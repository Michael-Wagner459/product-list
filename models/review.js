const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
	userName: String,
	text: String,
	product: { type: Schema.Types.ObjectId, ref: 'Product' },
});

const Review = mongoose.model('Review', reviewSchema);

const review = new Review({
	userName: 'Test User',
	text: 'Test Review Text',
	product: '66917821a673574ec36a3a1d',
});

// review.save();

module.exports = Review;
