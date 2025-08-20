const CatchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Property=require('../models/propertyModel');
const Selling = require('../models/sellingModel');
const User= require('../models/userModel');

exports.deleteOne = Model =>
  CatchAsync(async (req, res, next) => {
    const model = await Model.findById(req.params.id);
   // console.log( property.owner._id.toString() !== req.user._id.toString() );
   
    if (!model) {
      throw new AppError(`${Model.modelName} not found`,404);
    }

    if(Model.modelName == 'Property'){
   // Check ownership
    if ((req.user.role == 'seller' || req.user.role == 'agent') && model.owner._id.toString() !== req.user._id.toString() ) {
      throw new AppError('you are not allowed to this',403);
    }
  }

 const doc = await Model.findByIdAndDelete(req.params.id);
  if (!doc) {
      return next(new AppError(`No ${Model.modelName} found with that ID`, 404));
    }

    res.status(204).json({
      status: 'success',
      message: `${Model} deleted successfully`
    });
  });

exports.updateOne = Model =>
  CatchAsync(async (req, res, next) => {
  if(req.files) req.body.images=req.files.map(el=>el.filename);
  if(req.file) req.body.images=req.files.filename;
  //console.log(req.body.password);
  const model = await Model.findById(req.params.id);
    //console.log( property.owner._id.toString() !== req.user._id.toString() );
    if (!model) {
      throw new AppError(`${Model.modelName} not found`,404);
    }

  if(Model.modelName == 'Property'){
    // Check ownership
    if ((req.user.role == 'seller' || req.user.role == 'agent') && model.owner._id.toString() !== req.user._id.toString() ) {
      throw new AppError('you are not allowed to this',403);
    }
  }
  
  //console.log(Model.modelName == 'Property');
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!doc) {
    return next(new AppError(`No ${Model.modelName} found with that ID`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.createOne = Model =>
  CatchAsync(async (req, res, next) => {
    if(req.files) req.body.images=req.files.map(el=>el.filename);
    if(req.file) req.body.images=req.files.filename;
    if(req.body.isVerified){req.body.isVerified=false;};//if the seller and agent try to create isVerified is to true
    if(req.query.propertyId & req.query.userId & req.query.price){
      req.body.property=propertyId;
      req.body.user=userId;
      req.body.price=price;
    }
    if(Model.modelName=='Selling'){
      const property=await Property.findById( req.body.property);
      if(!property){
        throw new AppError('property not found. ',404);
      }
      console.log(property.sold);
      if(property.sold){
        throw new AppError('this property is already sold. ',404);
      }
      property.sold=true;
      await property.save(/* {validateBeforeSave: false} */);
    }
    if(Model.modelName=='Review'){
      console.log(req.user._id);
      req.body.buyer=req.user._id;
    }

    if(Model.modelName == 'Property') {
      // Check if the seller or agent have in database in time of creating a property by admin and employee
      if (req.user.role == 'admin' || req.user.role == 'employee') {
        console.log(req.body.owner);
        const user = await User.findById(req.body.owner);
        //console.log(user);
        // If the user is not found, throw an error
        if (!user) {
          return next(new AppError('user not found', 404));
        }
      }
      // If the user is a seller or agent, set the owner to the user's ID
      if (req.user.role == 'seller' || req.user.role == 'agent') {
        req.body.owner = req.user._id;
      }
    }

    const doc = await Model.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, Options) =>
  CatchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (Options) query = query.populate(Options);
    let doc = await query;

    if (!doc) {
      return next(new AppError(`No ${Model.modelName} found with that ID`, 404));
    }

    if(Model.modelName ==='Property'){    
      doc={
        ...doc.toObject(),
        imagesUrl: doc.images.map(file=>`http://localhost:5000/img/properties/${file}`)
      }
    }
    if(Model.modelName ==='User'){  
      doc={
        ...doc.toObject(),
        imagesUrl: `http://localhost:5000/img/users/${doc.images}`
      }
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  CatchAsync(async (req, res,next) => {
    // To allow for nested for reviews route
    let filter = {};
    if (`req.params.${Model}Id`) filter = { Model: `req.params.${Model}Id` };
  
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    if(Model.modelName ==='Property'){
      query=Model.find({ sold: false  });
      query = query.find(queryObj);
    }else{
      query = Model.find(queryObj);
    }
  
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      //console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
  
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
  
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;
    if(page>=1){
      query = query.skip(skip).limit(limit);  
    }else{
      throw new AppError('page number must be greater than 0',404);
    }
  
    const total = await Model.countDocuments();
    if(req.query.page){
      if(skip>=total) throw new AppError('the page is does not exist.',404);
    }
  
    let doc = await query;

 if(Model.modelName ==='Property'){
      doc=doc.map(el=>({
        ...el.toObject(),
        imagesUrl: el.images.map(file=>`http://localhost:5000/img/properties/${file}`)
      }))
    }

    if(Model.modelName ==='User'){
      doc=doc.map(el=>({
        ...el.toObject(),
        imagesUrl: `http://localhost:5000/img/users/${el.images}`
      }))
    }

    res.status(200).json({
      status: 'success',
      results: doc.length,
      pageNumber: Number(page),
      pages: Math.ceil(total / limit),
      data: {
        data: doc
      }
    });
  });
