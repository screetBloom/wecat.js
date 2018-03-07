/**
 *
 * User: wim_chen
 * Date: 2018/3/8
 * Time: 上午12:04
 *
 */

function TemplateEngine(tpl, options) {
    var reg = /{{([\s\S]+?}*)}}/g,
        reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
        code = 'var r=[];\n',
        cursor = 0,
        match;

    var add = function (line, js) {
        js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while (match = reg.exec(tpl)) {
        add(tpl.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length
    }
    code += 'return r.join("");'
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options)
}

