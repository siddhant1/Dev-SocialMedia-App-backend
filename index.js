require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const app = express();
const morgan = require("morgan");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
// --------------------
const User = require("./routes/User");
const Profile = require("./routes/Profile");
// --------------------
//middlewares
app.use(cors());
app.use(helmet());
app.use(helmet.noCache());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));

//Routes Link
app.use("/api/user", User);
app.use("/api/profile", Profile);

mongoose
  .connect(
    `mongodb://${process.env.db_username}:${
      process.env.db_password
    }@ds123963.mlab.com:23963/dev-social-media-app`
  )
  .then(_ => console.log("connected"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, _ => console.log("Listening" + PORT));
