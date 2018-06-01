
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

 @ 已知最准确的判断当前对象类型方法
*/

export function _isType (target, type) {
    return (
        Object.prototype.toString.call(target).toLowerCase() ===
        "[object " + type + "]"
    );
}

export function _def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

export function _trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
}

/*
*  @ 自己封装的继承函数
*  @ child继承parent
* */
export function _extend(Child, Parent) {
    let F = function(){};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    // 子对象可以直接回溯父对象，链式保存父对象
    Child.parent = Parent.prototype;
}

/*
*  1: 元素节点
*  2: 属性节点
*  3: 文本节点
*  8: 注释节点
*  9: document节点
* */
export function _isDOMType(node) {
    return node.nodeType
}

/*
*  @ div、input、p等
* */
export function _isDOMTagname(node) {
    return node.tagName.toLocaleLowerCase()
}

export function _isDirective(attr) {
    return attr.indexOf('c-') === 0
}

export function _isEventDirective (dir) {
    return dir.indexOf('on:') === 0
}

export function _node2Fragment (el) {
    let fragment = document.createDocumentFragment()
    let child = el.firstChild
    while (child) {
        fragment.appendChild(child)
        child = el.firstChild
    }
    return fragment
}

export function _deepPath(vm,exp){
    let value = '',
        paths = exp.split('.'),
        len = paths.length
    if(len === 1){
        value = vm[exp]
    }else{
        let res = vm
        paths.forEach(function (item) {
            res = res[item]
        })
        value = res
    }
    return value;
}

/*
*  @  DFS:深度优先遍历;有子节点找子节点，没有子节点再找兄弟节点
*  @ 由外部传递对当前层每个节点的处理方式
*  calback(){
*       console.log(`${deep}:${node.tagName}`);
*  }
* */
export function  _DFSTraverse(rootNodes,deep,callback){
    const roots = Array.from(rootNodes)
    while (roots.length) {
        const root = roots.shift();
        !!callback && callback(deep,root);
        // 如果有子节点，直接遍历子节点，同时将层级加1
        if ((root.nodeType === 1)&&root.children.length) {
            _DFSTraverse(root.children,deep + 1,callback)
        }
    }
}



















