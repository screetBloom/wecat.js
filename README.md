###  wecat.js
个人开发的一个js框架，欢迎提各种类型的issue，看到第一时间会回复   ：）  
![](https://img.shields.io/badge/%E8%84%9A%E6%89%8B%E6%9E%B6%7Cnpm%7Ccommander%7Cgit-0.0.1-blue.svg)
![](https://img.shields.io/badge/%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E%7Ctemplate%7Creg%7Cnew%20Function-0.0.1-blue.svg)
![](https://img.shields.io/badge/router%7Clazy%20load%7Chook%20function-1.0.0-brightgreen.svg)
<br>
#### 概述

目前正在开发打磨过程中，可能不会很及时的更新 ---> 3月底将基本展示出来
<br>

包含内容：
- 脚手架 
- 模板引擎  
- 路由和路由对应的钩子函数,懒加载js等 
- 数据和模板渲染（正在开发virtual-dom）
- 通信组件（支持父子通信、兄弟通信、广播消息、选择性的范围广播）
- http请求组件 （核心为xhr、fetch）
- 各个部分以插件形式载入项目 

<br>

---
#### 1 脚手架揭秘和实现
我们平时经常会使用vue、angular、react等的脚手架，都可以达到如下效果：
1. 全局安装对应的脚手架  xxx-cli  （不全局安装的话，只能在当前安装包下使用）
2. 接下来直接就如"vue init"就可以直接拉取一个模板项目到我们的当前文件夹

这个效果挺好用的，假如我积累了一套框架，我不想每次都拷贝到其他文件夹来用，或者当别人需要的时候，我拷贝给别人一份,太麻烦了
<br>
我希望我有一套自己的脚手架，能像这些成熟的框架的脚手架一样直接把我想要的模板项目用最简短而有效的命令拉取到任何想要获取的电脑的文件夹中
<br>
总结一下：
脚手架能解决的问题：
- 在任何一台电脑、任何一个文件夹中，我都可以利用脚手架的命令将我的目标模板项目拉取下来
```bash
// 全局安装脚手架
npm install -g snowcat
// 拉取预定义模板
snowcat init
```
<br>

本地效果演示：
<br>
![](http://7xl4c6.com1.z0.glb.clouddn.com/FjpPFQiEG8LPV5H84LvPmX1YQ4uW)

他人机器上演示：
<br>
![](http://7xl4c6.com1.z0.glb.clouddn.com/FuN7_ko3l211kWoorHjVYR_z0pQe)
![](http://7xl4c6.com1.z0.glb.clouddn.com/FnfbDsCKUt8RfvNG3lQKh6d8uRzw)

##### 1.1 脚手架具体实现代码

















