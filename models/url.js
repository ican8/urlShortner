const mongoose = require('mongoose')

const UrlSchema = new mongoose.Schema({
  original: {
    type: String,
    required: true
  },
  shortened: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  }
})

module.exports = mongoose.model('URL', UrlSchema)