
/*

常用类型：
    [object Object] => toLowerCase =>  [object object]
    [object array]
    [object function]
    [object string]
    [object number]
    [object boolean]
    [object date]
    [object null]
    [object undefined]
    [object regexp]
    [object window]

使用方式:
if (isType(target, "array")) {
    ......
}

*/

export function _def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

export function _trim_(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
}

export function _isType (target, type) {
    return (
        Object.prototype.toString.call(target).toLowerCase() ===
        "[object " + type + "]"
    );
}











