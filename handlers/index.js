/* ------------------------------------------websocket handlers入口------------------------------------------ */
var roomListHandler = require('./roomListHandler')
var roomHandler = require('./roomHandler')
const handlerRepeater = {
  handleMsg: function(ws, reqParam, msgObj, onlineObj) {
     //当前websocket的请求路径
    let path = reqParam.path;
    //获取处理当前websocket请求路径的handler
    let handler = path + 'Handler';
    //获取当前的handler处理信息的方法
    let handlerMethod = msgObj.msgType;
    //执行消息处理
    this[handler][handlerMethod](ws, reqParam, msgObj, onlineObj);

  },
  roomListHandler: roomListHandler,
  roomHandler: roomHandler
}

module.exports = handlerRepeater;