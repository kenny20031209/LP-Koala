const catchAsync = require('./../utils/asyncCatch');
const {singleChoice, mcqQuestion} = require('./../models/multipleChoiceModel');
const shortAnswer = require('./../models/shortAnswerModel');
const activity = require('./../models/activityModel');
const rating = require('./../models/ratingModel');
const myModule = require('./../models/moduleModel')
const factory = require('./activityHandler');


exports.getAllChoice = factory.getAll(singleChoice);
exports.getAllMcqQuestions = factory.getAll(mcqQuestion);
exports.getAllShortAnswerQuestions = factory.getAll(shortAnswer);
exports.getAllActivity = factory.getAll(activity);

exports.createChoice = factory.createOne(singleChoice);
exports.createMcq = factory.createOne(mcqQuestion);
exports.createShortAnswerQuestions = factory.createOne(shortAnswer);
exports.createActivity = factory.createNestObj(activity, myModule);
exports.createRating = factory.createNestObj(rating, activity);

exports.getOneChoice = factory.getOne(singleChoice);
exports.getOneMcqQuestion = factory.getOne(mcqQuestion);
exports.getOneShortAnswerQuestion = factory.getOne(shortAnswer);
exports.getOneActivity = factory.getOne(activity, true);
exports.getOneRating = factory.getOne(rating);

exports.deleteChoice = factory.deleteOne(singleChoice);
exports.deleteMcq = factory.deleteOne(mcqQuestion);
exports.deleteActivity = factory.deleteOne(activity);
exports.deleteShortAnswerQuestions = factory.deleteOne(shortAnswer);
exports.deleteRating = factory.deleteOne(rating);