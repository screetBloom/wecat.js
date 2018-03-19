
### 脚手架

该部分已经开发完成，请按照下述使用方式拉取框架

模版内置支持

- 热更新、支持es6、less或sass等
- 利用html-webpack-plugin来生成html页面
- 利用 extract-text-webpack-plugin 自动加载生成的css、less等
- 处理资源的动态路径问题
- 合理管理前端环境，如预发环境和线上环境

脚手架使用方式
```bash
// 安装脚手架,不全局安装的画，snowcat命令只能在当前文件夹使用
npm install snowcat -g
// 帮助命令，目前只是拉取github仓库代码，故帮助命令暂时取消，留待后期拓展
// snowcat -h
// 拉取项目模板
snowcat init
```

1.脚手架的实现
---
脚手架作用： **快速搭建一个我们预定义好的模板项目结构**    
我们这里就做了两件事（已经满足了我目前的需求，可以继续拓展）：
- 1.自定义nodejs命令
- 2.在nodejs中执行shell命令（通俗说的命令行命令），拉取模板项目到本地
     
###   1.1  导言
我们平时经常会使用vue、angular、react等的脚手架，都可以达到如下效果
```bash
// 1. 全局安装对应的脚手架  "xxx-cli"  （不全局安装的话，只能在当前安装包下使用）
npm install -g xxx-cli

// 2. 接下来直接就如"vue init"就可以直接拉取一个模板项目到我们的当前文件夹
vue init
```

这个效果挺好用的，假如我积累了一套框架，我不想每次重开项目都拷贝到其他文件夹来用；当别人需要的时候，别人又要从我这拷贝一份；或者是我每次都给别人一串别人基本记不住的git的url链接,这个太麻烦了   
我希望能有一套脚手架，能像这些成熟的框架的脚手架一样直接把我想要的模板项目用最简短而有效的命令拉取到任何我想要获取的电脑的文件夹中，再有需要了，我还能继续拓展  
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

**先上组织结构和代码，再从零开始讲实现方式和原理**   

