const express = require('express')
const multipleChoiceController = require('./../controllers/activityController');
const activityController = require('./../controllers/activityController')

const router = express.Router();

router.route('/mcq/choice')
    .get(multipleChoiceController.getAllChoice)
    .post(multipleChoiceController.createChoice);

router.route('/mcq/choice/:id')
    .get(multipleChoiceController.getOneChoice)
    .delete(multipleChoiceController.deleteChoice);

router.route('/mcq/multipleChoiceQuestion')
    .get(multipleChoiceController.getAllMcqQuestions)
    .post(multipleChoiceController.createMcq);

router.route('/mcq/multipleChoiceQuestion/:id')
    .get(multipleChoiceController.getOneMcqQuestion)
    .delete(multipleChoiceController.deleteMcq);

router.route('/shortAnswer')
    .get(activityController.getAllShortAnswerQuestions)
    .post(activityController.createShortAnswerQuestions);

router.route('/shortAnswer/:id')
    .get(activityController.getOneShortAnswerQuestion)
    .delete(activityController.deleteShortAnswerQuestions);

router.route('/')
    .get(activityController.getAllActivity);

router.route('/:id')
    .post(activityController.createActivity);

router.route('/:id')
    .get(activityController.getOneActivity)
    .delete(activityController.deleteActivity);

router.route('/:id/ratings')
    .post(activityController.createRating);


router.route('/ratings/:id')
    .get(activityController.getOneRating)
    .delete(activityController.deleteRating);



module.exports = router;