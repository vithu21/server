const express = require('express');
const {auth} = require('../middleware/auth.js');
const Book = require('../models/Book.js');

const router = express.Router();

// Get all books for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find({ user: req.userId });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new book
router.post('/', auth, async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
      user: req.userId,
    });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Error saving book:', error); // Add this line
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a book
router.put('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    console.error('Error saving book: ',error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a book
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;