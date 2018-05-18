/* ------------------------------------------用户模块------------------------------------------ */
var express = require('express');
var router = express.Router();

//登陆
router.post('/login', function(req, res) {
  console.log(req.body);
  let resObj = {
    result: true,
    desc: "登陆成功"
  }
  res.json(resObj);
});

//登陆
router.post('/register', function(req, res) {
  console.log(req.body);
  let resObj = {
    result: true,
    desc: "注册成功"
  }
  res.json(resObj);
});

module.exports = router;
