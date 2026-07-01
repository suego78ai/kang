const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const AdmZip = require("adm-zip");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, "db.json");
const COURSES_FILE = path.join(__dirname, "courses.json");
const INSTRUCTOR_DOCS_FILE = path.join(__dirname, "instructor_docs.json");

// Default Demo Instructor Documents
const DEFAULT_INSTRUCTOR_DOCS = [
  { id: 1, class: "AI 기초 엔트리 코딩 A반", name: "홍길동", email: "gildong.hong@gmail.com", phone: "010-1111-2222", folder: "https://drive.google.com/drive/folders/demo_hong", doc1: "완료", doc2: "완료", doc3: "검토중", doc4: "미제출", doc5: "미제출", status: "검토중" },
  { id: 2, class: "파이썬 데이터 분석 B반", name: "성춘향", email: "chunhyang.seong@gmail.com", phone: "010-3333-4444", folder: "https://drive.google.com/drive/folders/demo_seong", doc1: "완료", doc2: "완료", doc3: "완료", doc4: "완료", doc5: "완료", status: "제출 완료" },
  { id: 3, class: "아두이노 피지컬 IoT C반", name: "이순신", email: "soonshin.lee@gmail.com", phone: "010-5555-6666", folder: "https://drive.google.com/drive/folders/demo_lee", doc1: "완료", doc2: "검토중", doc3: "완료", doc4: "미제출", doc5: "완료", status: "검토중" },
  { id: 4, class: "메타버스 제페토 빌더 D반", name: "임꺽정", email: "kkukjung.lim@gmail.com", phone: "010-7777-8888", folder: "", doc1: "미제출", doc2: "미제출", doc3: "미제출", doc4: "미제출", doc5: "미제출", status: "검토중" }
];

// Helper: Read Instructor Docs DB
function readInstructorDocsDb() {
  try {
    if (!fs.existsSync(INSTRUCTOR_DOCS_FILE)) {
      fs.writeFileSync(INSTRUCTOR_DOCS_FILE, JSON.stringify(DEFAULT_INSTRUCTOR_DOCS, null, 2), "utf8");
      return DEFAULT_INSTRUCTOR_DOCS;
    }
    const data = fs.readFileSync(INSTRUCTOR_DOCS_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("강사 서류 데이터베이스 파일 읽기 에러:", err);
    return [];
  }
}

// Helper: Write Instructor Docs DB
function writeInstructorDocsDb(data) {
  try {
    fs.writeFileSync(INSTRUCTOR_DOCS_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("강사 서류 데이터베이스 파일 쓰기 에러:", err);
    return false;
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Ensure uploads folder exists and expose it statically
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use("/uploads", express.static(UPLOADS_DIR));

// Multer Storage Setup for Instructor Documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const instructorName = req.body.instructorName || "unknown_instructor";
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // Naming folder: "강사이름-제출날짜"
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

// Helper: Read Courses DB
function readCoursesDb() {
  try {
    if (!fs.existsSync(COURSES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(COURSES_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("교육과정 데이터베이스 파일 읽기 에러:", err);
    return [];
  }
}

// Helper: Write Courses DB
function writeCoursesDb(data) {
  try {
    fs.writeFileSync(COURSES_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("교육과정 데이터베이스 파일 쓰기 에러:", err);
    return false;
  }
}

// Helper: Read DB
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), "utf8");
      return [];
    }
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("데이터베이스 파일 읽기 에러:", err);
    return [];
  }
}

// Helper: Write DB
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("데이터베이스 파일 쓰기 에러:", err);
    return false;
  }
}

// Admin Credentials & Auth Config
const ADMIN_ID = "dsadmin";
const ADMIN_PW = "ds2026!";
const ADMIN_TOKEN = "dsadmin-session-token-2026";

// Auth Middleware
function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "인증 토큰이 누락되었습니다." });
  }
  const token = authHeader.substring(7); // Remove "Bearer "
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "유효하지 않은 관리자 인증 토큰입니다." });
  }
  next();
}

// API Endpoints

// 1. Health Check & Mode Verification
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "실시간 데이터베이스 서버가 정상 구동 중입니다." });
});

