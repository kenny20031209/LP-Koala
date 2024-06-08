const Project = require('../models/projectModel');
const AppError = require('../utils/appError');
const asyncCatch = require('../utils/asyncCatch');
const factory = require('./handlerFactory');

// Give an overview of users' projects, including researchers' name and usernames
exports.getProjects = asyncCatch(async (req, res, next) => {
  // First, check whether the user is rater, researcher, admin
  let items;
  const role = req.user.role;
  const id = req.user.id;
  let query = {};
  // Firstly, we find the corresponding query according to their roles
  if (role === 'researcher' || role === 'rater') {
    query[role + 's'] = { $elemMatch: { $eq: id } };
    // Since modules have access time, we construct a different query
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
  items = await Project.find(query).populate({
    path: 'researchers',
    select: 'name username',
  });
  res.status(200).json({
    status: 'success',
    data: items,
  });
});

// Returns a project with researchers' and raters' names and usernames
exports.getOneProject = asyncCatch(async (req, res, next) => {
  const popOptions = [
    {
      path: 'researchers',
      select: 'name username',
    },
    {
      path: 'raters',
      select: 'name username',
    },
    {
      path: 'modules',
      select: '-__v -projectId',
    },
  ];
  let query = Project.findById(req.params.id);
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }
  // Filter out unpublished modules
  if (req.user.role === 'rater') {
    let filteredModules = [];
    if (doc.modules.length != 0) {
      for (const m of doc.modules) {
        if (m.open == 'Yes') {
          filteredModules = filteredModules.concat(m);
        }
      }
    }
    doc.modules = filteredModules;
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.createProject = factory.createOneItem(Project);
exports.deleteProject = factory.deleteOneDoc(Project);
exports.updateProject = factory.updateOneItem(Project);
