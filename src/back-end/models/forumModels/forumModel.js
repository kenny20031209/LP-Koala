const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'An activity must have a general description'],
  },
  threads: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'thread',
    },
  ],
});

forumSchema.pre(/^find/, function (next) {
  this.populate('threads');
  next();
});

const forumModel = mongoose.model('forum', forumSchema);

module.exports = forumModel;
