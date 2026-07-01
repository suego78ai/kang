let state = {
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
  
  filterProgram: document.getElementById("filter-program"),
  filterName: document.getElementById("filter-name"),
  filterSchool: document.getElementById("filter-school"),
  filterDateStart: document.getElementById("filter-date-start"),
  filterDateEnd: document.getElementById("filter-date-end"),
  filterStatus: document.getElementById("filter-status"),
  filterMissing: document.getElementById("filter-missing"),
  
  programList: document.getElementById("program-list"),
  nameList: document.getElementById("name-list"),
  
  chkAll: document.getElementById("chk-all"),
  btnDownloadZip: document.getElementById("btn-download-zip"),
  excelDropZone: document.getElementById("excel-drop-zone"),
  excelFileInput: document.getElementById("excel-file-input"),
  
  modalSchool: document.getElementById("modal-school"),
  modalClassName: document.getElementById("modal-class-name"),
  modalStudentName: document.getElementById("modal-student-name"),
  modalPhone: document.getElementById("modal-phone"),
  modalStatus: document.getElementById("modal-status"),
  modalRole: document.getElementById("modal-role"),
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
    if (!files[`doc${docId}`]) missing.push("미제출");
  }
  return missing;
}

function maskPhone(phone) {
  if (!phone) return "-";
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 11) {
    return `010-****-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `010-***-${cleaned.slice(6)}`;
  }
  return phone; // if totally malformed, return as is
}

const APIService = {
  async checkHealth() {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1000);
      const res = await fetch(`${API_URL}/health`, { signal: controller.signal });
      clearTimeout(id);
      return res.ok;
    } catch (e) {
      return false;
    }
  },
  async login(id, password) {
    const res = await fetch(`${API_URL}/admin/login`, {
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
    if (state.adminToken) headers["Authorization"] = `Bearer ${state.adminToken}`;
    const res = await fetch(`${API_URL}/admin/instructors`, { headers });
    if (!res.ok) throw new Error("Failed to fetch documents");
    const data = await res.json();
    return data.data;
  },
  async updateInstructorDoc(id, docData) {
    const headers = { "Content-Type": "application/json" };
    if (state.adminToken) headers["Authorization"] = `Bearer ${state.adminToken}`;
    const res = await fetch(`${API_URL}/admin/instructors/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(docData)
    });
    if (!res.ok) throw new Error("Failed to update document");
    return await res.json();
  },
  async downloadZip(instructorIds) {
    const headers = { "Content-Type": "application/json" };
    if (state.adminToken) headers["Authorization"] = `Bearer ${state.adminToken}`;
    const res = await fetch(`${API_URL}/admin/download-zip`, {
      method: "POST",
      headers,
      body: JSON.stringify({ instructorIds })
    });
    if (!res.ok) throw new Error("Failed to download ZIP");
    
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `선택_강사_서류_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
};

function populateDatalists() {
  if (!state.instructorDocs) return;
  const programs = new Set();
  const names = new Set();
  
  state.instructorDocs.forEach(d => {
    if (d.className) programs.add(d.className);
    if (d.name) names.add(d.name);
  });
  
  if (DOM.programList) {
    DOM.programList.innerHTML = Array.from(programs).map(p => `<option value="${p}">`).join('');
  }
  if (DOM.nameList) {
    DOM.nameList.innerHTML = Array.from(names).map(n => `<option value="${n}">`).join('');
  }
}

async function initInstructorDocs() {
  if (isOnline) {
    try {
      state.instructorDocs = await APIService.getInstructorDocs();
      populateDatalists();
    } catch (err) {
      showToast("서버에서 데이터를 불러오는데 실패했습니다.", "error");
    }
  }
  renderInstructorDocs();
}

function renderInstructorDocs() {
  if (!DOM.spreadsheetTbody) return;
  DOM.spreadsheetTbody.innerHTML = "";
  
  const fProgram = DOM.filterProgram ? DOM.filterProgram.value.toLowerCase() : "";
  const fName = DOM.filterName ? DOM.filterName.value.toLowerCase() : "";
  const fSchool = DOM.filterSchool ? DOM.filterSchool.value.toLowerCase() : "";
  const fStatus = DOM.filterStatus ? DOM.filterStatus.value : "all";
  const fMissing = DOM.filterMissing ? DOM.filterMissing.value.toLowerCase() : "";
  
  const dStart = DOM.filterDateStart && DOM.filterDateStart.value ? new Date(DOM.filterDateStart.value) : null;
  const dEnd = DOM.filterDateEnd && DOM.filterDateEnd.value ? new Date(DOM.filterDateEnd.value + "T23:59:59") : null;

  let filteredDocs = state.instructorDocs.filter(doc => {
    if (fProgram && !(doc.className || "").toLowerCase().includes(fProgram)) return false;
    if (fName && !(doc.name || "").toLowerCase().includes(fName)) return false;
    if (fSchool && !(doc.school || "").toLowerCase().includes(fSchool)) return false;
    if (fStatus !== "all" && doc.status !== fStatus) return false;
    
    if (dStart || dEnd) {
      if (!doc.last_submission_datetime) return false;
      // parse "2026. 7. 1. 오전 10:30:00" -> tricky. 
      // Fortunately first_submission_date is "YYYYMMDD".
      let subDateStr = doc.first_submission_date; // "20260701"
      if (!subDateStr) return false;
      
      const year = parseInt(subDateStr.substring(0,4));
      const month = parseInt(subDateStr.substring(4,6)) - 1;
      const day = parseInt(subDateStr.substring(6,8));
      const subDate = new Date(year, month, day);
      
      if (dStart && subDate < dStart) return false;
      if (dEnd && subDate > dEnd) return false;
    }
    
    const required = getRequiredDocs(doc.status || "일반", doc.role || "주강사");
    let missingStr = "";
    required.forEach(docId => {
      const missing = checkMissingSubFiles(docId, doc.files);
      if (missing.length > 0) missingStr += ` ${docId}번 ${DOC_TYPES[docId]} ${missing.join(',')}`;
    });
    
    if (fMissing && !missingStr.toLowerCase().includes(fMissing)) return false;
    
    return true;
  });

  if (filteredDocs.length === 0) {
    DOM.spreadsheetTbody.innerHTML = `
      <tr>
        <td colspan="9" class="py-8 text-center text-slate-500">
          <i class="fa-solid fa-folder-open text-3xl mb-2 text-slate-300"></i>
          <p>등록된 강사가 없거나 검색 결과가 없습니다.</p>
        </td>
      </tr>
    `;
    updateDashboardStats();
    return;
  }

  filteredDocs.forEach((doc, index) => {
    const required = getRequiredDocs(doc.status || "일반", doc.role || "주강사");
    let approvedCount = 0;
    let missingDocs = [];

    required.forEach(docId => {
      const missing = checkMissingSubFiles(docId, doc.files);
      if (missing.length === 0) {
        approvedCount++;
      } else {
        if (docId === 6 || docId === 7) missingDocs.push(`${docId}번(${missing.join(',')})`);
        else missingDocs.push(`${docId}번`);
      }
    });

    const isComplete = required.length > 0 && approvedCount === required.length;
    let statusHtml = '';
    if (isComplete) {
      statusHtml = `<span class="text-emerald-600 font-bold text-sm">완료 (${approvedCount}/${required.length})</span>`;
    } else {
      statusHtml = `
        <div class="text-rose-600 font-bold text-sm mb-1">❌ 미제출 (${approvedCount}/${required.length})</div>
        <div class="text-[11px] text-slate-500 leading-tight max-w-[250px] truncate" title="${missingDocs.join(', ')}">
          ${missingDocs.join(', ')}
        </div>
      `;
    }

    const tr = document.createElement("tr");
    tr.className = "border-b border-slate-100 hover:bg-slate-50 transition";
    tr.innerHTML = `
      <td class="p-3 border-r text-center">
        <input type="checkbox" class="chk-row rounded text-inha-blue focus:ring-inha-blue" value="${doc.id}">
      </td>
      <td class="p-3 border-r font-bold text-slate-800 text-sm truncate">${doc.className || '-'}</td>
      <td class="p-3 border-r text-slate-600 truncate text-sm">${doc.school || '-'}</td>
      <td class="p-3 border-r font-bold text-slate-800 text-center">${doc.name || '-'}</td>
      <td class="p-3 border-r text-slate-600 text-center font-mono text-sm">${maskPhone(doc.phone)}</td>
      <td class="p-3 border-r text-slate-500 text-xs text-center">${doc.last_submission_datetime || '-'}</td>
      <td class="p-3 border-r text-center">
        <span class="${doc.status === '교원' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'} px-2 py-1 rounded text-xs font-bold">${doc.status || '일반'}</span>
      </td>
      <td class="p-3 border-r">${statusHtml}</td>
      <td class="p-3 text-center">
        <button class="btn-detail bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold transition" data-id="${doc.id}">상세</button>
      </td>
    `;
    DOM.spreadsheetTbody.appendChild(tr);
  });

  document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      showSubmissionDetails(e.currentTarget.getAttribute('data-id'));
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
  let completeUsers = 0, pendingUsers = 0;
  state.instructorDocs.forEach(doc => {
    const required = getRequiredDocs(doc.status || "일반", doc.role || "주강사");
    let approvedCount = 0;
    required.forEach(docId => {
      if (checkMissingSubFiles(docId, doc.files).length === 0) approvedCount++;
    });
    if (approvedCount === required.length) completeUsers++;
    else pendingUsers++;
  });
  const rate = Math.round((completeUsers / state.instructorDocs.length) * 100);
  if (DOM.overallCompletionRate) DOM.overallCompletionRate.textContent = `${rate}%`;
  if (DOM.overallProgressBar) DOM.overallProgressBar.style.width = `${rate}%`;
  if (DOM.countComplete) DOM.countComplete.textContent = `${completeUsers}명`;
  if (DOM.countPending) DOM.countPending.textContent = `${pendingUsers}명`;
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
  if (DOM.modalRole) DOM.modalRole.value = doc.role || '주강사';
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
    const reqBadge = isRequired ? `<span class="bg-rose-100 text-rose-600 text-[10px] px-1.5 py-0.5 rounded font-bold ml-2">필수</span>` : `<span class="bg-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-bold ml-2">비대상</span>`;
    let missingInfo = '', filesHtml = '';
    if (isRequired) {
      const missing = checkMissingSubFiles(i, doc.files);
      if (missing.length === 0) missingInfo = `<span class="text-emerald-600 text-xs font-bold"><i class="fa-solid fa-check"></i> 모두 제출됨</span>`;
      else missingInfo = `<span class="text-rose-500 text-xs font-bold"><i class="fa-solid fa-xmark"></i> 미제출: ${missing.join(', ')}</span>`;
      if (doc.files) {
        if (i === 6) {
          ['common_id', 'common_bank', 'doc6_resume'].forEach(key => {
            if (doc.files[key]) filesHtml += `<div class="text-xs text-slate-500">${doc.files[key].zipName}</div>`;
          });
        } else if (i === 7) {
          ['common_id_for_doc7', 'common_bank_for_doc7', 'doc7_log'].forEach(key => {
            if (doc.files[key]) filesHtml += `<div class="text-xs text-slate-500">${doc.files[key].zipName}</div>`;
          });
        } else if (i === 9 || i === 10) {
          if (doc.files[i]) doc.files[i].forEach(f => { filesHtml += `<div class="text-xs text-slate-500">${f.round}회차: ${f.zipName}</div>`; });
        } else {
          if (doc.files[`doc${i}`]) filesHtml += `<div class="text-xs text-slate-500">${doc.files[`doc${i}`].zipName}</div>`;
        }
      }
    }
    const html = `
      <div class="p-3 border border-slate-200 rounded-lg ${bgClass} flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <div class="text-sm font-bold text-slate-800">${i}. ${DOC_TYPES[i]} ${reqBadge}</div>
          <div>${missingInfo}</div>
        </div>
        ${filesHtml ? `<div class="mt-1 p-2 bg-slate-50 rounded border border-slate-200">${filesHtml}</div>` : ''}
      </div>`;
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
      state.instructorDocs[docIndex].role = DOM.modalRole.value;
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

if (DOM.chkAll) {
  DOM.chkAll.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    document.querySelectorAll('.chk-row').forEach(chk => { chk.checked = isChecked; });
  });
}

if (DOM.btnDownloadZip) {
  DOM.btnDownloadZip.addEventListener('click', async () => {
    const selectedIds = Array.from(document.querySelectorAll('.chk-row:checked')).map(chk => chk.value);
    if (selectedIds.length === 0) { showToast("다운로드할 강사를 선택해주세요.", "warning"); return; }
    showToast("ZIP 파일 생성을 시작합니다...", "info");
    try { await APIService.downloadZip(selectedIds); showToast("다운로드 성공!", "success"); } catch(err) { showToast("다운로드 실패: " + err.message, "error"); }
  });
}

if (DOM.excelDropZone && DOM.excelFileInput) {
  DOM.excelDropZone.addEventListener('click', () => DOM.excelFileInput.click());
  DOM.excelDropZone.addEventListener('dragover', (e) => { e.preventDefault(); DOM.excelDropZone.classList.add('border-inha-blue', 'bg-blue-50'); });
  DOM.excelDropZone.addEventListener('dragleave', (e) => { e.preventDefault(); DOM.excelDropZone.classList.remove('border-inha-blue', 'bg-blue-50'); });
  DOM.excelDropZone.addEventListener('drop', (e) => {
    e.preventDefault(); DOM.excelDropZone.classList.remove('border-inha-blue', 'bg-blue-50');
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
            id: `inst-${Date.now()}-${Math.random().toString(36).substring(2,9)}`,
            name, phone, school, region, className: program,
            status: "일반", role: "주강사", first_submission_date: null, files: {}
          };
          if (isOnline) {
             try {
                await fetch(`${API_URL}/admin/instructors/bulk-add`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${state.adminToken}` },
                  body: JSON.stringify(newDoc)
                });
             } catch(e) {}
          } else { state.instructorDocs.unshift(newDoc); }
          addedCount++;
        }
      }
    }
    
    showToast(`${addedCount}명의 데이터가 DB에 즉시 자동 등록되었습니다.`, "success");
    if (dropText) dropText.textContent = "엑셀 파일을 이곳에 드래그하거나 클릭하여 업로드하세요.";
    
    if (isOnline) await initInstructorDocs(); else { populateDatalists(); renderInstructorDocs(); }
  };
  reader.readAsArrayBuffer(file);
}


