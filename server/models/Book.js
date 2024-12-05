const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  coverUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['reading', 'completed', 'want-to-read'],
    default: 'want-to-read',
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);