// Admin Login Endpoint
app.post("/api/admin/login", (req, res) => {
  const { id, password } = req.body;
  if (id === ADMIN_ID && password === ADMIN_PW) {
    return res.json({ success: true, token: ADMIN_TOKEN });
  }
  res.status(401).json({ success: false, error: "ID 또는 비밀번호가 올바르지 않습니다." });
});

// 2. Get Applications (Search or List All)
app.get("/api/applications", (req, res) => {
  const { studentName, guardianPhone } = req.query;
  const db = readDb();

  // If specific search parameters are provided, perform lookup (Public)
  if (studentName && guardianPhone) {
    // Standardize phone format (remove whitespace, compare exactly)
    const cleanPhone = guardianPhone.trim();
    const cleanName = studentName.trim();

    const matched = db.filter(app => 
      app.studentName === cleanName && 
      app.guardianPhone === cleanPhone
    );
    return res.json(matched);
  }

  // Otherwise, return all applications (Requires Admin Authentication)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.substring(7) !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "권한이 없습니다. 관리자 로그인이 필요합니다." });
  }

  res.json(db);
});

// 2.5 Get Single Application
app.get("/api/applications/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const found = db.find(app => app.id === id);
  if (!found) {
    return res.status(404).json({ error: "해당 신청 내역을 찾을 수 없습니다." });
  }
  res.json(found);
});

