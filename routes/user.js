/* ------------------------------------------用户模块------------------------------------------ */
var express = require('express');
var router = express.Router();
const util = require('../util');
const code = require('../public/code');

//登陆
router.post('/login', function(req, res) {
  let reqObj = req.body;
  let whereObj = {
    username: reqObj.username
  }
  //查询注册用户的昵称是否已被注册
  util.mongodb.select(whereObj, 'user', (rows) => {
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
  }, (error) => {
    let resObj = {
      result: false,
      desc: "登陆失败，查询用户时出错"
    }
    res.json(resObj);
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
      //新注册用户默认头像为随机的系统头像
      reqObj.avatarType = code.AVATAR_TYPE_SUG;
      //随机一个系统头像
      let sugAvatarList = code.SUG_AVATAR_LIST;
      //在系统头像列表的范围内随机出一个头像
      let randomNum = Math.floor(Math.random() * sugAvatarList.length);
      //将头像code赋值给avatar字段
      reqObj.avatar = sugAvatarList[randomNum].code;
      //添加用户数据
      util.mongodb.insert(reqObj, 'user', (result) => {
        let resObj = {
          result: true,
          desc: "注册成功，快试试登陆吧"
        }
        res.json(resObj);
      }, (error) => {
        let resObj = {
          result: false,
          desc: "注册失败，注册时出错"
        }
        res.json(resObj);
      });
    }
  }, (error) => {
    let resObj = {
      result: false,
      desc: "注册失败，查询用户时出错"
    }
    res.json(resObj);
  })
});

//修改用户信息
router.post('/update', function(req, res) {
  let reqObj = req.body;
  let whereObj = {
    userId: reqObj.userId
  }
  let setObj = reqObj;
  //更新用户
  util.mongodb.update(whereObj, setObj, 'user', (result) => {
    let resObj = {
      result: true,
      desc: "用户更新成功"
    }
    res.json(resObj);
  }, (error) => {
    let resObj = {
      result: false,
      desc: "用户更新失败"
    }
    res.json(resObj);
  })
});
module.exports = router;
