const mongoose = require('mongoose');
const User = require('./userModel');
class Item extends mongoose.Schema {
  constructor(fields) {
    super(fields);
    this.add({
      researchers: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: true,
          validate: {
            validator: async function (id) {
              const user = await User.findById(id);

              return user.role === 'researcher';
            },
            message: 'Error: Project researchers include non-researcher users',
          },
        },
      ],
      raters: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: true,
          validate: {
            validator: async function (id) {
              const user = await User.findById(id);
              return user.role === 'rater';
            },
            message: 'Error: Project raters include non-rater users',
          },
        },
      ],
    });
  }
}
module.exports = Item;
