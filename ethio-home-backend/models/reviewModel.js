// review / rating / createdAt / ref to property / ref to user
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
      maxlength: [1000, 'review given to our service must have less than or equal to 1000 characters'],
      minlength: [10, 'review given to our service must have more than or equal to 10 characters']
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must given by buyer']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


reviewSchema.pre(/^find/, function(next) {
   this.populate({
     path: 'buyer',
     select: 'name photo'
   });
  next();
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
