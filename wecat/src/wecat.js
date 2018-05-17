
/**
 * wecat构造函数
 * @param options
 * @constructor
 */
function Cat(options) {
    this._init(options);
}

/**
 * 初始化构造函数
 * @param options
 * @private
 */
Cat.prototype._init = function (options) {

    // options 为上面使用时传入的结构体，包括 el, data, methods
    this.$options = options;
    this.$el = document.querySelector(options.el);
    this.$data = options.data;

    // this.$methods = {increment: function () { this.number++; }}
    this.$methods = options.methods;

    // _binding 保存着 model 与 view 的映射关系，也就是我们定义的 Watcher 的实例。当 model 改变时，我们会触发其中的指令类更新，保证 view 也能实时更新
    this._binding = {};

    // 监听 this.$data 中的数据变化；进行依赖收集
    // obverser(this.$data)

    // 解析：指令、依赖收集
    // compile(this.$el)
};











