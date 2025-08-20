const express = require('express');
const propertyController = require('../controllers/propertyController');
const authController=require('../controllers/authController');
const interestRouter=require('./interestRoutes');
const reviewRouter=require('./reviewRoutes');
const sellingRoutes=require('./sellingRoutes');

const router = express.Router();

router.use('/:PropertyId/reviews', reviewRouter);
router.use('/:PropertyId/interest', interestRouter);
router.use('/:PropertyId/selling', sellingRoutes);

// Routes
router.route('/')
.get(propertyController.getProperties)
.post(authController.protect,
    authController.restrictTo('admin', 'employee','seller','agent'),propertyController.permit,
    propertyController.createProperty);

router.route('/property-stats')
.get(authController.protect,
    authController.restrictTo('admin', 'employee'),
    propertyController.getPropertyStats);

router.route('/:id')
.get(propertyController.getProperty)
.patch(authController.protect,
    authController.restrictTo('admin', 'employee','seller','agent'),propertyController.permit,
    propertyController.propertyImage , 
    propertyController.updateProperty)
.delete(authController.protect,
    authController.restrictTo('admin', 'employee','seller','agent'),propertyController.permit,
    propertyController.deleteProperty)
.put(authController.protect,
    authController.restrictTo('admin', 'employee'),
    propertyController.verifyProperty);

/* router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'employee'),
    propertyController.getMonthlyPlan
  ); */

module.exports = router; 