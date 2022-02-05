const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const authRouter = express.Router();
const secureRouter = express.Router();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
require("dotenv").config();
var cors = require("cors");

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", authRouter);
app.use("/secure/", secureRouter);

authRoutes(authRouter);
userRoutes(secureRouter);

mongoose
  .connect(`${process.env.MONGODB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, (err) => {
      if (err) {
        console.log("Server is busy");
        console.log("Error :" + err);
      } else {
        console.log("Server running at PORT : " + PORT);
      }
    });
  });
