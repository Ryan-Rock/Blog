var express= require('express')
var router = express.Router()
var User= require('../models/User')
var Content=require('../models/Content')
//统一返回格式
var responseData;
router.use(function(req,res,next){
    responseData ={
        code: 0,
        message: ''
    }
    next()
})

//用户注册：验证以及逻辑
/**1.用户名不能为空号密码不能为空2.两次密码必须一致3.用户名是否被注册（数据库查询） */
router.post('/user/register',function(req,res,next){
    var username=req.body.username
    var password=req.body.password
    var repassword=req.body.repassword
    if(username == ''){
        responseData.code= 1
        responseData.message= '用户名不能为空'
        res.json(responseData)
        return
    }
    if(password == ''){
        responseData.code= 1
        responseData.message= '密码不能为空'
        res.json(responseData)
        return
    }
    if(password != repassword){
        responseData.code= 1
        responseData.message= '两次密码不一致'
        res.json(responseData)
        return
    }
    //基于数据库验证：用户名不可以重名
    User.findOne({
        username:username
    }).then(function(userInfo){
        if(userInfo){
            responseData.code= 1
            responseData.message= '用户名已经被注册'
            res.json(responseData)
            return
        }
        // 保存信息
        var user= new User({
            username:username,
            password:password
        })
        return user.save();
    }).then(function(newUserInfo){
        console.log(newUserInfo)
        responseData.message= '注册成功'
        res.json(responseData)
    })

})
//登录验证
router.post('/user/login',function(req,res,next){
    var username=req.body.username
    var password=req.body.password
    if(username == ''){
        responseData.code= 1
        responseData.message= '用户名不能为空'
        res.json(responseData)
        return
    }
    if(password == ''){
        responseData.code= 1
        responseData.message= '密码不能为空'
        res.json(responseData)
        return
    }
    //查询是否存在用户：保持一致性
    User.findOne({
        username:username,
        password:password
    }).then(function(userInfo){
        if(!userInfo){
            responseData.code= 1
            responseData.message= '用户名密码错误'
            res.json(responseData)
            return
        }
        //用户名密码正确
        responseData.message='登录成功'
        responseData.userInfo= {
            _id: userInfo._id,
            username: userInfo.username,
        }
        req.cookies.set('userInfo',JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username,
        }))
        res.json(responseData)
        return

    })
})
//退出
router.get('/user/layout', function(req,res,next){
    req.cookies.set('userInfo', null);
    // responseData.message='退出成功'
    res.json(responseData)
})
//评论提交的接口
router.post('/comment/post', function(req,res,next){
    var contentId= req.body.contentid || ''
    var postData = {
        username : req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    }
    //查询内容信息
    Content.findOne({
        _id: contentId
    }).then(function(content){
        content.comments.push(postData)
       return  content.save()
    }).then(function(newcontent){
        responseData.message= '评论成功'
        responseData.data= newcontent
        res.json(responseData)
    })

})
//获取评论
router.get('/comment',function(req,res){
    var contentId= req.query.contentid || ''
      Content.findOne({
        _id: contentId
    }).then(function(content){
        responseData.data= content.comments
        res.json(responseData)
    })
})
module.exports= router