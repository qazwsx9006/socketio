const config = require("config");
const Koa = require("koa");
const app = new Koa();

// response
app.use(ctx => {
  ctx.body = "Hello Koa";
});

app.listen(config.socket.port);
