const router = require("express").Router();
const { Profile, validate } = require("../models/Profile");
const auth = require("../middlewares/auth");
const Joi = require("joi");

router.get("/", auth, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id }).populate(
    "user"
  );
  if (!profile) {
    res.status(404).send("No profile found");
    return;
  }
  res.send(profile);
});

// @route post /user/profile
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const profileFields = {};
  profileFields.user = req.user._id;
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername)
    profileFields.githubusername = req.body.githubusername;
  if (typeof req.body.skills !== "undefined") {
    profileFields.skills = req.body.skills.split(",");
  }
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  const profile = new Profile(profileFields);
  await profile.save();
  res.send(profile);
});

// add new education
router.post("/education", auth, async (req, res) => {
  const { error } = validateEducation(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    res.status(400).send("Invalid Profile ID");
    return;
  }

  const newExp = {
    school: req.body.school,
    degree: req.body.degree,
    fieldofstudy: req.body.fieldofstudy,
    from: req.body.from,
    to: req.body.to
  };
  if (req.body.current) newExp.current = req.body.current;
  if (req.body.description) newExp.current = req.body.description;
  profile.education.unshift(newExp);
  await profile.save();
  res.send(profile);
});

//add new experience
router.post("/experienve", auth, async (req, res) => {
  const { error } = validateExperience(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    res.status(400).send("Invalid Profile ID");
    return;
  }

  const newExp = {
    title: req.body.school,
    comapany: req.body.degree,
    location: req.body.fieldofstudy,
    from: req.body.from,
    to: req.body.to
  };
  if (req.body.current) newExp.current = req.body.current;
  if (req.body.description) newExp.current = req.body.description;
  profile.education.unshift(newExp);
  await profile.save();
  res.send(profile);
});

function validateEducation(education) {
  const schema = {
    school: Joi.string().required(),
    degree: Joi.string().required(),
    fieldofstudy: Joi.string().required(),
    from: Joi.date().required(),
    to: Joi.date().required(),
    current: Joi.boolean(),
    description: Joi.string()
  };
  return Joi.validate(education, schema);
}

function validateExperience(Experience) {
  const schema = {
    title: Joi.string().required(),
    company: Joi.string().required(),
    location: Joi.string().required(),
    from: Joi.date().required(),
    to: Joi.date().required(),
    current: Joi.boolean(),
    description: Joi.string()
  };
  return Joi.validate(Experience, schema);
}
module.exports = router;
