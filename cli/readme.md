
### 脚手架

正在开发中，更新不及时请见谅   
脚手架使用方式
```bash
// 安装脚手架,不全局安装的画，snowcat命令只能在当前文件夹使用
npm install snowcat-cli -g
// 帮助命令
snowcat -h
// 拉取项目模板
snowcat -init

```



模版内置支持

- 热更新、支持es6、less或sass等
- 利用html-webpack-plugin来生成html页面
- 利用 extract-text-webpack-plugin 自动加载生成的css、less等
- 处理资源的动态路径问题
- 合理管理前端环境，如预发环境和线上环境
