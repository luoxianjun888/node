var express = require('express');
var router = express.Router();
var homeCon=require('../controller/index')

/* GET home page. */
router.get('/', homeCon.index);
router.get('/cate/:id',homeCon.catelist);
router.get('/detail/:id',homeCon.detail);
router.get('/sou',homeCon.sou);
router.post('/comment',homeCon.comment);
router.get('/msg',homeCon.msg);

module.exports = router;
