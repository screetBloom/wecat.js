wecat.js
---
个人开发的一个js框架，欢迎提各种类型的issue，看到第一时间会回复   ：）    
![](https://img.shields.io/badge/%E8%84%9A%E6%89%8B%E6%9E%B6cli-0.0.1%7Cnode%7Cnpm%7Ccommander%7Cgit-brightgreen.svg)    
![](https://img.shields.io/badge/%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8Etemplate-0.0.1%7Creg%7Cnew%20Function-brightgreen.svg)    
![](https://img.shields.io/badge/%E8%B7%AF%E7%94%B1router-1.0.0%7Chash%7Clazy%20load%7Chook%20function-brightgreen.svg)   
    
         
         

概述
---

目前正在开发打磨过程中，可能不会很及时的更新 ---> *3月底将基本展示出来*
<br>

包含内容：
- 脚手架 
- 模板引擎  
- 路由和路由对应的钩子函数,懒加载js等 
- 数据和模板渲染（正在开发virtual-dom）
- 通信组件（支持父子通信、兄弟通信、广播消息、选择性的范围广播）
- http请求组件 （核心为xhr、fetch）
- 各个部分以插件形式载入项目 
     
**每个部分结构都大致如下：**
- 导言（扯淡部分）
- 具体实现部分 

1.脚手架的实现
---
     
###   1.1  导言
我们平时经常会使用vue、angular、react等的脚手架，都可以达到如下效果
```bash
// 1. 全局安装对应的脚手架  "xxx-cli"  （不全局安装的话，只能在当前安装包下使用）
npm install -g xxx-cli

// 2. 接下来直接就如"vue init"就可以直接拉取一个模板项目到我们的当前文件夹
vue init
```

这个效果挺好用的，假如我积累了一套框架，我不想每次都拷贝到其他文件夹来用，或者当别人需要的时候，我拷贝给别人一份,这个太麻烦了   
我希望能有一套脚手架，能像这些成熟的框架的脚手架一样直接把我想要的模板项目用最简短而有效的命令拉取到任何我想要获取的电脑的文件夹中   
```bash
// 全局安装脚手架
npm install -g snowcat
// 拉取预定义模板
snowcat init
```   

本地效果演示：
<br>
![](http://7xl4c6.com1.z0.glb.clouddn.com/FjpPFQiEG8LPV5H84LvPmX1YQ4uW)

其它机器上演示：
<br>
![](http://7xl4c6.com1.z0.glb.clouddn.com/FuN7_ko3l211kWoorHjVYR_z0pQe)
![](http://7xl4c6.com1.z0.glb.clouddn.com/FnfbDsCKUt8RfvNG3lQKh6d8uRzw)

###   1.2  脚手架具体实现过程

先上组织结构和代码，再从零开始讲实现方式和原理   

#### 1.1.1  0.0.1版本脚手架组织结构
![](http://7xl4c6.com1.z0.glb.clouddn.com/FtssXeBajoEV6SDlWuTcCdsgq1c6)    

      
#### 1.1.2  实现0.0.1版本脚手架的代码
**snowcat.js** ==> 脚手架定义的所有命令的入口，这里只有init
```bash
#!/usr/bin/env node
'use strict'
process.env.NODE_PATH = __dirname + '/../node_modules/'
const program = require('commander')
program
    .version(require('../package').version )
program
    .usage('<command>')

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

 **package.json** ==> 在package.json文件中声明整个文件包的可执行文件的位置
```bash
"bin": {
    "snowcat": "bin/snowcat.js"
  }
```

#### 1.1.3  实现思路













