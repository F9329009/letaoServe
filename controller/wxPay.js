const QRCode = require("qrcode");

const { getTradeNo, wxOrderHandle, createSign } = require("../utils/wxPay");
const { appid, mchid, wxNativeOrderUrl, wxNativeOrderCallbackUrl, wxQueryOrderUrl } = require("../config/wxPay");
const { newOrder, updataOrder } = require("../model/wxPay");

// 微信下单
module.exports.order = async (ctx, next) => {
  const { body, total_fee, spbill_create_ip, trade_type } = ctx.request.body;
  // 下单需要的参数
  const params = {
    appid, // 公众号ID
    mch_id: mchid, // 商户号
    nonce_str: getTradeNo().toUpperCase(), // 随机字符串、
    // sign,
    body, //商品描述
    out_trade_no: getTradeNo("LT"), // 商户订单号
    total_fee, // 订单总金额
    spbill_create_ip, // 终端IP
    notify_url: wxNativeOrderCallbackUrl, // 通知地址
    trade_type, // 交易类型
  };
  // 生成签名
  params.sign = createSign(params);
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
  const data = await wxOrderHandle(wxNativeOrderUrl, sendData);
  const { return_code, return_msg } = data;
  // 判断是否下单成功
  if (return_code == "SUCCESS" && return_msg == "OK") {
    // 下单成功
    // 保存下单信息到数据库
    await newOrder(params);
    ctx.body = {
      status: 200,
      data: {
        out_trade_no: params.out_trade_no,
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

// 微信下单通知
module.exports.notifyCallback = async (ctx, next) => {
  const data = ctx.request.body.xml;
  // 判断是否正确接收回调
  if (data.return_code == "SUCCESS") {
    // 处理订单
    await updataOrder({
      appid: data.appid, // 公众账号ID
      mch_id: data.mch_id, // 商户号
      bank_type: data.bank_type, // 付款银行
      cash_fee: data.cash_fee, // 现金支付金额
      fee_type: data.fee_type, // 标价币种
      is_subscribe: data.is_subscribe, // 是否关注公众账号
      openid: data.openid, // 用户标识
      time_end: data.time_end, // 支付完成时间
      total_fee: data.total_fee, // 标价金额（订单总金额）
      trade_type: data.trade_type, // 交易类型
      transaction_id: data.transaction_id, // 微信支付订单号
      out_trade_no: data.out_trade_no, // 商户订单号
      trade_state: data.result_code, // 交易状态
    });
    // 通知微信服务器订单已处理(终止微信的重复回调)
    ctx.body = `
      <xml>
        <return_code><![CDATA[SUCCESS]]></return_code>
        <return_msg><![CDATA[OK]]></return_msg>
      </xml>
    `;
  } else {
    // 通知微信服务器回调的数据有错误(继续让微信的执行回调)
    ctx.body = `
      <xml>
        <return_code><![CDATA[FAIL]]></return_code>
        <return_msg><![CDATA[NO]]></return_msg>
      </xml>
  `;
  }
};

// 微信订单查询
module.exports.queryOrder = async (ctx, next) => {
  const { out_trade_no } = ctx.request.body;
  const params = {
    appid, // 公众号ID
    mch_id: mchid, // 商户号
    out_trade_no, // 商户订单号
    nonce_str: getTradeNo().toUpperCase(),
  };
  // 生成签名
  params.sign = createSign(params);
  // 合成请求 XML 参数
  const sendData = `
  <xml>
    <appid>${params.appid}</appid>
    <mch_id>${params.mch_id}</mch_id>
    <out_trade_no>${params.out_trade_no}</out_trade_no>
    <nonce_str>${params.nonce_str}</nonce_str>
    <sign>${params.sign}</sign>
  </xml>
  `;

  // 查询订单
  const data = await wxOrderHandle(wxQueryOrderUrl, sendData);
  console.log("data", data);

  const { return_code, return_msg, trade_state } = data;
  // 判断订单获取是否成功
  if (return_code == "SUCCESS" && return_msg == "OK") {
    // 判断订单是否已支付
    if (trade_state == "SUCCESS") {
      // 更新订单状态
      await updataOrder({
        appid: data.appid, // 公众账号ID
        mch_id: data.mch_id, // 商户号
        bank_type: data.bank_type, // 付款银行
        cash_fee: data.cash_fee, // 现金支付金额
        is_subscribe: data.is_subscribe, // 是否关注公众账号
        openid: data.openid, // 用户标识
        time_end: data.time_end, // 支付完成时间
        total_fee: data.total_fee, // 标价金额（订单总金额）
        trade_type: data.trade_type, // 交易类型
        transaction_id: data.transaction_id, // 微信支付订单号
        out_trade_no: data.out_trade_no, // 商户订单号
        trade_state: data.trade_state, // 交易状态
      });
    }
  }

  ctx.body = {
    status: 200,
    data: {
      total_fee: data.total_fee && data.total_fee[0], // 标价金额（订单总金额）
      trade_state: data.trade_state[0], // 交易状态
      trade_state_desc: data.trade_state_desc[0], // 交易状态描述
    },
  };
};

// 微信下单V3
module.exports.orderV3 = async (ctx, next) => {};

// 微信下单通知V3
module.exports.notifyV3Callback = () => {};
