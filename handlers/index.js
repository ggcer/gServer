/* ------------------------------------------websocket handlers入口------------------------------------------ */
const baseHandler = require('./baseHandler')
const roomListHandler = require('./roomListHandler')
const roomHandler = require('./roomHandler')
const handlerRepeater = {
  handleMsg(ws, reqParam, msgObj, onlineObj) {
     //当前websocket的请求路径
    let path = reqParam.path;
    //获取处理当前websocket消息的handler[若不指定hander则handler默认为当前用户所属path]
    let handler = (msgObj.handler ? msgObj.handler : path) + 'Handler';
    //获取当前的handler处理信息的方法
    let handlerMethod = msgObj.msgType;
    //执行消息处理
    this[handler][handlerMethod](ws, reqParam, msgObj, onlineObj);
  },
  baseHandler: baseHandler,
  roomListHandler: roomListHandler,
  roomHandler: roomHandler
}

module.exports = handlerRepeater;