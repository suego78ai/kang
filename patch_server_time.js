const fs = require('fs');

const serverJs = fs.readFileSync('server.js', 'utf8');

// We need to update the /api/instructor/submit route to record the exact submission date and time.
// I will use regex to find the inst creation/update block.
let updatedServerJs = serverJs.replace(
  'inst.status = status;\n  }',
  `inst.status = status;\n  }\n  \n  // Record exact date and time of submission\n  inst.last_submission_datetime = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });`
);

// Wait, the regex might fail. Let's make it robust by just replacing writeDb(db); with the datetime update.
updatedServerJs = serverJs.replace(
  '  writeDb(db);\n  res.json({ success: true, data: inst });',
  `  inst.last_submission_datetime = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });\n  writeDb(db);\n  res.json({ success: true, data: inst });`
);

fs.writeFileSync('server.js', updatedServerJs, 'utf8');
console.log('Updated server.js to record last_submission_datetime');
