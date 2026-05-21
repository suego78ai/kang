const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, "db.json");

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files in production if needed (optional)
app.use(express.static(__dirname));

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

// API Endpoints

// 1. Health Check & Mode Verification
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "실시간 데이터베이스 서버가 정상 구동 중입니다." });
});

// 2. Get Applications (Search or List All)
app.get("/api/applications", (req, res) => {
  const { studentName, guardianPhone } = req.query;
  const db = readDb();

  // If specific search parameters are provided, perform lookup
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

  // Otherwise, return all applications (for Administrator view)
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
app.patch("/api/applications/:id/status", (req, res) => {
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

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` 디지털새싹 SW·AI 교육캠프 백엔드 서버 구동 완료`);
  console.log(` 포트 번호: http://localhost:${PORT}`);
  console.log(` 로컬 DB 저장소 파일: ${DB_FILE}`);
  console.log(`===================================================`);
});
