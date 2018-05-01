
**如果对您有帮助，帮忙点个star，让我有更大的动力继续分享，如果您要转载，务必补上我的github地址，谢谢**
<br>
<br>

已完成列表
--- 
![](https://img.shields.io/badge/%E8%84%9A%E6%89%8B%E6%9E%B6cli-0.0.1%7Cnode%7Cnpm%7Ccommander%7Cgit-brightgreen.svg)    
![](https://img.shields.io/badge/%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8Etemplate-0.0.1%7Creg%7Cnew%20Function-brightgreen.svg)    
![](https://img.shields.io/badge/%E8%B7%AF%E7%94%B1router-1.0.0%7Chash%7Clazy%20load%7Chook%20function-brightgreen.svg)   

<br>

vue毫不疑问是我们写框架时借鉴的核心，**但是据我观察，其实很多人是不会读这种成熟的库、框架的**，所以在这里先和大家说一下如何读vue
         
科学读vue，授人以渔？知道element UI为什么取名element吗？
--- 
接下来我们会具体的回答这两个问题。
毫无疑问，任何东西在刚起步的时候都是非常简单，当然也包括Vue，而且一开始的代码更能清晰的展示出来最一开始作者的思路      
<br>
我相信当你读vue源代码的时候，肯定也遇到过和我一样的问题，vue从2014年中后期大规模被使用以来，历时4年了。目前高度解耦的代码我是感觉很不好读的，很多时候我们都是看别人的博客和理解来读vue源码，不仅片面还都喜欢互相抄袭       
其实，我们自己也是可以尝试完全靠自己来理解vue的，不用去看某些人云亦云的博客     
然而当我们尝试去读源码，当我们打开[vue.js](https://github.com/vuejs/vue),你会看到
![vue的github主页](http://7xl4c6.com1.z0.glb.clouddn.com/FiaRUXW8uTUs_m8UQL1yNyKozBwu)
<br>     
这里你会发现，即使你选"0.10"的branches，希望获取早期版本源码，那里面的代码也已经是中后期很系统的代码了，**那么如何从最最最初期的代码读起呢？**        
这个时候我们想到了commit，只要尤雨溪推代码，每次commit都会被记录下来，而在github上如何在当前仓库展示特定的某次commit呢？比如第一次的commit        
这个我先和大家说一下，github保存commit时是用的40位的hash值来标志某一次commit，呈现在浏览器上的url是这样子的：
```bahs
https://github.com/vuejs/vue/tree/83fac017f96f34c92c3578796a7ddb443d4e1f17
// 也可以用7位hash来访问，如
https://github.com/vuejs/vue/tree/83fac01
```
url格式是：仓库地址+'/tree/hash值'，那么我们只要获得commit的hash值，就可以读到vue从第一个提交到现在的所有版本的代码，不会有任何遗漏        
其实上述的url就是vue第一次提交的源代码，我们看图，注意标注的第一次提交：
![vue的第一次提交](http://7xl4c6.com1.z0.glb.clouddn.com/FnMSjLvqUx99YYk4Jy2k3L5VUhkn)        
**那么现在的问题就来了，如何获取到每一次vue项目提交的commit的hash值呢？既然是github，很明显的需要借助git命令**        
方法如下：
-  1. git clone下来
-  2. 在项目目录打开 控制台，输入“git log --oneline --decorate --graph --all”，来查看所有commit，你会发现有非常多的commit，远远大于github上统计的数字。可以输入10万直接翻到最后一个“83fac017”，那我们现在开始看看历史上的第一个版本的hash，然后在浏览器中输入https://github.com/vuejs/vue/tree/83fac017 在github上查看
-  3. 查看对应的head 的hash值，修改tree后面的值访问即可，我们找几个提交的代码来看看(test目录都是测试代码，可以不看)
![查看hash](http://7xl4c6.com1.z0.glb.clouddn.com/FsWUczxuJLMhHpG7qW9NbcEvv7xx)

```bash
// 看看第一次提交的代码，目录结构有好几个，但是主要代码就main.js里的一句
module.exports = 123
// 我们再看看第三次提交的代码，很明显的src目录里已经有了三个文件directives.js、filters.js、main.js；这部分可以自己去看
// 我们重点看一下目录'explorations/getset.html'
var app = new Element('test', {
    msg: 'hello'
})
```
**有没有想到饿了吗前端为什么将自己的UI组件库取名"element UI"**,猜的不错的话，一方面应该是致敬vue；
从中我们也很明显看得出来，他们很早以前就知道这个方法来查看vue的历史版本，但是遗憾的是，网上很少有"授人以鱼不如授人以渔"的做法，没人去说如何合理的去看源代码，大量充斥的都是对源码理解的相互抄袭      
**到这里，如何科学的读vue就结束了，读vue使用这种方法，读react呢？还有以后读各种库呢？**
          

wecat.js概述
---

目前正在开发打磨过程中，可能不会很及时的更新 ---> **近期将基本展示出来,核心代码在wecat目录**
<br>

包含内容：
- 脚手架：要让其他人能仅通过简单的一个脚手架命令，就能把项目按分类拉下来
- 模板引擎  
- 路由和路由对应的钩子函数,懒加载js等 
- 数据和模板渲染（正在开发virtual-dom）
- 通信组件（支持父子通信、兄弟通信、广播消息、选择性的范围广播）
- http请求组件 （核心为xhr、fetch）
- UI类库（参考eleUI）
- 各个部分以插件形式载入项目 
     
**下述5个大部分，每个部分结构都大致如下：**
- 导言（扯淡部分，可以直接跳过）
- 具体实现部分      
**各个模块的详细介绍一般放在各个模块内部**


1.脚手架的实现，更加详细教程，请查看目录cli => readme.md
---  
**更加详细的详情，请查看目录cli => readme.md**       
![](http://7xl4c6.com1.z0.glb.clouddn.com/Ft8EReomohPC5AcwOX320pxuiWbt)      

脚手架作用： **快速搭建一个我们预定义好的模板项目结构**    
我们这里就做了两件事（已经满足了我目前的需求，可以继续拓展）：
- 1.自定义nodejs命令
- 2.在nodejs中执行shell命令（通俗说的命令行命令），拉取模板项目到本地      
      

```bash
// 全局安装脚手架
npm install -g snowcat
// 拉取预定义模板
snowcat init
```        

####  实现0.0.1版本脚手架的完整代码
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

#### 不用任何依赖包的实现方式
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
/*
输出结果如下：
[ '/usr/local/bin/node',
  '/Users/chenwei/WebstormProjects/git_my/deep-in-vue/wim/test.js' ]
*/
node snowcat.js -test -host
/*
输出结果基本如下：
[ '/usr/local/bin/node',
  '/Users/chenwei/WebstormProjects/git_my/deep-in-vue/wim/test.js',
  '-test',
  '-host' ]
*/
```
这里我想告诉大家的就是**process.argv**，这个东西很关键，可以拿到用户输入的命令，然后你就可以根据输入执行对应的函数就行了       

先把 **console.log(process.argv)注释了，** 再来自定义指令试一试
```bash
node snowcat.js -test
/*
输出如下：
version is 1.0.0
*/
node snowcat.js -host
 /*
 输出如下：
 127.0.0.1
 */
```
我写这个demo主要表示**现在我们就可以直接根据参数来匹配对应执行的函数了**，以上面的init.js文件为例   
我们是先利用**process.argv.slice(2)** 获取到输入的参数，匹配一下执行对应的函数就行；纯node.js实现     
  
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
// 头部添加显示声明：本文件用node来执行；“#!”是一个约定的标记，它告诉系统这个脚本需要什么解释器来执行。
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
     
         
         
**0.0.1版本的脚手架分享到此结束**       

     
     
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

###   3.1  导言




###   3.2  模板引擎的具体实现过程



     
         
               
               

4.路由
---

路由属于已经开发结束的，但是目前没有更多的精力进行这一块的详细讲述，主要还是集中在框架剩余功能的开发上；一个框架首先不管怎么样要能跑起来     
另外，一旦组件化和数据渲染的方式向virtual-dom靠拢，路由需要跟着进行对应的修改，目前的路由还不满足virtual-dom的渲染要求  

###   4.1  导言




###   4.2  路由的具体实现过程                                                
                                                  

<br>
<br>
<br>
<br>
<br>

综合实现
---
**vue毫不疑问是借鉴的核心，这里放一点自己的思路，详情看目录 wecat => readme.md**     

      
vue的一种简单而直观的实现方式，正在迭代自己的一套东西,本部分只做参考     
 特性：
 - 数据响应式更新
 - 指令模板
 - MVVM
 - 轻量级
 
 [请看github仓库中源码](https://github.com/screetBloom/wecat.js)
 
<!-- more -->
 
#### 功能解读

```bash
 <templete>
    <div id='app'>
        <div>
            <input v-model='counter' />
            <button v-on-click='add'>add</button>
            <p v-text='counter'></p>
        </div>
    </div>
 </templete>

 <script>
var vm = new Vue({
        id: 'counter',
        data: {
            counter: 1
        },
        methods: {
            add: function () {
                this.counter += 1;
            }
        }
    })
 </script>
 ```
 
 如上为一段模板以及js脚本，我们所要实现的目标就是将 vm 实例与id为app的DOM节点关联起来，当更改vm data 的counter属性的时候，
 input的值和p标签的文本会响应式的改变，method中的add方法则和button的click事件绑定。
 简单的说就是, 当点击button按钮的时候，触发button的点击事件回调函数add,在add方法中使counter加1，counter变化后模板中的input
 和p标签会自动更新。vm与模板之间是如何关联的则是通过 v-model、v-on-click、v-text这样的指令声明的。   

#### 实现思路详解


 * 查找含指令的节点
 * 对查找所得的节点进行指令解析、指令所对应的实现与节点绑定、 节点指令值所对应的data属性与前一步关联的指令实现绑定、data属性值通过setter通知关联的指令进行更新操作
 * 含指令的每一个节点单独执行第二步
 * 绑定操作完成后，初始化vm实例属性值

#### 指令节点查找

 首先来看第一步，含指令节点的查找，因为指令声明是以属性的形式，所以可以通过属性选择器来进行查找，如下所示：
```bash
 <input v-model='counter' type='text' />
 ```
 则可通过 querySelectorAll('[v-model]') 查找即可。
```bash
    root = this.$el = document.getElementById(opts.el),
    els  = this.$els = root.querySelectorAll(getDirSelectors(Directives))
```
 root对于根节点，els对应于模板内含指令的节点。

 #### 指令解析，绑定
 
 ##### 1.指令解析
 同样以 **&lt;input v-model='counter' type='text'/&gt;** 为例，解析即得到
 ```bash
 var directive = {
    name: 'v-model',
    value: 'counter'
 }
 ```
 name对应指令名，value对应指令值。

 ##### 2.指令对应实现与当前节点的绑定(bindDirective)
 指令实现可简单分为函数或是包含update函数的对象，如下便是**v-text**指令的实现代码：

 ```bash
 text: function (el, value) {
        el.textContent = value || '';
    }
 ```
 指令与节点的绑定即将该函数与节点绑定起来，即该函数负责该节点的更新操作，**v-text**的功能是更新文本值，所以如上所示
 更改节点的textContent属性值。

 ##### 3. 响应式数据与节点的绑定(bindAccessors)
    响应式数据这里拆分为 data 和 methods 对象，分别用来存储数据值和方法。
```bash
    var vm = new Vue({
        id: 'counter',
        data: {
            counter: 1
        },
        methods: {
            add: function () {
                this.counter += 1;
            }
        }
    })
```
    我们上面解析得到 v-model 对于的指令值为 counter,所以这里将data中的counter与当前节点绑定。
 
 通过2、3两步实现了类型与 textDirective->el<-data.counter 的关联，当data.counter发生set(具体查看defineProperty set 用法)操作时，
 data.counter得知自己被改变了，所以通知el元素需要进行更新操作，el则使用与其关联的指令(textDirective)对自身进行更新操作，从而实现了数据的
 响应式。

    * textDirective
    * el
    * data.counter
 这三个是绑定的主体，数据发生更改，通知节点需要更新，节点通过指令更新自己。 


#### **基本实现**

```bash

var prefix = 'v';
 /**
  * Directives
  */

var Directives = {
    /**
     * 对应于 v-text 指令
     */
    text: function (el, value) {
        el.textContent = value || '';
    },
    show: function (el, value) {
        el.style.display = value ? '' : 'none';
    },
    /**
     * 对应于 v-model 指令
     */
    model: function (el, value, dirAgr, dir, vm, key) {
        let eventName = 'keyup';
        el.value = value || '';

        /**
         * 事件绑定控制
         */
        if (el.handlers && el.handlers[eventName]) {
            el.removeEventListener(eventName, el.handlers[eventName]);
        } else {
            el.handlers = {};
        }

        el.handlers[eventName] = function (e) {
            vm[key] = e.target.value;
        }

        el.addEventListener(eventName, el.handlers[eventName]);
    },
    on: {
        update: function (el, handler, eventName, directive) {
            if (!directive.handlers) {
                directive.handlers = {}
            }

            var handlers = directive.handlers;

            if (handlers[eventName]) {
                //绑定新的事件前移除原绑定的事件函数
                el.removeEventListener(eventName, handlers[eventName]);
            }
            //绑定新的事件函数
            if (handler) {
                handler = handler.bind(el);
                el.addEventListener(eventName, handler);
                handlers[eventName] = handler;
            }
        }
    }
}


/**
 * MiniVue 
 */
function TinyVue (opts) {
    /**
     * root/this.$el: 根节点
     * els: 指令节点
     * bindings: 指令与data关联的桥梁
     */
    var self = this,
        root = this.$el = document.getElementById(opts.el),
        els  = this.$els = root.querySelectorAll(getDirSelectors(Directives)),
        bindings = {};
    this._bindings = bindings;

    /**
     * 指令处理
     */
    [].forEach.call(els, processNode);
    processNode(root);

    /**
     * vm响应式数据初始化
     */

    let _data = extend(opts.data, opts.methods);
    for (var key in bindings) {
        if (bindings.hasOwnProperty(key)) {
            self[key] = _data[key];
        }
    }

    function processNode (el) {
        getAttributes(el.attributes).forEach(function (attr) {
            var directive = parseDirective(attr);
            if (directive) {
                bindDirective(self, el, bindings, directive);
            }
        })
    }

    /**
     * ready
     */
    if (opts.ready && typeof opts.ready == 'function') {
        this.ready = opts.ready;
        this.ready();
    }
}

/**************************************************************
 * @privete
 * helper methods
 */

/**
 * 获取节点属性
 * 'v-text'='counter' => {name: v-text, value: 'counter'}
 */
function getAttributes (attributes) {
    return [].map.call(attributes, function (attr) {
        return {
            name: attr.name,
            value: attr.value
        }
    })
}

/**
 * 返回指令选择器，便于指令节点的查找
 */
function getDirSelectors (directives) {
    /**
     * 支持的事件指令
     */
    let eventArr = ['click', 'change', 'blur']; 


    return Object.keys(directives).map(function (directive) {
        /**
         * text => 'v-text'
         */
        return '[' + prefix + '-' + directive + ']';
    }).join() + ',' + eventArr.map(function (eventName) {
        return '[' + prefix + '-on-' + eventName + ']';
    }).join();
}

/**
 * 节点指令绑定
 */
function bindDirective (vm, el, bindings, directive) {
    //从节点属性中移除指令声明
    el.removeAttribute(directive.attr.name);
    
    /**
     * v-text='counter'
     * v-model='counter'
     * data = { 
            counter: 1 
        } 
     * 这里的 counter 即指令的 key
     */
    var key = directive.key,
        binding = bindings[key];

    if (!binding) {
        /**
         * value 即 counter 对应的值
         * directives 即 key 所绑定的相关指令
         如：
           bindings['counter'] = {
                value: 1,
                directives: [textDirective, modelDirective]
             }
         */
        bindings[key] = binding = {
            value: '',
            directives: []
        }
    }
    directive.el = el;
    binding.directives.push(directive);

    //避免重复定义
    if (!vm.hasOwnProperty(key)) {
        /**
         * get/set 操作绑定
         */
        bindAccessors(vm, key, binding);
    }
}

/**
 * get/set 绑定指令更新操作
 */
function bindAccessors (vm, key, binding) {
    Object.defineProperty(vm, key, {
        get: function () {
            return binding.value;
        },
        set: function (value) {
            binding.value = value;
            binding.directives.forEach(function (directive) {
                directive.update(
                    directive.el,
                    value,
                    directive.argument,
                    directive,
                    vm,
                    key
                )
            })
        }
    })
}

function parseDirective (attr) {
    if (attr.name.indexOf(prefix) === -1) return ;

    /**
     * 指令解析
       v-on-click='onClick'
       这里的指令名称为 'on', 'click'为指令的参数，onClick 为key
     */

    //移除 'v-' 前缀, 提取指令名称、指令参数
    var directiveStr = attr.name.slice(prefix.length + 1),
        argIndex = directiveStr.indexOf('-'),
        directiveName = argIndex === -1
            ? directiveStr
            : directiveStr.slice(0, argIndex),
        directiveDef = Directives[directiveName],
        arg = argIndex === -1
            ? null
            : directiveStr.slice(argIndex + 1);

    /**
     * 指令表达式解析，即 v-text='counter' counter的解析
     * 这里暂时只考虑包含key的情况
     */
    var key = attr.value;
    return directiveDef
        ? {
            attr: attr,
            key: key,
            dirname: directiveName,
            definition: directiveDef,
            argument: arg,
            /**
             * 指令本身是一个函数的情况下，更新函数即它本身，否则调用它的update方法
             */
            update: typeof directiveDef === 'function'
                ? directiveDef
                : directiveDef.update
        }
        : null;
}

/**
 * 对象合并
 */
function extend (child, parent) {
    parent = parent || {};
    child = child || {};

    for(var key in parent) {
        if (parent.hasOwnProperty(key)) {
            child[key] = parent[key];
        }
    }

    return child;
}


```


















