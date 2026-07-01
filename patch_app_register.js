const fs = require('fs');

const appJs = fs.readFileSync('app.js', 'utf8');

const newScript = `
let pendingExcelData = [];

async function handleExcelFile(file) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type: 'array'});
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(worksheet);
    
    pendingExcelData = [];
    for (let row of json) {
      const name = row['담당자'];
      const phone = String(row['전화번호'] || '');
      const school = row['학교명'];
      const region = row['권역'];
      const program = row['프로그램'];
      if (name && phone) {
        pendingExcelData.push({
          id: \`inst-\${Date.now()}-\${Math.random().toString(36).substring(2,9)}\`,
          name, phone, school, region, className: program,
          status: "일반", first_submission_date: null, files: {}
        });
      }
    }
    
    const dropText = document.getElementById('excel-drop-text');
    const dropSubtext = document.getElementById('excel-drop-subtext');
    const btnRegister = document.getElementById('btn-excel-register');
    
    if (dropText) dropText.textContent = \`\${file.name} 파싱 완료! (\${pendingExcelData.length}명)\`;
    if (dropSubtext) dropSubtext.textContent = "우측 상단의 [DB에 최종 등록하기] 버튼을 눌러야 서버에 반영됩니다.";
    if (btnRegister) btnRegister.classList.remove('hidden');
    
    showToast(\`\${pendingExcelData.length}명의 데이터를 읽었습니다. [DB에 최종 등록하기]를 눌러주세요.\`, "info");
  };
  reader.readAsArrayBuffer(file);
}

document.addEventListener("DOMContentLoaded", () => {
  const btnRegister = document.getElementById('btn-excel-register');
  if (btnRegister) {
    btnRegister.addEventListener('click', async () => {
      if (pendingExcelData.length === 0) return;
      btnRegister.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 등록 중...';
      btnRegister.disabled = true;
      
      let addedCount = 0;
      for (let newDoc of pendingExcelData) {
        const exists = state.instructorDocs.find(d => d.name === newDoc.name && d.phone === newDoc.phone);
        if (!exists) {
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
      
      showToast(\`\${addedCount}명의 강사 명단이 DB에 최종 등록되었습니다!\`, "success");
      pendingExcelData = [];
      btnRegister.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> DB에 최종 등록하기';
      btnRegister.classList.add('hidden');
      btnRegister.disabled = false;
      
      const dropText = document.getElementById('excel-drop-text');
      const dropSubtext = document.getElementById('excel-drop-subtext');
      if (dropText) dropText.textContent = "엑셀 파일을 이곳에 드래그하거나 클릭하여 업로드하세요.";
      if (dropSubtext) dropSubtext.textContent = "필수 컬럼: 학교명, 권역, 담당자, 전화번호, 프로그램";
      
      if (isOnline) await initInstructorDocs(); else { populateDatalists(); renderInstructorDocs(); }
    });
  }
});
`;

let updatedAppJs = appJs.replace(
  /async function handleExcelFile\(file\) {[\s\S]*?reader\.readAsArrayBuffer\(file\);\n}/,
  newScript
);

fs.writeFileSync('app.js', updatedAppJs, 'utf8');
console.log('Updated app.js with Register button logic');
