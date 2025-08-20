const Review = require('./../models/reviewModel');
const general = require('./generalControler');

exports.getAllReviews = general.getAll(Review);
exports.getReview = general.getOne(Review);
exports.createReview = general.createOne(Review);
exports.updateReview = general.updateOne(Review);
exports.deleteReview = general.deleteOne(Review);
