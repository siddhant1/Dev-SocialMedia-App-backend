require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const User = require("./routes/User");
//middlewares
app.use(cors());
app.use(helmet());
app.use(helmet.noCache());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routes Link
app.use("/api/user", User);

mongoose
  .connect(
    `mongodb://${process.env.db_username}:${
      process.env.db_password
    }@ds123963.mlab.com:23963/dev-social-media-app`
  )
  .then(_ => console.log("connected"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, _ => console.log("Listening"+PORT));
