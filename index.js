const config = require("config");
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const app = new Koa();
const router = new Router();
const { Yao } = require("./models");

app.use(cors());
app.use(bodyParser());

router
  .get("/", (ctx) => {
    ctx.body = "首頁";
  })
  .post("/yao", async (ctx) => {
    const content = ctx.request.body;
    const yao = await Yao.create({ rawData: content });
    ctx.body = yao;
  })
  .get("/yaoAdmin", async (ctx) => {
    const yaos = await Yao.find().sort({ _id: -1 });
    ctx.body = yaos;
  });
// response;
app.use(router.routes());

const server = app.listen(config.socket.port, async () => {
  console.log(`Server listening on port ${config.socket.port}`);
});
