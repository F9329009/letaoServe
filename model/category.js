const { query } = require("../utils/mysql");

// 一级分类
module.exports.oneCategory = async () => {
  return await query("SELECT * FROM category");
};

// 二级分类
module.exports.towCategory = async (id) => {
  return await query("SELECT * FROM brand WHERE categoryId = ?", [id]);
};
