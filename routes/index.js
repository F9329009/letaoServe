const router = require("koa-router")();

const { banners, gridList, sport } = require("../controller/index");

// 轮播图数据
router.get("/banners", banners);

// 宫格数据
router.get("/gridList", gridList);

// 运动专区
router.get("/sport", sport);

module.exports = router;
