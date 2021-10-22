const router = require("koa-router")();

const { order, notifyCallback, queryOrder, orderV3, notifyV3Callback } = require("../controller/wxPay");

router.prefix("/wxPay");

// 微信下单
router.post("/order", order);
// 微信下单通知
router.post("/pay/notify", notifyCallback);
// 微信订单出现
router.post(`/queryOrder`, queryOrder);

// 微信下单V3
router.post("/orderV3", orderV3);
// 微信下单通知V3
router.post("/pay/v3/notify", notifyV3Callback);

module.exports = router;
