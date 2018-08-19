
![](https://img.shields.io/badge/%E8%84%9A%E6%89%8B%E6%9E%B6cli-0.0.1%7Cnode%7Cnpm%7Ccommander%7Cgit-brightgreen.svg)    
![](https://img.shields.io/badge/%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8Etemplate-0.0.1%7Creg%7Cnew%20Function-brightgreen.svg)    
![](https://img.shields.io/badge/%E8%B7%AF%E7%94%B1router-1.0.0%7Chash%7Clazy%20load%7Chook%20function-brightgreen.svg)   
![](https://img.shields.io/badge/c--model-wecat.js1.0-brightgreen.svg)         
![](https://img.shields.io/badge/c--show-wecat.js1.0-brightgreen.svg)       
![](https://img.shields.io/badge/%E6%8F%92%E5%80%BC%E8%A1%A8%E8%BE%BE%E5%BC%8F-wecat.js1.0-brightgreen.svg)         
![](https://img.shields.io/badge/watch%E7%9B%91%E6%B5%8B%E6%95%B0%E6%8D%AE-wecat.js1.0-brightgreen.svg)         
![](https://img.shields.io/badge/%E7%BB%84%E4%BB%B6%E7%B3%BB%E7%BB%9F-wecat.js1.0-brightgreen.svg)         
 
      

Vue.js科学阅读方式 => [从阅读Vue的第一个commit开始](https://github.com/screetBloom/wecat.js/tree/master/How_to_read_Vue_correctly)

wecat.js => 核心：基于响应式的组件系统
---

现在源码还很乱，写的挺差的的；如果感兴趣看一下下面的示意图，大概实现思路都在图中。           
**目前框架简单实现的demo**,[demo地址在这](http://115.159.100.155/wecat/index.html)     
demo示意图
![demo](http://oowv4l1s8.bkt.clouddn.com/demo.png)

包含内容：
- 脚手架 
- 响应式
- 组件化
- 数据和模板渲染
- 路由
- http请求组件 
- UI类库

wecat.js1.0综合实现示意图
---
**目前框架流程图，还比较粗糙**     
这段时间忙于公司业务，也在反省自己，思考未来的发展，有好一段时间没有更新了
![框架流程图](http://7xl4c6.com1.z0.glb.clouddn.com/FlPWkwa-hNjhdMEHT49949azsKT7)  

1.脚手架的实现
---  
**两种实现自定义脚手架教程，查看cli目录** => [https://github.com/screetBloom/wecat.js/tree/master/cli](https://github.com/screetBloom/wecat.js/tree/master/cli)

```bash
// 全局安装脚手架
npm install -g snowcat
// 拉取预定义模板
snowcat init
```        


####  0.0.1版本脚手架完整代码
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
**简单示意**
![响应式实现示意图](http://7xl4c6.com1.z0.glb.clouddn.com/FselYryU-RVQc4Bb4wnh4Uu81Q8N)     
思路：   
- 采用方法使对象是可观察变化的
- 观察对象所有属性
- 对属性进行读时，收集依赖关系
- 对属性进行写时，更新视图

3.Web Components 
---
#### 3.1 浏览器规范"web Components"
- 3.1.1 Custom Elements: 提供自定义元素和标签的能力
    - registerElement(需用"-"连接)
    - 生命周期和回调
    - 扩展元素
- 3.1.2 HTML Templates: 组件模板
- 3.1.3 HTML Imports: 支持/提供在 HTML 中合理引入组件的方式
    - HTMLLinkElement
- 3.1.4 Shadow DOM: 处理组件间代码隔离的问题          

#### 3.2 自己实现的"web Components"
**我们一定要利用未全面普及浏览器的组件化标准草案去做组件化吗？**        
在wecat.js中我采取了另外一种geek的实现方式： 利用H5的自定义标签实现，在子组件遍历时，将标签名和导入组件名一致的标签内容替换成已声明子组件内容；再将子组件作用域指向子组件       
下面这幅图主要是简单介绍一下当前在做组件遍历时采用的方法：    

![组件遍历方式](http://7xl4c6.com1.z0.glb.clouddn.com/Fk_gXH-Is7pneNWTJf9XqlMvVEyT)

4.模板引擎
---
virtual-template结合virtual-dom简单示意图       
![虚拟模板结合虚拟dom示意图](http://7xl4c6.com1.z0.glb.clouddn.com/Fpq5bEp2oZPPBXPsHwpFc1wshiOj)  

5.路由
---
路由属于已经开发结束的，但是目前没有更多的精力进行这一块的详细讲述，主要还是集中在框架剩余功能的开发上；一个框架首先不管怎么样要能跑起来    
另外，一旦组件化和数据渲染的方式向virtual-dom靠拢，路由需要跟着进行对应的修改，目前的路由还不满足virtual-dom的渲染要求          
- 预计可能的实现方式是：hash结合动态组件去实现      
**目前简单的方式：**    
![路由1.0流程示意图](http://7xl4c6.com1.z0.glb.clouddn.com/Fiz-dYfMNS0FZH70iGbZ45cZnMrV)  



License
---

The MIT License (MIT)

     