// 3. Create Application
app.post("/api/applications", (req, res) => {
  const application = req.body;

  if (!application.studentName || !application.guardianPhone || !application.courseId) {
    return res.status(400).json({ error: "필수 입력 항목(학생명, 보호자연락처, 강좌ID)이 누락되었습니다." });
  }

  const db = readDb();

  // Ensure unique ID
  const appId = application.id || `DS-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const newApp = {
    ...application,
    id: appId,
    status: application.status || "pending",
    date: application.date || new Date().toLocaleDateString("ko-KR", {
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
    })
  };

  db.unshift(newApp);
  const success = writeDb(db);

  if (success) {
    res.status(201).json(newApp);
  } else {
    res.status(500).json({ error: "데이터베이스 저장에 실패했습니다." });
  }
});

// 4. Update Application Status (Approve/Reject)
app.patch("/api/applications/:id/status", adminAuth, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "올바르지 않은 상태 값입니다. (pending, approved, rejected 중 하나)" });
  }

  const db = readDb();
  const appIndex = db.findIndex(app => app.id === id);

  if (appIndex === -1) {
    return res.status(404).json({ error: "해당 신청 내역을 찾을 수 없습니다." });
  }

  db[appIndex].status = status;
  const success = writeDb(db);

  if (success) {
    res.json(db[appIndex]);
  } else {
    res.status(500).json({ error: "상태 변경 저장에 실패했습니다." });
  }
});

// 5. Delete/Cancel Application
app.delete("/api/applications/:id", (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const initialLength = db.length;
  
  const filtered = db.filter(app => app.id !== id);

  if (filtered.length === initialLength) {
    return res.status(404).json({ error: "해당 신청 내역을 찾을 수 없습니다." });
  }

  const success = writeDb(filtered);

  if (success) {
    res.json({ message: "신청이 성공적으로 취소되었습니다.", id });
  } else {
    res.status(500).json({ error: "신청 취소 처리에 실패했습니다." });
  }
});

// 6. Get Dynamic Courses (Public)
app.get("/api/courses", (req, res) => {
  const courses = readCoursesDb();
  res.json(courses);
});

// 7. Save Imported Courses (Requires Admin Auth)
app.post("/api/courses", adminAuth, (req, res) => {
  const { courses } = req.body;
  if (!courses || !Array.isArray(courses)) {
    return res.status(400).json({ error: "올바르지 않은 교육과정 데이터 형식입니다." });
  }
  const success = writeCoursesDb(courses);
  if (success) {
    res.json({ success: true, message: "교육과정이 성공적으로 등록되었습니다." });
  } else {
    res.status(500).json({ error: "교육과정 등록 저장에 실패했습니다." });
  }
});

// 8. Reset Dynamic Courses (Requires Admin Auth)
app.post("/api/courses/reset", adminAuth, (req, res) => {
  const success = writeCoursesDb([]);
  if (success) {
    res.json({ success: true, message: "교육과정이 기본값으로 초기화되었습니다." });
  } else {
    res.status(500).json({ error: "교육과정 초기화에 실패했습니다." });
  }
});

// 9. Get Instructor Documents (Public)
app.get("/api/instructor-docs", (req, res) => {
  const docs = readInstructorDocsDb();
  res.json(docs);
});

// 10. Save Instructor Documents (Requires Admin Auth)
app.post("/api/instructor-docs", adminAuth, (req, res) => {
  const { docs } = req.body;
  if (!docs || !Array.isArray(docs)) {
    return res.status(400).json({ error: "올바르지 않은 강사 서류 데이터 형식입니다." });
  }
  const success = writeInstructorDocsDb(docs);
  if (success) {
    res.json({ success: true, message: "강사 서류 현황이 성공적으로 저장되었습니다." });
  } else {
    res.status(500).json({ error: "강사 서류 현황 저장에 실패했습니다." });
  }
});

// 11. Reset Instructor Documents (Requires Admin Auth)
app.post("/api/instructor-docs/reset", adminAuth, (req, res) => {
  const success = writeInstructorDocsDb(DEFAULT_INSTRUCTOR_DOCS);
  if (success) {
    res.json({ success: true, message: "강사 서류 현황이 기본 데모값으로 복구되었습니다.", docs: DEFAULT_INSTRUCTOR_DOCS });
  } else {
    res.status(500).json({ error: "강사 서류 현황 복구에 실패했습니다." });
  }
});

// 12. Instructor Documents File Upload (Public - Instructors Submit Docs)
app.post("/api/instructor-docs/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("파일 업로드 에러:", err);
      return res.status(500).json({ error: "파일 업로드 처리 중 에러가 발생했습니다." });
    }
    
     const { instructorName, email, className, phone } = req.body;
     if (!instructorName || !className) {
       return res.status(400).json({ error: "필수 정보(강사명, 분반 프로그램명)가 누락되었습니다." });
     }
     
     const db = readInstructorDocsDb();
     const newId = db.length > 0 ? Math.max(...db.map(i => i.id)) + 1 : 1;
     
     const d = new Date();
     const year = d.getFullYear();
     const month = String(d.getMonth() + 1).padStart(2, '0');
     const day = String(d.getDate()).padStart(2, '0');
     const dateStr = `${year}-${month}-${day}`;
     
     const folderName = `${instructorName.trim()}-${dateStr}`;
     const folderPath = `/uploads/${folderName}`;
     
     const getDocStatus = (fieldName) => {
       if (req.files && req.files[fieldName] && req.files[fieldName][0]) {
         return req.files[fieldName][0].filename; // 파일명을 저장
       }
       return "❌ 미제출";
     };
     
     const newDocRecord = {
       id: newId,
       class: className,
       name: instructorName,
       email: email || "",
       phone: phone || "",
       folder: folderPath, // 로컬 업로드 폴더 주소 저장
       doc1: getDocStatus('docFile1'),
       doc2: getDocStatus('docFile2'),
       doc3: getDocStatus('docFile3'),
       doc4: getDocStatus('docFile4'),
       doc5: getDocStatus('docFile5'),
       date: dateStr, // 제출 날짜
       status: "검토중" // 관리자 검토를 위한 기본 상태 설정
     };
     
     db.push(newDocRecord);
     writeInstructorDocsDb(db);
    
    res.status(201).json({ success: true, message: "서류 제출이 완료되었습니다.", record: newDocRecord });
  });
});

// 13. Download Instructor Documents Folder as ZIP (Supports Admin/Process filters)
app.get("/api/instructor-docs/download-zip/:id", (req, res) => {
  const { id } = req.params;
  const { type } = req.query; // admin (행정서류 1, 2) | process (진행서류 3, 4, 5) | all
  const db = readInstructorDocsDb();
  const record = db.find(inst => inst.id === parseInt(id));
  
  if (!record) {
    return res.status(404).json({ error: "해당 강사 서류 기록을 찾을 수 없습니다." });
  }
  
  if (!record.folder || record.folder.startsWith("http")) {
    return res.status(400).json({ error: "실제 서버에 업로드된 로컬 서류만 일괄 다운로드(ZIP)가 가능합니다." });
  }
  
  const folderName = path.basename(record.folder);
  const targetDir = path.join(UPLOADS_DIR, folderName);
  
  if (!fs.existsSync(targetDir)) {
    return res.status(404).json({ error: "서버 상에 서류 보관 폴더가 존재하지 않습니다." });
  }
  
  try {
    const zip = new AdmZip();
    let zipSuffix = "전체서류";
    
    if (type === "admin") {
      zipSuffix = "행정서류";
      // doc1, doc2 파일 필터링 추가
      [record.doc1, record.doc2].forEach(fileVal => {
        const isFile = fileVal && fileVal !== "완료" && fileVal !== "검토중" && fileVal !== "미제출";
        if (isFile) {
          const filePath = path.join(targetDir, fileVal);
          if (fs.existsSync(filePath)) {
            zip.addLocalFile(filePath);
          }
        }
      });
    } else if (type === "process") {
      zipSuffix = "진행서류";
      // doc3, doc4, doc5 파일 필터링 추가
      [record.doc3, record.doc4, record.doc5].forEach(fileVal => {
        const isFile = fileVal && fileVal !== "완료" && fileVal !== "검토중" && fileVal !== "미제출";
        if (isFile) {
          const filePath = path.join(targetDir, fileVal);
          if (fs.existsSync(filePath)) {
            zip.addLocalFile(filePath);
          }
        }
      });
    } else {
      // 전체 압축
      zip.addLocalFolder(targetDir);
    }
    
    // 압축할 파일 항목 체크
    if (zip.getEntries().length === 0) {
      return res.status(400).json({ error: `선택하신 분류(${zipSuffix})에 제출 완료된 물리 서류 파일이 존재하지 않습니다.` });
    }
    
    const zipName = `${folderName}_${zipSuffix}.zip`;
    const buffer = zip.toBuffer();
    
    // Set headers
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename=${encodeURIComponent(zipName)}`);
    res.send(buffer);
  } catch (err) {
    console.error("ZIP 압축 에러:", err);
    res.status(500).json({ error: "ZIP 파일 압축 생성에 실패했습니다." });
  }
});


