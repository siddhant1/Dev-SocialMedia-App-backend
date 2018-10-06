const router = require("express").Router();
const { User, validate } = require("../models/User");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const Joi = require("joi");

router.post("/register", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).send("The email Id is already registered with us");
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  await user.save();
  res.send(_.pick(user, ["_id", "name", "email"]));
});

router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("Invalid Email or password");
    return;
  }
  console.log(user.password);
  console.log(req.body.password);
  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) {
    res.status(400).send("Invalid Email or password");
    return;
  }
  res.send(user.generateAuthToken());
});
function validateLogin(User) {
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  };
  return Joi.validate(User, schema);
}
module.exports = router;
