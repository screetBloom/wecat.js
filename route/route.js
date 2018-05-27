/*
使用方法
		1：注册路由 : spaRouters.map('/name',function(transition){
						//异步加载js
						spaRouters.asyncFun('name.js',transition)
						//或者同步执行回调
						spaRouters.syncFun(function(transition){},transition)
					})
		2：初始化      spaRouters.init()
		3：跳转  href = '#/name'
*/
(function () {
	var util = {
		getParamsUrl: function () {
			var hashDeatail = location.hash.split("?"),
				hashName = hashDeatail[0].split("#")[1],
				params = hashDeatail[1] ? hashDeatail[1].split("&") : [],
				query = {};
			for (var i = 0; i < params.length; i++) {
				var item = params[i].split("=");
				query[item[0]] = item[1]
			}
			return {
				path: hashName,
				query: query
			}
		}
	}

	function spaRouters() {
		this.routers = {};
		this.beforeFun = null;
		this.afterFun = null;
	}

	spaRouters.prototype = {
		init: function () {
			var self = this;

			window.addEventListener('load', function () {
				self.urlChange()
			})

			window.addEventListener('hashchange', function () {
				self.urlChange()
			})

			window.SPA_RESOLVE_INIT = null;
		},
		refresh: function (currentHash) {
			var self = this;
			if (self.beforeFun) {

				console.log('>>>>>>>>>????????<<<<<<<');
				self.beforeFun({
					to: {
						path: currentHash.path,
						query: currentHash.query
					},
					next: function () {
						self.routers[currentHash.path].callback.call(self, currentHash)
					}
				})
			} else {
				self.routers[currentHash.path].callback.call(self, currentHash)
			}
		},

		urlChange: function () {

			var currentHash = util.getParamsUrl();
			if (this.routers[currentHash.path]) {
				this.refresh(currentHash)
			} else {
				location.hash = '/index'
			}
		},
		//单层路由注册
		map: function (path, callback) {
			path = path.replace(/\s*/g, "");
			if (callback && Object.prototype.toString.call(callback) === '[object Function]') {
				this.routers[path] = {
					callback: callback,
					fn: null
				}
			} else {
				console.trace('注册' + path + '地址需要提供正确的的注册回调')
			}


		},

		beforeEach: function (callback) {
			if (Object.prototype.toString.call(callback) === '[object Function]') {
				this.beforeFun = callback;
			} else {
				console.trace('路由切换前钩子函数不正确')
			}
		},

		afterEach: function (callback) {
			if (Object.prototype.toString.call(callback) === '[object Function]') {
				this.afterFun = callback;
			} else {
				console.trace('路由切换后回调函数不正确')
			}
		},

		loadFile: function (file, transition) {
			var self = this;
			if (self.routers[transition.path].fn) {
				self.afterFun && self.afterFun(transition)
				self.routers[transition.path].fn(transition)
			} else {
				var _body = document.getElementsByTagName('body')[0];
				var scriptEle = document.createElement('script');
				scriptEle.type = 'text/javascript';
				scriptEle.src = file;
				scriptEle.async = true;

				SPA_RESOLVE_INIT = null;
				scriptEle.onload = function () {
					self.afterFun && self.afterFun(transition)
					self.routers[transition.path].fn = SPA_RESOLVE_INIT;
					self.routers[transition.path].fn(transition)
				}
				_body.appendChild(scriptEle);
			}
		},

		loadCb: function (callback, transition) {

			this.afterFun && this.afterFun(transition)
			callback && callback(transition)
		}


	}
	//注册到window全局
	window._$router = new spaRouters();
})()
