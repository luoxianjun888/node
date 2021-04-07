var session=require('express-session');
var Model=require('../models');
var md5=require('md5');
var Op=Model.Sequelize.Op;

exports.index=(req,res,next)=>{
    res.render('admin/login');
}

exports.login=async (req,res,next)=>{
    let uname=req.body.uname;
    let pwd=req.body.password;

    let user=await Model.User.findOne({
        where:{[Op.and]:[
            {uname:uname},
            {password:md5(pwd)}
        ]}
    })
    if(user){
        req.session.username=user
        res.redirect('/admin')
    }else{
        res.redirect('/users/login')
    }
}


exports.logout=(req,res,next)=>{
    req.session.username=null;
    res.redirect('/')
}