const { sendSms } = require("../utils/tencentcloudSdkNodejs");

// 发送短信
module.exports.sendSms = async (module, code) => {
  return await sendSms(module, code);
};
