const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');
const Selling=require('../models/sellingModel');
const AppError=require('../utils/appError');
const catchAsync = require('./../utils/catchAsync');


const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/')
  .get(reviewController.getAllReviews)

router.use(catchAsync(async (req,res,next)=>{
  const selling=await Selling.find({buyer: req.user._id})
  //console.log(req.user._id, selling);
  if(!selling){
   throw new AppError('You are not allowed to submit a review before purchasing a property.',403);
  }
  next();
}));

router.route('/')
  .post(authController.restrictTo('buyer'),
        reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('buyer', 'admin'),
    reviewController.updateReview)
  .delete(
    authController.restrictTo('buyer', 'admin'),
    reviewController.deleteReview);

module.exports = router;
