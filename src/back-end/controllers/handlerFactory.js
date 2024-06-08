const asyncCatch = require('../utils/asyncCatch');
const AppError = require('../utils/appError');
const Project = require('../models/projectModel');

// Create an item document according to its ID
exports.createOneItem = (Model) =>
  asyncCatch(async (req, res, next) => {
    // Pass researchers according to front-end input
    if (!req.body.researchers || req.body.researchers == []) {
      req.body.researchers = [req.user.id];
    } else {
      if (!req.body.researchers.includes(req.user.id)) {
        req.body.researchers.push(req.user.id);
      }
    }
    // Create new Model
    const item = await Model.create(req.body);

    // Send response
    res.status(201).json({
      status: 'success',
      data: item,
    });
  });

// Deletes a document according to its ID
exports.deleteOneDoc = (Model) =>
  asyncCatch(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

// Returns a document according to its ID,
// with option to display additional information with populate
exports.getOneDoc = (Model, popOptions) =>
  asyncCatch(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAllItems = (Model) =>
  asyncCatch(async (req, res, next) => {
    // First, check whether the user is rater, researcher, admin
    let items;
    const role = req.user.role;
    const id = req.user.id;
    let query = {};
    // Firstly, we find the corresponding query according to their roles
    if (
      role === 'researcher' ||
      (role === 'rater' && Model.constructor.modelName != 'Module')
    ) {
      query[role + 's'] = { $elemMatch: { $eq: id } };
      // Since modules have access time, we construct a different query
    } else if (role === 'rater' && Model.constructor.modelName === 'Module') {
      query = {
        raters: { $elemMatch: { $eq: id } },
        open: 'Yes',
        // accessTime: { $lte: Date.now() },
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
    items = await Model.find(query).populate({
      path: 'researchers',
      select: 'name username',
    });
    res.status(200).json({
      status: 'success',
      data: items,
    });
  });

exports.updateOneItem = (Model) =>
  asyncCatch(async (req, res, next) => {
    // Pass researchers according to front-end input
    if (!req.body.researchers || req.body.researchers == []) {
      req.body.researchers = [req.user.id];
    } else {
      if (!req.body.researchers.includes(req.user.id)) {
        req.body.researchers.push(req.user.id);
      }
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
