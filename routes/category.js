const router = require("koa-router")();
const { oneCategory, towCategory } = require("../controller/category");

// 一级分类
router.get("/oneCategory", oneCategory);

// 二级分类
router.get("/towCategory", towCategory);

module.exports = router;
