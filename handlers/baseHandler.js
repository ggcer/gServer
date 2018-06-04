/* ------------------------------------------websocket baseHandler------------------------------------------ */
const util = require('../util');
const code = require('../public/code');
const baseHandler = {
  //连接开启
  connectionOpen(ws, reqParam, msgObj, onlineObj) {
    let userList = onlineObj.userList;  //当前在线的用户列表
    let roomList = onlineObj.roomList;  //当前活跃的房间列表
    let userId = reqParam.userId; //获取userId

    //如果该用户已经登陆过则将原来登陆的账号强制注销
    userList.forEach((item, index) => {
      if(userId == item.userMsg.userId){
        let ws = item.ws;
        ws.close();
      }
    })
    //查询出该用户的信息塞入userList中
    let whereObj = {
      userId: userId
    }
    util.mongodb.select(whereObj, 'user', (rows) => {
      if(rows.length > 0){
        let userMsg = rows[0];
        //将登陆用户存入在线用户列表中
        let user = util.roomGame.getInitUser();
        user.userMsg = userMsg; //用户信息
        user.reqParam = reqParam;  //其他请求参数
        user.ws = ws; //ws对象
        userList.push(user);
        //发送连接就绪的消息
        util.websocket.send(ws, 'openSuccess');
        console.log(`[用户登陆]: ${userId} 当前在线用户数: ${userList.length}`);
      }
    })
  },
  //连接关闭
  connectionClose(ws, reqParam, msgObj, onlineObj) {
    let userList = onlineObj.userList;  //当前在线的用户列表
    let roomList = onlineObj.roomList;  //当前活跃的房间列表
    let userId = reqParam.userId; //获取userId

    //从房间用户列表中删除该用户
    for(let i = 0; i < roomList.length; i++){
      let room = roomList[i];
      let roomId = room.roomId;
      let roomUserList = room.userList;
      //遍历当前房间用户列表
      for(let j = 0; j < roomUserList.length; j++){
        if(userId == roomUserList[j].userMsg.userId){
          let leaveUser = roomUserList[j];
          //找到ws被关闭的user将其删除
          if(leaveUser.ws.readyState != 1){
            let leaveUserMsg = leaveUser.userMsg;
            //从房间中删除该用户
            roomUserList.splice(j, 1);
            //当前房间没人之后发送消息并删除该房间
            if(roomUserList.length === 0){
              //发送房间解散通知[给对应游戏分类的房间列表用户]
              userList.forEach((item, index) => {
                if(item.reqParam.path == 'roomList' && item.reqParam.roomGameCode == room.roomGameCode){
                  util.websocket.send(item.ws, 'roomClose', {
                    roomId: roomId
                  });
                }
              })
              //删除该房间
              roomList.splice(i, 1);
            }else{  //当前房间还有人，发送用户退出消息
              //发送用户离开房间消息
              userList.forEach((item, index) => {
                //给对应房间列表的用户发送人数变更通知：路径为roomList 房间游戏类型一致
                if(item.reqParam.path == 'roomList' && item.reqParam.roomGameCode == room.roomGameCode){
                  util.websocket.send(item.ws, 'userLeaveRoom', {
                    roomId: roomId,
                    userId: leaveUserMsg.userId
                  });
                }
                //给当前房间的用户发送用户离开通知
                if(item.reqParam.path == 'room' && item.reqParam.roomId == roomId){
                  util.websocket.send(item.ws, 'userLeaveRoom', {
                    userId: leaveUserMsg.userId
                  });
                }
              })
            }
          }
        }
      }
    }
    
    //从在线用户列表删除该用户
    for(let i = 0; i < userList.length; i++){
      if(userId == userList[i].userMsg.userId){
        if(userList[i].ws.readyState != 1){
          userList.splice(i, 1);
        }
      }
    }
    console.log(`[用户注销]: ${userId} 当前在线用户数: ${userList.length}`);
  }
}

module.exports = baseHandler;