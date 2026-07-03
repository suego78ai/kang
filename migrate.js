require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Instructor = require('./models/Instructor');
const Course = require('./models/Course');
const Application = require('./models/Application');

const DB_FILE = path.join(__dirname, 'db.json');
const COURSES_FILE = path.join(__dirname, 'courses.json');
const INSTRUCTOR_DOCS_FILE = path.join(__dirname, 'instructor_docs.json');

async function migrate() {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes('<db_password>')) {
    console.error("오류: .env 파일의 MONGO_URI에 실제 비밀번호를 입력해주세요.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB 연결 성공!");

    // 1. Migrate Instructors
    if (fs.existsSync(INSTRUCTOR_DOCS_FILE)) {
      const data = JSON.parse(fs.readFileSync(INSTRUCTOR_DOCS_FILE, 'utf8') || '[]');
      if (data.length > 0) {
        await Instructor.deleteMany({});
        await Instructor.insertMany(data);
        console.log(`강사 서류 데이터 ${data.length}건 마이그레이션 완료.`);
      }
    }

    // 2. Migrate Courses
    if (fs.existsSync(COURSES_FILE)) {
      const data = JSON.parse(fs.readFileSync(COURSES_FILE, 'utf8') || '[]');
      if (data.length > 0) {
        await Course.deleteMany({});
        await Course.insertMany(data);
        console.log(`교육과정 데이터 ${data.length}건 마이그레이션 완료.`);
      }
    }

    // 3. Migrate Applications
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8') || '[]');
      if (data.length > 0) {
        await Application.deleteMany({});
        await Application.insertMany(data);
        console.log(`수강신청 데이터 ${data.length}건 마이그레이션 완료.`);
      }
    }

    console.log("모든 데이터 마이그레이션이 성공적으로 완료되었습니다!");
    process.exit(0);
  } catch (err) {
    console.error("마이그레이션 중 오류 발생:", err);
    process.exit(1);
  }
}

migrate();
