const fs = require('fs');

const serverJs = fs.readFileSync('server.js', 'utf8');

const newRoutes = `
// Bulk Add Instructors from Excel
app.post("/api/admin/instructors/bulk-add", adminAuth, (req, res) => {
  const newInst = req.body;
  const db = readDb();
  db.unshift(newInst);
  writeDb(db);
  res.json({ success: true });
});

// Instructor Auth
app.post("/api/instructor/auth", (req, res) => {
  const { name, phone } = req.body;
  const db = readDb();
  const inst = db.find(d => d.name === name && d.phone === phone);
  if (inst) {
    res.json({ success: true, data: inst });
  } else {
    res.status(404).json({ error: "등록된 명단에 없습니다. 관리자에게 문의하세요." });
  }
});
`;

const updatedServerJs = serverJs.replace(
  '// Start server',
  `${newRoutes}\n// Start server`
);

fs.writeFileSync('server.js', updatedServerJs, 'utf8');
console.log('Updated server.js with auth and bulk-add');
