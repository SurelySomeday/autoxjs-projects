//app应用关闭
function killApp(packageName) {
    // 打开系统级应用设置
    app.openAppSetting(packageName);
    sleep(random(1000, 2000));
    text(app.getAppName(packageName)).waitFor();

    // 执行盲点流程 （多点几次不过分。都是非阻塞的。）
    var times = 3; // 多点几次，应对页面上存在一些其他tips文字，干扰流程。
    do {
      stop();
      times--;
    } while (times);

    sleep(random(1000, 1500));
    back();
  }

  // 盲点
  function stop() {
    var is_sure = text("结束运行").findOnce();
    log(is_sure);
    if (is_sure) {
      is_sure.parent().click();
      sleep(random(500, 1000));
    }

    var b = textMatches(/(.*确.*|.*定.*)/).findOnce();
    if (b) {
      b.click();
      sleep(random(500, 1000));
    }
  }
//获取截屏权限
function getScreenCapture() {
  let Thread = threads.start(function () {
    if (auto.service != null) {
      //如果已经获得无障碍权限
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
    Thread.interrupt();
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
    text: msg,
  });
  var button = text("电子邮件").findOne(5 * 1000);
  if (button) {
    toast("默认选择电子邮件");
    button.parent().click();
  }

  sleep(1000);
  // 填写收件人
  id("to")
    .findOne(5 * 1000)
    .setText("648951430@qq.com");
  // 追加附件
  id("do_attach")
    .findOne(5 * 1000)
    .click();
  var button = text("相册").findOne(5 * 1000);
  if (button) {
    button.parent().click();
  }
  sleep(1000);
  id("grid")
    .findOne(5 * 1000)
    .children()
    .forEach((child) => {
      var target = child.findOne(id("pick_num_indicator"));
      if (target != null) {
        target.parent().click();
      }
    });
  // 点击发送
  sleep(1000);
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
  openApp("com.cmbchina.xft")
  log("确保在主页");
  // 确保在主页
  if (id("bar_id_left_view").exists()) {
    id("bar_id_left_view")
      .findOne(2 * 1000)
      .click();
  }
  if (id("bar_id_left_view").exists()) {
    id("bar_id_left_view")
      .findOne(2 * 1000)
      .click();
  }

  // -- 这时候xft是已经打开的
  // -- 下一步确认打卡按钮已经加载完毕
  //循环找色，找到蓝色(#3285ff)时停止并报告坐标
  log("获取截图权限，准备截图");
  getScreenCapture();
  // 找打卡按钮

  className("android.view.View")
    .text("打卡")
    .findOne(5 * 1000)
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

  // 获取签到\签退按钮
  var checkButton = className("android.view.View")
    .textMatches("签到|签退")
    .findOne(5 * 1000);
  sleep(5000);
  if (checkButton) {
    checkButton.click();
  }
  sleep(5000);
  //确认打卡弹窗
  log("点击打卡后的知道了");
  var button = text("知道了").findOne(5 * 1000);
  if (button) {
    button.click();
  } else {
    log("打卡失败");
    throw new Error("打卡失败");
  }
  sleep(3000);
  var img = captureScreen("/sdcard/res.png");

  // 返回到xft首页
  var backBtn1 = id("bar_id_left_view").findOne(2 * 1000);
  if (backBtn1) {
    backBtn1.click();
  }
  var backBtn2 = id("bar_id_left_view").findOne(2 * 1000);
  if (backBtn2) {
    backBtn2.click();
  }
  //顶部打卡提示去掉
  /*     var tipBtn = id("vp_act_tab_main_viewPager2").findOne(3*1000);
    if(tipBtn && tipBtn.children()){
        tipBtn.children().forEach(child => {
        var target = child.findOne(id("iv_scan_icon"));
        if(target != null){
            target.click();
        }
        });
    } */
  sendResult(img, "打卡成功");
  sleep(1000);
  log("结束打卡返回home");
  home();
  log("脚本结束");
} catch (error) {
  // 处理异常
  log("An exception occurred: ", error);
  var img = captureScreen("/sdcard/res.png");
  sendResult(img, "打卡失败,异常原因：" + error);
}
