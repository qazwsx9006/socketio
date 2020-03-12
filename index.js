const Server = require("socket.io");
const config = require("config");
const Koa = require("koa");
const tixHero = require("./services/tix_hero");
const app = new Koa();
let io;

// mask
const { Store, Yao } = require("./models");
//

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

  socket.conn.on("heartbeat", async function() {
    const token = socket.handshake.query.token;
    console.log(`${new Date().toLocaleString()} => token`);
  });

  socket.on("messages", async (content, ackCallback) => {
    socket.broadcast.emit("messages", content);
    if (ackCallback) ackCallback(content);
  });

  socket.on("eventInfo", async (content, ackCallback) => {
    const { eventKey, platform } = content;
    if (!eventKey || !platform) {
      ackCallback({ msg: "參數錯誤" });
      return;
    }
    const event = await tixHero.getEventInfo(eventKey, platform);
    if (ackCallback) ackCallback(event);
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

  socket.on("masks", async (content, ackCallback) => {
    const { lat, lng, distance = 2 } = content;
    const stores = await Store.getStore({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      distance
    });
    const response = stores.map(store => store.responseFormat());
    if (ackCallback) ackCallback(response);
  });

  socket.on("mingyuMaskAlert", async (content, ackCallback) => {
    socket.broadcast.emit("maskAlert", content);
    if (ackCallback) ackCallback(response);
  });

  socket.on("yao", async (content, ackCallback) => {
    const yao = await Yao.create({ rawData: content });
    socket.broadcast.emit("yao", yao);
    if (ackCallback) ackCallback(yao);
  });

  socket.on("yaoAdmin", async (content, ackCallback) => {
    const yaos = Yao.find().sort({ _id: -1 });
    if (ackCallback) ackCallback(yaos);
  });
});
