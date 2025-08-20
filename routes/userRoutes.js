const express = require('express');
const rateLimit = require('express-rate-limit');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 10 ,
  message:"Too many login trial. please try again later after few minutes!"
});
router.use('/login',limiter);

router.post('/signup', authController.signup);
router.patch('/send/:userId', authController.sendAgain);
router.patch('/verifyEmail/:userId', authController.verifyEmail);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe',userController.userPhoto,userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router
  .route('/')
  .get(authController.restrictTo('admin','employee'),userController.getUsers)
  .post(authController.restrictTo('admin'),userController.createUser);

router
  .route('/:id')
  .get(authController.restrictTo('admin','employee'),userController.getUser)
  .patch(authController.restrictTo('admin','employee'),userController.updateUser)
  .delete(authController.restrictTo('admin'),userController.deleteUser);

module.exports = router;
