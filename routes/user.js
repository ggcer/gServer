var express = require('express');
var router = express.Router();

router.post('/login', function(req, res) {
  console.log(req.body);
  let resObj = {
    result: true,
    desc: "登陆成功"
  }
  res.json(resObj);
});

module.exports = router;
