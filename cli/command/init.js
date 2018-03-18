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


