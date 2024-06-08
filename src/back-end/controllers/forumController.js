const Post = require('./../models/forumModels/postModel');
const Thread = require('./../models/forumModels/threadModel');
const Project = require('./../models/projectModel');
const factory = require('./activityHandler');
const asyncCatch = require('./../utils/asyncCatch');
const AppError = require('./../utils/appError');
const mongoose = require('mongoose');

const isDescendent = async (rootId, descendantType, descendantId) => {
  const aggconfig = [
    { $match: { _id: rootId } },
    // Lookup Threads
    {
      $lookup: {
        from: 'threads',
        localField: 'threads',
        foreignField: '_id',
        as: 'threads',
      },
    },
  ];
  // console.log(descendantType);
  // console.log(rootId);
  // console.log(descendantId);
  if (descendantType === 'thread') {
    aggconfig.push({ $match: { 'threads._id': descendantId } });
  } else if (descendantType === 'post') {
    aggconfig.push(
      ...[
        { $unwind: '$threads' },
        {
          $lookup: {
            from: 'posts',
            localField: 'threads.posts',
            foreignField: '_id',
            as: 'posts',
          },
        },
        { $match: { 'posts._id': descendantId } },
      ]
    );
  } else {
    return false;
  }
  aggconfig.push(
    ...[{ $project: { _id: 1, exists: { $literal: true } } }, { $limit: 1 }]
  );
  // console.log(aggconfig);
  const result = await Project.aggregate(aggconfig);
  // console.log(result);
  if (result.length === 0) {
    // console.log(`Instance is not in the given grandparent`);
    return false;
  } else {
    // console.log(`Instance is in the given grandparent`);
    return true;
  }
};
const createChild = (Model) =>
  asyncCatch(async (req, res, next) => {
    let parent;
    if (Model.modelName === 'Thread') {
      parent = await Project.findById(req.params.projectId);
    } else if (Model.modelName === 'Post') {
      parent = await Thread.findById(req.params.id);
    }
    if (!parent) {
      return next(
        new AppError('No such parent document found with given ID', 404)
      );
    }
    req.body.user = req.user.id;
    const newInstance = await Model.create(req.body);
    parent[Model.modelName.toLowerCase() + 's'].push(newInstance._id);
    parent.save();

    res.status(201).json({
      status: 'success',
      data: {
        data: newInstance,
      },
    });
  });

exports.checkDescendant = (Model) =>
  asyncCatch(async (req, res, next) => {
    const rootID = new mongoose.Types.ObjectId(req.params.projectId);
    const descendantId = new mongoose.Types.ObjectId(req.params.id);
    const result = await isDescendent(
      rootID,
      Model.modelName.toLowerCase(),
      descendantId
    );
    if (!result) {
      return next(new AppError("This project doesn't have this document", 404));
    }
    next();
  });

exports.getAllThreads = asyncCatch(async (req, res, next) => {
  const proj = await Project.findById(req.params.projectId).populate('threads');
  res.status(200).json({
    status: 'success',
    data: {
      data: proj.threads,
    },
  });
});

// exports.createOneForum = asyncCatch(async (req, res, next) => {
//   const result = await Forum.create(req.body);
//   // update the corresponding project reference
//   await Project.findByIdAndUpdate(
//     req.params.projectId,
//     { forum: result.id },
//     { new: true, runValidators: true }
//   );
//   res.status(201).json({
//     status: 'success',
//     data: {
//       data: result,
//     },
//   });
// });
const deleteAndRemoveReference = async (Model, insId) => {
  // Find the post to get its parent thread
  const instance = await Model.findById(insId);
  if (!instance) {
    throw new Error('Instance not found');
  }
  let parent;
  if (Model.modelName === 'Post') {
    parent = await Thread.findOne({ posts: insId });
  } else if (Model.modelName === 'Thread') {
    parent = await Project.findOne({ threads: insId });
  }

  if (!parent) {
    throw new Error('Thread not found for this post');
  }
  parent[Model.modelName.toLowerCase() + 's'].pull(insId);
  await parent.save();

  // Delete the post
  return await Model.findByIdAndDelete(insId);
};
exports.createOnePost = createChild(Post);
exports.createOneThread = createChild(Thread);

exports.getOnePost = factory.getOne(Post);
exports.getOneThread = factory.getOne(Thread);

exports.deleteOnePost = asyncCatch(async (req, res, next) => {
  const result = await deleteAndRemoveReference(Post, req.params.id);

  if (!result) {
    console.log(req.params);
    return next(new AppError('No such document found with given ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.deleteOneThread = asyncCatch(async (req, res, next) => {
  const result = await deleteAndRemoveReference(Thread, req.params.id);

  if (!result) {
    console.log(req.params);
    return next(new AppError('No such document found with given ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
