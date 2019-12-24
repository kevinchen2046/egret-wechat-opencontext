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
  contentWidth: 600,
  contentHeight: 1080,
  showFPS: false,
  fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
  showLog: false,
  maxTouches: 2,
  //----auto option end----
  renderMode: 'canvas',
  audioType: 0,
  calculateCanvasScaleFactor: function (context) {
    var systemInfo = wx.getSystemInfoSync();
    var s1 = 600 / systemInfo.windowWidth;
    var s2 = 1080 / systemInfo.windowHeight
    return s1 > s2 ? s1 : s2;
  }
});