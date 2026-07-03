const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  school: { type: String, default: "" },
  region: { type: String, default: "" },
  className: { type: String, required: true },
  status: { type: String, default: "일반" },
  role: { type: String, default: "주강사" },
  first_submission_date: { type: String, default: null },
  files: { type: mongoose.Schema.Types.Mixed, default: {} },
  folder: { type: String, default: "" },
  last_submission_datetime: { type: String, default: "" },
  isSaved: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Instructor', instructorSchema);
