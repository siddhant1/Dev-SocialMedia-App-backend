const auth = require("../middlewares/auth");
const { Post, validate } = require("../models/Posts");
const router = require("express").Router();

//get all posts
router.get("/", auth, async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  res.send(posts);
});

//get a particular post
router.get("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404).send("Invalid Post Id");
    return;
  }
  res.send(post);
});

//Post a Post (lol)
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (!error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const post = new Post({
    name: req.user._id,
    text: req.body.text
  });
  await post.save();
  res.send(post);
});

// delete a post
router.delete("/:id", auth, async (req, res) => {
  const post = Post.findById(req.params.id);
  if (!post) {
    res.status(404).send("No Post Found");
    return;
  }
  if (post.user.toString() !== req.user._id.toString()) {
    res.status(401).send("Not Authorised");
    return;
  }
  await post.remove();
  res.send({ success: true });
});

//Like a Post
router.post("/like/:id", auth, async (req, res) => {
  const post = Post.findById(req.params.id);
  if (!post) {
    res.status(404).send("Invalid Post Id");
    return;
  }
  post.likes.unshift({ user: req.user._id });
  await post.save();
  res.send(post);
});

//dislike a post
router.post("/unlike/:id", auth, async (req, res) => {
  const post = Post.findById(req.params.id);
  if (!post) {
    res.status(404).send("Invalid Post Id");
    return;
  }
  const removeIndex = post.likes
    .map(item => item.user.toString())
    .indexOf(req.user.id);

  post.likes.splice(removeIndex, 1);
  await post.save();
  res.send(post);
});
module.exports = router;
