// import { Promise } from 'mongoose';

// import { Promise } from 'mongoose';
var express= require('express')
var router = express.Router()
var User= require('../models/User')
var Category=require('../models/category')
var Content= require('../models/Content')
var Promise = require('mongoose')
router.use(function(req,res,next){
    // console.log(req.userInfo.isAdmin)
    if(!req.userInfo.isAdmin){
        res.send('不好意思,你不是管理员')
        return;
    }
    next()
})
router.get('/',function(req,res,next){
    res.render('admin/index',{
        userInfo:req.userInfo
    })
})
// router.get('/my',function(req,res,next){
//     res.send("ssskosa")
// })
//用户管理
router.get('/user',function(req,res){
    // c从数据库读取数据:limit进行分页,skip()忽略数据条数
    var limit=4
    var page=Number(req.query.page || 1)
   
    var pages=0
    User.count().then(function(count){
        //计算总页数
        pages=Math.ceil(count / limit)
        //在之间取值
        page= Math.min(page, pages)
        page=Math.max(page,1)
        var skip =(page -1)*limit
        User.find().limit(limit).skip(skip).then(function(users){
            // console.log(users)
            res.render('admin/user_index',{
                userInfo: req.userInfo,
                users: users,
                page: page,
                count:count,
                pages:pages,
                limit: limit
            })
        })
    })
  
   
})
//分类首页
router.get('/category',function(req,res){
      // c从数据库读取数据:limit进行分页,skip()忽略数据条数
      var limit=4
      var page=Number(req.query.page || 1)
     
      var pages=0
      Category.count().then(function(count){
          //计算总页数
          pages=Math.ceil(count / limit)
          //在之间取值 sort: 1| -1  1升序 -1 降序
          page= Math.min(page, pages)
          page=Math.max(page,1)
          var skip =(page -1)*limit
          Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
              // console.log(users)
              res.render('admin/category_index',{
                  userInfo: req.userInfo,
                  categories: categories,
                  page: page,
                  count:count,
                  pages:pages,
                  limit: limit
              })
          })
      })
})
//添加分类
router.get('/category/add',function(req,res){
    res.render('admin/category_add',{
        userInfo:req.userInfo
    })
})
//分类保存
router.post('/category/add',function(req,res){
    var name= req.body.name || ''
    if(name == ''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '名称不能为空'
        })
        return 
    }
    //判断是否重名
    Category.findOne({
        name:name
    }).then(function(rs){
        if(rs){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '已经存在该分类',
            })
            return Promise.reject()
        } else {
            return new Category({
                name: name
            }).save()
        }
    }).then(function(newCategory){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category'
        })
    })
})
//分类修改
router.get('/category/edit',function(req,res){
    //获取分类信息，并且展示出来：表单形似
    var id= req.query.id || ''
    Category.findOne({
        _id: id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类信息不存在'
            })
            return Promise.reject()
        }else{
            res.render('admin/category_edit',{
                userInfo: req.userInfo,
                category: category
            })
        }
    })
})
//分类编辑的保存
router.post('/category/edit',function(req,res){
    //获取要提交的id
    var id=req.query.id || ''
    //获取新的名称
    var name=req.body.name || ''
    Category.findOne({
        _id: id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '分类信息不存在'
            })
            return Promise.reject()
        }else{
            if(name== category.name){
                res.render('admin/success',{
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url:'/admin/category'
                })
                return Promise.reject()
            }else{
                return  Category.findOne({
                    _id: {$ne: id},
                    name:name
                })
                return Promise.reject()
            }
        }
    }).then(function(sanmeCategory){
        if(sanmeCategory){
            res.render('admin/error',{
                userInfo: req.userInfo,
                message: '数据库中存在同名分类'
            })
            return Promise.reject()
        }else{
             return  Category.update({
                    _id: id
                },{
                    name: name
                })
                return Promise.reject()
        }
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '修改成功',
            url:'/admin/category'
        })
        return 
    })
})

//分类删除
router.get('/category/delete',function(req,res){
    var id=req.query.id || ''
    Category.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '删除成功',
            url:'/admin/category'
        })
        return 
    })
})
//内容首页
router.get('/content',function(req,res,next){
      // c从数据库读取数据:limit进行分页,skip()忽略数据条数
      var limit=4
      var page=Number(req.query.page || 1)
      var pages=0
      Content.count().then(function(count){
          //计算总页数
          pages=Math.ceil(count / limit)
          //在之间取值 sort: 1| -1  1升序 -1 降序
          page= Math.min(page, pages)
          page=Math.max(page,1)
          var skip =(page -1)*limit
          Content.find().sort({addTime:-1}).limit(limit).skip(skip).populate(['category','user']).then(function(contents){
            //   console.log(contents)
              res.render('admin/content_index',{
                  userInfo: req.userInfo,
                  contents: contents,
                  page: page,
                  count:count,
                  pages:pages,
                  limit: limit
              })
          })
      })
})
//添加内容
router.get('/content/add',function(req,res,next){
    Category.find().sort({_id:-1}).then(function(categories){
        res.render('admin/content_add',{
            userInfo: req.userInfo,
            categories: categories
        })
    })
   
})
// 内容保存
router.post('/content/add', function(req,res){
    if(req.body.category ==''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '请选择分类'
        })
        return 
    }
    if(req.body.title ==''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return 
    }
    //保存博客到数据库
    new Content({
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        user: req.userInfo._id.toString(),
        content: req.body.content
    }).save().then(function(rs){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        })
        return 
    })

    // console.log(req.body)
})
//修改内容
router.get('/content/edit',function(req,res){
    var id= req.query.id || ''
    var categories =[]
    Category.find().sort({_id:-1}).then(function(rs){
        categories = rs
        return  Content.findOne({
            _id: id
        }).populate('category')
    }).then(function(content){
            if(!content){
                res.render('admin/error',{
                    userInfo: req.userInfo,
                    message: '文章信息不存在'
                })
                return Promise.reject()
            }else{
                res.render('admin/content_edit',{
                    userInfo: req.userInfo,
                    categories: categories,
                    content: content
                })
            }
   
    })
   
})
//修改内容保存
router.post('/content/edit',function(req,res){
    var id= req.query.id || ''
    if(req.body.category ==''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '请选择分类'
        })
        return 
    }
    if(req.body.title ==''){
        res.render('admin/error',{
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return 
    }
    Content.update({
        _id: id
    },{
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '修改成功',
            url:'/admin/content'
        })
        return 
    })
})
//修改删除
router.get('/content/delete',function(req,res){
    var id=req.query.id || ''
    Content.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo: req.userInfo,
            message: '删除成功',
            url:'/admin/content'
        })
        return 
    })
})
module.exports= router