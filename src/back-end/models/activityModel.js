const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    description:{
        type: String,
        required: [true, 'An activity must have a general description']
    },
    content:{
        type: String,
        required: [true, 'An activity must have content']
    },
    multipleChoiceQuestions:[{
        type: mongoose.Schema.ObjectId,
        ref: 'multipleChoices'
    }],
    shortAnswerQuestions:[{
        type: mongoose.Schema.ObjectId,
        ref: 'shortAnswer'
    }],
    files : [{
        type: mongoose.Schema.ObjectId,
        ref: 'fileModel'
    }],
    ratings : [{
        type: mongoose.Schema.ObjectId,
        ref: 'rating'
    }]
});

activitySchema.pre(/^find/, function(next) {
    if(!this._fields){
        this.populate('multipleChoiceQuestions');
        this.populate('shortAnswerQuestions');
        this.populate('files');
    }
    next();
})

const activityModel = mongoose.model('activity', activitySchema);

module.exports = activityModel;