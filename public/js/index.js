$(function(){
    //登录切换注册
    $("#toggle").on('click',function(){
        $("#zhuce").show()
        $("#denglu").hide()
    })
    $("#toggle1").on('click',function(){
        $("#zhuce").hide()
        $("#denglu").show()
    })
    //注册提交数据
    $("#zhuce").find('button').on('click',function(){
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$("#zhuce").find('[name="username"]').val(),
                password:$("#zhuce").find('[name="password"]').val(),
                repassword:$("#zhuce").find('[name="repassword"]').val()
            },
            dataType:'json',
            success:function(result) {
                $(".colWaring").html(result.message)
                if(!result.code){
                    setTimeout(() => {
                        $("#zhuce").hide()
                         $("#denglu").show()
                    }, 1000);
                }
            }
        })
    })
      //登录提交数据
      $("#denglu").find('button').on('click',function(){
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$("#denglu").find('[name="username"]').val(),
                password:$("#denglu").find('[name="password"]').val(),
            },
            dataType:'json',
            success:function(result) {
                $(".colWaring").html(result.message)
                if(!result.code){
                    setTimeout(() => {
                       window.location.reload()
                        //  $(".showuser").html(result.userInfo.username)
                        //  $("#showp").html('你好，欢迎光临我的博客')
                    }, 1000);
                }
            }
        })
    })
    //登录提交数据
    $("#logoutBtn").on('click',function(){
        $.ajax({
            type:'get',
            url:'/api/user/layout',
            success:function(result) {
                if(!result.code){
                    setTimeout(() => {
                       window.location.reload()
                        //  $(".showuser").html(result.userInfo.username)
                        //  $("#showp").html('你好，欢迎光临我的博客')
                    }, 1000);
                }
            }
        })
    })
   
})