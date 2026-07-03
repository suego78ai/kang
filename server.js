require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const AdmZip = require('adm-zip');
const mongoose = require('mongoose');

const Application = require('./models/Application');
const Course = require('./models/Course');
const Instructor = require('./models/Instructor');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI && !MONGO_URI.includes('<db_password>')) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB 연결 성공!'))
    .catch(err => console.error('MongoDB 연결 에러:', err));
} else {
  console.warn('경고: MONGO_URI가 설정되지 않아 MongoDB 연결을 스킵합니다.');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Ensure uploads folder exists and expose it statically
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Multer Storage Setup for Instructor Documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const instructorName = req.body.instructorName || 'unknown_instructor';
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // Naming folder: '강사이름-제출날짜'
    const folderName = `${instructorName.trim()}-${dateStr}`;
    const uploadPath = path.join(UPLOADS_DIR, folderName);
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    // Standardize file naming inside the folder
    cb(null, `${file.fieldname}_${base}${ext}`);
  }
});

const upload = multer({ storage }).fields([
  { name: 'docFile1', maxCount: 1 },
  { name: 'docFile2', maxCount: 1 },
  { name: 'docFile3', maxCount: 1 },
  { name: 'docFile4', maxCount: 1 },
  { name: 'docFile5', maxCount: 1 }
]);

// Admin Credentials & Auth Config
const ADMIN_ID = 'dsadmin';
const ADMIN_PW = 'ds2026!';
const ADMIN_TOKEN = 'dsadmin-session-token-2026';

// Auth Middleware
function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '인증 토큰이 누락되었습니다.' });
  }
  const token = authHeader.substring(7);
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: '유효하지 않은 관리자 인증 토큰입니다.' });
  }
  next();
}

// API Endpoints

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '실시간 데이터베이스 서버가 정상 구동 중입니다.' });
});

app.post('/api/admin/login', (req, res) => {
  const { id, password } = req.body;
  if (id === ADMIN_ID && password === ADMIN_PW) {
    return res.json({ success: true, token: ADMIN_TOKEN });
  }
  res.status(401).json({ success: false, error: 'ID 또는 비밀번호가 올바르지 않습니다.' });
});

app.get('/api/applications', async (req, res) => {
  try {
    const { studentName, guardianPhone } = req.query;
    if (studentName && guardianPhone) {
      const cleanPhone = guardianPhone.trim();
      const cleanName = studentName.trim();
      const matched = await Application.find({ studentName: cleanName, guardianPhone: cleanPhone }).sort({ createdAt: -1 });
      return res.json(matched);
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.substring(7) !== ADMIN_TOKEN) {
      return res.status(401).json({ error: '권한이 없습니다. 관리자 로그인이 필요합니다.' });
    }
    const apps = await Application.find({}).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) { res.status(500).json({ error: 'DB 조회 에러' }); }
});

app.get('/api/applications/:id', async (req, res) => {
  try {
    const found = await Application.findOne({ id: req.params.id });
    if (!found) return res.status(404).json({ error: '해당 신청 내역을 찾을 수 없습니다.' });
    res.json(found);
  } catch (err) { res.status(500).json({ error: 'DB 조회 에러' }); }
});

app.post('/api/applications', async (req, res) => {
  try {
    const application = req.body;
    if (!application.studentName || !application.guardianPhone || !application.courseId) {
      return res.status(400).json({ error: '필수 입력 항목 누락' });
    }
    const appId = application.id || `DS-${Math.floor(100000 + Math.random() * 900000)}`;
    const newApp = new Application({
      ...application,
      id: appId,
      status: application.status || 'pending',
      date: application.date || new Date().toLocaleDateString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
      })
    });
    await newApp.save();
    res.status(201).json(newApp);
  } catch (err) { res.status(500).json({ error: '저장 실패' }); }
});

app.patch('/api/applications/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: '올바르지 않은 상태 값' });
    }
    const updated = await Application.findOneAndUpdate({ id: req.params.id }, { status }, { new: true });
    if (!updated) return res.status(404).json({ error: '찾을 수 없음' });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: '업데이트 실패' }); }
});

