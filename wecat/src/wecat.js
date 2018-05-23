import {_isType} from './util'

export default class Cat {
    constructor (options) {
        /*
        *  @ 初始化时挂载预定义的数据和函数
        * */
        this.data = options.data || {}
        this.methods = options.methods

        /*
        *  @ 将 data 对象和实例对象建立代理关系 => 主要是 this.a 就能直接获取当前实例的数据 而不是 this.data.a
        * */
        this.initProxy()

        /*
        *  @ 为组件实例的每一个data属性都设置getter、setter => 实现监听数据变化
        * */
        new Observer(this.data)

        /*
        *  @ 结合传入的数据编译和渲染当前组件的模板
        *  @ 后续继续拓展
        * */
        new Compile(options.el, this)

        /*
        *  @ 目前此处是解析完模板立即调用mounted钩子；用call可以将作用域很方便的直接指向到当前的组件中
        *  @ 后续可以将此处剥离出去，按生命周期的各个加载时机执行
        * */
        options.mounted.call(this)
    }

    /*
    *  @ 代理当前组件的所有属性
    * */
    initProxy () {
        Object.keys(this.data).forEach(key => {
            this.proxyKeys(key)
        })
    }
    proxyKeys (key) {
        Object.defineProperty(this, key, {
            // 设置可枚举为false，防止遍历实例属性时获取到 data 的属性
            enumerable: false,
            configurable: true,
            get () {
                return this.data[key]
            },
            set (val) {
                this.data[key] = val
            }
        })
    }
}

/*
*  @ 实现一个监听器Observer，用来劫持并监听所有属性，如果有变动的，就通知订阅者
* */
class Observer {
    constructor (data) {
        /*
        *  @ 将组件的data挂载到ob实例上
        *  @ 遍历数据
        * */
        this.data = data
        // 遍历data数据
        this.walk(data)
    }

    walk (data) {
        Object.keys(data).forEach(key => {  // 这里使用箭头函数就是为了用外面的this
            console.log('here  >>>>   ',this.data)
            // 子属性类型为对象
            if(_isType(data[key],'object')){
                // 递归监听子属性
                this.walk(data[key])
            }
            // 子属性类型为数组
            else if(_isType(data[key],'array')){
                // 使数组改变时同样能够通知改变  bug
                this.observeArray(data[key])
            }
            // 子属性类型为常量
            else{
                this.defineReactive(data, key, data[key])
            }
        })
    }

    defineReactive (data, key, val) {
        // 创建一个依赖收集中心Dep 实例
        let dep = new Dep()
        // 建立 data 和 Dep 的联系
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get () {
                // 只有在watcher收集依赖时会设置Dep.target指向current watcher订阅者
                if (Dep.target) {
                    dep.addSub(Dep.target)  // 在这里添加一个订阅者  dep.addSub(current watcher)
                }
                return val
            },
            set (newVal) {
                if (newVal === val) return
                // 有则改之
                val = newVal
                dep.notify(newVal)
            }
        })
    }

    observeArray(arr, callback) {
        // 复制数组的原型方法,防止污染
        const arrayProto = Array.prototype
        const hackProto = Object.create(Array.prototype);
        // 对数组的8个方法进行监控
        [
            'push',
            'pop',
            'shift',
            'unshift',
            'splice',
            'slice',
            'sort',
            'reverse'
        ].forEach(function (method) {
            Object.defineProperty(hackProto, method, {
                writable: true,
                enumerable: true,
                configurable: true,
                value: function (...arg) {  // ...arg：解构写法，表示接受任意多的变量
                    let _this = this
                    // slice可以返回一个新的数组，防止引用原对象
                    let old = arr.slice()
                    let now = arrayProto[method].call(_this, ...arg)
                    console.log(arr.slice(), '  arr  _this   ', this, ' > ', arrayProto[method], ' > ', ...arg)
                    !!callback && callback(old, _this, ...arg)
                    return now
                },
            })
        })
        arr.__proto__ = hackProto
    }
}



class Dep {
    constructor () {
        // 订阅者集合
        // console.log('dep >> ',this)
        this.subs = []
    }

    // 添加订阅者
    addSub (sub) {
        this.subs.push(sub)
    }

    // 通知订阅者
    notify () {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}

// 初始化依赖
// Dep.target存放着当前正在执行依赖收集过程的那个watcher
Dep.target = null

/*
*  @ 实现一个订阅者Watcher，可以收到属性的变化通知并执行相应的函数，从而更新视图
* */
class Watcher {
    constructor (vm, exp, cb) {
        // 回调
        this.cb = cb
        // 拿到当前组件的实例vm对象
        this.vm = vm
        // 模版解析时拿到指令或者插值中的data属性名
        this.exp = exp
        // 将自己添加到订阅器dep中
        this.value = this.get()
    }

