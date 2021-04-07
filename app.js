var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session=require('express-session');
const favicon = require('serve-favicon');
var moment=require('moment');
var nunjucks=require('nunjucks');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
var adminRouter = require('./routes/admin');
var Model=require('./models');

var app = express();

app.locals.moment=moment;


app.use(favicon(__dirname + '/public/img/logo.png'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));

nunjucks.configure('views', {
    noCache: process.env.NODE_ENV !== 'production',
    autoescape: true,
    express: app,
});
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules/',express.static(path.join(__dirname, 'node_modules')));
app.use('/upload/',express.static(path.join(__dirname, 'upload')));

app.use(session({
  secret:'mjht.net',
  resave:false,
  saveUninitialized:true,
  cookie:{maxAge:1000*60*30}
}))


// 全局数据

app.use( async (req,res,next)=>{
  res.locals.username=req.session.username;
  res.locals.cate=await Model.Cate.findAll({where:{'pid':1}})
  res.locals.recommend=await Model.Posts.findAll({order:[['id','desc']],include:[Model.Cate,Model.User,Model.Comment],subQuery:false,limit:8})
  res.locals.neikans=await Model.Posts.findAll({where:{'cateid':2},order:[['id','desc']],limit:8,include:[Model.Cate,Model.User,Model.Comment],subQuery:false})
  res.locals.huaces=await Model.Posts.findAll({where:{'cateid':3},order:[['id','desc']],limit:8,include:[Model.Cate,Model.User,Model.Comment],subQuery:false})
  res.locals.comment=await Model.Comment.findAll({where:{'state':1},limit:4,order:[['id','desc']]});
  res.locals.webtitle='北京,期刊,杂志,企业,内刊,画册,年报,报纸书籍设计,排版,美景宏图公司';
  next()
})

// 拦截登录
app.get('/admin*',function(req,res,next){
  var username=req.session.username;
  if(!username){
    return res.redirect('/users/login');
  }
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use('*',function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('home/error');
});



module.exports = app;
