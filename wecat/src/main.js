
/*
    对象劫持
*/
function observeAllKey(obj, callback) {
    Object.keys(obj).forEach(function(key){
        observer(obj, key, callback)
    })
}

function observer(obj, key, callback) {
    let old = obj[key]
    if (old.toString() === '[object Object]') {
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
    name: 'mi'
}

observer(obj, 'name')
obj.name = 'mirone'











