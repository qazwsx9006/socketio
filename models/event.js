const mongoose = require("mongoose");

const getModels = function() {
  const definition = {
    eventKey: { type: String, required: true },
    platform: { type: String, required: true },
    rawData: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null }
  };
  let schema = new mongoose.Schema(definition);

  return mongoose.model("Event", schema);
};

module.exports = getModels;
