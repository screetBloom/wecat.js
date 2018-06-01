const slice = Array.prototype.slice;
// 自定义事件
export default class EventEmitter {
    constructor(){
        // 克隆一份 事件
        this._monitor_ = Object.assign({}, this._monitor_ || {});
    }
    /**
     * 绑定事件
     * @param type 事件名称
     * @param fun 事件方法
     * @returns {EventEmitter}
     */
    on(type, fun) {
        let monitor = this._monitor_ || (this._monitor_ = {});
        monitor[type] || (monitor[type] = []);
        monitor[type].push(fun);
        return this;
    }

    /**
     * 判断是否还有特定事件
     * @param type
     * @returns {*}
     */
    hasEvent(type) {
        let monitor = this._monitor_ && this._monitor_[type] || [];
        return monitor.length > 0 || !!this['on' + type];
    }

    /**
     * 只有执行一次的事件
     * @param type 事件名称
     * @param fun 事件方法
     * @returns {EventEmitter}
     */
    onec(type, fun) {
        function funx() {
            fun.apply(this, arguments);
            this.off(type, funx);
        }
        this.on(type, funx);
        return this;
    }

    /**
     * 移除事件
     * @param type 事件名称
     * @param fun 事件方法
     * @returns {EventEmitter}
     */
    off(type, fun) {
        let monitor = this._monitor_;
        if (monitor) {
            if (fun) {
                let es = monitor[type];
                if (es) {
                    let index = es.indexOf(fun);
                    if (index > -1) {
                        es.splice(index, 1);
                    }
                }
            } else if (type) {
                delete monitor[type];
            } else {
                delete this._monitor_;
            }
        }
        return this;
    }

    /**
     * 触发事件
     * @param {String} type 事件名称
     * @param {*} ag 传递的参数
     */
    emit(type, ...ag) {
        let es = this._monitor_ && this._monitor_[type] || [];
        if (es.length) {
            for (let i = 0; i < es.length; i += 1) {
                es[i].apply(this, ag);
            }
        }
        let onFun = this['on' + type];
        onFun && onFun.apply(this, ag);
        return this;
    }

    /**
     * 扩展本身
     */
    assign(...args) {
        if(typeof args[0] === 'string'){
            this.assign({[args[0]]:args[1]})
        }
        else{
            args.unshift(this);
            Object.assign.apply(Object, args);
        }
        return this;
    }
}