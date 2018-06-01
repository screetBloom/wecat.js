import {
    _isType,
    _isDOMType,
    _isDOMTagname,
    _isDirective,
    _trim,
    _isEventDirective,
    _node2Fragment,
    _deepPath,
    _DFSTraverse
} from './util'

export default class Cat {
    constructor (options) {

        /*
        *  @ 组件创建前的钩子
        * */
        !!options.beforeCreated && options.beforeCreated.call(this)

        /*
        *  @ 初始化时挂载预定义的数据和函数，和监视属性
        * */
        this.data = options.data || {}
        this.methods = options.methods || {}
        this.watch = options.watch || {}
        this.el = options.el
        if(!this.el) throw 'please declare a el' ;

        /*
        *  @ 子组件的挂载
        * */
        !!options.components && this.registerComponent(options.components,this)

        this.bindMethods()

        /*
        *  @ 将 data 对象和实例对象建立代理关系 => 主要是 this.a 就能直接获取当前实例的数据 而不是 this.data.a
        * */
        this.initProxy()

        /*
        *  @ 为组件实例的每一个data属性都设置getter、setter => 实现监听数据变化
        *  @ 将watch属性监视的数据注入进去，变化时，执行回调
        * */
        new Observer(this.data,this.watch,this)

        /*
        *  @ 结合传入的数据编译和渲染当前组件的模板
        *  @ 后续继续拓展
        * */
        new Compile(this.el, this)

        /*
        *  @ 解析完模板立即调用mounted钩子；用call可以将作用域很方便的直接指向到当前的组件中
        * */
        !!options.mounted && options.mounted.call(this)
    }

    /*
    *  @ tagName 自定义组件名
    *  @ path 需要引入的组件地址
    * */
    registerComponent(components){
        // 换一种注册方式
        // new componentGenerator(components,parent,this.el)

        let el = document.querySelector(this.el)
        let pChildNodes = Array.from(el.childNodes),
            pChildTags = [];
        /*
        *  @ 组件化关键：将父组件下的所有标签名检索出来，用于下一步与自定义组件相匹配
        * */
        pChildNodes.forEach((node) =>  {
            // 元素标签
            if(!!node.tagName ){
                pChildTags.push(_isDOMTagname(node))
                if(node.firstChild){
                    // 对模板具有子节点的元素进行深度优先遍历并合并模板的一级节点tagNama和子节点tagName
                    pChildTags = pChildTags.concat(this.walkNode(node))
                }
            }
        })

        Object.keys(components).forEach( (key) => {
            // 当前父组件中声明了子组件
            if(pChildTags.includes(key)){
                let oldNode = document.querySelector(key),
                    newNode = document.createElement('div');
                newNode.innerHTML = components[key].template;
                // 关键一步：获取自定义标签的父节点，将父节点内的自定义标签替换为组件内容
                oldNode.parentNode.replaceChild(_node2Fragment(newNode), oldNode);
                // 将子组件的数据和方法混入父组件
                this.data = Object.assign(this.data || {},components[key].data||{})
                this.methods = Object.assign(this.methods || {},components[key].methods||{})
            }
        })
    }

    walkNode(node){
        let res = []
        _DFSTraverse(node.childNodes,1,function (deep,node) {
            !!node.tagName && res.push(node.tagName.toLocaleLowerCase())
        })
        return res
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

    bindMethods(){
        Object.keys(this.methods).forEach((key)=>{
            // this.methods[key]
            this.methods[key] = this.methods[key].bind(this)
        })
    }
}

class componentGenerator {

    constructor(components,parent,el){

        this.el = document.querySelector(el)
        this.components = components
        this.parent = parent
        this.init()
    }

    init(){
        // 将子组件应用到父组件上
        this.patch()
    }

