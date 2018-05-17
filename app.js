/* ------------------------------------------express app实例------------------------------------------ */
var express = require('express');
var logger = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var app = express();
//设置请求编码格式为json格式
app.use(express.json());
//静态资源目录
app.use(express.static(path.join(__dirname, 'public')));
//日志
app.use(logger('dev'));
//cookie解析器
app.use(cookieParser());

//路由
app.use('/', indexRouter);
app.use('/user', userRouter);

module.exports = app;
