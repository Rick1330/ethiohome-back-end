
const multer = require('multer');
const Property = require('../models/propertyModel');
const User = require('../models/userModel');
const AppError=require('../utils/appError');
const CatchAsync=require('../utils/catchAsync');
const generalControler=require('./generalControler');
const SubscriptionController = require('../models/SubscriptionPlanModel');

// Use local storage
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/img/properties');
    },
    filename: function (req, file, cb) {
      const ex=file.mimetype.split('/')[1];
      const fileName = `${req.params.id}-${req.user._id}-${Date.now()}.${ex}`;
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
    fileSize: 5 * 1024 *1024
  }
});

exports.propertyImage=upload.array('images',6);

exports.verifyProperty = CatchAsync(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new AppError('Property not found',404);
  }

  property.isVerified = true;
  property.verificationDate = Date.now();
  property.verifiedBy = req.user._id;

  const verifiedProperty= await property.save();
  res.status(200).json({
    status: 'success',
    data:{
      data:verifiedProperty
    }
  });
});

exports.getPropertyStats = CatchAsync(async (req, res, next) => {
  const statsOfVerified = await Property.aggregate([
    {
      $match: { isVerified: true }
    },
    {
      $group: {
        _id: { $toUpper: '$location' },
        numProperty: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  const statsOfUnverified = await Property.aggregate([
    {
      $match: { isVerified: false }
    },
    {
      $group: {
        _id: { $toUpper: '$location' },
        numProperty: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      statsOfVerified,
      statsOfUnverified
    }
  });
});

exports.permit= CatchAsync(async (req, res, next) => {
  
  if(req.user.role == 'seller' || req.user.role == 'agent') {
     const subscriptionController = await SubscriptionController.find({ seller: req.user._id , active: true });
     console.log("subscriptionController",subscriptionController);
    if (!subscriptionController.length) {
    return next(new AppError('No active subscription found. please subscribe to a plan before creating a property', 403));
  }
}
next();
});

exports.getProperties = generalControler.getAll(Property);
exports.getProperty = generalControler.getOne(Property);
exports.deleteProperty = generalControler.deleteOne(Property);
exports.createProperty = generalControler.createOne(Property);
exports.updateProperty = generalControler.updateOne(Property);

