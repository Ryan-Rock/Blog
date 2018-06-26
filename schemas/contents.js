// 创建数据库结构
var mongoose=require('mongoose')



//内容结构
module.exports =new mongoose.Schema({
    //关联字段
    category: {
        type: mongoose.Schema.Types.ObjectId,
        //引用关联其他表
        ref: 'category' 
    },
    title: String,
    description: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    //用户id
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    addTime: {
        type: String,
        default: new Date()
    },
    //阅读量
    views :{
        type: Number,
        default: 0
    },
    //评论
    comments: {
        type: Array,
        default: []
    }

   
})

