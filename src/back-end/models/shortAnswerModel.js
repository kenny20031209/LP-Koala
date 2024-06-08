const mongoose = require('mongoose')

const shortAnswerQuestionSchema = new mongoose.Schema({
    question : {
        type: String,
        required: [true, 'A question must have a body!']
    },
    answer : {
        type: String
    }
})

const shortAnswer = mongoose.model("shortAnswer",shortAnswerQuestionSchema);

module.exports = shortAnswer;