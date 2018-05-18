/* ------------------------------------------用户模块------------------------------------------ */
var express = require('express');
var router = express.Router();
var util = require('../util');

//登陆
router.post('/login', function(req, res) {
  let reqObj = req.body;
  //查询注册用户的昵称是否已被注册
  util.mongodb.select({username: reqObj.username}, 'user', (rows) => {
    if(rows.length > 0){
      let user = rows[0];
      //比对密码
      if(user.password == reqObj.password){
        //返回给前端时去掉password属性
        delete user.password;
        let resObj = {
          result: true,
          desc: "登陆成功",
          obj: {
            user: user
          }
        }
        res.json(resObj);
      }else{
        let resObj = {
          result: false,
          desc: "密码错误，重新试试吧"
        }
        res.json(resObj);
      }
    }else{
      let resObj = {
        result: false,
        desc: "该账号/昵称不存在，仔细检查一下吧"
      }
      res.json(resObj);
    }
  })
});

//注册
router.post('/register', function(req, res) {
  let reqObj = req.body;
  //查询注册用户的昵称是否已被注册
  util.mongodb.select({username: reqObj.username}, 'user', (rows) => {
    if(rows.length > 0){
      let resObj = {
        result: false,
        desc: "该昵称已被注册，换一个吧"
      }
      res.json(resObj);
    }else{
      //生成uuid
      reqObj.userId = util.uuid.create();
      //添加用户数据
      util.mongodb.insert(reqObj, 'user', (result) => {
        let resObj = {
          result: true,
          desc: "注册成功，快试试登陆吧"
        }
        res.json(resObj);
      });
    }
  })
});

module.exports = router;
