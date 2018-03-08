SPA_RESOLVE_INIT = function(transition) {
    console.log('  detail.js >>> ')
    console.log(transition)
	document.getElementById("content").innerHTML = '<p style="color:red;">当前异步渲染详情页 >detail >>  '+ JSON.stringify(transition) +'</p>'
	console.log("首页回调" + JSON.stringify(transition))
}