const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.json({
        service: "User-Device-DB",
        version: "1.0.1",
        description: "This is the service document for the User-Device API.",
        host: req.hostname,
        links: [
          {rel: "self", link: "http://localhost:3000/"},
          {rel: "users", link: "http://localhost:3000/users"},
          {rel: "user_by_id", link: "http://localhost:3000/users/{user_id}", templated: true},
          {rel: "search_devices", link: "http://localhost:3000/search/devices?owner={user_id}", templated: true},
          {rel: "search_owner", link: "http://localhost:3000/search/owner?device={device_id}", templated: true},
          {rel: "event_feed", link: "http://localhost:3000/events/feed"}
        ]
      });
});

router.get('/search/devices', function(req, res, next) {
  res.redirect(`http://localhost:3000/users/${req.query.owner}`);
});

router.get('/search/owner', function(req, res, next) {
  res.redirect(`http://localhost:3000/users/john`);
});

module.exports = router;
