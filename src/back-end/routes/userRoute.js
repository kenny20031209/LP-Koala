const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login', authController.login);
router.use(authController.protect);

router.post(
  '/createUser',
  authController.restrictTo('admin'),
  userController.createUser
);

router.get('/findUser/:userId', userController.findUser);
router.get(
  '/getUsers',
  authController.restrictTo('admin', 'researcher'),
  userController.getUsers
);
router.delete(
  '/deleteUser/:id',
  authController.restrictTo('admin'),
  userController.forbidSelfDelete,
  userController.deleteUser
);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch('/updateName', userController.updateName);

module.exports = router;
