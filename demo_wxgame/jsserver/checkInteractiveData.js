exports.main = function (req) {
  let openid = wx.getOpenId();
  console.log(openid);
  //console.log(fs)
  return true
}