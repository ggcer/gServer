/* ------------------------------------------index------------------------------------------ */
const mongodb = require('./mongodb');
const uuid = require('./uuid');

const util = {
  mongodb: mongodb,
  uuid: uuid
}

module.exports = util;
