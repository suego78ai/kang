const fs = require('fs');

let serverJs = fs.readFileSync('server.js', 'utf8');

serverJs = serverJs.replace(
  /\/\/ Default Demo Instructor Documents[\s\S]*?\];/,
  'const DEFAULT_INSTRUCTOR_DOCS = [];'
);

fs.writeFileSync('server.js', serverJs, 'utf8');
console.log('Cleared default instructor docs from server.js');
