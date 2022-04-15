const mongoose = require("mongoose");

const getModels = function () {
  const definition = {
    rawData: { type: Object },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now },
  };
  let schema = new mongoose.Schema(definition);

  return mongoose.model("Yao", schema);
};

module.exports = getModels;
