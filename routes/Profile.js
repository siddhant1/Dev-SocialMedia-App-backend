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
  let profile = await Profile.findOne({ user: req.user._id });
  if (profile) {
    profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      { new: true }
    );
  } else {
    profile = new Profile(profileFields);
  }
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

  const newEdu = {
    school: req.body.school,
    degree: req.body.degree,
    fieldofstudy: req.body.fieldofstudy,
    from: req.body.from,
    to: req.body.to
  };
  if (req.body.current) newEdu.current = req.body.current;
  if (req.body.description) newEdu.current = req.body.description;
  profile.education.unshift(newEdu);
  await profile.save();
  res.send(profile);
});

//add new experience
router.post("/experience", auth, async (req, res) => {
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
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    from: req.body.from,
    to: req.body.to
  };
  if (req.body.current) newExp.current = req.body.current;
  if (req.body.description) newExp.current = req.body.description;
  profile.experience.unshift(newExp);
  await profile.save();
  res.send(profile);
});

//delete experience
router.delete("/experience/:id", auth, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    res.status(400).send("Invalid Profile ID");
    return;
  }
  console.log({ profile });
  const removeIndex = profile.experience
    .map(item => item.id)
    .indexOf(req.params.id);
  profile.experience.splice(removeIndex, 1);
  await profile.save();
  res.send(profile);
});

//delete education
router.delete("/education/:id", auth, async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    res.status(400).send("Invalid Profile Id");
    return;
  }
  console.log({ profile });
  const removeIndex = profile.education
    .map(item => item.id)
    .indexOf(req.params.id);
  profile.education.splice(removeIndex, 1);
  await profile.save();
  res.send(profile);
});

//update experience
router.put("/experience/:id", auth, async (req, res) => {
  const { error } = validateExperience(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    res.status(404).send("No profile with the given Id is found");
    return;
  }
  const newExp = {
    title: req.body.title,
    company: req.body.company,
    location: req.body.location,
    from: req.body.from,
    to: req.body.to
  };
  if (req.body.current) newExp.current = req.body.current;
  if (req.body.description) newExp.current = req.body.description;
  const updateIndex = profile.experience
    .map(item => item.id)
    .indexOf(req.params.id);
  if (updateIndex === -1) {
    res.status(400).send("Invalid experience Id");
    return;
  }
  profile.experience[updateIndex] = newExp;
  await profile.save();
  res.status(202).send(profile);
});
//update education
router.put("/education/:id", auth, async (req, res) => {
  const { error } = validateEducation(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    res.status(404).send("No profile with the given Id is found");
    return;
  }
  const newEdu = {
    school: req.body.school,
    degree: req.body.degree,
    fieldofstudy: req.body.fieldofstudy,
    from: req.body.from,
    to: req.body.to
  };
  if (req.body.current) newEdu.current = req.body.current;
  if (req.body.description) newEdu.current = req.body.description;
  const updateIndex = profile.education
    .map(item => item.id)
    .indexOf(req.params.id);
  if (updateIndex === -1) {
    res.status(400).send("Invalid education Id");
    return;
  }
  profile.education[updateIndex] = newEdu;
  await profile.save();
  res.status(202).send(profile);
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
