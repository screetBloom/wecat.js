/**
 *
 * User: wim_chen
 * Date: 2018/3/10
 * Time: 下午10:16
 *
 */

define('ajax', ['util?[hash]'] ,function(U){
    var host = window.location.host;
    // 如果存在 fetch 优先使用 fetch
    var hasFetch = !!window.fetch;

    var bindFun = U.bind;


    /**
     * 参数整合url
     * @param url
     * @param param
     * @returns {*}
     */
    function fixedURL(url,param){
        var str = typeof param == 'string' ? param : U.stringifyQS(param,'&');
        if(str){
            return url + (url.indexOf("?") > -1 ? '&' : '?') + str;
        }
        return url;
    }

    // 结束 返回数据
    function responseEnd(req, res){
        if(!res.result && res.text){
            res.result = U.parseJSON(res.text, this.isSafetyJSON);
        }
        delete this._req;
        this.emit("verify", res, req);
        if(res.cancel === true){
            return ;
        }
        this.emit("callback", res, req);
        this.emit(res.err ? "fail" : "success", res, req);
    }

    // ============================ajax=========================================
    //创建XHR
    var createXHR = window.XMLHttpRequest ? function(isCross){
        if(window.XDomainRequest && isCross){
            return new window.XDomainRequest();
        }
        return new window.XMLHttpRequest();
    } : function(){
        return new window.ActiveXObject("Microsoft.XMLHTTP");
    };

    /**
     * ajax  进度
     * @param type
     * @param event
     */
    function onprogress(type, event){
        this.emit("progress" + type, event);
    }

    function onload(req, res){
        var xhr = req.xhr;
        if(xhr && !req.outFlag){
            var headers = ''
            try{
                headers = xhr.getAllResponseHeaders();
            }catch(e){}
            /**
             * 获取header 值
             * @param key
             * @returns {string}
             */
            res.getHeader = function (key) {
                return new RegExp("(?:" + key + "):[ \t]*([^\r\n]*)\r").test(headers) ? RegExp["$1"] : "";
            };

            res.text = "";
            try{
                res.text = xhr.responseText;
            }catch(e){}
            res.status = 0;
            try{
                res.status = xhr.status;
            }catch(e){}
            if(res.status === 0){
                res.status = res.text?200:404;
            }
            var s = res.status;
            res.err = (s >= 200 && s < 300 || s === 304 || s === 1223)? null : ('http error [' + s + ']');
            responseEnd.call(this, req, res);
        }
        delete req.xhr;
        delete req.outFlag;
    }

    function onHttpRequestChange(req, res){
        var xhr = req.xhr;
        if(xhr && xhr.readyState == 4){
            onload.call(this, req, res);
        }
    }

    /**
     * ajax 发送数据
     * @returns {ajax}
     */
    function httpSend(req, res) {
        var async = req.async;
        var header = req.header;

        // XHR
        req.xhr = createXHR(req.isCross);
        // IE8 跨域
        var isXDR = req.isXDR = req.xhr.constructor == window.XDomainRequest;
        if(isXDR){
            // 注意 IE8 XDR无法同步
            async = req.async = true;
        }
        var method = (req.method || 'GET').toUpperCase();

        var param = req.param;
        if(method == 'GET'){
            req.xhr.open(method, fixedURL(req.url, param), async);
            param = null
        }
        else{
            var url = req.url;
            if(isXDR){
                url = fixedURL(url, param);
                param = null;
            }
            req.xhr.open(method, url, async);
            if(header["Content-Type"] === undefined && !req.isFormData && !isXDR){
                header["Content-Type"] = "application/x-www-form-urlencoded";
            }
        }
        if(header['X-Requested-With'] === undefined && !req.isCross){
            // 跨域不增加 X-Requested-With
            header['X-Requested-With'] = 'XMLHttpRequest';
        }
        if(!isXDR){
            U.forEach(header, function(v, k){
                req.xhr.setRequestHeader(k, v);
            });
        }
        res.status = 0;
        if(this.hasEvent('progress')){
            // 跨域 加上 progress post请求导致 多发送一个 options 的请求
            // 只有有进度需求的任务,才加上
            try{
                req.xhr.upload.onprogress = bindFun(onprogress, this, "");
            }catch(e){}
        }
        if(this.hasEvent('progressdown')){
            try{
                req.xhr.onprogress = bindFun(onprogress, this, "down");
            }catch(e){}
        }

        //发送请求
        if(async){
            if(isXDR || 'onload' in req.xhr){
                req.xhr.onload = bindFun(onload, this, req, res);
            }
            else{
                req.xhr.onreadystatechange = bindFun(onHttpRequestChange, this, req, res);
            }
        }

        this.emit('send', req);
        req.xhr.send(param? U.stringifyQS(param, '&').replace(/[\x00-\x08\x11-\x12\x14-\x20]/g, "*") : null);
    }

    // ========================================================fetch请求数据================================
    /**
     * fetch 发送数据
     */
    function fetchSend(req, res) {
        var header = req.header;
        var method = (req.method || 'GET').toUpperCase();

        var url = req.url;
        var param = req.param;

        if(method == 'GET'){
            url = fixedURL(url, param);
            param = null;
        }
        else{
            if(header["Content-Type"] === undefined && !req.isFormData){
                header["Content-Type"] = "application/x-www-form-urlencoded";
            }
        }

        if(header['X-Requested-With'] === undefined && !req.isCross){
            // 跨域不增加 X-Requested-With
            header['X-Requested-With'] = 'XMLHttpRequest';
        }

        var option = {
            method : method,
            headers: header,
            body: param
        };
        if(req.isCross){
            option.mode = 'cors';
        }

        var fetchData = (function (text) {
            res.text = text || '';
            responseEnd.call(this, req, res);
        }).bind(this);

        function fetchBack(response) {
            if(!req.outFlag){
                res.getHeader = function (key) {
                    return response.headers.get(key);
                };

                res.status = response.status;
                res.text = '';
                res.err = response.ok ? null : 'http error [' + res.status + ']';
                response.text().then(fetchData, fetchData);
            }
            delete req.outFlag;
        }

        this.emit('send', req);
        window.fetch(url, option).then(fetchBack, fetchBack);
    }

    // ==============================================jsonp==============================================
    function jsonpSend(req, res){
        var param = req.param;
        var key = req.jsonpKey || this.jsonpKey;
        var backFunKey = param[key];
        if(!backFunKey){
            param[key] = backFunKey = 'jsonp_' + U.getSole();
        }

        var backFunFlag;
        var backFun = bindFun(function(data){
            if(!backFunFlag){
                backFunFlag = true;
                res.result = data;
                res.text = '';
                res.err = data ? null : 'http error';
                if(!req.outFlag){
                    responseEnd.call(this, req, res);
                }
            }
        }, this);

        window[backFunKey] = backFun;

        var url = fixedURL(req.url, param);

        this.emit('send', req);
        U.loadJS(url, function () {
            backFun();
        });
    }


    function requestSend(xParam, req){
        if(req.outFlag){
            return ;
        }

        var res = {
            root: this
        }

        var isFormData = req.isFormData
        var async = req.async
        var method = (req.method || '').toUpperCase()

        if(isFormData){
            forEach(this.param, function (value, key) {
                if(!xParam.has(key)){
                    xParam.append(key, value);
                }
            })
            req.param = xParam
        }
        else{
            if(typeof xParam == "string"){
                xParam = parseQS(xParam) || {};
            }
            req.param = U.assign({}, this.param, xParam)
        }

        req.qsParam = U.assign({}, this.qsParam)
        req.header = U.assign({}, this.header)

        this.emit('open', req)

        // 还原,防止复写
        req.isFormData = isFormData;
        req.async = async;
        req.method = method;

        if(method == 'GET' || method == 'JSONP'){
            if(req.cache === false && !req.qsParam._r_){
                // 加随机数，去缓存
                req.qsParam._r_ = U.getSole()
            }
            // qsParam 复制到 param
            req.param = U.assign({}, req.qsParam, req.param)
        }
        else{
            // qsParam 复制到 URL上
            req.url = fixedURL(req.url, req.qsParam)
        }

        req.method = this.method
        req.url = this.url
        req.cache = this.cache

        // 是否跨域
        req.isCross = !/:\/\/$/.test(U.getFullUrl(req.url).split(host)[0] || '');

        if(method == 'JSONP'){
            // jsonp 获取数据
            jsonpSend.call(this, req, res);
            return ;
        }

        if(hasFetch && async && this.useFetch && !this.hasEvent('progress')){
            //fetch 存在 fetch 并且无上传或者进度回调 只能异步
            fetchSend.call(this, req, res);
            return ;
        }
        // 走 XMLHttpRequest
        httpSend.call(this, req, res);
    }

    /**
     * Ajax基础类
     * @param url
     * @param method
     * @param async
     */
    var ajax = U.createClass(U.EventEmitter, function(prot){
        // 默认使用 fetch
        prot.useFetch = true;
        prot.jsonpKey = 'callback';

        // 初始化
        prot.constructor = function(url, method, async, cache){
            this.$super();

            this.url = url;
            this.method = method || 'GET';
            this.async = method == 'jsonp'? true : (async === false?false:true);
            this.param = {};
            this.qsParam = {};
            this.header = {};
            this.cache = cache;
        }

        // 中止ajax请求
        prot.abort = function(){
            var req = this._req;
            if(req){
                req.outFlag = true;
                if(req.xhr){
                    req.xhr.abort();
                    req.xhr = null;
                }
                delete this._req;
            }
            return this;
        }

        /**
         * 发送数据据
         * @param param
         * @param over
         * @returns {ajax}
         */
        prot.send =  function(param, over){
            if(this._req){
                if(!over){
                    return this;
                }
                this.abort();
            }

            var req = this._req = {
                root: this,
                async: this.async
            };
            if(window.FormData && param instanceof window.FormData){
                req.isFormData = true;
                req.method = 'POST';
            };
            if(this.async){
                setTimeout(bindFun(requestSend, this, param || {}, req), 1);
            }
            else{
                requestSend.call(this, param, param || {}, req);
            }
            return this;
        }

    });

    U.forEach(['get', 'post', 'put', 'delete'], function (type) {
        ajax[type] = function(url, callback, param, sync){
            var t = new ajax(url, type, !sync);
            if(callback){
                t.on('callback', callback);
            }
            t.send(param);
            return t;
        }
    });

    ajax.jsonp = function(url, callback, param, key){
        var t = new ajax(url, 'jsonp', true);
        key && (t.jsonpKey = key);
        callback && t.on('callback', callback);
        t.send(param);
        return t;
    }

    return ajax;
});