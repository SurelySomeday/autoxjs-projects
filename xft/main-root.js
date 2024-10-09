//app应用关闭
function killApp(packageName) {
  shell('am force-stop '+packageName,true);
}


//打开app
function openApp(str) {
  log("脚本开始");
  //确定无障碍已经打开
  auto.waitFor();
  launch(str);
  waitForPackage(str);
  //允许打开app
  //let Allow = textMatches(/(允许|立即开始|统一)/).findOne(2 * 1000);
  //if (Allow) {
  //	Allow.click();
  //}
  }

//邮件推送打卡结果
function sendResult(img, msg, type) {
  msg = msg+'.';
  var subject = '';
  if(type == 1){
    subject = '打卡结果: 成功！'
  }else if(type == 0 ){
    subject = '打卡结果: 失败！'
  }
  app.sendEmail({
    email: ["648951430@qq.com"],
    subject: subject,
    text: msg
  });
  var button = text("电子邮件").findOne();
  if (button) {
    toast("默认选择电子邮件");
    button.parent().click();
  }
  // 填写收件人
  id("to")
    .findOne()
    .setText("648951430@qq.com");
  // 追加附件
  var list = id("compose_body_binding").findOne();
  for(var i = 0; i < list.childCount(); i++){
      var child = list.child(i);
      if(child && child.className()=="android.widget.EditText"){
        child.setText(msg);
        child.setSelection(msg.length-1,msg.length);
        break;
      }
  }

  var button = id("compose_toolsbar_media_picture").findOne(1*1000);
  if (button) {
    button.click();
    var png_btn = descContains('res.png').findOne();
    if(png_btn){
      png_btn.click();
    }
  }
  id("compose_send_btn").findOne().click();
  home();
}
try {
  log("脚本开始");
  sleep(1000);
  log("打开xft");
  openApp("com.cmbchina.xft")
  sleep(1000);
  log("关闭xft");
  killApp("com.cmbchina.xft");
  log("打开xft");
  openApp("com.cmbchina.xft");
  text("打卡").findOne(5 * 1000);
  // -- 这时候xft是已经打开的
  // -- 下一步确认打卡按钮已经加载完毕
  log("获取截图权限，准备截图");
  requestScreenCapture();
  captureScreen("/sdcard/res.png");
  // 找打卡按钮
  className("android.view.View")
    .text("打卡")
    .findOne(10 * 1000)
    .click();

  log("点击签到按钮");
  //确认打卡
  // 这里需要暂停等待定位
  sleep(8000);
  while (text("定位中").exists()) {}
  while (text("不在考勤范围").exists()) {
    text("刷新").click();
    sleep(5000);
  }
  var isCheck = false;
  // 获取签到\签退按钮
  var checkButton = className("android.view.View")
    .textMatches("签到|签退")
    .findOne(30 * 1000);
  if (checkButton) {
    var checkButton = textContains("已签退").findOne(1 * 1000);
    if(!checkButton){
      checkButton.click();
    }else{
      isCheck = true;
    }
  }else{
    throw new Error("打卡失败！无法获取签到按钮！");
  }
  if(!isCheck){
    // 检查早退
    var textZt = textContains("早退").findOne(3 * 1000)
    if (textZt) {
      throw new Error("打卡失败！早退！");
    }
    //确认打卡弹窗
    log("点击打卡后的知道了");
    var button = text("知道了").findOne(5 * 1000);
    if (button) {
      button.click();
    } else {
      log("打卡失败!");
      throw new Error("打卡失败!");
    }
  }
  sleep(3000);
  var img = captureScreen("/sdcard/res.png");

  sendResult(img, "打卡成功!",1);
  sleep(1000);
  log("结束打卡返回home");
  home();
  log("脚本结束");
} catch (error) {
  // 处理异常
  log("An exception occurred: ", error);
  var img = captureScreen("/sdcard/res.png");
  sendResult(img, "打卡失败,异常原因：" + error,0);
}
