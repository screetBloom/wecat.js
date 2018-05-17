import {
    def, //new
    hasOwn,
    isObject
}
    from '../util/index'

export function Observer(value) {
    this.value = value
    this.dep = new Dep()
    this.walk(value)
    def(value, '__ob__', this)
}

