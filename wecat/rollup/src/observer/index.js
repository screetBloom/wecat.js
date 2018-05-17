import {
    hasOwn,
    isObject
}
    from '../util/index'

export function observe (value){
    if (!isObject(value)) {
        return
    }
    var ob
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__
    } else {
        ob = new Observer(value)
    }
    return ob
}


