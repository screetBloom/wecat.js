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

function _isType_(target, type) {
    return (
        Object.prototype.toString.call(target).toLowerCase() ===
        "[object " + type + "]"
    );
}


// export default {_isType}
module.exports=_isType_



