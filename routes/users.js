const express = require('express');
const router = express.Router();

const base = "http://localhost:3000";

let users = ["john", "edna", "joe", "kim", "ted", "lisa", "mike", "kyle", "alice", "bob"];
let devices = [
    {id: "737846327B673", type: "Smoke Detector", locked: false},
    {id: "KK8L3274673IU", type: "Alarm System", locked: false},
    {id: "B87asd888UZ232", type: "Smartphone (iOS)", locked: true}
];

router.post('/', function(req, res, next) {

		// TODO: Save new User

    res.json({
            userCount: result.size,
            pageNumber: 1,
            pageSize: 757,
            users: users.map(u => ({id: u, link: `${base}/users/${u}`})),
            links:[ {rel: "next", link: `${base}/users?page=2` } ]
        });
});

router.get('/', function (req, res) {
	res.json(
		{
			users: users.map((user) => ({
				userId: user,
				links: 	[
					{rel: "self", link: `${base}/users/${user}`, methods: "GET, DELETE"},
					{rel: "devices", link: `${base}/users/${user}/devices`, methods: "GET, POST"}
				]
			})),
			pageSize: users.lengh,
			pageNumber: 1,
			links:[ {rel: "next", link: `${base}/users?page=2` } ]
		}
		);

});

router.get('/:id', function(req, res, next) {
    let userId = req.params.id;
    if (userId !== "john") {
        let err = new Error('User not found');
        err.status = 404;
        next(err);
    } else {
        res.json({
                userId: userId,
                username: "John doe",
                links: [
                    {rel: "self", link: `${base}/users/${userId}`, methods: "GET, DELETE" },
                    {rel: "devices", link: `${base}/users/${userId}/devices`, methods: "GET, POST" }
                ]
            });
    }
});

router.get('/:id/devices', function(req, res, next) {
    res.json(
        devices.map(d => ({
            deviceId: d.id,
            deviceType: d.type,
            locked: d.locked === true,
            links : [ {rel: "self", link: `${base}/users/${req.params.id}/devices/${d.id}`, methods: "GET, DELETE"} ]
        }))
    );
});

router.get('/:user_id/devices/:device_id', function(req, res, next) {
    let dev = devices.find(e => req.params.device_id);
    if (!dev) {
        let err = new Error('Device not found');
        err.status = 404;
        next(err);
    } else {
        res.json({
            deviceId: dev.id,
            deviceType: dev.type,
            locked: dev.locked === true,
            links : [
                {rel: "self", link: `${base}/users/${req.params.user_id}/devices/${dev.id}`},
                {rel: "owner", link: `${base}/users/${req.params.user_id}`},
               	{rel: "lock", link: `${base}/users/${req.params.user_id}/devices/${dev.id}/lock`, methods: "PUT, DELETE" }
            ]
        });
    }
});

router.get('/:user_id/devices/:device_id/lock', function(req, res, next) {
    let err = new Error('Method not allowed');
    err.status = 405;
    next(err);
});

module.exports = router;