// Public GET Programs
app.get("/api/public/programs", (req, res) => {
  const db = readInstructorDocsDb();
  const programs = new Set();
  db.forEach(d => {
    if (d.className) programs.add(d.className);
  });
  res.json({ success: true, data: Array.from(programs) });
});

// Instructor Auth updated to require className
app.post("/api/instructor/auth", (req, res) => {
  const { className, name, phone } = req.body;
  const db = readInstructorDocsDb();
  // Using className to authenticate exactly
  const inst = db.find(d => d.className === className && d.name === name && d.phone === phone);
  if (inst) {
    res.json({ success: true, data: inst });
  } else {
    res.status(404).json({ error: "등록된 명단에 없습니다. 관리자에게 문의하세요." });
  }
});


// ==========================================
// NEW ADMIN APIs FOR INSTRUCTOR DOCS
// ==========================================

// GET /api/admin/instructors
app.get("/api/admin/instructors", adminAuth, (req, res) => {
  const db = readInstructorDocsDb();
  res.json({ success: true, data: db });
});

// POST /api/admin/instructors/bulk-add
app.post("/api/admin/instructors/bulk-add", adminAuth, (req, res) => {
  const newDoc = req.body;
  if (!newDoc || !newDoc.id) {
    return res.status(400).json({ error: "유효하지 않은 데이터입니다." });
  }
  const db = readInstructorDocsDb();
  
  // Check if exists
  const exists = db.find(d => d.name === newDoc.name && d.phone === newDoc.phone);
  if (exists) {
    return res.status(409).json({ error: "이미 존재하는 강사입니다." });
  }
  
  db.unshift(newDoc);
  writeInstructorDocsDb(db);
  res.status(201).json({ success: true, data: newDoc });
});

// PATCH /api/admin/instructors/:id
app.patch("/api/admin/instructors/:id", adminAuth, (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const db = readInstructorDocsDb();
  
  const index = db.findIndex(d => d.id === id || String(d.id) === String(id));
  if (index === -1) {
    return res.status(404).json({ error: "해당 강사를 찾을 수 없습니다." });
  }
  
  db[index] = { ...db[index], ...updateData };
  writeInstructorDocsDb(db);
  res.json({ success: true, data: db[index] });
});


// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` 디지털새싹 SW·AI 교육캠프 백엔드 서버 구동 완료`);
  console.log(` 포트 번호: http://localhost:${PORT}`);
  console.log(` 로컬 DB 저장소 파일: ${DB_FILE}`);
  console.log(`===================================================`);
});
