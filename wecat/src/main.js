
/*
    对象劫持
*/
let _isType = require('../util/type')

function observer(obj, key, callback) {
    let old = obj[key]
    if (_isType(old,'object')) {
        // console.log(old,_isType(old,'object'))
        observeAllKey(old, callback)
    }
    else if(_isType(old,'array')){
        observeArray(old,callback)
    }else {
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                return old
            },
            set: function(now) {
                if(now !== old) {
                    console.log(`${old} ---> ${now}`)
                    !!callback&&callback(old , now)
                    old = now
                }
            }
        })
    }

}

function observeArray(arr, callback) {
    const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
    const arrayProto = Array.prototype
    const hackProto = Object.create(Array.prototype)
    methods.forEach(function(method){
        Object.defineProperty(hackProto, method, {
            writable: true,
            enumerable: true,
            configurable: true,
            value: function(...arg) {
                let _this = this
                console.log('arr  _this   ',this)
                let old = arr.slice()
                let now = arrayProto[method].call(_this, ...arg)
                !!callback&&callback(old, _this, ...arg)
                return now
            },
        })
    })
    arr.__proto__ = hackProto
}

function observeAllKey(obj, callback) {
    Object.keys(obj).forEach(function(key){
        observer(obj, key, callback)
    })
}


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
obj.children.children.friends.push('xiaoming ')
console.log(obj.children.children.friends)












