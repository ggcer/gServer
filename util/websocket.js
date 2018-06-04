/* ------------------------------------------websocket工具类------------------------------------------ */
const websocket = {
  //发送ws信息
  send(wsList, msgType, param){
    let sendObj = {
      msgType: msgType,
      ...param
    }
    if(wsList.length === undefined){
      if(wsList.readyState == 1){
        wsList.send(JSON.stringify(sendObj));
      }
    }else{  //如果是数组(群发)
      wsList.forEach((item, index) => {
        if(item.readyState == 1){
          item.send(JSON.stringify(sendObj));
        }
      })
    }
  },
}

module.exports = websocket;