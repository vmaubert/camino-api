const mongoose = require('mongoose')

const substanceSchema = new mongoose.Schema({
  _id: {
    type: String,
    lowercase: true,
    required: true,
    alias: 'id'
  },
  nom: {
    type: String,
    lowercase: true,
    required: true
  },
  domaine: {
    type: String,
    lowercase: true,
    required: true
  },
  type: {
    type: String,
    lowercase: true,
    required: true
  },
  usage: {
    type: String,
    lowercase: true,
    required: true
  },
  symbole: String,
  alias: [String],
  gerep: Number,
  description: String,
  legal: {
    type: String,
    required: true,
    ref: 'SubstanceLegal'
  }
})

module.exports = mongoose.model('Substance', substanceSchema)