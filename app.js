// 应用程序启动页
var express= require('express')
var swig = require('swig')
var bodyParser=require('body-parser')
var cookies=require('cookies')
var User=require('./models/User')
var app= express()

//配置cookie
app.use(function(req,res,next){
    req.cookies=new cookies(req,res);
    req.userInfo={}
    //解析登录用户cookiex信息
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'))
        //获取登录类型
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin=Boolean(userInfo.isAdmin)
                next()
            })
        }catch(e){
            next()
        }
    }else{
        next()
    }
   
})
// bodyParser配置
app.use(bodyParser.urlencoded({extended:true}))
//静态文件托管
app.use('/public', express.static(__dirname+'/public'))
// 定义末班引擎
app.engine('html',swig.renderFile)
//设置模板存放的路径:第一个必须为views
app.set('views', './views')
//第一个参数是固定的
app.set('view engine' ,'html')
//取消末班缓存
swig.setDefaults({cache: false })
var mongoose=require('mongoose')
// 划分模块
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

// 监听:连接数据库
mongoose.connect('mongodb://localhost:27017/blog',function(err){
    if(err){
        console.log('数据库连接失败')
    }
    else{
        console.log('数据库连接成功')
        app.listen(8081,function(){
            console.log('服务器启动')
        })
    }
})
