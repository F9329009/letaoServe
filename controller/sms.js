const { sendSms } = require("../model/sms");

const { getRandomByLength } = require("../utils/tencentcloudSdkNodejs");

module.exports.sendsms = async (ctx, next) => {
  const { module } = ctx.request.body;
  console.log("module", module);

  // 验证码
  const code = getRandomByLength(6);
  console.log("code", code);

  // 判断是否需要正在需要发送验证码(开发期间不需要每次都发送验证码)
  if (!process.isSendSms) {
    // 模拟短信发送成功
    ctx.body = {
      status: 200,
      message: "短信发送成功",
      data: {
        module,
        code,
      },
    };
    return;
  }

  // 发送验证码
  const result = await sendSms(module, code);
  // 判断验证码是否发送成功
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
