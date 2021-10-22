const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const xmlParser = require("koa-xml-body");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const jwt = require("koa-jwt");
const { jwtSecret } = require("./config");
// 配置 process.env
require("dotenv").config();

// 导入路由
const index = require("./routes/index");
const users = require("./routes/users");
const category = require("./routes/category");
const sms = require("./routes/sms");
const wxPay = require("./routes/wxPay");

// 错误处理
onerror(app);

// 中间件
// 使用 koa-jwt 中间件 未拦截客户端在调用接口时 如果请求头中没有设置Token 返回401
app.use((ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = "没有访问权限";
    } else {
      throw err;
    }
  });
});
// 设置哪些接口需要Token
app.use(jwt({ secret: jwtSecret }).unless({ path: [/^\/public/, /^\/users\/register/, /^\/users\/login/, /^\/wxPay\/pay\/notify/] }));
// 获取XML格式的数据(必须在 koa-bodyparser 之前调用)
app.use(xmlParser());
// 获取POST请求的参数
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// 日志记录
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 挂载路由
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(category.routes(), category.allowedMethods());
app.use(sms.routes(), sms.allowedMethods());
app.use(wxPay.routes(), wxPay.allowedMethods());

// 错误处理
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
