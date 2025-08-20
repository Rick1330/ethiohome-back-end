const multer = require('multer');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const general = require('./generalControler');
const Email=require('../utils/email')
// Use local storage
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/img/users');
    },
    filename: function (req, file, cb) {
      const ex=file.mimetype.split('/')[1];
      const fileName = `${req.user._id}-${Date.now()}.${ex}`;
      cb(null, fileName);
    }
  });

  // Configure multer
upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new AppErrorError('Invalid file type. Only images and videos are allowed.',400),false);
    }
  },
  limits: {
    fileSize: 2 * 1024 *1024
  }
});

exports.userPhoto=upload.single('photo');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next( new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
  }

  const object = {};
  const allowedFields=['name', 'email'];
  Object.keys(req.body).forEach(el => {
    if (allowedFields.includes(el)) object[el] = req.body[el];
  });

  if (req.file) object.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, object, {
    new: true,
    runValidators: true
  });
  await new Email(updatedUser).accountUpdate();
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser =catchAsync(async (req, res) => {
  console.log(req.body);
  newUser= await User.create(req.body);

  res.status(201).json({
    status: 'success',
    newUser 
  });
});

exports.getUser = general.getOne(User);
exports.getUsers = general.getAll(User);
exports.updateUser = general.updateOne(User);
exports.deleteUser = general.deleteOne(User);

