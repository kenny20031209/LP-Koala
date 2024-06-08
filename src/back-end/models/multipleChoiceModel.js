const mongoose = require('mongoose');

const mcqSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'A question must have a name!']
    },
    choices : [{
        type: mongoose.Schema.ObjectId,
        ref: 'singleChoices'
    }]
})

const singleChoiceSchema = new mongoose.Schema({
    text :{
        type: String,
        required: [true, 'A choice can not be empty!']
    },
    isCorrect : {
        type: Boolean,
        required: [true, 'A choice must have answer!']
    }
})

mcqSchema.pre(/^find/, function(next){
    this.populate('choices');
    next();
})


const singleChoice = mongoose.model('singleChoices', singleChoiceSchema);
const mcqQuestion = mongoose.model('multipleChoices', mcqSchema);

module.exports = {singleChoice, mcqQuestion};