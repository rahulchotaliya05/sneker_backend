const express = require("express");
const cors = require("cors");

require("dotenv").config({ path: "./config.env" });
const PORT = process.env.PORT || 8000;
const app = express();
const AppError = require("./utils/appError");
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const commentRoutes = require("./routes/commentRoutes");
const channelRoutes = require("./routes/channelRoutes");
const errorFormatter = require("./ErrorHandler/errorFormatter");
const dbConnect = require("./Config/dbConnect");

// Parse JSON request body
app.use(express.json());
app.use(cors());

dbConnect(); //mongoose connection

//Routes
app.use("/users", userRoutes);
app.use("/sellers", sellerRoutes);
app.use("/payments", paymentRoutes);
app.use("/comments", commentRoutes);
app.use("/sneakers", productRoutes);
app.use("/channel", channelRoutes);
app.use("/sellerblogs", blogRoutes);
app.use("/uploads", express.static("uploads"));

app.all("*", (req, res, next) => {
  return next(
    new AppError(`can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(errorFormatter);

//starting server
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}....`);
});