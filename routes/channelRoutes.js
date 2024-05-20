const express = require("express");
const channelController = require("../Controllers/channelController");
const router = express.Router();

router.post("/login", channelController.login);
router.post("/signup", channelController.signup);
router.post("/authenticate", channelController.authenticate);

module.exports = router;