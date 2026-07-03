const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  courseId: { type: String, required: true },
  courseTitle: { type: String, default: "" },
  status: { type: String, default: "pending" },
  date: { type: String, default: "" },
  school: { type: String, default: "" },
  grade: { type: String, default: "" }
}, {
  timestamps: true,
  strict: false // Allow dynamic fields if they exist in db.json
});

module.exports = mongoose.model('Application', applicationSchema);
