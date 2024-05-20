const { promisify } = require("util");
const cors = require("cors");
const axios = require("axios");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const CHAT_ENGINE_PROJECT_ID = process.env.CHAT_ENGINE_PROJECT_ID;
const CHAT_ENGINE_PRIVATE_KEY = process.env.CHAT_ENGINE_PRIVATE_KEY;

const signup = catchAsync(async (req, res, next) => {
  const { username, secret, confirmSecret, email, first_name, last_name } =
    req.body;
  console.log(req.body);
  if (secret != confirmSecret) {
    return res.status(401).json({
      message: "Secret & ConfirmSecret is Not Same",
    });
  }
  try {
    const r = await axios.post(
      "https://api.chatengine.io/users/",
      { username, secret, email, first_name, last_name },
      { headers: { "Private-Key": CHAT_ENGINE_PRIVATE_KEY } }
    );
    // console.log(r);
    res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response.status).json(e.response.data);
  }
});

const login = catchAsync(async (req, res, next) => {
  const { username, secret } = req.body;
  //   console.log(req.body);

  try {
    const r = await axios.get("https://api.chatengine.io/users/me/", {
      headers: {
        "Project-ID": CHAT_ENGINE_PROJECT_ID,
        "User-Name": username,
        "User-Secret": secret,
      },
    });
    res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response.status).json(e.response.data);
  }
});

const authenticate = catchAsync(async (req, res, next) => {
  const { username } = req.body;

  try {
    const r = await axios.put(
      "https://api.chatengine.io/users/",
      { username, secret: username, first_name: username },
      { headers: { "Private-Key": CHAT_ENGINE_PRIVATE_KEY } }
    );
    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response.status).json(e.response.data);
  }
});

module.exports = {
  signup,
  login,
  authenticate,
};