app.delete('/api/applications/:id', async (req, res) => {
  try {
    const deleted = await Application.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: '찾을 수 없음' });
    res.json({ message: '취소 성공', id: req.params.id });
  } catch (err) { res.status(500).json({ error: '삭제 실패' }); }
});

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (err) { res.status(500).json({ error: 'DB 조회 에러' }); }
});

app.post('/api/courses', adminAuth, async (req, res) => {
  try {
    const { courses } = req.body;
    if (!courses || !Array.isArray(courses)) return res.status(400).json({ error: '형식 에러' });
    await Course.deleteMany({});
    if (courses.length > 0) await Course.insertMany(courses);
    res.json({ success: true, message: '등록 성공' });
  } catch (err) { res.status(500).json({ error: '저장 실패' }); }
});

app.post('/api/courses/reset', adminAuth, async (req, res) => {
  try {
    await Course.deleteMany({});
    res.json({ success: true, message: '초기화 성공' });
  } catch (err) { res.status(500).json({ error: '초기화 실패' }); }
});

app.get('/api/instructor-docs', async (req, res) => {
  try {
    const docs = await Instructor.find({}).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) { res.status(500).json({ error: 'DB 조회 에러' }); }
});

app.post('/api/instructor-docs', adminAuth, async (req, res) => {
  try {
    const { docs } = req.body;
    if (!docs || !Array.isArray(docs)) return res.status(400).json({ error: '형식 에러' });
    await Instructor.deleteMany({});
    if (docs.length > 0) await Instructor.insertMany(docs);
    res.json({ success: true, message: '저장 성공' });
  } catch (err) { res.status(500).json({ error: '저장 실패' }); }
});

app.post('/api/instructor-docs/reset', adminAuth, async (req, res) => {
  try {
    await Instructor.deleteMany({});
    res.json({ success: true, message: '초기화 성공', docs: [] });
  } catch (err) { res.status(500).json({ error: '초기화 실패' }); }
});

app.post('/api/instructor-docs/upload', (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: '업로드 에러' });
    try {
      const { instructorName, email, className, phone, status, role } = req.body;
      if (!instructorName || !className || !phone) return res.status(400).json({ error: '필수 정보 누락' });
      
      const d = new Date();
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const folderPath = `/uploads/${instructorName.trim()}-${dateStr}`;
      
      let instructor = await Instructor.findOne({ name: instructorName, phone, className });
      if (!instructor) {
        instructor = new Instructor({
          id: `inst-${Date.now()}`,
          className, name: instructorName, email: email || '', phone, folder: folderPath,
          first_submission_date: dateStr.replace(/-/g, ''),
          last_submission_datetime: d.toLocaleString('ko-KR'),
          status: status || '일반', role: role || '주강사',
          files: {}
        });
      } else {
        if (email) instructor.email = email;
        instructor.folder = folderPath;
        if (status) instructor.status = status;
        if (role) instructor.role = role;
        instructor.last_submission_datetime = d.toLocaleString('ko-KR');
        if (!instructor.first_submission_date) instructor.first_submission_date = dateStr.replace(/-/g, '');
      }
      
      const currentFiles = instructor.files || {};
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach(file => {
          const field = file.fieldname;
          if (field.startsWith('doc9_')) {
            currentFiles['9'] = currentFiles['9'] || [];
            currentFiles['9'].push(file.filename);
          } else if (field.startsWith('doc10_')) {
            currentFiles['10'] = currentFiles['10'] || [];
            currentFiles['10'].push(file.filename);
          } else if (/^doc\d+$/.test(field)) {
            const num = field.replace('doc', '');
            currentFiles[num] = currentFiles[num] || [];
            currentFiles[num].push(file.filename);
          } else {
            currentFiles[field] = currentFiles[field] || [];
            currentFiles[field].push(file.filename);
          }
        });
      }
      instructor.files = currentFiles;
      instructor.markModified('files');
      await instructor.save();
      res.status(200).json({ success: true, message: '업로드 성공', record: instructor });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'DB 에러' });
    }
  });
});

