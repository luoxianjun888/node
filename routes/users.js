var express = require('express');
var router = express.Router();
var userCon=require('../controller/user')

/* GET users listing. */
router.get('/login', userCon.index);
router.post('/login', userCon.login);
router.get('/logout',userCon.logout)


module.exports = router;
