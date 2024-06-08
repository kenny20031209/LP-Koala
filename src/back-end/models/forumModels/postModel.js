const mongoose = require('mongoose');
const User = require('./../userModel');
const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'A post must have content'],
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
  creatAt: Date,
});

postSchema.pre(/^find/, function (next) {
  this.populate('user')
  next();
});

postSchema.pre('save', function (next) {
  if (this.isNew) {
    this.creatAt = Date.now();
  }
  next();
});
// postSchema.pre('findOneAndDelete', async function (next) {
//   const post = await this.model.findOne(this.getQuery());
//   if (post) {
//     await Thread.updateOne({ posts: post._id }, { $pull: { posts: post._id } });
//   }
//   next();
// });
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
