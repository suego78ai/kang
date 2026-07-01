const fs = require('fs');

const submitJs = fs.readFileSync('submit.js', 'utf8');

// 1. Add fetch for programs and populate dropdown
const newInitCode = `
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch(\`\${API_URL}/public/programs\`);
    const data = await res.json();
    const programSelect = document.getElementById('auth-program');
    if (data.success && data.data && data.data.length > 0) {
      programSelect.innerHTML = '<option value="" disabled selected>프로그램을 선택하세요</option>';
      data.data.forEach(p => {
        programSelect.innerHTML += \`<option value="\${p}">\${p}</option>\`;
      });
      programSelect.disabled = false;
    } else {
      programSelect.innerHTML = '<option value="" disabled selected>등록된 프로그램이 없습니다.</option>';
    }
  } catch(e) {
    console.error(e);
    document.getElementById('auth-program').innerHTML = '<option value="" disabled selected>서버 연결 실패</option>';
  }
});
`;

let updatedSubmitJs = newInitCode + "\n" + submitJs;

// 2. Update auth payload
updatedSubmitJs = updatedSubmitJs.replace(
  "const name = DOM.authName.value.trim();\n  const phone = DOM.authPhone.value.trim();",
  "const name = DOM.authName.value.trim();\n  const phone = DOM.authPhone.value.trim();\n  const className = document.getElementById('auth-program').value;"
);

updatedSubmitJs = updatedSubmitJs.replace(
  "if(!name || !phone) {",
  "if(!className || !name || !phone) {\n    DOM.authError.textContent = \"프로그램 선택, 이름, 전화번호를 모두 입력해주세요.\";\n    DOM.authError.classList.remove('hidden');\n    return;\n  }"
);

updatedSubmitJs = updatedSubmitJs.replace(
  "body: JSON.stringify({ name, phone })",
  "body: JSON.stringify({ className, name, phone })"
);

// 3. Append className to formData on submit
updatedSubmitJs = updatedSubmitJs.replace(
  "formData.append('school', instructorData.school);",
  "formData.append('school', instructorData.school);\n  formData.append('className', instructorData.className);"
);

fs.writeFileSync('submit.js', updatedSubmitJs, 'utf8');
console.log('Updated submit.js with program logic');
