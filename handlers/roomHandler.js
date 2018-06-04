/* ------------------------------------------websocket roomHandler------------------------------------------ */
const util = require('../util');
const roomHandler = {
  //获取房间详情
  getRoomDetail(ws, reqParam, msgObj, onlineObj) {
    let userList = onlineObj.userList;
    let roomList = onlineObj.roomList;

    let userId = reqParam.userId;
    let roomId = reqParam.roomId;
    //根据userId获取当前用户对象
    let user = util.roomGame.getUserById(userId, userList);
    //更具roomId获取当前房间对象
    let room = util.roomGame.getRoomById(roomId, roomList);
    if(room){
      //用户加入该房间
      room.userList.push(user);
      //返回房间对象
      let resRoom = util.roomGame.transResRoom(room);
      //将房间详情返回给当前请求ws
      util.websocket.send(ws, msgObj.msgType, {
        room: resRoom
      });

      let resUser = util.roomGame.transResUser(user);
      userList.forEach((item, index) => {
        //给对应房间列表的用户发送人数变更通知：路径为roomList 房间游戏类型一致
        if(item.reqParam.path == 'roomList' && item.reqParam.roomGameCode == room.roomGameCode){
          util.websocket.send(item.ws, 'userEnterRoom', {
            roomId: roomId,
            user: resUser
          });
        }
        //给当前房间的用户发送用户加入通知[除该用户本身]
        if(item.reqParam.path == 'room' && item.reqParam.roomId == roomId && item != user){
          util.websocket.send(item.ws, 'userEnterRoom', {
            user: resUser
          });
        }
      })
    }else{
      //当前房间不存在
      util.websocket.send(ws, msgObj.msgType, {
        room: null
      });
    }
  }
}

module.exports = roomHandler;