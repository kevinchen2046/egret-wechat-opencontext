require('./weapp-adapter.js');
require('./egret.js');
require('./tween.js');
require('./game.js');
require('./egret.wxgame.js');
require('./main.js');
let sharedCanvas = wx.getSharedCanvas();
let sharedContext = sharedCanvas.getContext('2d');
egret.wxgame.isSubContext = true;
egret.runEgret({
  entryClassName: "Main",
  orientation: "portrait",
  frameRate: 60,
  scaleMode: "fixedNarrow",
  contentWidth: 640,
  contentHeight: 1136,
  showFPS: false,
  fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
  showLog: false,
  maxTouches: 2,
  //----auto option end----
  renderMode: 'canvas',
  audioType: 0,
  calculateCanvasScaleFactor: function (context) {
    var systemInfo = wx.getSystemInfoSync();
    var s1 = 640 / systemInfo.windowWidth;
    var s2 = 1136 / systemInfo.windowHeight
    return s1 > s2 ? s1 : s2;
  }
});

wx.modifyFriendInteractiveStorage({
  key: '5',
  opNum: 1,
  operation: 'add',
  // 静默修改需要用户通过快捷分享消息卡片进入才有效，代表分享反馈操作，无需填写 toUser，直接修改分享者与被分享者交互数据
  quiet: true,
  complete: (res) => {
    console.log('好友成功进入:', res);
  }
});

console.log(11111);