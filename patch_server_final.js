const fs = require('fs');

const serverJs = fs.readFileSync('server.js', 'utf8');

// 1. Add GET /api/public/programs
const newRoutes = `
// Public GET Programs
app.get("/api/public/programs", (req, res) => {
  const db = readDb();
  const programs = new Set();
  db.forEach(d => {
    if (d.className) programs.add(d.className);
  });
  res.json({ success: true, data: Array.from(programs) });
});

// Instructor Auth updated to require className
app.post("/api/instructor/auth", (req, res) => {
  const { className, name, phone } = req.body;
  const db = readDb();
  // Using className to authenticate exactly
  const inst = db.find(d => d.className === className && d.name === name && d.phone === phone);
  if (inst) {
    res.json({ success: true, data: inst });
  } else {
    res.status(404).json({ error: "등록된 명단에 없습니다. 관리자에게 문의하세요." });
  }
});
`;

let updatedServerJs = serverJs.replace(
  /\/\/ Instructor Auth[\s\S]*?}\);/g,
  ''
);

updatedServerJs = updatedServerJs.replace(
  '// Start Server',
  `${newRoutes}\n// Start Server`
);

// 2. Update multer config to use className as the parent folder
const oldMulterDest = `  destination: (req, file, cb) => {
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
  }`;

const newMulterDest = `  destination: (req, file, cb) => {
    const instName = req.body.name || "Unknown";
    const className = req.body.className || "미지정_프로그램";
    // Sanitize className for folder naming
    const safeClassName = className.replace(/[\\\\/:*?"<>|]/g, "_");
    
    let subDate = req.body.first_submission_date;
    if (!subDate) {
      const d = new Date();
      subDate = \`\${d.getFullYear()}\${String(d.getMonth() + 1).padStart(2, '0')}\${String(d.getDate()).padStart(2, '0')}\`;
      req.body.first_submission_date = subDate;
    }
    
    const folderPath = path.join(UPLOADS_DIR, safeClassName, \`\${instName}-\${subDate}\`);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  }`;

updatedServerJs = updatedServerJs.replace(oldMulterDest, newMulterDest);

fs.writeFileSync('server.js', updatedServerJs, 'utf8');
console.log('Updated server.js with public programs and structured folders');
