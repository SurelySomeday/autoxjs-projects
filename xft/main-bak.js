//获取截屏权限
function getScreenCapture() {
    let Thread = threads.start(function() {
        if (auto.service != null) { //如果已经获得无障碍权限
            //由于系统间同意授权的文本不同，采用正则表达式
            let Allow = textMatches(/(允许|立即开始|统一)/).findOne(10 * 1000);
            if (Allow) {
                Allow.click();
            }
        }
    });
    if (!requestScreenCapture()) {
        toast("请求截图权限失败");
        return false;
    } else {
        Thread.interrupt()
        toast("已获得截图权限");
        return true;
    }
}
//确定无障碍已经打开
auto.waitFor();
launch("com.cmbchina.xft");
//允许打开app
let Allow = textMatches(/(允许|立即开始|统一)/).findOne(10 * 1000);
if (Allow) {
	Allow.click();
}

// -- 这时候xft是已经打开的

sleep(3000)
home();
sleep(1000);
home();
//暂停3秒
sleep(1000);
//跳转页面
click(500, 500);
sleep(5000);
//getScreenCapture();
//requestScreenCapture();
//循环找色，找到红色(#ff0000)时停止并报告坐标
while(true){
    var img = captureScreen();
    var point = findColor(img, "#3285ff", {
       region: [198, 915, 5, 5],
       threshold: 4
     });
    if(point){
        toast("找到色块，坐标为(" + point.x + ", " + point.y + ")");
    }
}
//点击打卡
click(200, 1000)
sleep(5000)
//确认打卡
//click(550, 1750)
sleep(3000)
//确认打卡弹窗
//click(558,1590)
sleep(3000)
// 结束打卡，返回上一级
//click(51,150)

//app.startActivity("PopupWebViewActivity");