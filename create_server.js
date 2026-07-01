const fs = require('fs');

const serverJsCode = `const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const AdmZip = require("adm-zip");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, "db.json");
const INSTRUCTOR_DOCS_FILE = path.join(__dirname, "instructor_docs.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Ensure dummy admin token logic
const ADMIN_TOKEN = "dsadmin-session-token-2026";
function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.substring(7) !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

function readDb() {
  try {
    if (!fs.existsSync(INSTRUCTOR_DOCS_FILE)) {
      fs.writeFileSync(INSTRUCTOR_DOCS_FILE, JSON.stringify([], null, 2), "utf8");
      return [];
    }
    return JSON.parse(fs.readFileSync(INSTRUCTOR_DOCS_FILE, "utf8") || "[]");
  } catch (err) {
    return [];
  }
}

function writeDb(data) {
  fs.writeFileSync(INSTRUCTOR_DOCS_FILE, JSON.stringify(data, null, 2), "utf8");
}

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use("/uploads", express.static(UPLOADS_DIR));

app.post("/api/admin/login", (req, res) => {
  const { id, password } = req.body;
  if (id === "dsadmin" && password === "ds2026!") {
    res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Admin API
app.get("/api/admin/instructors", adminAuth, (req, res) => {
  res.json({ success: true, data: readDb() });
});

// Download ZIP for selected instructors
app.post("/api/admin/download-zip", adminAuth, (req, res) => {
  const { instructorIds } = req.body;
  if (!instructorIds || !Array.isArray(instructorIds)) {
    return res.status(400).json({ error: "instructorIds array is required" });
  }

  const db = readDb();
  const selected = db.filter(d => instructorIds.includes(d.id));
  
  if (selected.length === 0) {
    return res.status(404).json({ error: "No matching instructors found" });
  }

  const zip = new AdmZip();

  selected.forEach(inst => {
    const folderName = \`\${inst.name}-\${inst.first_submission_date}\`;
    
    // Add all stored files with required logic
    if (inst.files) {
      Object.keys(inst.files).forEach(key => {
        const fileInfo = inst.files[key];
        if (Array.isArray(fileInfo)) {
          // Arrays mean multi-files (doc9, doc10)
          fileInfo.forEach(f => {
             const filePath = path.join(UPLOADS_DIR, f.path);
             if (fs.existsSync(filePath)) {
                 const zipDir = \`\${folderName}/\${f.categoryFolder}\`;
                 zip.addLocalFile(filePath, zipDir, f.zipName);
             }
          });
        } else {
          // Single file
          const filePath = path.join(UPLOADS_DIR, fileInfo.path);
          if (fs.existsSync(filePath)) {
             let zipDir = folderName;
             if (fileInfo.categoryFolder) {
                 zipDir = \`\${folderName}/\${fileInfo.categoryFolder}\`;
             }
             zip.addLocalFile(filePath, zipDir, fileInfo.zipName);
          }
        }
      });
    }
  });

  const zipBuffer = zip.toBuffer();
  res.set("Content-Type", "application/zip");
  res.set("Content-Disposition", \`attachment; filename=선택_강사_서류_\${Date.now()}.zip\`);
  res.send(zipBuffer);
});

// Public upload API
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const instName = req.body.name || "Unknown";
    let subDate = req.body.first_submission_date;
    if (!subDate) {
      const d = new Date();
      subDate = \`\${d.getFullYear()}\${String(d.getMonth() + 1).padStart(2, '0')}\${String(d.getDate()).padStart(2, '0')}\`;
      req.body.first_submission_date = subDate;
    }
    
    const folderPath = path.join(UPLOADS_DIR, \`\${instName}-\${subDate}\`);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + Math.round(Math.random() * 1e9);
    cb(null, \`\${file.fieldname}_\${unique}\${ext}\`);
  }
});
const upload = multer({ storage });

const DOC_NAMES = {
  doc1: "01_성범죄_경력_조회_동의서",
  doc2: "02_성범죄_및_아동학대_사실_부존재_확인_서약서",
  doc3: "03_현직_교원_출강_안내_및_확인서",
  doc4: "04_프로그램_결과보고서",
  doc5: "05_식다과_수령_확인서",
  doc6: "06_강사비_신청서",
  doc7: "07_일용직_근로자_근로계약서",
  doc8: "08_디지털새싹_프로그램_출강_확인서",
  doc9: "09_운영전_체크리스트(매회)",
  doc10: "10_운영후_체크리스트(매회)",
  doc11: "11_안전관리_서약서",
  common_id: "신분증",
  common_bank: "통장사본",
  doc6_resume: "이력서",
  doc7_log: "일일_근로일지"
};

app.post("/api/instructor/submit", upload.any(), (req, res) => {
  const { name, school, phone, status } = req.body;
  if (!name || !school || !phone || !status) {
    return res.status(400).json({ error: "Missing basic info" });
  }

  let db = readDb();
  let inst = db.find(d => d.name === name && d.phone === phone);
  
  if (!inst) {
    inst = {
      id: \`inst-\${Date.now()}\`,
      name, school, phone, status,
      first_submission_date: req.body.first_submission_date,
      files: {}
    };
    db.unshift(inst);
  } else {
    // Update basic info if changed
    inst.school = school;
    inst.status = status;
  }

  // Process files
  if (req.files) {
    req.files.forEach(f => {
      const field = f.fieldname; // e.g. "doc1", "common_id", "doc9_1"
      const ext = path.extname(f.originalname);
      const relativePath = path.relative(UPLOADS_DIR, f.path);
      
      let zipName = \`\${DOC_NAMES[field] || field}_\${name}\${ext}\`;
      let categoryFolder = "";

      if (field === "common_id" || field === "common_bank" || field === "doc6_resume") {
        categoryFolder = "06_강사비_신청서_첨부";
        zipName = \`\${DOC_NAMES[field] || field}\${ext}\`;
        
        // Save to inst.files
        inst.files[field] = { path: relativePath, zipName, categoryFolder };
        
        // For doc7, we also need id and bank
        if (field === "common_id" || field === "common_bank") {
          inst.files[\`\${field}_for_doc7\`] = { 
            path: relativePath, 
            zipName: \`\${DOC_NAMES[field]}\${ext}\`, 
            categoryFolder: "07_일용직_근로계약서_첨부" 
          };
        }
      } else if (field === "doc7_log") {
        categoryFolder = "07_일용직_근로계약서_첨부";
        zipName = \`\${DOC_NAMES[field]}\${ext}\`;
        inst.files[field] = { path: relativePath, zipName, categoryFolder };
      } else if (field.startsWith("doc9_") || field.startsWith("doc10_")) {
        const parts = field.split("_");
        const docNum = parts[0];
        const round = parts[1] || "1";
        categoryFolder = DOC_NAMES[docNum];
        zipName = \`\${round}회차_체크리스트_\${name}\${ext}\`;
        
        if (!inst.files[docNum]) inst.files[docNum] = [];
        // Prevent duplicate round
        const existingIdx = inst.files[docNum].findIndex(d => d.round === round);
        const fileObj = { round, path: relativePath, zipName, categoryFolder };
        if (existingIdx > -1) {
          inst.files[docNum][existingIdx] = fileObj;
        } else {
          inst.files[docNum].push(fileObj);
        }
      } else {
        // Normal doc1, doc2, etc
        zipName = \`\${DOC_NAMES[field]}_\${name}\${ext}\`;
        inst.files[field] = { path: relativePath, zipName, categoryFolder: "" };
      }
    });
  }

  writeDb(db);
  res.json({ success: true, data: inst });
});

// Admin override an instructor status (for manual adjustments)
app.patch("/api/admin/instructors/:id", adminAuth, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const idx = db.findIndex(d => d.id === id);
  if (idx > -1) {
    db[idx] = { ...db[idx], ...req.body };
    writeDb(db);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;

fs.writeFileSync('server.js', serverJsCode, 'utf8');
console.log('Successfully updated server.js');
