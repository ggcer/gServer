/* ------------------------------------------websocket wss实例------------------------------------------ */
var globalConfig = require('./public/globalConfig');
const ws  = require('ws');
const url = require('url');

//websocket 请求转发器
const handlerRepeater = require('./handlers');

//创建websocket wss实例
const wss = new ws.Server({
  port: globalConfig.wssPort
})

var onlineObj = {
  userList: [], //当前在线的用户列表
  roomList: [], //当前活跃的房间列表
  nextRoomId: 10000,  //下一个创建房间的id
}

//建立连接监听事件
wss.on('connection', (ws, req) => {
  //请求参数对象
  let reqParam = url.parse(req.url, true).query;

  //连接开启，转发到baseHandler的connectionOpen方法进行处理
  handlerRepeater.handleMsg(ws, reqParam, {handler: 'base', msgType: 'connectionOpen'}, onlineObj);

  //一般接收信息监听事件
  ws.on('message', (msg) => {
    //转发消息到对应的handler进行处理
    handlerRepeater.handleMsg(ws, reqParam, JSON.parse(msg), onlineObj);
  });

  //连接断开事件
  ws.on('close', () => {
    //连接关闭，转发到baseHandler的connectionClose方法进行处理
    handlerRepeater.handleMsg(ws, reqParam, {handler: 'base', msgType: 'connectionClose'}, onlineObj);
  });
});

module.exports = wss;
