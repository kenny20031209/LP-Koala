const Module = require('../models/moduleModel');
const factory = require('./handlerFactory');
const Project = require('../models/projectModel');
const asyncCatch = require('../utils/asyncCatch');

exports.getModules = asyncCatch(async (req, res, next) => {
  // First, check whether the user is rater, researcher, admin
  let items;
  const role = req.user.role;
  const id = req.user.id;
  let query = {};
  // Firstly, we find the corresponding query according to their roles
  if (role === 'researcher') {
    query[role + 's'] = { $elemMatch: { $eq: id } };
    // Since modules have access time, we construct a different query
  } else if (role === 'rater') {
    query = {
      raters: { $elemMatch: { $eq: id } },
      open: 'Yes',
    };
  } else if (role == null || role != 'admin') {
    // Return error in case no role is found
    return next(
      new AppError(
        "Unable to identify the current user's role. Refuse to perform operations.",
        401
      )
    );
  }

  // Next, display their own models according to their roles
  items = await Module.find(query).populate({
    path: 'researchers',
    select: 'name username',
  });
  res.status(200).json({
    status: 'success',
    data: items,
  });
});

exports.getOneModule = asyncCatch(async (req, res, next) => {
  const popOptions = {
    path: 'activities',
    select:
      '-ratings -__v -multipleChoiceQuestions -shortAnswerQuestions -files -ratings -content',
  };
  let query = Module.findById(req.params.id);
  // Raters cannot access unpublished module
  if (popOptions) query = query.populate(popOptions);
  let doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }
  if (req.user.role === 'rater' && doc.open !== 'Yes') {
    doc = {};
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.createModule = asyncCatch(async (req, res, next) => {
  // Pass researchers according to front-end input
  if (!req.body.researchers || req.body.researchers == []) {
    req.body.researchers = [req.user.id];
  } else {
    if (!req.body.researchers.includes(req.user.id)) {
      req.body.researchers.push(req.user.id);
    }
  }
  // Create new Model
  const item = await Module.create(req.body);

  // update the corresponding project reference
  await Project.findByIdAndUpdate(
    item.projectId,
    { $push: { modules: item.id } },
    { new: true, runValidators: true }
  );
  // Send response
  res.status(201).json({
    status: 'success',
    data: item,
  });
});
exports.deleteModule = factory.deleteOneDoc(Module);
exports.updateModule = factory.updateOneItem(Module);
