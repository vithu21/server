const express = require('express');
const { auth } = require('../middleware/auth.js');
const Review = require('../models/Review.js');

const router = express.Router();

// Get all reviews for a book
router.get('/book/:bookId', async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'username avatar')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a review
router.post('/', auth, async (req, res) => {
  try {
    const review = new Review({
      ...req.body,
      user: req.userId,
    });
    await review.save();
    
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username avatar');
    
    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Error creating review: ',error)
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a review
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    ).populate('user', 'username avatar');
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;