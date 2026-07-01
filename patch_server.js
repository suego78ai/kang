const fs = require('fs');

const serverJs = fs.readFileSync('server.js', 'utf8');

// The new routes we want to add
const newRoutes = `
// [NEW] Get Instructor Docs (admin)
app.get("/api/admin/instructor-docs", adminAuth, (req, res) => {
  const db = readInstructorDocsDb();
  res.json({ success: true, data: db });
});

// [NEW] Update single instructor doc
app.put("/api/admin/instructor-docs/:id", adminAuth, (req, res) => {
  const { id } = req.params;
  const docData = req.body;
  const db = readInstructorDocsDb();
  
  const idx = db.findIndex(d => d.id === id);
  if (idx > -1) {
    db[idx] = { ...db[idx], ...docData };
  } else {
    db.unshift(docData);
  }
  
  writeInstructorDocsDb(db);
  res.json({ success: true, data: docData });
});

// [NEW] Delete single instructor doc
app.delete("/api/admin/instructor-docs/:id", adminAuth, (req, res) => {
  const { id } = req.params;
  let db = readInstructorDocsDb();
  db = db.filter(d => d.id !== id);
  writeInstructorDocsDb(db);
  res.json({ success: true });
});
`;

const updatedServerJs = serverJs.replace(
  '// ==========================================\n// START SERVER\n// ==========================================',
  `${newRoutes}\n// ==========================================\n// START SERVER\n// ==========================================`
);

fs.writeFileSync('server.js', updatedServerJs, 'utf8');
console.log('Updated server.js');
