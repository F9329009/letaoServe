const router = require("koa-router")();
const { sendsms } = require("../controller/sms");

router.post("/sendsms", sendsms);

module.exports = router;
