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
}

//建立连接监听事件
wss.on('connection', (ws, req) => {
  //请求参数对象
  let reqParam = url.parse(req.url, true).query;
  //获取userId
  let userId = reqParam.userId;
  //获取当前登陆的用户列表
  let userList = onlineObj.userList;
  //如果该用户已经登陆过则将原来登陆的账号强制注销
  userList.forEach((item, index) => {
    if(userId == item.userId){
      let ws = item.ws;
      ws.close();
    }
  })
  //将登陆用户存入在线用户列表中
  userList.push({
    userId: userId,
    ws: ws
  })
  console.log(`[用户登陆]: ${userId} 当前在线用户数: ${userList.length}`);
  //接收信息监听事件
  ws.on('message', (msg) => {
    //转发消息到对应的handler进行处理
    handlerRepeater.handleMsg(ws, reqParam, JSON.parse(msg), onlineObj);
  });
  //连接断开事件
  ws.on('close', () => {
    //从在线用户列表删除该用户
    let userList = onlineObj.userList;
    for(let i = 0; i < userList.length; i++){
      if(userId == userList[i].userId){
        userList.splice(i, 1);
        break;
      }
    }
    console.log(`[用户注销]: ${userId} 当前在线用户数: ${userList.length}`);
  });
});

module.exports = wss;
