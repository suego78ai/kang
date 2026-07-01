const fs = require('fs');

// The new getRequiredDocs logic based on the matrix
const newGetRequiredDocsCode = `
function getRequiredDocs(status, role) {
  // status: "교원", "일반"
  // role: "주강사", "보조강사", "운영요원", "안전요원"
  role = role || "주강사"; // Default to 주강사 if undefined
  
  if (status === "교원") {
    if (role === "주강사") return [3, 4, 5, 6, 8];
    if (role === "보조강사") return [6];
    if (role === "운영요원") return [1, 2, 7, 9, 10, 11];
    if (role === "안전요원") return [1, 2, 7, 11];
  } else {
    // 프리랜서(일반)
    if (role === "주강사") return [1, 2, 4, 5, 6];
    if (role === "보조강사") return [6];
    if (role === "운영요원") return [1, 2, 7, 9, 10, 11];
    if (role === "안전요원") return [1, 2, 7, 11];
  }
  return [];
}`;

// --- Update app.js ---
let appJs = fs.readFileSync('app.js', 'utf8');

// Replace old getRequiredDocs
appJs = appJs.replace(
  /function getRequiredDocs\(status\) \{[\s\S]*?return \[1, 2, 4, 5, 6, 7, 8, 9, 10, 11\];\n\}/,
  newGetRequiredDocsCode
);

// We must also update every invocation of getRequiredDocs in app.js
appJs = appJs.replace(/getRequiredDocs\(doc\.status \|\| "일반"\)/g, 'getRequiredDocs(doc.status || "일반", doc.role || "주강사")');

// Wait, the previous version of app.js might have a slightly different old getRequiredDocs function:
// function getRequiredDocs(status) {
//   if (status === "교원") return [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
//   else return [1, 2, 4, 5, 6, 7, 8, 9, 10, 11];
// }
// Let's make the replace more robust.
appJs = appJs.replace(
  /function getRequiredDocs\(status\) \{[\s\S]*?return \[.*?\];\n\}/,
  newGetRequiredDocsCode
);

// We need to display the role in the table.
// In the <thead>, after <th class="p-3 border-r w-20">유형</th>, we add <th class="p-3 border-r w-24">역할</th>.
// Actually, it's easier to patch index.html manually later. For app.js, we add it to the <tr>.
appJs = appJs.replace(
  /<td class="p-3 border-r text-center">\s*<span class="\\\${doc.status === '교원' \? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'} px-2 py-1 rounded text-xs font-bold">\\\${doc.status \|\| '일반'}<\/span>\s*<\/td>/,
  `<td class="p-3 border-r text-center">
        <span class="\${doc.status === '교원' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'} px-2 py-1 rounded text-xs font-bold">\${doc.status || '일반'}</span>
      </td>
      <td class="p-3 border-r text-center">
        <span class="bg-cyan-50 text-cyan-700 border border-cyan-200 px-2 py-1 rounded text-xs font-bold">\${doc.role || '주강사'}</span>
      </td>`
);

// Also add role to the default mock object when excel is imported
appJs = appJs.replace(
  /status: "일반", first_submission_date: null, files: \{\}/g,
  `status: "일반", role: "주강사", first_submission_date: null, files: {}`
);

// Update modal
const newModalStatusHtml = `
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">신분 (유형)</label>
                <select id="modal-status" class="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:ring-inha-blue">
                  <option value="일반">일반 강사</option>
                  <option value="교원">현직 교원</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">역할</label>
                <select id="modal-role" class="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:ring-inha-blue">
                  <option value="주강사">주강사</option>
                  <option value="보조강사">보조강사</option>
                  <option value="운영요원">운영요원</option>
                  <option value="안전요원">안전요원</option>
                </select>
              </div>
`;

// Wait, app.js doesn't contain the HTML for the modal, it just sets the values.
// So I will just add DOM.modalRole = document.getElementById("modal-role");
appJs = appJs.replace(
  /modalStatus: document\.getElementById\("modal-status"\),/,
  `modalStatus: document.getElementById("modal-status"),
  modalRole: document.getElementById("modal-role"),`
);

appJs = appJs.replace(
  /if \(DOM\.modalStatus\) DOM\.modalStatus\.value = doc\.status \|\| '일반';/,
  `if (DOM.modalStatus) DOM.modalStatus.value = doc.status || '일반';
  if (DOM.modalRole) DOM.modalRole.value = doc.role || '주강사';`
);

appJs = appJs.replace(
  /state\.instructorDocs\[docIndex\]\.status = DOM\.modalStatus\.value;/,
  `state.instructorDocs[docIndex].status = DOM.modalStatus.value;
      state.instructorDocs[docIndex].role = DOM.modalRole.value;`
);

fs.writeFileSync('app.js', appJs, 'utf8');


// --- Update submit.js ---
let submitJs = fs.readFileSync('submit.js', 'utf8');

submitJs = submitJs.replace(
  /function getRequiredDocs\(status\) \{[\s\S]*?return \[.*?\];\n\}/,
  newGetRequiredDocsCode
);

// We need to add DOM.roleRadios
submitJs = submitJs.replace(
  /statusRadios: document\.querySelectorAll\('input\[name="instructor-status"\]'\),/,
  `statusRadios: document.querySelectorAll('input[name="instructor-status"]'),
  roleRadios: document.querySelectorAll('input[name="instructor-role"]'),`
);

// Update renderDocInputs to use role
submitJs = submitJs.replace(
  /const status = document\.querySelector\('input\[name="instructor-status"\]:checked'\)\.value;[\s\S]*?const req = getRequiredDocs\(status\);/,
  `const status = document.querySelector('input[name="instructor-status"]:checked').value;
  const role = document.querySelector('input[name="instructor-role"]:checked').value;
  const req = getRequiredDocs(status, role);`
);

// Add event listener for roleRadios (same visual styling)
const roleRadiosListener = `
DOM.roleRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.role-radio').forEach(r => {
      r.classList.remove('bg-emerald-50', 'border-emerald-600');
      r.classList.add('border-slate-200');
    });
    if (radio.checked) {
      radio.closest('.role-radio').classList.remove('border-slate-200');
      radio.closest('.role-radio').classList.add('bg-emerald-50', 'border-emerald-600');
    }
  });
});
`;

submitJs = submitJs.replace(
  /DOM\.statusRadios\.forEach[\s\S]*?\}\);/,
  `$&
${roleRadiosListener}`
);

// Update formData appending
submitJs = submitJs.replace(
  /const status = document\.querySelector\('input\[name="instructor-status"\]:checked'\)\.value;[\s\S]*?formData\.append\('status', status\);/,
  `const status = document.querySelector('input[name="instructor-status"]:checked').value;
  const role = document.querySelector('input[name="instructor-role"]:checked').value;
  formData.append('status', status);
  formData.append('role', role);`
);

// Auto-select role if instructorData has it
submitJs = submitJs.replace(
  /if \(instructorData\.status === "교원"\) \{[\s\S]*?document\.querySelector\('input\[value="교원"\]'\)\.checked = true;[\s\S]*?\}/,
  `if (instructorData.status === "교원") {
        document.querySelector('input[value="교원"]').checked = true;
      }
      if (instructorData.role) {
        const rInput = document.querySelector(\`input[name="instructor-role"][value="\${instructorData.role}"]\`);
        if (rInput) rInput.checked = true;
      }`
);

fs.writeFileSync('submit.js', submitJs, 'utf8');
console.log('Successfully patched logic in app.js and submit.js');
