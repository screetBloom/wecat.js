
let object = {}, test = 'test'
Object.defineProperty(object, 'test', {
    configurable: true,            // 描述该属性的描述符能否被改变，默认值为 false
    enumerable: true,               // 能否被遍历，比如 for in，默认值为 false
    get: function(){                // 取值的时候调用，object.test，默认值为 false
        console.log('enter get')
        return test
    },
    set: function(newValue){        // 设置值的时候使用
        console.log('enter set')
        test = newValue
    }
})

object.test

object.test = 'test4'










