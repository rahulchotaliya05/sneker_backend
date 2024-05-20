const express = require("express");
const blogController = require("../Controllers/blogController");
const authController = require("../Controllers/authController");
const commentController = require("../Controllers/commentController");
const IDvalidation = require("../Middleware/IDvalidation");

const router = express.Router();

router.route("/getAllComments/:id").get(commentController.getCommentsOfProduct);

router.route("/:id?").post(commentController.createComment);

module.exports = router;