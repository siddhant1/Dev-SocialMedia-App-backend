const mongoose = require("mongoose");
const Joi = require("joi");

// Create Schema
const PostSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  text: {
    type: String,
    required: true
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  //   comments: [
  //     {
  //       user: {
  //         type: Schema.Types.ObjectId,
  //         ref: "users"
  //       },
  //       text: {
  //         type: String,
  //         required: true
  //       },
  //       avatar: {
  //         type: String
  //       },
  //       date: {
  //         type: Date,
  //         default: Date.now
  //       }
  //     }
  //   ],
  date: {
    type: Date,
    default: Date.now
  }
});

function validatePost(Post) {
  const schema = {
    text: Joi.string().required()
  };
  return Joi.validate(Post, schema);
}
const Post = mongoose.model("post", PostSchema);
module.exports.Post = Post;
module.exports.validate = validatePost;