    patch(){
        let pChildNodes = Array.from(this.el.childNodes),
            pChildTags = [],
            _el = this.el,
            _this = this;
        pChildNodes.forEach(function (node) {
            !!node.tagName && pChildTags.push(_isDOMTagname(node))
        })
        Object.keys(this.components).forEach(function (key) {
            // 当前父组件中声明了子组件
            if(pChildTags.includes(key)){
                // console.log(`${key}`,_this.components[key])
                let oldNode = document.querySelector(key),
                    newNode = document.createElement('div');
                newNode.innerHTML = _this.components[key].template;
                _el.replaceChild(_node2Fragment(newNode), oldNode);

                // 将子组件的数据混入父组件
                // this.parent = Object.assign(this.parent,_this.components[key].data)

            }

        })
    }

}



/*
*  @ 实现一个监听器Observer，用来劫持并监听所有属性，如果有变动的，就通知订阅者
* */
class Observer {
    constructor (data,watch,vm) {
        /*
        *  @ 将组件的data挂载到ob实例上
        *  @ 遍历data数据
        *  @ 挂载 监听变化 回调
        * */
        this.data = data
        this.watch = watch
        this.vm = vm
        this.walk(data)
    }

    walk (data) {
        Object.keys(data).forEach(key => {  // 这里使用箭头函数就是为了用外面的this
            // // 子属性类型为对象
            if(_isType(data[key],'object')){
                // 递归监听子属性，目前bug
                this.walk(data[key])
            }
            // 子属性类型为数组，目前bug
            else if(_isType(data[key],'array')){
                // 使数组改变时同样能够通知改变
                this.observeArray(data[key])
            }
            // 子属性类型为常量
            else{
                this.defineReactive(data, key, data[key])
            }
        })
    }

    defineReactive (data, key, val) {
        // 为每一个data创建一个依赖收集中心Dep 实例，初次渲染时，dep.targe为null
        let dep = new Dep(),
            cb = '',
            _this = this;
        Object.keys(this.watch).forEach((k) => {
            if(k === key){
                cb = this.watch[key]
            }
        })
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
                /*
                *  @ 如果该对象被监听了，那么执行监听回调
                *  @ 这里是否需要考虑订阅者和监听函数执行的时机问题
                * */
                !!cb && cb.call(_this.vm,newVal,val)
                val = newVal
                // 通知当前属性的所有订阅者
                dep.notify()
            }
        })
    }

    observeArray(arr,callback) {
        // 复制数组的原型方法,防止污染
        const arrayProto = Array.prototype,
            hackProto = Object.create(Array.prototype);
        // 对数组的7个方法进行监控
        [
            'push',
            'pop',
            'shift',
            'unshift',
            'splice',
            'sort',
            'reverse'
        ].forEach(function (method) {
            Object.defineProperty(hackProto, method, {
                writable: true,
                enumerable: true,
                configurable: true,
                value: function (...arg) {  // ...arg：解构写法，表示接受任意多的变量
                    // slice可以返回一个新的数组，防止引用原对象
                    let old = arr.slice(0)
                    let now = arrayProto[method].call(this, ...arg)
                    console.log('数组发生了改变  ',...arg)
                    !!callback && callback()
                    return now
                },
            })
        })
        arr.__proto__ = hackProto
    }
}

class Dep {
    constructor () {
        this.subs = []  // 订阅者集合,保存的是一个个watcher实例
    }

    // 添加订阅者
    addSub (sub) {
        this.subs.push(sub)
    }

    // 通知订阅者,即当前data的所有watcker实例
    notify () {
        // console.log('>>>>>>   ',data)
        // console.log(this.subs)
        this.subs.forEach(sub => {
            sub.update()    // 更新watcher实例
        })
    }
}

// Dep.target存放着当前正在执行依赖收集过程的那个watcher
// 子类target初始值和父类一致，但改变不会影响父类的target
Dep.target = null

/*
*  @ 实现一个订阅者Watcher，可以收到属性的变化通知并执行相应的函数，从而更新视图
* */
class Watcher {
    constructor (vm, exp, cb) {
        // watcher实例更新视图的回调
        this.cb = cb
        // 保存当前组件的实例vm对象
        this.vm = vm
        // 模版解析时拿到指令或者插值中的data属性名
        this.exp = exp
        /*
        *  1 设置Dep.target的值，触发data的getter事件，将watcher实例添加进去
        *  2 保存data上当前状态的值
        * */
        this.value = this.get()
    }

