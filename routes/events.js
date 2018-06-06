const express = require('express');
const router = express.Router();
const event_store = require("../lib/event_store");

router.get('/feed', function(req, res, next) {
	res.json({
		events: event_store.getEvents().map(toDisplay),
		links: [
			{rel: "self", link: "http://localhost:3000/events/feed"},
			{rel: "previous", link: "http://localhost:3000/events/feed?start=12345"},
		]
	});
});

router.get('/:event_id', function(req, res, next) {
	let event = event_store.find(parseInt(req.params.event_id));
	res.json(toDisplay(event));
});

function toDisplay(event) {
	return Object.assign({}, event,
		{ timestamp: event.timestamp.toISOString(),
			links: [
				{rel: "self", link: `http://localhost:3000/events/${event.id}`},
				{rel: "feed", link: `http://localhost:3000/events/feed`},
			]
		});
}

module.exports = router;
