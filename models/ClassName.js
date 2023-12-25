const mongoose = require('mongoose');

const classNameSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    unique: true,
  },
  madrasa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Madrasa',
    required: true,
  },
});

const ClassName = mongoose.model('ClassName', classNameSchema);

module.exports = ClassName;
