
/*
    普通对象劫持
*/
function observe(obj, key) {
    let old = obj[key]
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function() {
            return old
        },
        set: function(now) {
            if(now !== old) {
                console.log(`${old} ---> ${now}`)
                old = now
            }
        }
    })
}

//demo
var obj = {
    name: 'mi'
}

observe(obj, 'name')
obj.name = 'mirone'











