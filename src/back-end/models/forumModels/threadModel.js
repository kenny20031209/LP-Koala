const mongoose = require('mongoose');
const Post = require('./postModel');
const User = require('./../userModel');
const threadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A thread must have a title'],
  },
  description: {
    type: String,
    required: [true, 'A thread must have a general description'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async function (id) {
        const user = await User.findById(id);
        return Boolean(user);
      },
      message: 'Error: No user information',
    },
  },
  posts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
    },
  ],
  creatAt: Date,
});
threadSchema.pre(/^find/, function (next) {
  this.populate('posts');
  this.populate('user')
  next();
});
threadSchema.pre('save', function (next) {
  if (this.isNew) {
    this.creatAt = Date.now();
  }
  next();
});
threadSchema.pre('findOneAndDelete', async function (next) {
  const thread = await this.model.findOne(this.getQuery());
  if (thread) {
    await Post.deleteMany({ _id: { $in: thread.posts } });
  }
  next();
});

const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;
