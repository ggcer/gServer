/* ------------------------------------------index------------------------------------------ */
const mongodb = require('./mongodb');
const uuid = require('./uuid');
const websocket = require('./websocket');
const object = require('./object');
const roomGame = require('./roomGame');

const util = {
  mongodb: mongodb,
  uuid: uuid,
  websocket: websocket,
  object: object,
  roomGame: roomGame
}

module.exports = util;
