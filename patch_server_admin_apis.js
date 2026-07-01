const fs = require('fs');

const serverJsPath = 'server.js';
let serverJs = fs.readFileSync(serverJsPath, 'utf8');

const newApis = `
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

`;

serverJs = serverJs.replace('// Start Server', `${newApis}\n// Start Server`);

fs.writeFileSync(serverJsPath, serverJs, 'utf8');
console.log('Successfully patched server.js with missing admin APIs');
