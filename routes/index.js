const router = require("koa-router")();

const { banners, gridlist, sports } = require("../controller/index");

// 轮播图数据
router.get("/banners", banners);

// 宫格数据
router.get("/gridlist", gridlist);

// 运动专区
router.get("/sports", sports);

module.exports = router;
