const router = require('express').Router();
const faker = require('faker');
const Product = require('../models/product');
const Review = require('../models/review');

router.get('/generate-fake-data', (req, res, next) => {
	for (let i = 0; i < 90; i++) {
		let product = new Product();

		product.category = faker.commerce.department();
		product.name = faker.commerce.productName();
		product.price = faker.commerce.price();
		product.image = 'https://via.placeholder.com/250?text=Product+Image';

		product.save();
	}
	res.end();
});

router.get('/products', async (req, res) => {
	const itemsPerPage = 9;
	const page = parseInt(req.query.page) || 1;
	const category = req.query.category;
	const priceSort = req.query.price;
	const searchParam = req.query.query;

	let query = {};

	if (category) {
		query.category = category;
	}

	if (searchParam) {
		query.$or = [
			{ name: { $regex: new RegExp(searchParam, 'i') } }, // Case-insensitive search in names
			{ category: { $regex: new RegExp(searchParam, 'i') } }, // Case-insensitive search in categories
		];
	}

	let sortCriteria = {};

	if (priceSort === 'highest') {
		sortCriteria = { price: -1 };
	} else if (priceSort === 'lowest') {
		sortCriteria = { price: 1 };
	}

	try {
		const totalCount = await Product.countDocuments(query);
		if (totalCount === 0) {
			return res.status(404).send('No products found');
		}
		const products = await Product.find(query)
			.sort(sortCriteria)
			.skip((page - 1) * itemsPerPage)
			.limit(itemsPerPage);

		const totalPages = Math.ceil(totalCount / itemsPerPage);

		res.status(200).json({
			products,
			totalPages,
			currentPage: page,
			totalCount,
		});
	} catch (err) {
		res.status(500).send('Server Error');
	}
});

router.get('/products/:product', (req, res) => {
	Product.findById(req.params.product)
		.then((product) => {
			if (!product) {
				return res.status(404).send('Product not found');
			}

			res.status(200).send(product);
		})
		.catch((err) => {
			if (err.name === 'CastError') {
				return res.status(404).send('Product not found');
			}
			res.status(500).send('Server Error');
		});
});

router.get('/products/:product/reviews', async (req, res) => {
	const productId = req.params.product;
	const page = parseInt(req.query.page) || 1;
	const reviewsPerPage = 4;
	const skip = (page - 1) * reviewsPerPage;

	try {
		const product = await Product.findById(productId).populate({
			path: 'reviews',
			options: {
				skip: skip,
				limit: reviewsPerPage,
			},
		});

		if (!product) {
			return res.status(404).send('Product not found');
		}
		const totalReviews = await Review.countDocuments({
			product: productId,
		});

		res.status(200).json({
			reviews: product.reviews,
			currentPage: page,
			totalPages: Math.ceil(totalReviews / reviewsPerPage),
		});
	} catch (err) {
		if (err.name === 'CastError') {
			return res.status(404).send('Product not found');
		}
		res.status(500).send('Server Error');
	}
});

router.post('/products', async (req, res) => {
	const { category, name, price, image } = req.body;

	if (!category || !name || !price || !image) {
		return res.status(400).send('All fields are required');
	}

	try {
		const newProduct = new Product({
			category,
			name,
			price,
			image,
		});

		const savedProduct = await newProduct.save();

		res.status(200).send(savedProduct);
	} catch (err) {
		res.status(500).send('Server Error');
	}
});

router.post('/products/:product/reviews', async (req, res) => {
	const productId = req.params.product;
	const { username, text } = req.body;

	if (!username || !text) {
		return res.status(400).send('Username and text are required');
	}

	try {
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).send('Product not found');
		}

		const review = new Review({
			username,
			text,
			product: productId,
		});

		const savedReview = await review.save();

		product.reviews.push(savedReview._id);
		await product.save();

		res.status(200).send(savedReview);
	} catch (err) {
		if (err.name === 'CastError') {
			return res.status(404).send('Product not found');
		}
		res.status(500).send('Server Error');
	}
});

router.delete('/products/:product', async (req, res) => {
	const productId = req.params.product;

	try {
		const deletedProduct = await Product.findByIdAndDelete(productId);

		if (!deletedProduct) {
			return res.status(404).send('Product not found');
		}

		res.status(200).send('Product deleted successfully');
	} catch (err) {
		if (err.name === 'CastError') {
			return res.status(404).send('Product not found');
		}
		res.status(500).send('Server error');
	}
});

router.delete('/reviews/:review', async (req, res) => {
	const reviewId = req.params.review;

	try {
		const deletedReview = await Review.findByIdAndDelete(reviewId);

		if (deletedReview) {
			return res.status(404).send('Review not found');
		}

		res.status(200).send('Review deleted successfully');
	} catch (err) {
		if (err.name === 'CastError') {
			return res.status(404).send('Review not found');
		}
		res.status(500).send('Server error');
	}
});

module.exports = router;
