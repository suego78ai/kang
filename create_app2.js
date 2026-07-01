const fs = require('fs');

const appJsCode = `let state = {
  instructorDocs: [],
  isAdminAuthenticated: sessionStorage.getItem("digitalsaessak-admin-auth") === "true",
  adminToken: sessionStorage.getItem("digitalsaessak-admin-token") || ""
};
const API_URL = "http://localhost:3000/api";
let isOnline = false;

const DOM = {
  adminLoginForm: document.getElementById("admin-login-form"),
  loginId: document.getElementById("login-id"),
  loginPw: document.getElementById("login-pw"),
  loginErrorMsg: document.getElementById("login-error-msg"),
  btnAdminLogout: document.getElementById("btn-admin-logout"),
  loginSection: document.getElementById("login-section"),
  adminDashboardSection: document.getElementById("admin-dashboard-section"),
  spreadsheetTbody: document.getElementById("spreadsheet-tbody"),
  btnAdminRefresh: document.getElementById("btn-admin-refresh"),
  overallCompletionRate: document.getElementById("overall-completion-rate"),
  overallProgressBar: document.getElementById("overall-progress-bar"),
  countComplete: document.getElementById("count-complete"),
  countPending: document.getElementById("count-pending"),
  toastContainer: document.getElementById("toast-container"),
  submissionDetailsModal: document.getElementById("submission-details-modal"),
  
  filterSchool: document.getElementById("filter-school"),
  filterName: document.getElementById("filter-name"),
  filterStatus: document.getElementById("filter-status"),
  filterMissing: document.getElementById("filter-missing"),
  chkAll: document.getElementById("chk-all"),
  btnDownloadZip: document.getElementById("btn-download-zip"),
  excelDropZone: document.getElementById("excel-drop-zone"),
  excelFileInput: document.getElementById("excel-file-input"),
  
  modalSchool: document.getElementById("modal-school"),
  modalClassName: document.getElementById("modal-class-name"),
  modalStudentName: document.getElementById("modal-student-name"),
  modalPhone: document.getElementById("modal-phone"),
  modalStatus: document.getElementById("modal-status"),
  btnSaveInstructorInfo: document.getElementById("btn-save-instructor-info"),
  modalDocsContainer: document.getElementById("modal-docs-container"),
  submissionDetailsClose: document.getElementById("submission-details-close")
};

const DOC_TYPES = {
  1: "성범죄 경력 조회 동의서",
  2: "성범죄 및 아동학대 사실 부존재 확인 서약서",
  3: "현직 교원 출강 안내 및 확인서",
  4: "프로그램 결과보고서",
  5: "식·다과 수령 확인서",
  6: "강사비 신청서",
  7: "일용직 근로자 근로계약서",
  8: "디지털새싹 프로그램 출강 확인서",
  9: "운영 전 체크리스트(매회)",
  10: "운영 후 체크리스트(매회)",
  11: "안전관리 서약서"
};

function getRequiredDocs(status) {
  if (status === "교원") {
    return [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // 1 제외
  } else {
    // 일반 강사
    return [1, 2, 4, 5, 6, 7, 8, 9, 10, 11]; // 3 제외
  }
}

function checkMissingSubFiles(docId, files) {
  if (!files) return ["미제출"];
  const missing = [];
  if (docId === 6) {
    if (!files.common_id) missing.push("신분증");
    if (!files.common_bank) missing.push("통장사본");
    if (!files.doc6_resume) missing.push("이력서");
  } else if (docId === 7) {
    if (!files.common_id_for_doc7) missing.push("신분증");
    if (!files.common_bank_for_doc7) missing.push("통장사본");
    if (!files.doc7_log) missing.push("일일 근로일지");
  } else if (docId === 9 || docId === 10) {
    if (!files[docId] || files[docId].length === 0) missing.push("파일없음");
  } else {
    if (!files[\`doc\${docId}\`]) missing.push("미제출");
  }
  return missing;
}

const APIService = {
  async checkHealth() {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1000);
      const res = await fetch(\`\${API_URL}/health\`, { signal: controller.signal });
      clearTimeout(id);
      return res.ok;
    } catch (e) {
      return false;
    }
  },
  async login(id, password) {
    const res = await fetch(\`\${API_URL}/admin/login\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password })
    });
    if (!res.ok) {
      const err = new Error("ID 또는 비밀번호가 올바르지 않습니다.");
      err.status = res.status;
      throw err;
    }
    return await res.json();
  },
  async getInstructorDocs() {
    const headers = {};
    if (state.adminToken) headers["Authorization"] = \`Bearer \${state.adminToken}\`;
    const res = await fetch(\`\${API_URL}/admin/instructors\`, { headers });
    if (!res.ok) throw new Error("Failed to fetch documents");
    const data = await res.json();
    return data.data;
  },
  async updateInstructorDoc(id, docData) {
    const headers = { "Content-Type": "application/json" };
    if (state.adminToken) headers["Authorization"] = \`Bearer \${state.adminToken}\`;
    const res = await fetch(\`\${API_URL}/admin/instructors/\${id}\`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(docData)
    });
    if (!res.ok) throw new Error("Failed to update document");
    return await res.json();
  },
  async downloadZip(instructorIds) {
    const headers = { "Content-Type": "application/json" };
    if (state.adminToken) headers["Authorization"] = \`Bearer \${state.adminToken}\`;
    const res = await fetch(\`\${API_URL}/admin/download-zip\`, {
      method: "POST",
      headers,
      body: JSON.stringify({ instructorIds })
    });
    if (!res.ok) throw new Error("Failed to download ZIP");
    
    // Trigger download
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`선택_강사_서류_\${Date.now()}.zip\`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
};

async function initInstructorDocs() {
  if (isOnline) {
    try {
      state.instructorDocs = await APIService.getInstructorDocs();
    } catch (err) {
      showToast("서버에서 데이터를 불러오는데 실패했습니다.", "error");
    }
  }
  renderInstructorDocs();
}

function renderInstructorDocs() {
  if (!DOM.spreadsheetTbody) return;
  DOM.spreadsheetTbody.innerHTML = "";
  
  const fSchool = DOM.filterSchool ? DOM.filterSchool.value.toLowerCase() : "";
  const fName = DOM.filterName ? DOM.filterName.value.toLowerCase() : "";
  const fStatus = DOM.filterStatus ? DOM.filterStatus.value : "all";
  const fMissing = DOM.filterMissing ? DOM.filterMissing.value.toLowerCase() : "";

  let filteredDocs = state.instructorDocs.filter(doc => {
    if (fSchool && !(doc.school || "").toLowerCase().includes(fSchool)) return false;
    if (fName && !(doc.name || "").toLowerCase().includes(fName)) return false;
    if (fStatus !== "all" && doc.status !== fStatus) return false;
    
    // calculate missing docs string to filter
    const required = getRequiredDocs(doc.status || "일반");
    let missingStr = "";
    required.forEach(docId => {
      const missing = checkMissingSubFiles(docId, doc.files);
      if (missing.length > 0) {
        missingStr += \` \${docId}번 \${DOC_TYPES[docId]} \${missing.join(',')}\`;
      }
    });
    doc._missingStr = missingStr;
    
    if (fMissing && !missingStr.toLowerCase().includes(fMissing)) return false;
    
    return true;
  });

  if (filteredDocs.length === 0) {
    DOM.spreadsheetTbody.innerHTML = \`
      <tr>
        <td colspan="7" class="py-8 text-center text-slate-500">
          <i class="fa-solid fa-folder-open text-3xl mb-2 text-slate-300"></i>
          <p>등록된 강사가 없거나 검색 결과가 없습니다.</p>
        </td>
      </tr>
    \`;
    updateDashboardStats();
    return;
  }

  filteredDocs.forEach((doc, index) => {
    const required = getRequiredDocs(doc.status || "일반");
    let approvedCount = 0;
    let missingDocs = [];

    required.forEach(docId => {
      const missing = checkMissingSubFiles(docId, doc.files);
      if (missing.length === 0) {
        approvedCount++;
      } else {
        if (docId === 6 || docId === 7) {
          missingDocs.push(\`\${docId}번(\${missing.join(',')})\`);
        } else {
          missingDocs.push(\`\${docId}번\`);
        }
      }
    });

    const isComplete = required.length > 0 && approvedCount === required.length;
    let statusHtml = '';
    if (isComplete) {
      statusHtml = \`<span class="text-emerald-600 font-bold text-sm">완료 (\${approvedCount}/\${required.length})</span>\`;
    } else {
      statusHtml = \`
        <div class="text-rose-600 font-bold text-sm mb-1">❌ 미제출 (\${approvedCount}/\${required.length})</div>
        <div class="text-[11px] text-slate-500 leading-tight max-w-[250px] truncate" title="\${missingDocs.join(', ')}">
          \${missingDocs.join(', ')}
        </div>
      \`;
    }

    const tr = document.createElement("tr");
    tr.className = "border-b border-slate-100 hover:bg-slate-50 transition";
    tr.innerHTML = \`
      <td class="p-3 border-r text-center">
        <input type="checkbox" class="chk-row rounded text-inha-blue focus:ring-inha-blue" value="\${doc.id}">
      </td>
      <td class="p-3 border-r">
        <div class="font-bold text-slate-800 text-sm truncate">\${doc.school || '-'}</div>
        <div class="text-[10px] text-slate-400">\${doc.className || '-'}</div>
      </td>
      <td class="p-3 border-r font-bold text-slate-800 text-center">\${doc.name || '-'}</td>
      <td class="p-3 border-r text-slate-600 text-center">\${doc.phone || '-'}</td>
      <td class="p-3 border-r text-center">
        <span class="\${doc.status === '교원' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'} px-2 py-1 rounded text-xs font-bold">\${doc.status || '일반'}</span>
      </td>
      <td class="p-3 border-r">\${statusHtml}</td>
      <td class="p-3 text-center">
        <button class="btn-detail bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold transition" data-id="\${doc.id}">상세</button>
      </td>
    \`;
    DOM.spreadsheetTbody.appendChild(tr);
  });

  document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      showSubmissionDetails(id);
    });
  });

  updateDashboardStats();
}

function updateDashboardStats() {
  if (!state.instructorDocs || state.instructorDocs.length === 0) {
    if (DOM.overallCompletionRate) DOM.overallCompletionRate.textContent = "0%";
    if (DOM.overallProgressBar) DOM.overallProgressBar.style.width = "0%";
    if (DOM.countComplete) DOM.countComplete.textContent = "0명";
    if (DOM.countPending) DOM.countPending.textContent = "0명";
    return;
  }

  let completeUsers = 0;
  let pendingUsers = 0;

  state.instructorDocs.forEach(doc => {
    const required = getRequiredDocs(doc.status || "일반");
    let approvedCount = 0;
    required.forEach(docId => {
      if (checkMissingSubFiles(docId, doc.files).length === 0) approvedCount++;
    });
    if (approvedCount === required.length) completeUsers++;
    else pendingUsers++;
  });

  const rate = state.instructorDocs.length === 0 ? 0 : Math.round((completeUsers / state.instructorDocs.length) * 100);

  if (DOM.overallCompletionRate) DOM.overallCompletionRate.textContent = \`\${rate}%\`;
  if (DOM.overallProgressBar) DOM.overallProgressBar.style.width = \`\${rate}%\`;
  if (DOM.countComplete) DOM.countComplete.textContent = \`\${completeUsers}명\`;
  if (DOM.countPending) DOM.countPending.textContent = \`\${pendingUsers}명\`;
}

let currentEditingId = null;

function showSubmissionDetails(id) {
  const doc = state.instructorDocs.find(d => d.id === id);
  if (!doc) return;
  currentEditingId = id;

  if (DOM.modalSchool) DOM.modalSchool.value = doc.school || '';
  if (DOM.modalClassName) DOM.modalClassName.value = doc.className || '';
  if (DOM.modalStudentName) DOM.modalStudentName.value = doc.name || '';
  if (DOM.modalPhone) DOM.modalPhone.value = doc.phone || '';
  if (DOM.modalStatus) DOM.modalStatus.value = doc.status || '일반';

  renderModalDocs(doc);

  if (DOM.submissionDetailsModal) {
    DOM.submissionDetailsModal.style.display = 'flex';
    setTimeout(() => { DOM.submissionDetailsModal.style.opacity = '1'; }, 10);
  }
}

function renderModalDocs(doc) {
  if (!DOM.modalDocsContainer) return;
  DOM.modalDocsContainer.innerHTML = '';
  
  const required = getRequiredDocs(doc.status || '일반');

  for (let i = 1; i <= 11; i++) {
    const isRequired = required.includes(i);
    const bgClass = isRequired ? 'bg-white' : 'bg-slate-100 opacity-60 grayscale';
    const reqBadge = isRequired ? \`<span class="bg-rose-100 text-rose-600 text-[10px] px-1.5 py-0.5 rounded font-bold ml-2">필수</span>\` : \`<span class="bg-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-bold ml-2">비대상</span>\`;
    
    let missingInfo = '';
    let filesHtml = '';
    
    if (isRequired) {
      const missing = checkMissingSubFiles(i, doc.files);
      if (missing.length === 0) {
        missingInfo = \`<span class="text-emerald-600 text-xs font-bold"><i class="fa-solid fa-check"></i> 모두 제출됨</span>\`;
      } else {
        missingInfo = \`<span class="text-rose-500 text-xs font-bold"><i class="fa-solid fa-xmark"></i> 미제출: \${missing.join(', ')}</span>\`;
      }
      
      // Render file list if submitted
      if (doc.files) {
        if (i === 6) {
          ['common_id', 'common_bank', 'doc6_resume'].forEach(key => {
            if (doc.files[key]) filesHtml += \`<div class="text-xs text-slate-500">\${doc.files[key].zipName}</div>\`;
          });
        } else if (i === 7) {
          ['common_id_for_doc7', 'common_bank_for_doc7', 'doc7_log'].forEach(key => {
            if (doc.files[key]) filesHtml += \`<div class="text-xs text-slate-500">\${doc.files[key].zipName}</div>\`;
          });
        } else if (i === 9 || i === 10) {
          if (doc.files[i]) {
            doc.files[i].forEach(f => {
              filesHtml += \`<div class="text-xs text-slate-500">\${f.round}회차: \${f.zipName}</div>\`;
            });
          }
        } else {
          if (doc.files[\`doc\${i}\`]) filesHtml += \`<div class="text-xs text-slate-500">\${doc.files[\`doc\${i}\`].zipName}</div>\`;
        }
      }
    }

    const html = \`
      <div class="p-3 border border-slate-200 rounded-lg \${bgClass} flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <div class="text-sm font-bold text-slate-800">\${i}. \${DOC_TYPES[i]} \${reqBadge}</div>
          <div>\${missingInfo}</div>
        </div>
        \${filesHtml ? \`<div class="mt-1 p-2 bg-slate-50 rounded border border-slate-200">\${filesHtml}</div>\` : ''}
      </div>
    \`;
    DOM.modalDocsContainer.insertAdjacentHTML('beforeend', html);
  }
}

if (DOM.btnSaveInstructorInfo) {
  DOM.btnSaveInstructorInfo.addEventListener('click', async () => {
    if (!currentEditingId) return;
    const docIndex = state.instructorDocs.findIndex(d => d.id === currentEditingId);
    if (docIndex > -1) {
      state.instructorDocs[docIndex].school = DOM.modalSchool.value;
      state.instructorDocs[docIndex].className = DOM.modalClassName.value;
      state.instructorDocs[docIndex].name = DOM.modalStudentName.value;
      state.instructorDocs[docIndex].phone = DOM.modalPhone.value;
      state.instructorDocs[docIndex].status = DOM.modalStatus.value;
      
      if (isOnline) {
        try { await APIService.updateInstructorDoc(currentEditingId, state.instructorDocs[docIndex]); } catch(e) {}
      }

      showToast("기본 정보가 저장되었습니다.", "success");
      renderModalDocs(state.instructorDocs[docIndex]);
      renderInstructorDocs();
    }
  });
}

if (DOM.submissionDetailsClose) {
  DOM.submissionDetailsClose.addEventListener("click", () => {
    DOM.submissionDetailsModal.style.opacity = '0';
    setTimeout(() => { DOM.submissionDetailsModal.style.display = 'none'; }, 300);
  });
}

// Check all
if (DOM.chkAll) {
  DOM.chkAll.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    document.querySelectorAll('.chk-row').forEach(chk => {
      chk.checked = isChecked;
    });
  });
}

if (DOM.btnDownloadZip) {
  DOM.btnDownloadZip.addEventListener('click', async () => {
    const selectedIds = Array.from(document.querySelectorAll('.chk-row:checked')).map(chk => chk.value);
    if (selectedIds.length === 0) {
      showToast("다운로드할 강사를 선택해주세요.", "warning");
      return;
    }
    showToast("ZIP 파일 생성을 시작합니다...", "info");
    try {
      await APIService.downloadZip(selectedIds);
      showToast("다운로드 성공!", "success");
    } catch(err) {
      showToast("다운로드 실패: " + err.message, "error");
    }
  });
}

// Excel Parsing
if (DOM.excelDropZone && DOM.excelFileInput) {
  DOM.excelDropZone.addEventListener('click', () => DOM.excelFileInput.click());
  DOM.excelDropZone.addEventListener('dragover', (e) => { e.preventDefault(); DOM.excelDropZone.classList.add('border-inha-blue', 'bg-blue-50'); });
  DOM.excelDropZone.addEventListener('dragleave', (e) => { e.preventDefault(); DOM.excelDropZone.classList.remove('border-inha-blue', 'bg-blue-50'); });
  DOM.excelDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    DOM.excelDropZone.classList.remove('border-inha-blue', 'bg-blue-50');
    if (e.dataTransfer.files.length > 0) handleExcelFile(e.dataTransfer.files[0]);
  });
  DOM.excelFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleExcelFile(e.target.files[0]);
  });
}

async function handleExcelFile(file) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, {type: 'array'});
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    
    // Parse mapping: 학교명, 권역, 담당자, 전화번호, 프로그램
    let addedCount = 0;
    for (let row of json) {
      const name = row['담당자'];
      const phone = String(row['전화번호'] || '');
      const school = row['학교명'];
      const region = row['권역'];
      const program = row['프로그램'];

      if (name && phone) {
        // Find if exists
        const exists = state.instructorDocs.find(d => d.name === name && d.phone === phone);
        if (!exists) {
          const newDoc = {
            id: \`inst-\${Date.now()}-\${Math.random().toString(36).substring(2,9)}\`,
            name, phone, school, region, className: program,
            status: "일반", // default
            first_submission_date: null,
            files: {}
          };
          
          if (isOnline) {
             try {
                // To keep it simple, we use a single update endpoint.
                // In production, we'd use a bulk POST endpoint. For now, just add to state and we will patch individually.
                await fetch(\`\${API_URL}/admin/instructors/bulk-add\`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${state.adminToken}\` },
                  body: JSON.stringify(newDoc)
                });
             } catch(e) { console.error(e); }
          } else {
             state.instructorDocs.unshift(newDoc);
          }
          addedCount++;
        }
      }
    }
    showToast(\`\${addedCount}명의 강사 명단이 등록되었습니다.\`, "success");
    if (isOnline) {
      await initInstructorDocs();
    } else {
      renderInstructorDocs();
    }
  };
  reader.readAsArrayBuffer(file);
}

function showToast(message, type = "info") {
  if (!DOM.toastContainer) return;
  const toast = document.createElement("div");
  let bgColor = "bg-slate-800";
  let icon = "fa-info-circle";
  if (type === "success") { bgColor = "bg-emerald-600"; icon = "fa-circle-check"; }
  if (type === "error") { bgColor = "bg-rose-600"; icon = "fa-circle-xmark"; }
  if (type === "warning") { bgColor = "bg-amber-500"; icon = "fa-triangle-exclamation"; }

  toast.className = \`\${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium transform transition-all duration-300 translate-y-4 opacity-0\`;
  toast.innerHTML = \`<i class="fa-solid \${icon}"></i> <span>\${message}</span>\`;
  
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => { toast.classList.remove("translate-y-4", "opacity-0"); }, 10);
  setTimeout(() => {
    toast.classList.add("translate-y-4", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    isOnline = await APIService.checkHealth();
  } catch(e) { isOnline = false; }
  
  if (state.isAdminAuthenticated) {
    if (DOM.loginSection) DOM.loginSection.style.display = "none";
    if (DOM.adminDashboardSection) DOM.adminDashboardSection.style.display = "block";
    if (DOM.btnAdminLogout) DOM.btnAdminLogout.style.display = "flex";
    initInstructorDocs();
  }

  // Filter Event Listeners
  if (DOM.filterSchool) DOM.filterSchool.addEventListener("input", renderInstructorDocs);
  if (DOM.filterName) DOM.filterName.addEventListener("input", renderInstructorDocs);
  if (DOM.filterStatus) DOM.filterStatus.addEventListener("change", renderInstructorDocs);
  if (DOM.filterMissing) DOM.filterMissing.addEventListener("input", renderInstructorDocs);
});

if (DOM.adminLoginForm) {
  DOM.adminLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = DOM.loginId.value.trim();
    const password = DOM.loginPw.value;
    
    if (isOnline) {
      try {
        const data = await APIService.login(id, password);
        if (data && data.success) {
          state.isAdminAuthenticated = true;
          state.adminToken = data.token;
          sessionStorage.setItem("digitalsaessak-admin-auth", "true");
          sessionStorage.setItem("digitalsaessak-admin-token", data.token);
          DOM.loginSection.style.display = "none";
          DOM.adminDashboardSection.style.display = "block";
          DOM.btnAdminLogout.style.display = "flex";
          initInstructorDocs();
        }
      } catch(err) {
        DOM.loginErrorMsg.style.display = "flex";
      }
    } else {
      if (id === "dsadmin" && password === "ds2026!") {
        state.isAdminAuthenticated = true;
        sessionStorage.setItem("digitalsaessak-admin-auth", "true");
        DOM.loginSection.style.display = "none";
        DOM.adminDashboardSection.style.display = "block";
        DOM.btnAdminLogout.style.display = "flex";
        initInstructorDocs();
      } else {
        DOM.loginErrorMsg.style.display = "flex";
      }
    }
  });
}

if (DOM.btnAdminLogout) {
  DOM.btnAdminLogout.addEventListener("click", () => {
    state.isAdminAuthenticated = false;
    state.adminToken = "";
    sessionStorage.removeItem("digitalsaessak-admin-auth");
    sessionStorage.removeItem("digitalsaessak-admin-token");
    DOM.loginSection.style.display = "block";
    DOM.adminDashboardSection.style.display = "none";
    DOM.btnAdminLogout.style.display = "none";
  });
}

if (DOM.btnAdminRefresh) {
    DOM.btnAdminRefresh.addEventListener("click", async () => {
        await initInstructorDocs();
        showToast("데이터를 새로고침했습니다.", "success");
    });
}
`;

fs.writeFileSync('app.js', appJsCode, 'utf8');
console.log('Successfully updated app.js');
