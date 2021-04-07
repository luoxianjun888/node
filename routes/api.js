var express=require('express');
var router=express.Router();
var apiCon=require('../controller/api');

router.get('/posts',apiCon.posts);
router.get('/cate',apiCon.cate);
router.get('/cate/:id',apiCon.cateid);
router.get('/detail/:id',apiCon.detail);

module.exports=router;