    get () {
        // 设置当前的订阅者为自己，极其关键的一步
        Dep.target = this   // 缓存自己
        /*
        *  @ 模板编译时，在设置指令和插值的data时，都强制执行监听器里的get函数
        *  @ 目的是为了在model指令和'{{}}'插值的时候；手动触发当前实例.data的getter动作
        * */
        // 等价于：let value = this.data.key => 手动触发实例data的getter动作
        let paths = this.exp.split('.'),
            value = '';
        if(paths.length>1){
            // value = this.vm[paths[0]][paths[1]]
            value = _deepPath(this.vm,this.exp)
        }else{
            // show的表达式写法
            if(this.exp.indexOf('=')){
                let exps = this.exp.split('=')
                value = this.vm[_trim(exps[0])]
            }else{
                value = this.vm[this.exp]
            }
        }
        // value = this.vm[this.exp]
        // 收集完当前依赖的订阅者之后，释放当前依赖收集的指向
        Dep.target = null
        return value
    }

    update () {
        // watcher实例更新视图的过程
        let paths = this.exp.split('.'),
            value = '',
            oldValue = this.value;
        if(paths.length>1){
            // value = this.vm[paths[0]][paths[1]]
            value = _deepPath(this.vm,this.exp)
            console.log('test1   ',value)
        }else{
            // show的表达式写法
            if(this.exp.indexOf('=')){
                let exps = this.exp.split('=')
                value = this.vm[_trim(exps[0])]
                console.log('value     ',value)
            }else{
                value = this.vm[this.exp]
            }
        }

        if (value !== oldValue) {
            // 为data设置最新的值
            this.value = value
            // 给回调函数绑定作用域
            this.cb.call(this.vm, value, oldValue)
        }
    }
}

/*
*  @ 实现一个编译器Compile，可以扫描和解析每个节点的相关指令，并根据初始化模板数据以及初始化相应的订阅器
* */
class Compile {
    constructor (el, vm) {
        // 保存当前的组件实例
        this.vm = vm
        // 获取当前模板
        this.el = document.querySelector(el)
        this.fragment = null
        this.init()
    }

    init () {
        if (this.el) {
            /*
            *  @ 直接操作this.el就会造成页面频繁的回流、重绘
            *  @ 使用fragment复制一份组件模板，好处之一是不会多出来一个容器标签
            * */
            this.fragment = _node2Fragment(this.el)
            /*
            *  @ 解析模板指令、插值表达式
            * */

            this.compileElement(this.fragment)
            // 使用节点
            this.el.appendChild(this.fragment)
        } else {
            throw Error('DOM 元素未找到！')
        }
    }

    // 对模板进行编译，重要部分
    compileElement (el) {
        /*
        *  @ 获取节点要用 childNodes，children会丢失大量节点信息
        *  @ 将类数组对象转化为数组对象
        * */
        let childNodes = Array.from(el.childNodes)
        childNodes.forEach(node => {
            // 匹配插值表达式的正则，这里竟然不能带g，是什么鬼
            let reg = /\{\{((?:.|\n)+?)\}\}/,
                text = node.textContent;   // 拿到元素节点内的文本信息，匹配插值表达式

            // 元素节点指令的编译
            if (_isDOMType(node) === 1) {
                this.compileDirective(node)
            }
            // 插值的编译
            else if (_isDOMType(node) === 3 && reg.test(text)) {
                this.compileText(node, reg.exec(text)[1])
            }

            // 递归处理当前节点的子节点
            if ( !!node.childNodes && node.childNodes.length > 0 ) {
                this.compileElement(node)
            }
        })
    }

    // 目前不允许元素内插值的写法
    compileDirective (node) {
        let attrs = Array.from(node.attributes)
        attrs.forEach(attr => {
            // c-model="test"  name:c-model，value:test
            let attrName = attr.name
            // 如果是指令(视图层呈现为自定义属性)
            if (_isDirective(attrName)) {
                let expression = attr.value,
                    directive = attrName.slice(2)
                // 事件指令，如on:click
                if (_isEventDirective(directive)) {
                    this.compileEvent(node, expression, directive)
                }
                // 一般指令，如model
                else {
                    this.compileModelAll(node, expression, directive)
                }
                // 视图层呈现时，将自定义属性移除
                node.removeAttribute(attrName)
            }
        })
    }

