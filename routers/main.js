var express= require('express')
var router = express.Router()
var Category=require('../models/category')
var Content=require('../models/Content')
var data
router.use (function(req,res,next){
    //处理通用数据
     data ={
        userInfo: req.userInfo,
        categories: [],
        // category: ''  ,
        //      limit: 4,
        //      page: 1,
        //      pages:0,
        //      count: 0,
        //      contents: ''
    } 
    Category.find().then(function(categories){
        data.categories =categories
        next()
    })
})
router.get('/',function(req,res,next){
    data.category =req.query.category || ''  
    // console.log(2)
    data.limit = 4
    data.pages =0
    data.page =Number(req.query.page || 1)
    data.count = 0
    data.contents =''
    var where = {};
    if(data.category){
        where.category = data.category
    }
    Content.where(where).count().then(function(count){
         data.count =count
         //计算总页数
         data.pages=Math.ceil( data.count / data.limit)
         //在之间取值 sort: 1| -1  1升序 -1 降序
         data.page= Math.min( data.page, data.pages)
         data.page=Math.max( data.page,1)
         var  skip =( data.page -1)* data.limit
       
         return    Content.where(where).find().sort({_id:-1}).limit(data.limit).skip(skip).populate(['category','user']).sort({addTime:-1})
    }).then(function(contents){
        // console.log(contents)
        data.contents=contents
        res.render('main/index',data)
        // console.log(data)
    })
   
    // console.log(req.userInfo._id)
})
router.get('/view',function(req,res){
    var contentId = req.query.contentid || ''
    console.log(contentId)
    Content.findOne({
        _id: contentId
    }).then(function(content){
        data.content =content
        content.views++
        content.save()
        console.log(data)
        res.render('main/view', data)
    })

})
module.exports= router