/* ------------------------------------------websocket roomListHandler------------------------------------------ */
const util = require('../util');
const roomListHandler = {
  //获取房间列表
  getRoomList(ws, reqParam, msgObj, onlineObj) {
    //获取当前房间的游戏代码
    let roomGameCode = reqParam.roomGameCode;
    //获取当前全部的房间数组
    let roomList = onlineObj.roomList;
    //当前要返回的对应请求的所有房间列表
    let resRoomList = [];
    roomList.forEach((item, index) => {
      if(item.roomGameCode == roomGameCode){
        resRoomList.push(item);
      }
    })
    resRoomList = util.roomGame.transResRoom(resRoomList);
    //将房间列表返回给当前请求ws
    util.websocket.send(ws, msgObj.msgType, {
      roomList: resRoomList
    });
  },
  //创建房间
  createRoom(ws, reqParam, msgObj, onlineObj) {
    let userList = onlineObj.userList;
    let roomList = onlineObj.roomList;

    //创建房间对象
    let room = util.roomGame.getInitRoom();
    room.roomId = onlineObj.nextRoomId++;  //房间id
    room.roomGameCode = msgObj.roomGameCode;  //房间游戏类型
    room.roomInfo = msgObj.roomInfo;  //房间描述
    room.roomCreaterId = msgObj.roomCreaterId;  //房间创建者id
    //将当前创建的房间塞入roomList中
    onlineObj.roomList.push(room);

    //给符合条件的用户发送创建房间消息(path为roomList,roomGameCode与当前创建的房间一致)
    userList.forEach((item, index) => {
      if(item.reqParam.path == 'roomList' && item.reqParam.roomGameCode == msgObj.roomGameCode){
        //将当前创建的房间信息发送给符合条件的用户
        util.websocket.send(item.ws, msgObj.msgType, {
          room: room
        });
      }
    })
  }
}

module.exports = roomListHandler;