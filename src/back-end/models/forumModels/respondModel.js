const mongoose = require('mongoose');

const respondSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: [true, 'A respond must have content'],
  },
  creatAt: Date,
});

respondSchema.pre('save', function (next) {
  if (this.isNew) {
    this.creatAt = Date.now();
  }
  next();
});

const respondModel = mongoose.model('respond', respondSchema);

module.exports = respondModel;
