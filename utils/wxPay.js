const axios = require("axios");
const crypto = require("crypto");
const xml2js = require("xml2js");

const { apikey } = require("../config/wxPay");

const { getRandomByLength } = require("./tencentcloudSdkNodejs");

// 订单处理
module.exports.wxOrderHandle = async (url, data) => {
  return new Promise(async (resolve, reject) => {
    // 给微信发送请求
    const result = await axios({
      url,
      method: "POST",
      data,
    });
    // 把返回信息转换成对象
    xml2js.parseString(result.data, (err, res) => {
      if (err) return reject(err);
      resolve(res.xml);
    });
  });
};

// 生成商户订单号
module.exports.getTradeNo = (prefix = "") => {
  const date = new Date();
  return prefix + date.toJSON().substr(0, 10).replace(/[-]/g, "") + date.getTime() + getRandomByLength(32 - 21 - prefix.length || 0);
};

// 生成签名算法
module.exports.createSign = (args) => {
  // 设所有发送或接受到的数据为集合M
  // 将集合M内非空参数值的参数按照参数名ASCII码从大到小排序(字典序)
  // 使用URL键值对的格式(key1=value&key2=value2...)拼接成字符串stringA

  // let stringA = "";
  // Object.keys(args)
  //   .sort()
  //   .forEach((key) => {
  //     stringA += `${key}=${args[key]}&`;
  //   });
  // stringA = `key=${apikey}`;

  const stringA = Object.keys(args)
    .sort()
    .reduce((prev, next) => (prev += `${next}=${args[next]}&`), "")
    .concat(`key=${apikey}`);

  return crypto.createHash("MD5").update(stringA).digest("hex").toUpperCase();
};
