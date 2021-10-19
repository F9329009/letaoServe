const router = require("koa-router")();

const { wxOrder, notifyCallback, wxOrderV3, notifyV3Callback } = require("../controller/order");

router.post("/wxOrder", wxOrder);
router.post("/pay/notify", notifyCallback);

router.post("/wxOrderV3", wxOrderV3);
router.post("/pay/v3/notify", notifyV3Callback);

module.exports = router;
