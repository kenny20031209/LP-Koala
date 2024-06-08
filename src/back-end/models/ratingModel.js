const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
    rater : {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A rating must belong to a user!']
    },
    rating : {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'A rating must have a author!']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

ratingSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'rater',
        select: 'name role'
    });
    next();
});

const ratingModel = mongoose.model( 'rating', ratingSchema);

module.exports = ratingModel;
