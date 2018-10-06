const mongoose = require("mongoose");
const Joi = require("joi");
const Jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

UserSchema.methods.generateAuthToken = function() {
  return Jwt.sign({ _id: this.id, name: this.name }, process.env.JwtKey);
};
const User =  mongoose.model("users", UserSchema);

function validateUser(User) {
  const schema = {
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required()
  };
  return Joi.validate(User, schema);
}

exports.User = User;
exports.validate = validateUser;
