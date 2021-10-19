// appid
module.exports.appid = process.env.WX_APPID;
// 商户号
module.exports.mchid = process.env.WX_MCHID;
// 商户号中的key
module.exports.apikey = process.env.WX_APIKEY;

// 微信Native下单Url
module.exports.wxNativeOrderUrl = "https://api.mch.weixin.qq.com/pay/unifiedorder";
// 微信Native下单Url(V3)
module.exports.wxNativeV3OrderUrl = "https://api.mch.weixin.qq.com/v3/pay/transactions/native";

// 微信Native下单回调Url
module.exports.wxNativeOrderCallbackUrl = process.env.WX_NATIVE_ORDER_CALLBACK_URL;
// 微信Native下单回调Url(V3)
module.exports.wxNativeOrderV3CallbackUrl = process.env.WX_NATIVE_ORDER_V3_CALLBACK_URL;
