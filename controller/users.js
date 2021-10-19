const Joi = require("joi");
const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../config");
const { register, findUserByUserName, findUserInfo } = require("../model/users");
const { crypto } = require("../utils/crypto");

// 注册
module.exports.register = async (ctx, next) => {
  const { username, password, mobile } = ctx.request.body;
  // 参数校验
  const schema = Joi.object({
    username: Joi.string().min(4).max(20).required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{6,20}$/),
    repeat_password: Joi.ref(password),
    mobile: Joi.string().pattern(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/),
  });
  const verify = schema.validate({ username, password, mobile });
  if (!verify.error) {
    // 检测用户是否已注册
    const user = await findUserByUserName(username);
    if (user.length > 0) {
      ctx.body = {
        status: 0,
        message: "您已注册，无需重复注册",
      };
      return;
    }

    // 注册
    await register(username, crypto(password), mobile);
    ctx.body = {
      status: 200,
      message: "注册成功",
    };
  } else {
    // 参数校验失败
    ctx.body = {
      status: 0,
      message: verify.error.details[0].message,
    };
  }
};

// 登录
module.exports.login = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  // 参数校验
  const schema = Joi.object({
    username: Joi.string().min(4).max(20).required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{6,20}$/),
  });
  const verify = schema.validate({ username, password });
  if (!verify.error) {
    const user = await findUserInfo(username, crypto(password));
    // 判断是否查找到用户
    if (user.length > 0) {
      const token = jwt.sign(
        {
          username,
          password,
        },
        jwtSecret,
        { expiresIn: 60 * 60 }
      );
      ctx.body = {
        status: 200,
        message: user[0],
        data: { token },
      };
    } else {
      ctx.body = {
        status: 0,
        message: "登录失败,请检查用户名或者密码是否正确",
      };
    }
  }
};