#### 1.1.1  0.0.1版本脚手架组织结构
![](http://7xl4c6.com1.z0.glb.clouddn.com/FtssXeBajoEV6SDlWuTcCdsgq1c6)    

      
#### 1.1.2  实现0.0.1版本脚手架的完整代码
**snowcat.js** ==> 脚手架定义的所有命令的入口，这里暂时只有init命令
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

 **package.json** ==> 在package.json文件中声明整个文件包的可执行文件的位置
```bash
"bin": {
    "snowcat": "bin/snowcat.js"
  }
```

#### 1.1.3  实现思路

上述的3个文件主要完成了2个最基本的事情
- 1.自定义nodejs命令。在nodejs原本肯定是没有"snowcat"这种命令的，这个是我们自定义的
- 2.用nodejs执行shell命令（通俗讲的命令行命令），这里主要是执行了git clone     
    
**那么我们现在先来尝试一下，如何自定义nodejs命令**   
在这里我们需要引入一个"commander.js"的npm包   
先说明：不引入任何包都是可以完成我们上述的两件事，引入的主要原因有2个
- 1.有了这个npm包，可以简化我们命令行的开发，把我们主要精力还是回归到框架开发上
- 2.commander有大量的api，我们目前只是0.0.1版本，不依赖任何包来实现都是没有问题的，以后高版本1.0.0的拓展还是要用它的，这里我直接和大家说一下，也可以熟悉一下它的使用   


我在这里补充一下不用任何依赖包的实现方式：
```bash
// PS.在nodejs中，可以直接用nodejs内置的全局变量process获取到你输入的命令的参数
// 现在我们直接就可以利用 process.argv来获取，如定义snowcat.js文件如下：
#!/usr/bin/env node
let run= function (para) {
    if(para[0] === '-test'){
        console.log('version is 1.0.0');
    }
    if(para[1] === '-host'){
        console.log('127.0.0.1');
    }
};
 console.log(process.argv)
run(process.argv.slice(2));
```   
**顶部的"#!/usr/bin/env node"的意思是 显式的声明这个文件用node来执行**   
执行snowcat.js文件   
```bash
node snowcat.js
```
输出结果如下：
```bash
[ '/usr/local/bin/node',
  '/Users/chenwei/Desktop/工作与兴趣/common_test/command/test_one/snowcat.js',
  '-test',
  '-host' ]
version is 1.0.0
127.0.0.1
```
我写这个demo是什么意思呢，现在我们就可以直接根据参数来匹配对应执行的函数了，以上面的init.js文件为例   
我们先获取到输入的参数，匹配一下执行对应的函数就行，这里可以直接require('init.js')执行就行，和commander.js无任何关系    
     
**argv返回的是一个不定长的数组，第一个是node.exe的路径，第二个是当前文件的路径，接下来是你命令后面跟的参数**    
    
nodejs中的process的[官方说明文档在这](http://nodejs.cn/api/process.html)   
**这里我们就顺着这个继续了，commander等等再说**，对目前的我们来说也没到重要要偏说不可的地步      
      
      
有没有注意到上面我们都是在js文件所在目录下直接"node snowcat.js -test"来执行js文件，我们该如何直接"snowcat -test"就执行js文件呢 ，也就是上面我们说的**自定义nodejs命令** 
这个时候**package.json**就需要登场了    
```bash
// 初始化一个package.json，相关信息自定义
npm init
```   
在里面添加一行   
```bash
"bin": {
    "snowcat": "snowcat.js"
  }
```    
**这个是什么意思呢： 简单说就是把命令名作为key，本地文件名作为value做一个映射。全局安装的时候，npm会把你定义的这个命令名"snowcat"对应的可执行文件安装到系统路径下，达到全局使用该命令的目的；本地安装的时候，会直接链接到'./node_modules/.bin/'**

目前的配置信息应该基本如下：
```bash
{
  "name": "snowcat",
  "version": "0.0.1",
  "description": "my cli 0.0.1",
  "main": "init.js",
  "bin": {
    "snowcat": "snowcat.js"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "wim_chen",
  "license": "ISC"
}

```     
**现在我们来尝试本地的全局的运行 "snowcat" 命令，这里需要用到 "npm link"，这里注意：是我们自己全局使用，给别人全局用可以发布到npm仓库**   
```bash
// 在当前的package.json中输入该命令
npm link
```    

这个"npm link"主要是在我们本机的全局的"node_modules"目录中，生成一个符号链接"a symbolic link"指向我们当前文件夹       
      
      
又因为我们在**package.json**中定义了"bin"，指出了全局安装的时候命令"snowcat"对应的js文件   
现在我们在本机的任何一个地方输入"**snowcat -test -host**"都会输出下述结果：
```bash
[ '/usr/local/bin/node',
  '/Users/chenwei/Desktop/工作与兴趣/common_test/command/test_one/snowcat.js',
  '-test',
  '-host' ]
version is 1.0.0
127.0.0.1
```

**想要进一步的达到如**
```bash
npm install -g snowcat 
// 执行我们目前的脚手架
snowcat -test -host
```   
现在只需要做如下几步：   
- 1.注册一个npm账号，点击[https://www.npmjs.com/ 直达npm官网](https://www.npmjs.com/)
- 2.给你的package.json里面的name写一个大家都没用过名字（snowcat你是别想了，很明显已经名花有主了）  
- 3.在你本地的package.json所在的路径下输入："npm adduser"，然后输入你的用户名、密码、邮箱
- 4.输入 "npm publish"就将你的npm包发送到了npm仓库
- 5.找个好朋友，让他安装一下你的包"npm install -g xxx"，让他输入" snowcat -test -host"就可以打印出你写好的内容了，比如"我爱你"？   
    
    
**现在我们来按要求拉取我们的项目，用一开始的文件结构举例**      
![](http://7xl4c6.com1.z0.glb.clouddn.com/FtssXeBajoEV6SDlWuTcCdsgq1c6)         
先创建一下对应的文件   
    
首先"npm init"我们的package.json文件，并设置"commander.js"依赖和合适的bin
```bash
{
  "name": "snowcat",
  "version": "0.0.1",
  "description": "my js cli 0.0.1",
  "main": "index.js",
  "bin": {
    "snowcat": "bin/snowcat.js"
  },
  "dependencies": {
    "commander": "^2.9.0"
  },
  "author": "wim_chen",
  "license": "ISC"
}

```     

**这里先说明一下 commander.js的语法**
```bash
program
    .command('init')       // 命令是 init
    .description('pull a new project')    // 命令的描述
    .alias('i')    // 命令别名，用init和i都行
    .action(() => {
      require('../command/init')()  // 执行init命令时要做什么，这里是执行init文件里导出的函数
  })
```

开始是编写我们的命令行入口文件，bin文件夹下的snowcat.js，也很简单
```bash
// 头部添加显示声明：本文件用node来执行
#!/usr/bin/env node
// 严格模式
'use strict'
// 引入 commander，用于处理自定义nodejs命令
const program = require('commander')
// 引用package.json里面的版本号来定义当前版本
program
    .version(require('../package').version )

// 定义init命令，同时定义init命令的简化命令 i，包括命令的脚本文件所在路径
program
    .command('init')
    .description('pull a new project')
    .alias('i')
    .action(() => {
        require('../command/init')()
    })

// 这一句必不可少，作用是解析命令行参数argv，这里的process.argv是nodejs全局对象的属性
program.parse(process.argv)

// 如果用户只是输入了 "snowcat"没带参数，就给他展示他能输入的所有命令
if(!program.args.length){
    program.help()
}

```    
    
**我们先来试一下，执行snowcat命令**  
```bash
node ./bin/snowcat.js 
```   
显示如下，就是正确的,说明我们commander.js使用的很顺利    
![](http://7xl4c6.com1.z0.glb.clouddn.com/FrbZ39PqzBMxsuOlJQ8byl_HxC2x)   

    
编写我们的 init.js   
```bash
'use strict'
// 这个是node自带调用自窗口执行shell命令的方法,等会用
const exec = require('child_process').exec
module.exports = () => {
    console.log('this is my first commander >>>>>> ')
}
```    

现在我们输入
```bash
node ./bin/snowcat.js  init
```
![](http://7xl4c6.com1.z0.glb.clouddn.com/Frf5IpGeA-b0WMzm93xLovfT0EwD)     
     
     
接下来我们来利用git来拉取我们的项目   
编写init.js
```bash
'use strict'
const exec = require('child_process').exec
const projectUrl = 'https://github.com/screetBloom/wecat.js.git'

module.exports = () => {
    console.log('this is my first commander >>>>>> ')

    // git命令，远程拉取项目并自定义项目名
    let cmdStr = `git clone `+projectUrl

    // 在nodejs中执行shell命令，第一个参数是命令，第二个是具体的回调函数
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

现在我们再输入
```bash
node ./bin/snowcat.js  init
```   
此时项目已经可以正确的拉取下来了，接下来我们来进行本地全局安装，在当前的package.json路径下输入"npm link"（可以本地全局使用了）   
在其它路径下拉取项目   
![](http://7xl4c6.com1.z0.glb.clouddn.com/FrBSi6ByHOlv75ZnLlDP6DxxUz99)
成功，那么现在我们把它放到npm仓库里，如果上一次你已经放进去0.0.1版本了，这次就需要修改版本号了，操作如下：
```bash
// 比如对最后一位进行修改：增1，命令，回车：
npm version patch    
// 比如对第二位进行了修改：增1，命令：
npm version minor    
// 比如对第一位进行了修改：增1，命令：
npm version major  
     
// 查看所有的版本号：
npm view snowcat versions
```

最后我们再在其它机器上测试
```bash
// 全局安装脚手架
npm install -g snowcat
// 拉取预定义模板
snowcat init
```   
![](http://7xl4c6.com1.z0.glb.clouddn.com/FuN7_ko3l211kWoorHjVYR_z0pQe)
![](http://7xl4c6.com1.z0.glb.clouddn.com/FnfbDsCKUt8RfvNG3lQKh6d8uRzw)    
     
         
<br>
<br>
0.0.1版本的脚手架分享到此结束



