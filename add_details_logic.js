const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf-8');

const targetStr = `<td class="p-2 text-center">
          <button onclick="removeInstructorDocRow(\${inst.id})" class="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded transition" title="행 삭제">
              <i class="fa-regular fa-trash-can"></i>
          </button>
      </td>`;

const replaceStr = `<td class="p-2 text-center">
          <div class="flex items-center justify-center gap-1">
            <button onclick="openSubmissionDetails(\${inst.id})" class="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 p-1.5 rounded transition" title="상세보기">
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>
            <button onclick="removeInstructorDocRow(\${inst.id})" class="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded transition" title="행 삭제">
                <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
      </td>`;

code = code.replace(targetStr, replaceStr);

const modalLogic = `

// ============================================================================
// Submission Details Modal Logic
// ============================================================================
window.openSubmissionDetails = function(id) {
  const inst = state.instructorDocs.find(i => i.id === id);
  if (!inst) return;
  
  document.getElementById("detail-name").innerText = inst.name || "N/A";
  document.getElementById("detail-phone").innerText = inst.phone || "N/A";
  document.getElementById("detail-email").innerText = inst.email || "N/A";
  document.getElementById("detail-class").innerText = inst.class || "N/A";
  document.getElementById("detail-date").innerText = inst.date || "N/A";
  
  const folderLinkContainer = document.getElementById("detail-folder-link");
  if (inst.folder) {
    folderLinkContainer.innerHTML = \`<a href="\${inst.folder}" target="_blank" class="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-600 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 px-2 py-1 rounded-full transition shadow-sm">
      <i class="fa-solid fa-folder-open"></i> 드라이브 열기
    </a>\`;
  } else {
    folderLinkContainer.innerHTML = \`<span class="text-xs text-slate-400 italic">폴더 미개설</span>\`;
  }
  
  const docsList = document.getElementById("detail-docs-list");
  docsList.innerHTML = "";
  
  const docFields = [
    { key: "doc1", label: "강사서약서" },
    { key: "doc2", label: "강의계획서" },
    { key: "doc3", label: "출석부(매주)" },
    { key: "doc4", label: "최종수업일지" },
    { key: "doc5", label: "정산 영수증" }
  ];
  
  docFields.forEach(field => {
    const val = inst[field.key];
    const isFile = val && val !== "완료" && val !== "검토중" && val !== "미제출" && !val.includes("❌");
    
    let statusHtml = "";
    if (isFile) {
      const fileUrl = inst.folder && inst.folder.startsWith("http") ? \`\${inst.folder}/\${val}\` : \`http://localhost:3000\${inst.folder}/\${val}\`;
      const cleanFileName = val.substring(val.indexOf("_") + 1);
      
      statusHtml = \`
        <div class="flex items-center gap-3">
          <span class="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-bold">제출됨</span>
          <div class="flex items-center gap-2 overflow-hidden">
            <a href="\${fileUrl}" target="_blank" class="text-sm text-cyan-600 hover:text-cyan-800 hover:underline truncate" title="\${cleanFileName} 다운로드">
              <i class="fa-solid fa-paperclip"></i> \${cleanFileName}
            </a>
            <button onclick="openPreviewDoc(\${inst.id}, '\${field.key}', '\${val}')" class="text-amber-500 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 p-1.5 rounded transition" title="미리보기">
              <i class="fa-regular fa-eye"></i>
            </button>
          </div>
        </div>
      \`;
    } else {
      let badgeClass = "bg-slate-50 text-slate-500 border-slate-200";
      if (val === "완료") badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
      else if (val === "검토중") badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
      else if (val === "미제출" || val.includes("❌")) badgeClass = "bg-rose-50 text-rose-700 border-rose-200";
      
      statusHtml = \`<span class="px-2 py-1 \${badgeClass} border rounded text-xs font-bold">\${val || "미제출"}</span>\`;
    }
    
    const row = document.createElement("div");
    row.className = "flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700";
    row.innerHTML = \`
      <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">\${field.label}</span>
      \${statusHtml}
    \`;
    docsList.appendChild(row);
  });
  
  const modal = document.getElementById("submission-details-modal");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
};

window.closeSubmissionDetails = function() {
  const modal = document.getElementById("submission-details-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
};

document.addEventListener("DOMContentLoaded", () => {
  const closeBtn1 = document.getElementById("btn-close-submission-details");
  const closeBtn2 = document.getElementById("btn-close-submission-details-bottom");
  if (closeBtn1) closeBtn1.addEventListener("click", closeSubmissionDetails);
  if (closeBtn2) closeBtn2.addEventListener("click", closeSubmissionDetails);
});
`;

code += modalLogic;

fs.writeFileSync('app.js', code);
console.log('Updated app.js successfully');
