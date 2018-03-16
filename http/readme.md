
### http请求部分

- http部分得益于实习期间的积累，已经开发完毕，正在积极的融合到框架中

这个部分主要的重点
- 核心是xhr、fetch、jsonp
- 辅助querystring、EventEmitter


注意事项

- jsonp只支持异步并且只有get
- xDomainRequest能支持POS，不过无法在body上发送数据
- 跨域访问的时候，有时会有一个options方法的请求，只是一个探测请求
- fetch无法支持上传进度反馈
- withCredentials 为设置请求是否带cookie，fetch和xhr有很小的差异
- fetch和jsonp无法abort请求，需要特殊处理