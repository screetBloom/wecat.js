#!/usr/bin/env node
'use strict'
// 引入 commander，用于处理自定义nodejs命令
const program = require('commander')
// 引用package.json里面的版本号来定义当前版本
program
    .version(require('../package').version )
// 定义使用方法
program
    .usage('<command>')

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

// 处理参数和提供帮助信息
if(!program.args.length){
    program.help()
}

