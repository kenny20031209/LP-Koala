const express = require('express');
const forumController = require('./../controllers/forumController');
const Post = require('../models/forumModels/postModel');
const Thread = require('../models/forumModels/threadModel');
const router = express.Router({ mergeParams: true });

router
  .route('/threads/')
  .get(forumController.getAllThreads)
  .post(forumController.createOneThread);

// router.route('/threads/posts/').get(forumController.getAllPosts);

// router.route('/threads/posts/responds/').get(forumController.getAllResponds);
router
  .route('/threads/posts/:id')
  .get(forumController.checkDescendant(Post), forumController.getOnePost)
  .delete(forumController.checkDescendant(Post), forumController.deleteOnePost);

router
  .route('/threads/:id')
  .get(forumController.checkDescendant(Thread), forumController.getOneThread)
  .delete(
    forumController.checkDescendant(Thread),
    forumController.deleteOneThread
  )
  .post(forumController.checkDescendant(Thread), forumController.createOnePost);

module.exports = router;
