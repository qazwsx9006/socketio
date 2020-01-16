const axios = require("axios");
const { Event } = require("../models");

async function getEventInfo(eventKey, platform) {
  let event = await Event.findOne({ eventKey, platform });
  if (event) return event;
  if (platform === "kktix") return await getKKtixEvent(eventKey);
}

async function getKKtixEvent(eventKey) {
  const response = await axios.get(
    `https://kktix.com/g/events/${eventKey}/base_info`
  );
  event = Event.create({
    eventKey,
    platform: "kktix",
    rawData: response.data
  });
  return event;
}

module.exports = {
  getEventInfo
};
