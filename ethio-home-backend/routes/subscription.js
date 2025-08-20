const express = require('express');
const authController = require('../controllers/authController');
const subscriptionController=require('../controllers/subscriptionController');

const router = express.Router({mergeParams: true});

router.use(authController.protect);

router.route('/create-plan').post( authController.restrictTo('buyer', 'seller', 'agent') , subscriptionController.createSubscriptionPlan);
router.route('/plans')
.get(authController.restrictTo('admin','seller', 'agent') , subscriptionController.getSubscriptionPlans);
router.route('/plans/:planId')
.patch(authController.restrictTo('admin','seller', 'agent'), subscriptionController.updateSubscriptionPlan)
.delete(authController.restrictTo('admin'), subscriptionController.deleteSubscriptionPlan)
.put(authController.restrictTo('admin'), subscriptionController.updateSubscriptionstatus);
router.route('/verify-payment/:tx_ref').get(subscriptionController.verifyPayment);
router.route('/verify-subscription-webhook').post(subscriptionController.verifySubscriptionWebhook);

module.exports=router;