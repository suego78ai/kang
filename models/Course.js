const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  schedule: { type: String, default: "" },
  target: { type: String, default: "" },
  capacity: { type: Number, default: 0 },
  currentApplicants: { type: Number, default: 0 },
  instructor: { type: String, default: "" }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
