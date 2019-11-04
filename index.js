const Server = require("socket.io");
const config = require("config");
const Koa = require("koa");
const app = new Koa();
let io;

// response;
app.use(ctx => {
  ctx.body = "Hello Koa";
});

const server = app.listen(config.socket.port, async () => {
  console.log(`Server listening on port ${config.socket.port}`);
});

io = new Server(server);

io.on("connection", function(socket) {
  console.log("a user connected");
});
