const clientSocket = require("socket.io-client");
const server = require("../index");
jest.setTimeout(10000);

let socket;

describe("socket jwt token auth success", () => {
  beforeAll(async done => {
    const socketUrl = "http://localhost:3000";
    socket = clientSocket(socketUrl);
    done();
  });

  test("should connect success", function(done) {
    socket.on("connect", done);
  });

  test("test messages event", function(done) {
    socket.emit("messages", "test message", data => {
      expect(data).toBe("test message");
      done();
    });
  });
});
