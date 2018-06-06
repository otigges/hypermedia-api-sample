const moment = require("moment");

const EVT_LOCKED = "device-locked";
const EVT_UNLOCKED = "device-unlocked";
const events = [];

let ID_GEN = 56789;

class Event {
	constructor(type, payload, timestamp = moment()) {
		this.id = ID_GEN++;
		this.type = type;
		this.payload = payload;
		this.timestamp = timestamp;
	}
}

events.unshift(new Event(EVT_LOCKED, {device_id: "673K7878776DS", user_id: "john"}, moment().subtract(45, "seconds")));
events.unshift(new Event(EVT_LOCKED, {device_id: "872847284L22", user_id: "john"}, moment().subtract(35, "seconds")));
events.unshift(new Event(EVT_LOCKED, {device_id: "K237478274782", user_id: "kim"}, moment().subtract(23, "seconds")));
events.unshift(new Event(EVT_LOCKED, {device_id: "737846327B673", user_id: "lisa"}, moment().subtract(21, "seconds")));
events.unshift(new Event(EVT_LOCKED, {device_id: "324234234233J", user_id: "john"}, moment().subtract(9, "seconds")));
events.unshift(new Event(EVT_UNLOCKED, {device_id: "737846327B673", user_id: "john"}, moment().subtract(5, "seconds")));
events.unshift(new Event(EVT_LOCKED, {device_id: "737846327B673", user_id: "john"}, moment().subtract(3, "seconds")));
events.unshift(new Event(EVT_UNLOCKED, {device_id: "K237478274782", user_id: "kim"}, moment().subtract(1, "seconds")));

module.exports = {
	addEvent: function (event) {
		events.unshift(event);
	},
	onDeviceLocked: function (deviceId, userId) {
		this.addEvent(new Event(EVT_LOCKED, { device_id: deviceId, user_id: userId}))
	},
	onDeviceUnlocked: function (deviceId, userId) {
		this.addEvent(new Event(EVT_UNLOCKED, { device_id: deviceId, user_id: userId}))
	},
	getEvents : function () {
		return events;
	},
	find : function(event_id) {
		return events.find(e => e.id === event_id);
	}
};