    get () {
        // 设置当前的订阅者为自己，在
        Dep.target = this   // 缓存自己
        /*
        *  @ 模板编译时，在设置指令和插值的data时，都强制执行监听器里的get函数
        *  @ 目的是为了在model指令和'{{}}'插值的时候；手动触发当前实例.data的getter动作
        * */
        // 等价于：let value = this.data.key => 手动触发实例data的getter动作
        let value = this.vm[this.exp]
        // 收集完当前依赖的订阅者之后，释放当前依赖收集的指向
        Dep.target = null
        return value
    }

    // 观察者自己的行为
    update () {
        let value = this.vm[this.exp]
        let oldValue = this.value
        // 更新
        if (value !== oldValue) {
            this.value = value
            // 给回调函数绑定作用域
            this.cb.call(this.vm, value, oldValue)
        }
    }
}

/*
*  @ 实现一个解析器Compile，可以扫描和解析每个节点的相关指令，并根据初始化模板数据以及初始化相应的订阅器
* */
class Compile {
    constructor (el, vm) {
        this.vm = vm
        this.el = document.querySelector(el)
        this.fragment = null
        this.init()
    }

    init () {
        if (this.el) {
            // 创建节点
            this.fragment = this.node2Fragment(this.el)
            // 加工节点
            this.compileElement(this.fragment)
            // 使用节点
            this.el.appendChild(this.fragment)
        } else {
            throw Error('DOM 元素未找到！')
        }
    }

    node2Fragment (el) {
        let fragment = document.createDocumentFragment()

        // 将 DOM 元素移入 fragment 中
        let child = el.firstChild
        while (child) {
            fragment.appendChild(child)
            child = el.firstChild
        }

        return fragment
    }

    // 对模板进行编译，重要部分
    compileElement (el) {
        let childNodes = Array.from(el.childNodes)
        // console.log(el)
        // console.log(el.childNodes)
        // console.log('>>>>>   ')

        childNodes.forEach(node => {
            // 匹配插值表达式的正则，这里竟然不能带g，是什么鬼
            // let reg = /\{\{(.*)\}\}/
            let reg = /\{\{((?:.|\n)+?)\}\}/
            let text = node.textContent

            // 细粒度绑定
            if (this.isElementNode(node)) {
                this.compile(node)
            } else if (this.isTextNode(node) && reg.test(text)) {
                this.compileText(node, reg.exec(text)[1])
            }

            // 递归处理子节点
            if (node.childNodes != null && node.childNodes.length) {
                this.compileElement(node)
            }
        })
    }

    compile (node) {
        let attrs = Array.from(node.attributes)
        attrs.forEach(attr => {
            let attrName = attr.name
            // 编译指令
            if (this.isDirective(attrName)) {
                let expression = attr.value
                let directive = attrName.substring(2)
                // v-on
                if (this.isEventDirective(directive)) {
                    this.compileEvent(node, this.vm, expression, directive)
                }
                // v-model
                else {
                    this.compileModel(node, this.vm, expression, directive)
                }
                node.removeAttribute(attrName)
            }
        })
    }

    compileEvent (node, vm, exp, dir) {
        // 获取事件名和回调函数
        let eventName = dir.split(':')[1]
        let cb = null
        if (vm.methods) {
            cb = vm.methods[exp]
        }
        // 添加事件监听
        if (eventName && cb) {
            node.addEventListener(eventName, cb.bind(vm), false)
        }
    }

    compileModel (node, vm, exp, dir) {
        // 数据->html
        let val = this.vm[exp]
        this.modelUpdater(node, val)
        new Watcher(this.vm, exp, value => {
            this.modelUpdater(node, value)
        })

        // html 事件->数据
        node.addEventListener('input', (e) => {
            let newValue = e.target.value
            if (val === newValue) {
                return
            }
            this.vm[exp] = newValue
            val = newValue
        })
    }

    modelUpdater (node, value, oldValue) {
        node.value = typeof value === 'undefined' ? '' : value
    }

    compileText (node, exp) {
        let text = this.vm[exp]
        // 先更新一次文本
        this.updateText(node, text)
        // 使用数据响应系统
        new Watcher(this.vm, exp, (val) => {
            this.updateText(node, val)
        })
    }

    updateText (node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value
    }

    isDirective (attr) {
        return attr.indexOf('v-') === 0
    }

    isEventDirective (dir) {
        return dir.indexOf('on:') === 0
    }

    isElementNode (node) {
        return node.nodeType === 1
    }

    isTextNode (node) {
        return node.nodeType === 3
    }
}