    /*
    *  @ 解析事件指令，将对应函数绑定到元素节点上
    *  @ node 事件需要绑定到的元素
    *  @ exp 函数名
    *  @ dir 指令、事件名，如click
    * */
    compileEvent (node, exp, dir) {
        // 将真实需要绑定的事件剥离出关键词，如 on:click => click
        let eventName = dir.split(':')[1]
        let cb = null
        if (this.vm.methods) {
            cb = this.vm.methods[exp]
        }
        // 添加事件监听
        if (eventName && cb) {
            /*
            *  @ method name
            *  @ callback：需要将this指向到当前的组件实例，否则默认this会指向元素节点，导致函数失效
            *  @ 是否在捕获或者冒泡阶段执行
            *  @ addEventListener带参数会默认执行一次,因此不可以  node.addEventListener(eventName, cb.call(this.vm,node))
            * */
            function event() {
                return cb.call(this.vm,node)
            }
            node.addEventListener(eventName, event.bind(this))
        }
    }

    compileModelAll(node, exp, dir){
        if(dir === 'model'){
            this.compileModel(node, exp, dir)
        }
        else if(dir === 'show'){
            this.compileShow(node, exp, dir)
        }
    }

    /*
    *  @ 解析一般指令，目前只有c-model
    *  @ node 指令所在元素
    *  @ exp 指令绑定的data属性名
    *  @ dir 指令名，如model
    * */
    compileModel (node, exp, dir) {
        // let val = this.vm[exp]
        let val = _deepPath(this.vm,exp)   // 组件实例化时，预定义数据的初始值
        // 这里是为model指令对象设置初初始值，并可以利用_isDOMTagname(node)，根据不同元素进行针对性处理
        this.modelUpdater(node, val);
        /*
        *  @ 借助watch,将指令和data关联起来；回调作用：更新视图
        *  @ 1 触发watch实例的get
        *  @ 2 设置Dep.target为当前watch实例，并主动触发data的getter
        *  @ 3 dep.addSub(watch实例)
        *  @ 4 data进行set时，dep调用所有的watcher实例的视图更新回调函数
        * */
        new Watcher(this.vm, exp, (val) => {
            this.modelUpdater(node, val)
        })

        node.addEventListener('input', (e) => {
            let newValue = e.target.value
            if (val === newValue) {
                return
            }
            // 多层嵌套属性的赋值
            let res = 'this.vm',
                paths = exp.split('.');
            paths.forEach(function (item) {
                res += "['"+item+"']";
            })
            // this.vm[exp] = newValue
            eval(res+' = newValue')
        })
    }

    /*
    *  @ 还应该支持表达式和直接输入true、false的形式
    *  @ 可以利用函数构造器或者eval 需要继续提升、润色
    * */
    compileShow (node, exp, dir) {
        let show = '';
        // show表达式的第一次取值
        if(exp.indexOf('=')>=0){
            let exps = exp.split('=');
            show = this.vm[_trim(exps[0])];
        }else{
            show = this.vm[exp]
        }
        // 设置初始渲染的默认值
        this.showUpdate(node, show)
        /*
       *  @ 借助watch,将指令和data关联起来
       *  @ 回调作用：更新视图
       * */
        new Watcher(this.vm, exp, (val) => {
            this.showUpdate(node, val)
        })
    }


    /*
    *  @ 初始化和设置指令元素的value：但是 v-model 仅能应用在input这些含有value的元素节点上
    *  @ node model指令绑定的元素
    *  @ value 需要设置的值
    * */
    modelUpdater (node, value,oldValue) {
        node.value = value || ''
    }

    compileText (node, exp) {
        // let text = this.vm[exp]
        let text = _deepPath(this.vm,exp)
        // 设置初始渲染的默认值
        this.textUpdate(node, text)
        /*
        *  @ 借助watch,将指令和data关联起来
        *  @ 回调作用：更新视图
        * */
        new Watcher(this.vm, exp, (val) => {
            this.textUpdate(node, val)
        })
    }

    /*
    *  @ 初始化和设置文本节点的textContent
    *  @ node 插值内容所在文本节点
    *  @ value 需要设置的值
    * */
    textUpdate (node, value) {
        node.textContent =  value || ''
    }

    showUpdate (node, value) {
        // let res = eval("console.log('函数构造器nei   ',value);return !!value")
        // // let res = new Function('', " console.log('函数构造器nei   ',value);return !!value");
        // console.log('函数构造器 2  ',res())
        node.style.display = !!value ? '' : 'none';
    }


}









