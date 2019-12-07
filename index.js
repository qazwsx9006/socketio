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
  socket.join("system");

  socket.on("messages", async (content, ackCallback) => {
    socket.broadcast.emit("messages", content);
    if (ackCallback) ackCallback(content);
  });

  socket.on("join", async (content, ackCallback) => {
    const { eventId } = content;
    socket.join(eventId);

    if (ackCallback) {
      ackCallback({
        status: 200,
        message: `success join ${eventId}`
      });
    }
  });

  socket.on("captcha", async (content, ackCallback) => {
    const { eventId } = content;
    socket.broadcast.to(eventId).emit("captcha", content);

    if (ackCallback) {
      ackCallback({
        status: 200,
        message: `broadcast success`
      });
    }
  });
});
