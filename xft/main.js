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
log("脚本开始");
//确定无障碍已经打开
auto.waitFor();
log("打开xft");
launch("com.cmbchina.xft");
sleep(1000);
//允许打开app
//let Allow = textMatches(/(允许|立即开始|统一)/).findOne(2 * 1000);
//if (Allow) {
//	Allow.click();
//}

log("连续点击两次返回，确保在主页");
// 连续点击两次返回，确保在主页
sleep(3000);
click(28, 128);
sleep(1000);
click(28, 128);

// -- 这时候xft是已经打开的
// -- 下一步确认打卡按钮已经加载完毕
//循环找色，找到蓝色(#3285ff)时停止并报告坐标
log("获取截图权限，准备截图");
getScreenCapture();
requestScreenCapture();
while(true){
    var img = captureScreen();
    var point = findColor(img, "#3285ff", {
        region: [202, 952, 1,1],
        threshold: 4
        });
    if(point){
        toast("找到打卡模块按钮，坐标为(" + point.x + ", " + point.y + ")");
        break;
    }
}


// -- 这时候打卡按钮已经出现

//点击打卡
click(200, 1000);
sleep(5000)
//循环找色，找到蓝色(#3e76ff)时停止并报告坐标
while(true){
    var img = captureScreen();
    var point = findColor(img, "#3e76ff", {
        region: [660, 1719, 200, 200],
        threshold: 4
        });
    if(point){
        toast("找到签到按钮，坐标为(" + point.x + ", " + point.y + ")");
        break;
    }
}
log("点击签到按钮");
//确认打卡
click(550, 1750)
sleep(3000)
//确认打卡弹窗
log("点击打卡后的知道了");
click(558,1590)
sleep(3000)
// 结束打卡，返回上一级
log("结束打卡返回上一级");
click(51,150)
sleep(500)
log("结束打卡返回home");
home()
log("脚本结束");