/*
    对象劫持
*/
let _isType_ = require('./../util/type')

function observer(obj, key, callback) {
    let old = obj[key],
        dep = new Dep();
    if (_isType_(old, 'object')) {
        // 只有对象需要递归
        observeAllKey(old, callback)
    }
    else if (_isType_(old, 'array')) {
        observeArray(old, callback)
    } else {
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                dep.addSub()
                return old
            },
            set: function (now) {
                if (now === old) {
                    return
                }
                console.log(`${old} ---> ${now}`)
                !!callback && callback(old, now)
                old = now
                // 通知所有订阅者
                dep.notify()
            }
        })
    }

}

function observeArray(arr, callback) {
    // 复制数组的原型方法,防止污染
    const arrayProto = Array.prototype
    const hackProto = Object.create(Array.prototype);
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

// 只有对象嵌套需要递归
function observeAllKey(obj, callback) {
    Object.keys(obj).forEach(function (key) {
        observer(obj, key, callback)
    })
}


// 发布中心dep
function Dep() {
    this.subs = [];
}

Dep.prototype = {
    addSub: function (sub) {
        this.subs.push(sub);
    },
    notify: function () {
        this.subs.forEach(function (sub) {
            sub.update();
        });
    }
};



//demo
var obj = {
    name: 'mi',
    children: {
        name: 'little tom',
        age: 14,
        children: {
            name: 'grand children  tom',
            friends: ['zhangsan']
        }
    }
}

// observer(obj, 'name')
// obj.name = 'mirone'
observer(obj, 'children')
// obj.children.age = 15
// obj.children.name = 'middle tom'
// obj.children.children.name = 'wahaha'
obj.children.children.friends.push('xiaoming ', 'liang', 'wang')












