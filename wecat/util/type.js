/*
if (isType(target, "array")) {
    lastArr = target;
}
*/

function _isType(target, type) {
    return (
        Object.prototype.toString.call(target).toLowerCase() ===
        "[object " + type + "]"
    );
}



