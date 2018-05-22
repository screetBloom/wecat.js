<br>
<br>
**如果对您有帮助，帮忙点个star，让我有更大的动力继续分享，如果您要转载，务必补上我的github地址，谢谢**
<br>


科学读vue，授人以渔？element UI为什么取名element？
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
- 1. git clone下来
- 2. 在项目目录打开 控制台，输入“git log --oneline --decorate --graph --all”，来查看所有commit，你会发现有非常多的commit，远远大于github上统计的数字。可以输入10万直接翻到最后一个“83fac017”，那我们现在开始看看历史上的第一个版本的hash，然后在浏览器中输入https://github.com/vuejs/vue/tree/83fac017 在github上查看
- 3. 查看对应的head 的hash值，修改tree后面的值访问即可，我们找几个提交的代码来看看(test目录都是测试代码，可以不看)
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
  