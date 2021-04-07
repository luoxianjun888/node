const Model=require('../models')
const Op=Model.Sequelize.Op;
const multiparty=require('multiparty')
var fs=require('fs')
var path=require('path')


exports.welcome=async (req,res,next)=>{
    res.render('admin/welcome')
}

exports.index=async (req,res,next)=>{
    res.render('admin/index')
}



exports.user=async (req,res,next)=>{
    res.render('admin/admin-list')
}

exports.cate=async (req,res,next)=>{
    res.render('admin/cate')
}

// 文章列表页面
exports.posts=async (req,res,next)=>{
    let page= parseInt(req.query.page) || 1;
    let prepage= parseInt(req.query.prepage) || 20;
    let offset = (page-1)*prepage;
    let sou=req.query.sou;
    let where={}
    if(sou){
        where={title:{[Op.like]:'%'+sou+'%'}}
    }
    console.log(req.query)
    let posts=await Model.Posts.findAndCountAll({where:where,order:[['id','desc']],include:[Model.Cate,Model.User],limit:prepage,offset:offset})
    res.render('admin/posts-list',{posts:posts.rows,
                count:posts.count,
                page:page,
                pages:Math.ceil(posts.count/prepage),
                sou:sou})
}

// 增加文章页面
exports.postsadd=async (req,res,next)=>{
    let cates=await Model.Cate.findAll();
    let users=await Model.User.findAll()
    res.render('admin/posts-add',{cates:cates,users:users})
}

// 增加文章处理
exports.postsaddload= (req,res,next)=>{
    let form=new multiparty.Form();
    form.uploadDir='upload/2021'
    form.parse(req,function(err,fields,files){
    //    console.log(fields.title[0])
    //    console.log(files.pic[0].path)
       let piclists=[]
       files.piclist.map((v)=>{
            let obj={
                path:v.path
            }
            piclists.push(obj)
       })
       Model.Posts.create({
           'userid':fields.userid[0],
           'cateid':fields.cateid[0],
           'title':fields.title[0],
           'desc':fields.desc[0],
           'content':fields.content[0],
           'pic':files.pic[0].path,
           'piclist':piclists,
           'state':fields.state[0]
       })
       res.redirect('/admin/posts')
    })
}

// 编辑器图片上传
exports.upload=(req,res,next)=>{
    var form=new multiparty.Form();
    form.parse(req,function(err,fields,files){
        if(err){
            console.log('上传失败',err)
        }else{
            console.log(files.filedata[0])
            var file=files.filedata[0]
            var rs=fs.createReadStream(file.path)
            var oldname=file.path
            oldname=oldname.substr(-14)
            var newPath='/upload/imgload/'+oldname;
            var ws=fs.createWriteStream('./'+newPath)
            rs.pipe(ws)
            ws.on('close',function(){
                res.send({err:'',msg:newPath})
            })
        }
    })
}


// 删除数据
exports.delete=async (req,res,next)=>{
    let id=req.params.id;
    let posts=await Model.Posts.findByPk(id); 
    await posts.destroy();
    res.redirect('/admin/posts')
}

// 编辑文章
exports.postedit=async (req,res,next)=>{
    let id=req.params.id
    let posts=await Model.Posts.findOne({
        where:{'id':id},
        include:[Model.Cate,Model.User]
    });
    let user=await Model.User.findAll();
    let cate=await Model.Cate.findAll();
    res.render('admin/posts-edit',{item:posts,users:user,cates:cate})
}

// 编辑文章提交数据
exports.posteditadd=async (req,res,next)=>{
   
   let form=new multiparty.Form();
    form.uploadDir='upload/2021'
    form.parse(req, async function(err,fields,files){
    //    console.log(fields)
    //    console.log(files.pic[0].path)
       let piclists=[]
       files.piclist.map((v)=>{
            let obj={
                path:v.path
            }
            piclists.push(obj)
       })
      await Model.Posts.update({
           'userid':fields.userid[0],
           'cateid':fields.cateid[0],
           'title':fields.title[0],
           'desc':fields.desc[0],
           'content':fields.content[0],
        //    'pic':files.pic[0].path,
        //    'piclist':piclists,
           'state':fields.state[0]
       },{where:{id:fields.id[0]}})
    //    res.json({fields,files})
       res.redirect('/admin/posts')
    })
}