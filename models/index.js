const _ = require("lodash");
const fs = require("fs");
const mongoose = require("mongoose");

let models;

const getClient = () => {
  if (!models) {
    const uris = "mongodb+srv://cluster0-kggog.gcp.mongodb.net/tix_hero";
    const options = {
      useCreateIndex: true,
      useNewUrlParser: true,
      config: { autoIndex: true },
      user: "tix_hero",
      pass: "Rbxb75vS7NzhKIi3",
      readPreference: "secondaryPreferred"
    };
    mongoose.connect(uris, options, function(err) {
      if (err) console.error(err);
    });

    const db = mongoose.connection;
    db.on("connected", () => console.log("mongodb connected"));
    db.on("error", () => console.log("mongodb error"));
    db.on("disconnected", () => console.log("mongodb disconnected"));
    models = getModels();
  }
  return models;
};

const getModels = function() {
  const modelNames = fs
    .readdirSync(__dirname)
    .filter(file => !(/^(index|plugins)/.test(file) || /test/.test(file)))
    .map(file => file.split(".")[0]);
  let result = {};
  _.map(modelNames, modelName => {
    const camelCaseModelName = _.upperFirst(_.camelCase(modelName));
    result[camelCaseModelName] = require(`./${modelName}`)();
    return modelName;
  });
  return result;
};

module.exports = getClient();
