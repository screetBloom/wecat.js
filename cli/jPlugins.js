var fs = require("fs");
var path = require("path");
var postcss = require('postcss');
var autoprefixer = require('autoprefixer');
var uglifycss = require('uglifycss');
var uglifyjs = require("uglify-js");
var htmlmin = require('html-minifier');
var glob = require('glob');

var createHash = require("crypto").createHash;

var helper = {
    createDir: function (tarDir) {
        var me = function (dir) {
            var parent = path.dirname(dir);
            if (!fs.existsSync(parent)) me(parent);
            fs.mkdirSync(dir);
        };
        !fs.existsSync(tarDir) && me(tarDir);
    },
    removeDir: function (dir) {
        if (!fs.existsSync(dir)) return;
        var files = fs.readdirSync(dir);
        files.forEach((file, index) => {
            var curPath = path.join(dir, file);
            if (fs.statSync(curPath).isDirectory()) {
                this.removeDir(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dir);
    },
    copyDir: function (srcDir, tarDir, showLog = true) {
        this.createDir(tarDir);
        var files = fs.readdirSync(srcDir);
        files.forEach((file, index) => {
            var srcPath = path.join(srcDir, file),
                tarPath = path.join(tarDir, file);
            showLog && console.log(srcPath);
            if (fs.statSync(srcPath).isDirectory()) {
                this.copyDir(srcPath, tarPath);
            } else {
                //fs.copyFileSync(srcPath, tarPath);
                fs.createReadStream(srcPath).pipe(fs.createWriteStream(tarPath));
            }
        });
    },
    getHash: function (str, len) {
        var o = {
            hashFunction: "md5",
            hashDigest: "hex",
            hashDigestLength: len || 8
        };
        const hash = createHash(o.hashFunction);
        hash.update(str);
        const hashId = hash.digest(o.hashDigest);
        return hashId.substr(0, o.hashDigestLength);
    }
};
var replacePathHelper = {
    process: function (code, reg, replaceFn) {
        var codeCopy = code, m;
        while (m = reg.exec(codeCopy)) {
            var p = m[1].trim();
            // if (m[0].length > 100) {
            //     console.log(m[0].length, m[1].length);
            // }
            if (!p) continue;
            if (p.toLowerCase().startsWith("data:")) continue;
            if (/^{\s*{/.test(p)) continue;
            if (p.startsWith("//") || p.indexOf("://") > -1) continue;
            code = replaceFn(code, m);
        }
        return code;
    },
    getAbsolutePath: function (projRoot, absFilePath, refFilePath) {
        refFilePath = refFilePath.replace(/\\/g, '/');
        if (!refFilePath.startsWith('/')) {
            var absPath = path.join(path.dirname(absFilePath), refFilePath);
            // console.log(projRoot, absFilePath, refFilePath, absPath);
            refFilePath = absPath.substring(projRoot.length).replace(/\\/g, '/');
        }
        return refFilePath;
    },
    rules: {
        //script: /<script.+?\s+src=\s*['"](.+?)['"][^>]*>\s*<\/script>/ig,
        //img: /<img.+?\s+src=\s*['"](.+?)['"][^>]*>/ig,
        src: /\bsrc\s*=\s*['"](.+?)['"]/ig, // img、script
        link: /<link\b.*?\bhref\s*=\s*['"](.+?)['"][^>]*>/ig, // link
        url: /\burl\s*\(\s*['"]?(.+?)['"]?\s*\)/ig // background、background-image ...
    }
};

function TcTrainActivityPlugin(options) {
    this.opts = options;
}

TcTrainActivityPlugin.prototype.apply = function (compiler) {
    var opts = this.opts,
        wOpts, outDir, publicPath, version,
        log = function (msg) {
            if (opts.showLog) console.log(msg);
        },
        readFile = function (fp, fn) {
            var data = fs.readFileSync(fp);
            fn && fn(data.toString());
        },
        saveFile = function (fp, data, fn) {
            var dir = path.dirname(fp);
            helper.createDir(dir);
            fs.writeFileSync(fp, data);
            fn && fn();
        },
        clearOutputPath = function () {
            if (!opts.clearOutputPath) return;
            helper.removeDir(outDir);
        },
        replaceVersion = function (data) {
            if (!opts.repVersionReg) return data;
            return data.replace(opts.repVersionReg, version);
        },
        replacePath = function (absFilePath, data, replMonitor) {
            if (!opts.repServerRoot) return data;
            var rules = replacePathHelper.rules;
            for (var prop in rules) {
                var reg = rules[prop];
                data = replacePathHelper.process(data, reg, function (code, groups) {
                    var absPath = replacePathHelper.getAbsolutePath(opts.projRoot, absFilePath, groups[1]);
                    if (publicPath && absPath.toLowerCase().startsWith("/" + publicPath.toLowerCase() + "/")) {
                        // 处理html中的类似 ./dist/ 目录
                        absPath = absPath.substring(publicPath.length + 1);
                    }
                    if (replMonitor) absPath = replMonitor(groups[1], absPath);
                    var replStr = groups[0].replace(groups[1], opts.repServerRoot + absPath);
                    var res = code.replace(groups[0], replStr);
                    return res;
                });
            }
            return data;
        },
        processHtml = function (data, fn) {
            var res = htmlmin.minify(data, {
                // Collapse white space that contributes to text nodes in a document tree
                collapseWhitespace: true,
                // Array of strings corresponding to types of script elements to process through minifier
                processScripts: ["text/html", "text/ng-template", "text/x-handlebars-template"],
                // Strip HTML comments
                removeComments: true,
                // Strip HTML comments from scripts and styles
                removeCommentsFromCDATA: true,
                // Minify Javascript in script elements and on* attributes (uses UglifyJS)
                minifyJS: true, // boolean | UglifyJS.MinifyOptions;
                // Minify CSS in style elements and style attributes (uses clean-css)
                minifyCSS: true // boolean | CleanCSS.Options;
            });
            fn && fn(res);
        },
        processJs = function (data, fn) {
            var res = uglifyjs.minify(data, {
                fromString: true
            });
            fn && fn(res.code);
        },
        processCss = function (data, fn) {
            postcss([autoprefixer]).process(data).then(function (result) {
                result.warnings().forEach(function (warn) {
                    console.warn(warn.toString());
                });
                var css = result.css;
                // console.log(css);
                var minData = uglifycss.processString(css);
                fn && fn(minData);
            }).catch(err => {
                console.error(err);
                // const cssError = err.name === 'CssSyntaxError';
                // if (cssError) {
                //     err.message += err.showSourceCode();
                // }
            });
        };
    // console.log(opts);
    compiler.plugin('compilation', function (compilation, options) {
        // console.log(compilation.options);
        wOpts = compilation.options;
        outDir = wOpts.output.path;
        publicPath = (wOpts.output.publicPath || "").replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
        version = new Date().zjFormat("MMddHHmm");

        if (opts.clearOutputPath) {
            log("cleaning\t" + outDir);
            clearOutputPath()
        }

        for (let i of opts.cssFiles) {
            log("processing\t" + i);
            var fp = path.resolve(i);
            readFile(fp, function (data) {
                data = replaceVersion(data);
                data = replacePath(fp, data);
                processCss(data, function (minData) {
                    // var hv = helper.getHash(minData),
                    //     ih = i.substring(0, i.length - 3) + hv + ".css",
                    //     savePath = path.resolve(outDir, ih);
                    // console.log(i, savePath, hv);
                    savePath = path.resolve(outDir, i);
                    saveFile(savePath, minData);
                });
            });
        }

        for (let i of opts.copyDirs) {
            log("copying  \t" + i);
            var srcDir = path.resolve(i),
                tarDir = path.join(outDir, i);
            helper.copyDir(srcDir, tarDir, opts.showLog);
        }

        log("");
    });

    compiler.plugin("done", () => {
        setTimeout(() => {
            var pattern = wOpts.output.path + "\\js\\*.*.js",
                files = glob.sync(pattern),
                hashFiles = [];
            for (var i of files) {
                hashFiles.push(i.substring(outDir.length));
            }

            for (let i of opts.htmlFiles) {
                log("processing\t" + i);
                var fp = path.resolve(i);
                readFile(fp, function (data) {
                    data = replaceVersion(data);
                    data = replacePath(fp, data, (oldPath, absPath) => {
                        var extName = path.extname(oldPath).toLowerCase();
                        if (extName != ".js") return absPath;
                        var re = /\.[0-9a-f]+\./;
                        for (var i of hashFiles) {
                            var f = i.replace(re, ".");
                            if (f == absPath) {
                                log("replaceHash\t" + absPath + "\t" + i);
                                return i;
                            }
                        }
                        return absPath;
                    });
                    if (opts.minifyHtml) {
                        processHtml(data, function (minData) {
                            saveFile(path.resolve(outDir, i), minData);
                        });
                    } else {
                        saveFile(path.resolve(outDir, i), data);
                    }
                });
            }
        }, 200);

    });
};

(function (S) {
    S.prototype.zjFill = function (args) {
        var s = this;
        if (args != null) {
            var r, type = Object.prototype.toString.call(args),
                arr = type == "[object Array]" || type == "[object Object]" ? args : arguments;
            for (var i in arr) {
                r = new RegExp('\\{' + i + '\\}', 'gm');
                s = s.replace(r, arr[i]);
            }
        }
        return s;
    };
    S.prototype.zjReplace = function (oldStr, newStr) {
        var s = this, i = 0;
        while ((i = s.indexOf(oldStr, i)) > -1) {
            s = s.substring(0, i) + newStr + s.substring(i + oldStr.length);
            i += newStr.length;
        }
        return s;
    };
})(String);

(function (D) {

    D.prototype.zjMinus = function (date) {
        var ms = (this.getTime() - date.getTime()); // / 24 / 3600 / 1000;

        var day = Math.floor(ms / 24 / 3600 / 1000),
            hh = Math.floor((ms / 3600 / 1000) % 24),
            mm = Math.floor((ms / 1000 / 60) % 60),
            ss = Math.floor((ms / 1000) % 60);
        return {
            day: day,
            hour: hh,
            minute: mm,
            second: ss
        };
    }

    D.prototype.zjFormat = function (format) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "H+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "f+": this.getMilliseconds()
        };

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
        return format;
    };
})(Date);

module.exports = {
    TcTrainActivityPlugin: TcTrainActivityPlugin

};
