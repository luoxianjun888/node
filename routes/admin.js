var express=require('express');
var router=express.Router();
var adminCon=require('../controller/admin');

router.get('/',adminCon.index);
router.get('/welcome',adminCon.welcome);
router.get('/user',adminCon.user);
router.get('/cate',adminCon.cate)
router.get('/posts',adminCon.posts)
router.get('/posts-add',adminCon.postsadd)
router.post('/post-add',adminCon.postsaddload)
router.post('/upload',adminCon.upload)
router.get('/delete/:id',adminCon.delete)
router.get('/posts-edit/:id',adminCon.postedit)
router.post('/posts-edit',adminCon.posteditadd)

module.exports=router;