<br>
已完成列表

![](https://img.shields.io/badge/%E8%84%9A%E6%89%8B%E6%9E%B6cli-0.0.1%7Cnode%7Cnpm%7Ccommander%7Cgit-brightgreen.svg)    
![](https://img.shields.io/badge/%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8Etemplate-0.0.1%7Creg%7Cnew%20Function-brightgreen.svg)    
![](https://img.shields.io/badge/%E8%B7%AF%E7%94%B1router-1.0.0%7Chash%7Clazy%20load%7Chook%20function-brightgreen.svg)   

<br>

vue毫不疑问是我们写框架时借鉴的核心，**但是据我观察，其实很多人是不会读这种成熟的库、框架的**
<br>
所以在这里先和大家说一下如何读vue => [https://github.com/screetBloom/wecat.js/tree/master/How_to_read_Vue_correctly](https://github.com/screetBloom/wecat.js/tree/master/How_to_read_Vue_correctly)
         
           

wecat.js概述
---


目前正在开发打磨过程中，可能不会很及时的更新 ---> **近期将基本展示出来,核心代码在wecat目录**
<br>
包含内容：
- 脚手架 
- 数据和模板渲染
- 路由
- 通信组件
- http请求组件 
- UI类库

1.脚手架的实现
---  
**多种实现教程，查看cli目录** => [https://github.com/screetBloom/wecat.js/tree/master/cli](https://github.com/screetBloom/wecat.js/tree/master/cli)

```bash
// 全局安装脚手架
npm install -g snowcat
// 拉取预定义模板
snowcat init
```        

####  0.0.1版本完整代码
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
    
 **init.js** ==> init 命令的定义文件
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
响应式代码主要在wecat>lib文件夹里面      
我们目前定义的"响应式"其实主要是指在对对象属性进行修改时可以直接的将视图进行响应式的变化   
思路：   
- 采用方法使对象是可观察变化的
- 观察对象所有属性
- 对属性进行读时，收集依赖关系
- 对属性进行写时，更新视图



3.模板引擎
---

目前的模板引擎比较不满意，暂时不会进行讲解；正在进行virtual-template的开发


<br>
<br>        

4.路由
---

路由属于已经开发结束的，但是目前没有更多的精力进行这一块的详细讲述，主要还是集中在框架剩余功能的开发上；一个框架首先不管怎么样要能跑起来    
另外，一旦组件化和数据渲染的方式向virtual-dom靠拢，路由需要跟着进行对应的修改，目前的路由还不满足virtual-dom的渲染要求  
<br>
<br>
<br>
<br>

综合实现
---
**vue毫不疑问是借鉴的核心，这里放一点自己的思路，详情看目录** => [https://github.com/screetBloom/wecat.js/tree/master/wecat](https://github.com/screetBloom/wecat.js/tree/master/wecat)     

      





