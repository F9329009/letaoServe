const { query } = require("../utils/mysql");

// 注册
module.exports.register = async (username, password, mobile) => {
  return await query("INSERT INTO user(username, password,mobile) VALUES(?,?,?)", [username, password, mobile]);
};

// 查询用户信息
module.exports.findUserByUserName = async (username) => {
  return await query("SELECT id FROM user WHERE username=?", [username]);
};

// 登录
module.exports.findUserInfo = async (username, password) => {
  return await query("SELECT id,username,password,mobile FROM user WHERE username= ? AND password = ?", [username, password]);
};
