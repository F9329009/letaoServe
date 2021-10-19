const { sendSms } = require("../model/sms");

const { getRandomByLength } = require("../utils/tencentcloudSdkNodejs");

module.exports.sendsms = async (ctx, next) => {
  const { module } = ctx.request.body;
  console.log("module", module);

  // 验证码
  const code = getRandomByLength(6);
  console.log("code", code);
  const result = await sendSms(module, code);

  console.log("result", result);

  if (result.SendStatusSet[0].Code === "OK") {
    ctx.body = {
      status: 200,
      message: "短信发送成功",
    };
  } else {
    ctx.body = {
      status: 0,
      message: result.SendStatusSet[0].Message,
    };
  }
};
