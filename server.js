/* ------------------------------------------express app实例------------------------------------------ */
const globalConfig = require('./public/globalConfig');
var express = require('express');
var logger = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var debug = require('debug')('gserver');
var http = require('http');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var app = express();
//捕获进程异常
process.on('uncaughtException', (err) => {
  console.error(err)
});
//设置请求编码格式为json格式，且限制json请求的最大长度为50mb
app.use(express.json({limit: '50mb'}));
//静态资源目录
app.use(express.static(path.join(__dirname, 'public')));
//日志
app.use(logger('dev'));
//cookie解析器
app.use(cookieParser());
//设置可跨域访问
app.use('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin); //允许该源进行跨域访问
  res.header('Access-Control-Allow-Credentials', true); //设置可以跨域
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');  //设置允许的请求头
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');  //设置允许的请求方法
  if (req.method == 'OPTIONS') {
    res.send(200); // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
  }
  else {
    next();
  }
});
//路由
app.use('/', indexRouter);
app.use('/user', userRouter);

//改变默认的监听端口号
process.env.PORT = globalConfig.serverPort;
//端口号配置
var port = process.env.PORT;
app.set('port', process.env.PORT);

//创建server实例
var server = http.createServer(app);

//开启端口监听
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//错误回调
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

//端口监听开启回调
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = server;