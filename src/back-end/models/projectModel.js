const mongoose = require('mongoose');

const Item = require('./itemModel');

const projectSchema = new Item({
  title: {
    type: String,
    required: [true, 'Please enter project title here.'],
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  modules: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Module',
    },
  ],
  threads: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Thread',
    },
  ]
});
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
