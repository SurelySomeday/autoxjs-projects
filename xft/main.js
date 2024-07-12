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

//打开app
function openApp(str) {
    log("脚本开始");
    //确定无障碍已经打开
    auto.waitFor();
    launch(str);
    //允许打开app
    //let Allow = textMatches(/(允许|立即开始|统一)/).findOne(2 * 1000);
    //if (Allow) {
    //	Allow.click();
    //}
}

//邮件推送打卡结果
function sendResult(img, msg) {
    sleep(1000);
    app.sendEmail({
        email: ["648951430@qq.com"],
        subject: "打卡结果",
        text: msg
    });
    var button = text("电子邮件").findOne(10*1000)
    if(button){
        toast("默认选择电子邮件");
        button.parent().click();
    }

    sleep(1000);
    // 填写收件人
    id("to").findOne(10*1000).setText("648951430@qq.com");
    // 追加附件
    id("do_attach").findOne(10*1000).click();
    var button = text("相册").findOne(10*1000)
    if(button){
        button.parent().click();
    }
    sleep(1000);
    id("grid").findOne(10*1000).children().forEach(child => {
        var target = child.findOne(id("pick_num_indicator"));
        if(target != null){
            target.parent().click();
        }
    });
    // 点击发送
    sleep(1000);
    id("compose_send_btn").findOne().click();
    home();

}
try{
    log("脚本开始");
    log("打开xft");
    openApp("com.cmbchina.xft")
    sleep(1000);
    log("确保在主页");
    // 确保在主页
    while(id("bar_id_left_view").exists()){
        id("bar_id_left_view").click();
    }

    // -- 这时候xft是已经打开的
    // -- 下一步确认打卡按钮已经加载完毕
    //循环找色，找到蓝色(#3285ff)时停止并报告坐标
    log("获取截图权限，准备截图");
    getScreenCapture();
    // 找打卡按钮
    className("android.view.View").text("打卡").findOne(10*1000).click();

    log("点击签到按钮");
    //确认打卡
    // 这里需要暂停等待定位
    sleep(3000);
    while(text("定位中").exists()){
    }
    while(text("不在考勤范围").exists()){
        text("刷新").click();
        sleep(5000);
    }
    className("android.view.View").text("签退").findOne(10*1000).click();
    //确认打卡弹窗
    sleep(3000)
    log("点击打卡后的知道了");
    var button = text("知道").findOne(10*1000);
    if(button){
        button.parent().click();
    }else{
        log("打卡失败");
        throw new Error("打卡失败");
    }
    sleep(3000)
    var img = captureScreen("/sdcard/res.png");
    sendResult(img, "打卡成功");
    sleep(1000)

    // 返回到xft首页
    while(id("bar_id_left_view").exists()){
        id("bar_id_left_view").click();
    }
    log("结束打卡返回home");
    home()
    log("脚本结束");
}catch(error){
    // 处理异常
    log("An exception occurred: ", error);
    var img = captureScreen("/sdcard/res.png");
    sendResult(img, "打卡失败,异常原因：" + error);
}
