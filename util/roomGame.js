/* ------------------------------------------roomGame工具类------------------------------------------ */
const object = require('./object');
const roomGame = {
  //根据用户id获取用户对象
  getUserById(userId, userList){
    let user = null;
    userList.forEach((item, index) => {
      if(item.userMsg.userId == userId){
        user = item;
      }
    })
    return user;
  },

  //根据房间id获取房间对象
  getRoomById(roomId, roomList){
    let room = null;
    roomList.forEach((item, index) => {
      if(item.roomId == roomId){
        room = item;
      }
    })
    return room;
  },

  //转译返回的房间列表
  transResRoom(roomList){
    if(roomList.length === undefined){
      let returnRoom = this.getInitRoom();
      let userList = [];
      roomList.userList.forEach((item, index) => {
        userList.push(item.userMsg);
      })
      object.copyFieldValue(returnRoom, roomList);
      returnRoom.userList = userList;
      return returnRoom;
    }else{  //room数组
      let returnRoomList = [];
      roomList.forEach((item, index) => {
        let returnRoom = this.getInitRoom();
        let userList = [];
        item.userList.forEach((userItem, userIndex) => {
          userList.push(userItem.userMsg);
        })
        object.copyFieldValue(returnRoom, item);
        returnRoom.userList = userList;
        returnRoomList.push(returnRoom);
      })
      return returnRoomList;
    }
  },

  //转译返回的用户列表
  transResUser(userList){
    if(userList.length === undefined){
      return userList.userMsg;
    }else{  //userList数组
      let returnUserList = [];
      userList.forEach((item, index) => {
        returnUserList.push(item.userMsg);
      })
      return returnUserList;
    }
  },

  //获取初始化用户对象
  getInitUser() {
    let user = {
      userMsg: null, //用户信息
      reqParam: null, //其他请求参数
      ws: null  //ws对象
    }
    return user;
  },
  //获取初始化房间对象
  getInitRoom() {
    let room = {
      roomId: null, //房间ID
      roomGameCode: null, //房间游戏编号
      roomInfo: null, //房间描述
      roomCreaterId: null, //房间创建人
      userList: [], //房间玩家列表
      roomStatus: 1,  //房间状态：1未开始 2游戏中
    }
    return room;
  }
}

module.exports = roomGame;