//提交评论
$(function(){
    var perpage =5
    var page=1
    var pages=0
    var comments =[]
    $(".tijiaopinglun").on('click',function(){
        $.ajax({
            type:'post',
            url:'/api/comment/post',
            data: {
                contentid:$("#hiddenid").val() ,
                content: $(".pingluncontent").val()
            },
            success:function(result) {
                $(".pingluncontent").val('')
                comments=result.data.comments.reverse()
                radcoments()
            }
        })
    })
    //每次进入页面获取评论
    $.ajax({
        type:'get',
        url:'/api/comment',
        data: {
            contentid:$("#hiddenid").val() ,
        },
        success:function(result) {
            $(".pingluncontent").val('')
            comments=result.data.reverse()
            radcoments()
        }
    })
    function radcoments (){
        if(comments.length<=0){
            $(".tiptip").show()
        }else{
            $(".tiptip").hide()
        }
        var $lis= $('.pager li')
         pages= Math.max(Math.ceil(comments.length/perpage),1)
        var start =Math.max(0,(page-1)* perpage)
        var end =Math.min( start+ perpage,comments.length)
        $lis.eq(1).html(page+ ' / '+ pages)
        if(page<=1){
            page=1
            $lis.eq(0).html('<span>没有上一页</span>')
        }else{
            $lis.eq(0).html('<a href="javascript: ;">上一页</a>')
        }
        if(page>=pages){
            page=pages
            $lis.eq(2).html('<span>没有下一页</span>')
        }else{
            $lis.eq(2).html('<a href="javascript: ;">下一页</a>')
        }
        $("#plcount").html(comments.length)
        var html = ''
        for(var i=start;i<end;i++){
            html += '  <li style="border:1px solid green;margin-top:3px">' +
                        '<p><span>'+ comments[i].username + '</span><span>'+ formDate(comments[i].postTime) +'</span></p>'+
                        '<p>'+ comments[i].content +'</p>'+
                     ' </li>'
        }
        $("#meesagelist").html(html)

    }
    function formDate(dateTime){
        var datatime=new Date(dateTime)
        return datatime.getFullYear()+'年' + (datatime.getMonth()+1)+'月'+datatime.getDate()+"日"+ datatime.getHours()+ ':' +datatime.getMinutes() +
        ":" + datatime.getSeconds()
    }
    //换页
    $('.pager').delegate('a','click',function(){
        if($(this).parent().hasClass('previous')){
            page--
        }else{
            page++
        }
        radcoments()
    })
})