app.get('/api/instructor-docs/download-zip/:id', async (req, res) => {
  try {
    const record = await Instructor.findOne({ id: req.params.id });
    if (!record) return res.status(404).json({ error: '찾을 수 없음' });
    if (!record.folder || record.folder.startsWith('http')) return res.status(400).json({ error: '로컬 서류만 다운로드 가능' });
    
    const folderName = path.basename(record.folder);
    const targetDir = path.join(UPLOADS_DIR, folderName);
    if (!fs.existsSync(targetDir)) return res.status(404).json({ error: '폴더 없음' });
    
    const zip = new AdmZip();
    const type = req.query.type;
    let addedCount = 0;
    
    const validFiles = record.files || {};
    let allowedKeys = [];
    if (type === 'admin') allowedKeys = ['1', '2'];
    else if (type === 'process') allowedKeys = ['3', '4', '5'];
    else allowedKeys = Object.keys(validFiles);
    
    allowedKeys.forEach(key => {
      const arr = validFiles[key];
      if (Array.isArray(arr)) {
        arr.forEach(filename => {
          const fp = path.join(targetDir, filename);
          if (fs.existsSync(fp)) { zip.addLocalFile(fp); addedCount++; }
        });
      }
    });
    
    if (addedCount === 0) return res.status(400).json({ error: '파일 없음' });
    const zipSuffix = type === 'admin' ? '행정서류' : (type === 'process' ? '진행서류' : '전체서류');
    const zipName = `${record.name}_${zipSuffix}.zip`;
    const data = zip.toBuffer();
    
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', `attachment; filename="${encodeURIComponent(zipName)}"`);
    res.set('Content-Length', data.length);
    res.send(data);
  } catch (err) { res.status(500).json({ error: 'ZIP 에러' }); }
});

app.get('/api/public/programs', async (req, res) => {
  try {
    const docs = await Instructor.find({});
    const programs = new Set();
    docs.forEach(d => { if (d.className) programs.add(d.className); });
    res.json({ success: true, data: Array.from(programs) });
  } catch (err) { res.status(500).json({ error: 'DB 조회 에러' }); }
});

app.post('/api/instructor/auth', async (req, res) => {
  try {
    const { className, name, phone } = req.body;
    const inst = await Instructor.findOne({ className, name, phone });
    if (inst) res.json({ success: true, data: inst });
    else res.status(404).json({ error: '명단 없음' });
  } catch (err) { res.status(500).json({ error: 'DB 조회 에러' }); }
});

app.get('/api/admin/instructors', adminAuth, async (req, res) => {
  try {
    const docs = await Instructor.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: docs });
  } catch (err) { res.status(500).json({ error: 'DB 에러' }); }
});

app.post('/api/admin/instructors/bulk-add', adminAuth, async (req, res) => {
  try {
    const newDoc = req.body;
    if (!newDoc || !newDoc.id) return res.status(400).json({ error: '유효하지 않은 데이터' });
    // const exists = await Instructor.findOne({ 
    //   name: newDoc.name, 
    //   phone: newDoc.phone, 
    //   className: newDoc.className,
    //   school: newDoc.school 
    // });
    // if (exists) return res.status(409).json({ error: '이미 존재함' });
    const instructor = new Instructor(newDoc);
    await instructor.save();
    res.status(201).json({ success: true, data: instructor });
  } catch (err) { res.status(500).json({ error: '저장 에러' }); }
});

app.patch('/api/admin/instructors/:id', adminAuth, async (req, res) => {
  try {
    const updated = await Instructor.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: '찾을 수 없음' });
    res.json({ success: true, data: updated });
  } catch (err) { res.status(500).json({ error: '업데이트 에러' }); }
});

app.post('/api/admin/instructors/reset', adminAuth, async (req, res) => {
  try {
    await Instructor.deleteMany({});
    res.json({ success: true, message: '데이터 초기화됨' });
  } catch (err) { res.status(500).json({ error: '초기화 에러' }); }
});

app.listen(PORT, () => {
  console.log('===================================================');
  console.log(' 디지털새싹 백엔드 구동 완료 (MongoDB 연동)');
  console.log(` 포트 번호: http://localhost:${PORT}`);
  console.log('===================================================');
});
