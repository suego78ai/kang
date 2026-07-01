const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

// 1. Remove the "DB에 최종 등록하기" button
indexHtml = indexHtml.replace(
  /<button id="btn-excel-register"[\s\S]*?<\/button>/,
  ''
);

// 2. Add Search and Reset buttons in the filter section
const searchButtonsHtml = `
                    <div class="flex items-end gap-2 ml-auto mt-auto">
                        <button id="btn-search" class="bg-slate-800 text-white font-bold text-sm px-4 py-1.5 rounded-lg hover:bg-slate-700 transition flex items-center gap-2 shadow-sm h-[34px]">
                            <i class="fa-solid fa-magnifying-glass"></i> 검색
                        </button>
                        <button id="btn-reset-filters" class="bg-slate-200 text-slate-700 font-bold text-sm px-4 py-1.5 rounded-lg hover:bg-slate-300 transition flex items-center gap-2 shadow-sm h-[34px]">
                            <i class="fa-solid fa-rotate-left"></i> 전체 리스트 보기
                        </button>
                        <button id="btn-download-zip" class="bg-inha-blue text-white font-bold text-sm px-4 py-1.5 rounded-lg hover:bg-inha-navy transition flex items-center gap-2 shadow-sm h-[34px]">
                            <i class="fa-solid fa-file-zipper"></i> 선택 ZIP 다운로드
                        </button>
                    </div>
`;

// Replace the old btn-download-zip div
indexHtml = indexHtml.replace(
  /<div class="ml-auto mt-auto">\s*<button id="btn-download-zip"[\s\S]*?<\/button>\s*<\/div>/,
  searchButtonsHtml
);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Patched index.html');

let appJs = fs.readFileSync('app.js', 'utf8');

// 3. Revert handleExcelFile to immediate save
const autoSaveExcelCode = `
async function handleExcelFile(file) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type: 'array'});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(worksheet);
    
    let addedCount = 0;
    
    const dropText = document.getElementById('excel-drop-text');
    if (dropText) dropText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 자동 저장 중...';
    
    for (let row of json) {
      const name = row['담당자'];
      const phone = String(row['전화번호'] || '');
      const school = row['학교명'];
      const region = row['권역'];
      const program = row['프로그램'];
      if (name && phone) {
        const exists = state.instructorDocs.find(d => d.name === name && d.phone === phone);
        if (!exists) {
          const newDoc = {
            id: \`inst-\${Date.now()}-\${Math.random().toString(36).substring(2,9)}\`,
            name, phone, school, region, className: program,
            status: "일반", role: "주강사", first_submission_date: null, files: {}
          };
          if (isOnline) {
             try {
                await fetch(\`\${API_URL}/admin/instructors/bulk-add\`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${state.adminToken}\` },
                  body: JSON.stringify(newDoc)
                });
             } catch(e) {}
          } else { state.instructorDocs.unshift(newDoc); }
          addedCount++;
        }
      }
    }
    
    showToast(\`\${addedCount}명의 데이터가 DB에 즉시 자동 등록되었습니다.\`, "success");
    
    if (dropText) dropText.textContent = "엑셀 파일을 이곳에 드래그하거나 클릭하여 업로드하세요.";
    
    if (isOnline) await initInstructorDocs(); else { populateDatalists(); renderInstructorDocs(); }
  };
  reader.readAsArrayBuffer(file);
}

// Remove the old pendingExcelData and button logic
document.addEventListener("DOMContentLoaded", () => {
  const btnSearch = document.getElementById("btn-search");
  const btnReset = document.getElementById("btn-reset-filters");
  
  if (btnSearch) {
    btnSearch.addEventListener("click", renderInstructorDocs);
  }
  
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if(DOM.filterProgram) DOM.filterProgram.value = "";
      if(DOM.filterName) DOM.filterName.value = "";
      if(DOM.filterSchool) DOM.filterSchool.value = "";
      if(DOM.filterDateStart) DOM.filterDateStart.value = "";
      if(DOM.filterDateEnd) DOM.filterDateEnd.value = "";
      if(DOM.filterStatus) DOM.filterStatus.value = "all";
      if(DOM.filterMissing) DOM.filterMissing.value = "";
      renderInstructorDocs();
      showToast("전체 리스트가 표시되었습니다.", "info");
    });
  }
  
  // Add enter key support for text inputs
  ['filterProgram', 'filterName', 'filterSchool', 'filterMissing'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          renderInstructorDocs();
        }
      });
    }
  });
});
`;

// Replace the old pendingExcelData logic
appJs = appJs.replace(
  /let pendingExcelData = \[\];[\s\S]*?\}\);/m,
  autoSaveExcelCode
);

// We need to make sure the previous DOMContentLoaded which attached real-time 'input' events is modified
// I will just remove the automatic 'input' and 'change' triggers so it only searches on button click or Enter.
appJs = appJs.replace(
  /\['filterProgram', 'filterName', 'filterSchool', 'filterMissing'\].forEach\(id => \{[\s\S]*?\}\);/m,
  ''
);
appJs = appJs.replace(
  /\['filterStatus', 'filterDateStart', 'filterDateEnd'\].forEach\(id => \{[\s\S]*?\}\);/m,
  ''
);

fs.writeFileSync('app.js', appJs, 'utf8');
console.log('Patched app.js');
