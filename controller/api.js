var Model=require('../models')
const Op=Model.Sequelize.Op;
var moment=require('moment');

exports.posts=async (req,res,next)=>{
    let page=parseInt(req.query.page) || 1;
    let prepage=parseInt(req.query.prepage) || 10;
    let offset=(page-1)*prepage;
    let posts=await Model.Posts.findAndCountAll({
      order:[['createdAt','desc']],include:[{model:Model.Cate},{model:Model.User},{model:Model.Comment}],
      subQuery:false,
      limit:prepage,
      offset:offset,
    })
    let pages=Math.ceil(posts.count/prepage);
    let postList=[]
    posts.rows.map((v)=>{
      let obj={
        id:v.id,title:v.title,desc:v.desc,content:v.content,piclist:v.piclist,pic:v.pic,
        dianji:v.dianji,createdAt:moment(v.createdAt).format('YYYY-MM-DD HH:mm:ss'),updatedAt:moment(v.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
        cate:v.Cate,user:v.User,comment:v.Comments
      }
      postList.push(obj)
    })
    res.json({posts:postList,page:page,prepage:prepage,total:posts.count,pages:pages})
}

exports.cate=async (req,res,next)=>{
  let cate=await Model.Cate.findAll({where:{"pid":1},include:{model:Model.Posts,include:[Model.User,Model.Comment],required:true},subQuery:false})
  res.json({cate:cate})
}

// 分类列表查询
exports.cateid=async (req,res,next)=>{
    var cateid=req.params.id;
    let cates=await Model.Cate.findAll({where:{"id":cateid},
    include:{model:Model.Posts,limit:8,required: false, order:[['id','desc']],include:[Model.User,Model.Comment],subQuery:false}
  })
    res.json({cates:cates})
}

// 详情页

exports.detail=async (req,res,next)=>{
  console.log(req.params)
   var id=req.params.id;
    let posts=await Model.Posts.findOne({where:{"id":id},include:[{model:Model.Cate},{model:Model.User},{model:Model.Comment}]})
    await posts.increment('dianji',{by:1}) 
    // 上一篇文章
    let prevPage=await Model.Posts.findOne({
        where:{'id':{[Op.gt]:id}},order:[['id','asc']],limit:1
    })
    // 下一篇文章
   let nextPage=await Model.Posts.findOne({
        where:{'id':{[Op.lt]:id}},order:[['id','desc']],limit:1
    })
    let picimg='http://www.mjht.net/'+posts.pic
   let obj={
        id:posts.id,
        title:posts.title,
        desc:posts.desc,
        content:posts.content,
        pic:picimg,
        piclist:posts.piclist,
        dianji:posts.dianji,
        cate:posts.Cate,
        user:posts.User,
        comment:posts.Comments,
        createdAt:moment(posts.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt:moment(posts.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
     }

  
    res.json({posts:obj,prevPage:prevPage,nextPage:nextPage})
}