
![](https://img.shields.io/badge/%E8%84%9A%E6%89%8B%E6%9E%B6cli-0.0.1%7Cnode%7Cnpm%7Ccommander%7Cgit-brightgreen.svg)    
![](https://img.shields.io/badge/%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8Etemplate-0.0.1%7Creg%7Cnew%20Function-brightgreen.svg)    
![](https://img.shields.io/badge/%E8%B7%AF%E7%94%B1router-1.0.0%7Chash%7Clazy%20load%7Chook%20function-brightgreen.svg)   

Vue.js科学阅读方式 => [从阅读Vue的第一个commit开始](https://github.com/screetBloom/wecat.js/tree/master/How_to_read_Vue_correctly)

wecat.js => 核心：基于响应式的组件系统
---

包含内容：
- 脚手架 
- 数据和模板渲染
- 路由
- 通信组件
- http请求组件 
- UI类库

1.脚手架的实现
---  
**两种实现自定义脚手架教程，查看cli目录** => [https://github.com/screetBloom/wecat.js/tree/master/cli](https://github.com/screetBloom/wecat.js/tree/master/cli)

```bash
// 全局安装脚手架
npm install -g snowcat
// 拉取预定义模板
snowcat init
```        

####  0.0.1版本完整代码
**snowcat.js**
```bash
#!/usr/bin/env node
'use strict'
const program = require('commander')
program
    .version(require('../package').version )

program
    .command('init')
    .description('pull a new project')
    .alias('i')
    .action(() => {
        require('../command/init')()
    })

program.parse(process.argv)

if(!program.args.length){
    program.help()
}
```   
    
 **init.js**
```bash
'use strict'
const exec = require('child_process').exec
const projectUrl = 'https://github.com/screetBloom/wecat.js.git'

module.exports = () => {
    console.log('this is my first commander >>>>>> ')
    let cmdStr = `git clone `+projectUrl

    exec(cmdStr, (error, stdout, stderr) => {
        if (error) {
            console.log(error)
            process.exit()
        }
        console.log('pull我们的项目已经成功了')
        process.exit()
    })

}
```


     
     
2.响应式实现
---
**此图有误，暂未更新；往下看，有整体的流程图**
![响应式实现示意图](http://7xl4c6.com1.z0.glb.clouddn.com/Fu3WDr8EtxG0pGJgWA1USXzLBuc_)     
思路：   
- 采用方法使对象是可观察变化的
- 观察对象所有属性
- 对属性进行读时，收集依赖关系
- 对属性进行写时，更新视图

3.模板引擎
---
目前的模板引擎比较不满意，暂时不会进行讲解；正在进行virtual-template的开发       
![虚拟模板结合虚拟dom示意图](http://7xl4c6.com1.z0.glb.clouddn.com/Fpq5bEp2oZPPBXPsHwpFc1wshiOj)  

4.路由
---
路由属于已经开发结束的，但是目前没有更多的精力进行这一块的详细讲述，主要还是集中在框架剩余功能的开发上；一个框架首先不管怎么样要能跑起来    
另外，一旦组件化和数据渲染的方式向virtual-dom靠拢，路由需要跟着进行对应的修改，目前的路由还不满足virtual-dom的渲染要求          
- 预计可能的实现方式是：hash结合动态组件去实现      
**目前简单的方式：**    
![路由1.0流程示意图](http://7xl4c6.com1.z0.glb.clouddn.com/Fiz-dYfMNS0FZH70iGbZ45cZnMrV)  

5.Web Components 
---
- Custom Elements: 提供自定义元素和标签的能力
    - registerElement(需用"-"连接)
    - 生命周期和回调
    - 扩展元素
- HTML Templates: 组件模板
- HTML Imports: 支持/提供在 HTML 中合理引入组件的方式
    - HTMLLinkElement
- Shadow DOM: 处理组件间代码隔离的问题
<br>
**我们一定要利用浏览器的组件化标准草案去做组件化吗？**   
还有其它的解决方式，可以利用实现H5的自定义标签名去实现；在子组件遍历时，将标签名和导入组件名一样的标签内容替换成已声明子组件的template内容；再将子组件的data和methods作用域指向子组件
<br>
**简单介绍组件遍历**
![组件遍历方式](http://7xl4c6.com1.z0.glb.clouddn.com/Fk_gXH-Is7pneNWTJf9XqlMvVEyT)


1.0综合实现示意图
---
**初始小demo**    
![框架流程图](http://7xl4c6.com1.z0.glb.clouddn.com/FvjdO6Dpd8dKIizCzcsI5zhvygpd)  