function showToast(message, type = "info") {
  if (!DOM.toastContainer) return;
  const toast = document.createElement("div");
  let bgColor = "bg-slate-800", icon = "fa-info-circle";
  if (type === "success") { bgColor = "bg-emerald-600"; icon = "fa-circle-check"; }
  if (type === "error") { bgColor = "bg-rose-600"; icon = "fa-circle-xmark"; }
  if (type === "warning") { bgColor = "bg-amber-500"; icon = "fa-triangle-exclamation"; }
  toast.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium transform transition-all duration-300 translate-y-4 opacity-0`;
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => { toast.classList.remove("translate-y-4", "opacity-0"); }, 10);
  setTimeout(() => { toast.classList.add("translate-y-4", "opacity-0"); setTimeout(() => toast.remove(), 300); }, 3000);
}

document.addEventListener("DOMContentLoaded", async () => {
  try { isOnline = await APIService.checkHealth(); } catch(e) { isOnline = false; }
  if (state.isAdminAuthenticated) {
    if (DOM.loginSection) DOM.loginSection.style.display = "none";
    if (DOM.adminDashboardSection) DOM.adminDashboardSection.style.display = "block";
    if (DOM.btnAdminLogout) DOM.btnAdminLogout.style.display = "flex";
    initInstructorDocs();
  }
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

if (DOM.adminLoginForm) {
  DOM.adminLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = DOM.loginId.value.trim(), password = DOM.loginPw.value;
    if (isOnline) {
      try {
        const data = await APIService.login(id, password);
        if (data && data.success) {
          state.isAdminAuthenticated = true; state.adminToken = data.token;
          sessionStorage.setItem("digitalsaessak-admin-auth", "true"); sessionStorage.setItem("digitalsaessak-admin-token", data.token);
          DOM.loginSection.style.display = "none"; DOM.adminDashboardSection.style.display = "block"; DOM.btnAdminLogout.style.display = "flex";
          initInstructorDocs();
        }
      } catch(err) { DOM.loginErrorMsg.style.display = "flex"; }
    } else {
      if (id === "dsadmin" && password === "ds2026!") {
        state.isAdminAuthenticated = true; sessionStorage.setItem("digitalsaessak-admin-auth", "true");
        DOM.loginSection.style.display = "none"; DOM.adminDashboardSection.style.display = "block"; DOM.btnAdminLogout.style.display = "flex";
        initInstructorDocs();
      } else { DOM.loginErrorMsg.style.display = "flex"; }
    }
  });
}

if (DOM.btnAdminLogout) {
  DOM.btnAdminLogout.addEventListener("click", () => {
    state.isAdminAuthenticated = false; state.adminToken = "";
    sessionStorage.removeItem("digitalsaessak-admin-auth"); sessionStorage.removeItem("digitalsaessak-admin-token");
    DOM.loginSection.style.display = "block"; DOM.adminDashboardSection.style.display = "none"; DOM.btnAdminLogout.style.display = "none";
  });
}
if (DOM.btnAdminRefresh) {
    DOM.btnAdminRefresh.addEventListener("click", async () => { await initInstructorDocs(); showToast("데이터를 새로고침했습니다.", "success"); });
}
