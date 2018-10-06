const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  }
});

function validateProfile(Profile) {
  const schema = {
    company: Joi.string(),
    website: Joi.string(),
    location: Joi.string(),
    status: Joi.string().required(),
    skills: Joi.string().required(),
    bio: Joi.string(),
    githubusername: Joi.string(),
    experience: Joi.array().items(
      Joi.object().keys({
        title: Joi.string().required(),
        company: Joi.string().required(),
        location: Joi.string().required(),
        from: Joi.date().required(),
        to: Joi.date().required(),
        current: Joi.boolean(),
        description: Joi.string()
      })
    ),
    education: Joi.array().items(
      Joi.object().keys({
        school: Joi.string().required(),
        degree: Joi.string().required(),
        fieldofstudy: Joi.string().required(),
        from: Joi.date().required(),
        to: Joi.date().required(),
        current: Joi.boolean(),
        description: Joi.string()
      })
    ),
    youtube: Joi.string(),
    twitter: Joi.string(),
    facebook: Joi.string(),
    linkedin: Joi.string(),
    instagram: Joi.string()
  };
  return Joi.validate(Profile, schema);
}
module.exports.Profile = Profile = mongoose.model("profile", ProfileSchema);
module.exports.validate = validateProfile;
