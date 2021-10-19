const QRCode = require("qrcode");

const { getTradeNo, createWxOrder, createSign } = require("../utils/wx");
const { appid, mchid, wxNativeOrderUrl, wxNativeOrderCallbackUrl } = require("../config/wx");

// 微信下单
module.exports.wxOrder = async (ctx, next) => {
  const { body, total_fee, spbill_create_ip, trade_type } = ctx.request.body;

  // 下单需要的参数
  const params = {
    appid, // 应用ID
    mch_id: mchid, // 直连商户号
    nonce_str: getTradeNo().toUpperCase(), // 随机字符串、
    // sign,
    body, //商品描述
    out_trade_no: getTradeNo(), // 商户订单号
    total_fee, // 订单总金额
    spbill_create_ip, // 终端IP
    notify_url: wxNativeOrderCallbackUrl, // 通知地址
    trade_type, // 交易类型
  };

  // 生成签名
  const sign = createSign(params);
  // 给请求参数添加 sign 参数
  params.sign = sign;
  // 合成请求 XML 参数
  const sendData = `
  <xml>
    <appid>${params.appid}</appid>
    <body>${params.body}</body>
    <mch_id>${params.mch_id}</mch_id>
    <nonce_str>${params.nonce_str}</nonce_str>
    <notify_url>${params.notify_url}</notify_url>
    <out_trade_no>${params.out_trade_no}</out_trade_no>
    <spbill_create_ip>${params.spbill_create_ip}</spbill_create_ip>
    <total_fee>${params.total_fee}</total_fee>
    <trade_type>${params.trade_type}</trade_type>
    <sign>${params.sign}</sign>
  </xml>
  `;
  // 创建订单
  const data = await createWxOrder(wxNativeOrderUrl, sendData);
  const { return_code, return_msg } = data;
  // 判断是否下单成功
  if (return_code == "SUCCESS" && return_msg == "OK") {
    // 下单成功
    ctx.body = {
      status: 200,
      data: {
        prepay_id: data.prepay_id[0],
        trade_type: data.trade_type[0],
        code_url: data.code_url[0],
        // 生成支付二维码图片
        pay_img: await QRCode.toDataURL(data.code_url[0]),
      },
    };
  } else {
    // 下单失败
    ctx.body = {
      status: 0,
      data: {
        return_code: return_code[0],
        return_msg: return_msg[0],
      },
    };
  }
};

// 微信支付通知
module.exports.notifyCallback = () => {};

// 微信下单V3
module.exports.wxOrderV3 = async (ctx, next) => {};

// 微信支付通知V3
module.exports.notifyV3Callback = () => {};
