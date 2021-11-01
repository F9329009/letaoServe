const { oneCategory, towCategory } = require("../model/category");

// 一级分类
module.exports.oneCategory = async (ctx, next) => {
  const data = await oneCategory();
  ctx.body = {
    status: 200,
    data,
  };
};

// 二级分类
module.exports.towCategory = async (ctx, next) => {
  const { id } = ctx.request.query;
  const data = await towCategory(id);
  ctx.body = {
    status: 200,
    data,
  };
};
