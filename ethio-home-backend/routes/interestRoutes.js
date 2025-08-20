const express=require('express');
const interestController = require('../controllers/interestController');
const authController=require('../controllers/authController');

const router = express.Router({mergeParams: true});

router.use(authController.protect);
// Routes for buyer
router.route('/buyer')
.get(interestController.getInterests)
.post(interestController.submitInterest)

router.route('/buyer/:id')
.get(interestController.getInterest)
.patch(interestController.updateInterest)
.delete(interestController.deleteInterest);

router.route('/:owner')
.get(authController.restrictTo('admin','seller','employee'),
interestController.getSellerInterests);

//Routes for Admin
router.use(authController.restrictTo('admin','employee'));
router.route('/').get(interestController.getPropertyInterests)
router.patch('/status/:id',interestController.updateInterestStatus);

module.exports = router; 