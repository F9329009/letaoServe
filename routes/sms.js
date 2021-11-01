const router = require("koa-router")();
const { sendsms } = require("../controller/sms");

router.post("/sendSms", sendsms);

module.exports = router;
