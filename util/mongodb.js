/* ------------------------------------------mongodb工具类------------------------------------------ */
const globalConfig = require('../public/globalConfig');
//mongodb客户端
var mongoClient = require('mongodb').MongoClient;
//mongodb连接地址
const dbConnStr = globalConfig.mongodbUrl;
//mongodb工具类
const mongodb = {
  insert(row, table, succCb, failCb) {
    mongoClient.connect(dbConnStr, function (error, db) {
      if (error) {
        console.log(error);
        failCb(error);
      } else {
        //创建连接
        let collection = db.collection(table);
        //进行插入操作
        collection.insert(row, function (error, result) {
          if (error) {
            console.log(error);
            failCb(error);
          } else {
            succCb(result.result);
            db.close();
          }
        })
      }
    })
  },
  delete() {

  },
  update(whereObj, setObj, table, succCb, failCb) {
    mongoClient.connect(dbConnStr, function (error, db) {
      if (error) {
        console.log(error);
        failCb(error);
      } else {
        //创建连接
        let collection = db.collection(table);
        let set = {
          $set: setObj
        }
        collection.updateMany(whereObj, set, function (error, result) {
          if (error) {
            console.log(error);
            failCb(error);
          } else {
            succCb(result.result);
            db.close();
          }
        })
      }
    })
  },
  select(whereObj, table, succCb, failCb) {
    mongoClient.connect(dbConnStr, function (error, db) {
      if (error) {
        console.log(error);
        failCb(error);
      } else {
        //创建连接
        let collection = db.collection(table);
        collection.find(whereObj).toArray((error, rows) => {
          if (error) {
            console.log(error);
            failCb(error);
          } else {
            succCb(rows);
            db.close();
          }
        })
      }
    })
  }
}

module.exports = mongodb;