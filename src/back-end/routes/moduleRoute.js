const express = require('express');
const {
  getModules,
  createModule,
  getOneModule,
  deleteModule,
  updateModule,
} = require('../controllers/moduleController');
const {
  protect,
  restrictTo,
  checkModuleAccess,
} = require('../controllers/authController');
const Module = require('../models/moduleModel');

const router = express.Router();

router.use(protect);

router.get('/', getModules);

router.post('/createModule', restrictTo('researcher'), createModule);

router
  .route('/:id')
  .get(checkModuleAccess(Module), getOneModule)
  .delete(restrictTo('researcher'), checkModuleAccess(Module), deleteModule)
  .post(restrictTo('researcher'), checkModuleAccess(Module), updateModule);

module.exports = router;
