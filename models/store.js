const mongoose = require("mongoose");
const conn = mongoose.createConnection("$databaseUrl", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  config: { autoIndex: true },
  user: "$user",
  pass: "$pass",
  readPreference: "secondaryPreferred"
});

const getModels = function() {
  const definition = {
    _id: { type: String, require: true },
    name: { type: String, required: true },
    openTime: { type: String },
    address: { type: String },
    note: { type: String },
    maskAdult: { type: Number, default: 0 },
    maskChild: { type: Number, default: 0 },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point"
      },
      coordinates: {
        // [<longitude>, <latitude> ]
        type: [Number],
        index: { type: "2dsphere", sparse: true },
        validate: function([lng, lat]) {
          if (
            !_.some(this.topics, topicId =>
              _.includes(config.topics.distance, topicId)
            )
          )
            return true;
          if (!lat || !lng) throw new Error(`lng and lat is required.`);
          return true;
        }
      }
    },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now }
  };
  let schema = new mongoose.Schema(definition);

  schema.statics.getStore = async function(params = {}) {
    const { lat, lng, distance = 5 } = params;
    const aggregate = [
      {
        $match: {
          location: {
            $geoWithin: {
              $centerSphere: [[lng, lat], distance / 6378.1]
            }
          }
        }
      }
    ];
    const result = await this.aggregate(aggregate);
    return result;
  };

  return conn.model("Store", schema);
};

module.exports = getModels;
