var Model=require('../models')
const Op=Model.Sequelize.Op;

exports.index=async (req,res,next)=>{
    let hots=await Model.Posts.findAll({where:{'id':[16,18,19]}})
    let sheji=await Model.Posts.findAll({where:{'cateid':19},order:[['id','desc']],limit:10})
    let anli=await Model.Posts.findAll({where:{cateid:{[Op.lt]:18}},order:[['id','desc']],limit:10})
    res.render('home/index',{hots:hots,sheji:sheji,anli:anli});
}

// 分类列表查询
exports.catelist=async (req,res,next)=>{
    let page= parseInt(req.query.page) || 1;
    let prepage= parseInt(req.query.prepage) || 8;
    let offset = (page-1)*prepage;

    var aname=req.params.id.replace('.html','');
    let cates=await Model.Cate.findAndCountAll({where:{"aname":aname}, 
    order:[[Model.Posts,'id','desc']],
     include:{model:Model.Posts,required: false,include:[Model.User,Model.Comment]},
    limit:prepage,offset:offset,subQuery:false
  })
    console.log(cates.rows)
    res.render('home/cate',{cates:cates.rows,
                count:cates.count,
                page:page,
                pages:Math.ceil(cates.count/prepage)
               })
}



// 详情页

exports.detail=async (req,res,next)=>{
   var id=req.params.id;
    let posts=await Model.Posts.findOne({where:{"id":id},include:[Model.Cate,Model.User,{model:Model.Comment,where:{'state':1},required:false}]})
    // 上一篇文章
    let prevPage=await Model.Posts.findOne({
        where:{'id':{[Op.gt]:id}},order:[['id','asc']],limit:1
    })
    // 下一篇文章
   let nextPage=await Model.Posts.findOne({
        where:{'id':{[Op.lt]:id}},order:[['id','desc']],limit:1
    })
    await posts.increment('dianji',{by:1}) 
  
    res.render('home/detail',{item:posts,prevPage:prevPage,nextPage:nextPage})
}

// 搜索
exports.sou=async (req,res,next)=>{
    let page= parseInt(req.query.page) || 1;
    let prepage= parseInt(req.query.prepage) || 8;
    let offset = (page-1)*prepage;
    let sous=req.query.sou;
    let where={}
    if(sous){
        where={[Op.or]:[ {title:{[Op.like]:'%'+sous+'%'}},{content:{[Op.like]:'%'+sous+'%'}},]}
    }
    let posts=await Model.Posts.findAndCountAll({where,order:['id','desc'],include:[Model.Cate,Model.User,Model.Comment],subQuery:false,limit:prepage,offset:offset})
    res.render('home/sou',
            {cates:posts.rows,
                count:posts.count,
                page:page,
                pages:Math.ceil(posts.count/prepage),
                sou:sous
            });
}

// 发表评论
exports.comment=async (req,res,next)=>{
    let uname=req.body.uname;
    let content=req.body.content;
    let postid=req.body.postid;
    let comments=await Model.Comment.create({
        'postid':postid,
        'uname':uname,
        'content':content
    })
    // console.log(req.body)
    res.redirect('/msg')
}

exports.msg=(req,res,next)=>{
    res.render('home/msg')
}