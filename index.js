/* 通过require载入模块*/
var http = require('http')
var fs = require('fs')
var path = require('path')
var url = require('url')

/*调用createServer方法创建服务器,会返回一个对象，该对象使用listen方法绑定端口*/
/*方法的接收参数为request事件的监听函数，会自动添加到request事件，函数传递req请求对象和res响应对象两个参数*/
http.createServer(function(req,res){
		rootPath(req,res)
}).listen(8888)

console.log('server running at http://127.0.0.1:8888')



var routes = {
  '/a': function(req, res){
    res.end(JSON.stringify(req.query))
  },

  '/b': function(req, res){
    res.end('match /b')
  },

  '/search': function(req, res){
    res.end('username='+req.body.username+',password='+req.body.password)
  }

}

function rootPath(req,res){

	var urlObj = url.parse(req.url,true)
	var handleFunc = routes[urlObj.pathname]
	if(handleFunc){
		req.query = urlObj.query
		//参考 https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
    // post json 解析
    var body = ''
    req.on('data', function(chunk){
    /*data事件中发出的块(chunk)是一个buffer,若事先知道是字符串则可以在end事件时对其进行格式化*/
      body += chunk
    }).on('end', function(){
      req.body = parseBody(body)
      handleFunc(req, res)
    })


	}else{
		staticRoot(path.resolve(__dirname,'sample'),req,res)
	}
}


function staticRoot(staticPath,req,res){
		var urlObj = url.parse(req.url,true)
		if(urlObj.pathname === '/'){
			urlObj.pathname += 'test.html'
		}
		var filePath = path.join(staticPath,urlObj.pathname)
		console.log('filePath = '+ filePath)
		fs.readFile(filePath, function(err,buffer){
			if(err){
					console.log('error readFile: '+err)
					res.writeHead(404,'File Not Found')
					res.end()
			}else{
					res.writeHead(200,'OK')
					res.write(buffer)
					res.end()
			}
		})
}

function parseBody(body){
  console.log(body)
  var obj = {}
  body.split('&').forEach(function(str){
    obj[str.split('=')[0]] = str.split('=')[1]
  })
  return obj
}
























