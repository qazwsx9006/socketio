const mongoose = require("mongoose");
const conn = mongoose.createConnection("$monogoUrl", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  config: { autoIndex: true },
  user: "user",
  pass: "pass",
  readPreference: "secondaryPreferred"
});

const getModels = function() {
  const definition = {
    _id: { type: String, require: true },
    rawData: { type: Object },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now }
  };
  let schema = new mongoose.Schema(definition);

  return conn.model("Yao", schema);
};

module.exports = getModels;
