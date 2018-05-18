/* ------------------------------------------uuid工具类------------------------------------------ */
const uuidModule = require('uuid');
//uuid工具类
const uuid = {
  create() {
    return uuidModule.v1();
  },
}

module.exports = uuid;