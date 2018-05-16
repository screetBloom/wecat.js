
/*
    对象劫持
*/
let _isType = require('../util/type')

function observeAllKey(obj, callback) {
    Object.keys(obj).forEach(function(key){
        observer(obj, key, callback)
    })
}

function observer(obj, key, callback) {
    let old = obj[key]
    if (_isType(old,'object')) {
        console.log(' old object > ',_isType(old,'object'))
        observeAllKey(old, callback)
    } else {
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

//demo
var obj = {
    name: 'mi',
    children: {
        name: 'little tom',
        age: 14
    }
}

// observer(obj, 'name')
// obj.name = 'mirone'
observer(obj, 'children')
obj.children.age = 15
obj.children.name = 'middle tom'











