let state = {
  instructorDocs: [],
  pendingExcelDocs: [],
  isAdminAuthenticated: sessionStorage.getItem("digitalsaessak-admin-auth") === "true",
  adminToken: sessionStorage.getItem("digitalsaessak-admin-token") || ""
};
const API_URL = "/api";
let isOnline = false;
let currentPage = 1;
const itemsPerPage = 20;

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
    return `010-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `010-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone; 
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
      if (!doc.first_submission_date) return false;
      let subDateStr = doc.first_submission_date;
      const year = parseInt(subDateStr.substring(0,4));
      const month = parseInt(subDateStr.substring(4,6)) - 1;
      const day = parseInt(subDateStr.substring(6,8));
      const subDate = new Date(year, month, day);
      if (dStart && subDate < dStart) return false;
      if (dEnd && subDate > dEnd) return false;
    }
    
    const required = getRequiredDocs(doc.status || "일반", doc.role || "주강사");
    let missingStr = "";
    if (doc.files) {
       const missing = checkMissingSubFiles(6, doc.files);
       if(missing.length) missingStr += " 강사비";
       const missing7 = checkMissingSubFiles(7, doc.files);
       if(missing7.length) missingStr += " 근로";
    }
    for (let docId of required) {
      if (docId !== 6 && docId !== 7) {
        if (!doc.files || !doc.files[docId] || doc.files[docId].length === 0) {
          missingStr += " " + (DOC_TYPES[docId] || "");
        }
      }
    }
    if (fMissing && !missingStr.toLowerCase().includes(fMissing)) return false;
    return true;
  });

  let totalCount = filteredDocs.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pagedDocs = filteredDocs.slice(startIndex, endIndex);

  let completeCount = 0;
  const rowsHtml = pagedDocs.map((doc, idx) => {
    const required = getRequiredDocs(doc.status || "일반", doc.role || "주강사");
    let isRowComplete = true;
    for (let docId of required) {
      if (checkMissingSubFiles(docId, doc.files).length > 0) isRowComplete = false;
    }
    if (isRowComplete) completeCount++;
    
    return `<tr class="border-b border-slate-100 hover:bg-slate-50 transition">
      <td class="p-3 text-center border-r"><input type="checkbox" class="row-chk rounded text-inha-blue focus:ring-inha-blue" value="${doc.id}"></td>
      <td class="p-3 border-r text-slate-800 font-medium whitespace-nowrap">
        ${doc.isPending ? '<span class="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded mr-1 font-bold">[저장 대기]</span>' : ''}
        ${doc.isSaved ? '<span class="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded mr-1 font-bold">[저장 완료]</span>' : ''}
        ${doc.className || '-'}
      </td>
      <td class="p-3 border-r text-slate-600 whitespace-nowrap">${doc.school || '-'}</td>
      <td class="p-3 border-r font-bold text-slate-800 text-center">${doc.name || '-'}</td>
      <td class="p-3 border-r text-slate-600 text-center whitespace-nowrap">${maskPhone(doc.phone)}</td>
      <td class="p-3 border-r text-xs text-slate-500 text-center whitespace-nowrap">${doc.last_submission_datetime || '-'}</td>
      <td class="p-3 border-r text-center">
        <span class="px-2 py-1 rounded text-xs font-bold ${doc.status === '교원' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}">
          ${doc.status || '일반'}
        </span>
      </td>
      <td class="p-3 border-r text-center">
        <span class="px-2 py-1 rounded text-xs font-bold bg-blue-50 text-inha-blue border border-blue-100">
          ${doc.role || '-'}
        </span>
      </td>
      <td class="p-3 border-r">
        ${isRowComplete 
          ? '<span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200"><i class="fa-solid fa-check"></i> 모든 서류 완비</span>' 
          : '<span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200"><i class="fa-solid fa-triangle-exclamation"></i> 보완 필요</span>'
        }
      </td>
      <td class="p-3 text-center">
        <button class="btn-detail bg-slate-100 hover:bg-inha-blue hover:text-white text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm" data-id="${doc.id}">
          <i class="fa-solid fa-folder-open"></i> 상세
        </button>
      </td>
    </tr>`;
  }).join('');
  
  if (pagedDocs.length === 0) {
    DOM.spreadsheetTbody.innerHTML = `<tr><td colspan="10" class="py-8 text-center text-slate-500"><i class="fa-solid fa-folder-open text-3xl mb-2 text-slate-300"></i><p>등록된 강사가 없거나 검색 결과가 없습니다.</p></td></tr>`;
  } else {
    DOM.spreadsheetTbody.innerHTML = rowsHtml;
  }
  
  let overallComplete = 0;
  filteredDocs.forEach(d => {
      let c = true;
      const reqs = getRequiredDocs(d.status || "일반", d.role || "주강사");
      for(let docId of reqs) {
          if (checkMissingSubFiles(docId, d.files).length > 0) c = false;
      }
      if(c) overallComplete++;
  });
  
  if (DOM.countComplete) DOM.countComplete.textContent = overallComplete + "명";
  if (DOM.countPending) DOM.countPending.textContent = (totalCount - overallComplete) + "명";
  if (DOM.overallCompletionRate) {
    const rate = totalCount === 0 ? 0 : Math.round((overallComplete / totalCount) * 100);
    DOM.overallCompletionRate.textContent = rate + "%";
    DOM.overallProgressBar.style.width = rate + "%";
  }

  document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      showSubmissionDetails(e.currentTarget.getAttribute('data-id'));
    });
  });
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const container = document.getElementById("pagination-container");
  if (!container) return;
  if (totalPages <= 1) { container.innerHTML = ""; return; }
  
  let html = `<button class="px-3 py-1 rounded border ${currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white hover:bg-slate-100'} transition" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i> 이전</button>`;
  
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += `<button class="px-3 py-1 rounded bg-inha-blue text-white font-bold shadow-md">${i}</button>`;
    } else {
      if (totalPages > 10 && i > 3 && i < totalPages - 2 && Math.abs(i - currentPage) > 2) {
         if (Math.abs(i - currentPage) === 3) html += `<span class="px-2 text-slate-400">...</span>`;
         continue;
      }
      html += `<button class="px-3 py-1 rounded border bg-white hover:bg-slate-100 transition" onclick="changePage(${i})">${i}</button>`;
    }
  }
  
  html += `<button class="px-3 py-1 rounded border ${currentPage === totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white hover:bg-slate-100'} transition" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>다음 <i class="fa-solid fa-chevron-right"></i></button>`;
  container.innerHTML = html;
}

window.changePage = function(page) {
  currentPage = page;
  renderInstructorDocs();
};

function updateDashboardStats() {
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
    const selectedIds = Array.from(document.querySelectorAll('.row-chk:checked')).map(chk => chk.value);
    if (selectedIds.length === 0) { showToast("다운로드할 강사를 선택해주세요.", "warning"); return; }
    showToast("ZIP 파일 생성을 시작합니다...", "info");
    try { await APIService.downloadZip(selectedIds); showToast("다운로드 성공!", "success"); } catch(err) { showToast("다운로드 실패: " + err.message, "error"); }
  });
}

const btnResetData = document.getElementById("btn-reset-data");
if (btnResetData) {
  btnResetData.addEventListener('click', async () => {
    if (!confirm("모든 데이터를 초기화하시겠습니까? (이 작업은 되돌릴 수 없습니다)")) return;
    try {
      const res = await fetch(`${API_URL}/admin/instructors/reset`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${state.adminToken}` }
      });
      if (res.ok) {
        state.instructorDocs = [];
        currentPage = 1;
        renderInstructorDocs();
        showToast("데이터가 모두 초기화되었습니다.", "success");
      } else {
        showToast("데이터 초기화에 실패했습니다.", "error");
      }
    } catch(err) {
      showToast("서버 오류로 초기화에 실패했습니다.", "error");
    }
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
    
    const newDocs = [];
    for (let row of json) {
      const name = (row['담당자'] || '').trim();
      const phoneRaw = String(row['전화번호'] || '').replace(/-/g, '');
      const phone = phoneRaw.length === 10 && phoneRaw.startsWith('10') ? '0' + phoneRaw : phoneRaw;
      const school = row['학교명'] || '';
      const region = row['권역'] || '';
      const program = row['프로그램'] || '';
      
      if (name) {
        const newDoc = {
          id: `inst-${Date.now()}-${Math.random().toString(36).substring(2,9)}`,
          name, phone, school, region, className: program,
          status: "일반", role: "", first_submission_date: null, files: {}
        };
        newDocs.push(newDoc);
      }
    }
    
    if (newDocs.length > 0) {
      // Mark as pending
      newDocs.forEach(d => d.isPending = true);
      state.pendingExcelDocs = newDocs;
      
      // Merge for preview
      state.instructorDocs = [...state.pendingExcelDocs, ...state.instructorDocs.filter(d => !d.isPending)];
      
      // Show action buttons
      const btnGroup = document.getElementById('excel-action-buttons');
      if (btnGroup) btnGroup.classList.remove('hidden');
    }
    
    showToast(`${newDocs.length}건의 데이터가 읽혀졌습니다. [DB에 최종 등록] 버튼을 눌러야 저장됩니다.`, "info");
    if (dropText) dropText.textContent = "엑셀 파일을 이곳에 드래그하거나 클릭하여 업로드하세요.";
    
    populateDatalists();
    renderInstructorDocs();
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
    btnSearch.addEventListener("click", () => {
      currentPage = 1;
      renderInstructorDocs();
    });
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
      currentPage = 1;
      renderInstructorDocs();
      showToast("전체 리스트가 표시되었습니다.", "info");
    });
  }
  
  const btnExcelSave = document.getElementById("btn-excel-save");
  const btnExcelCancel = document.getElementById("btn-excel-cancel");
  
  if (btnExcelSave) {
    btnExcelSave.addEventListener("click", async () => {
      if (state.pendingExcelDocs.length === 0) return;
      
      const btnGroup = document.getElementById('excel-action-buttons');
      const dropText = document.getElementById('excel-drop-text');
      if (dropText) dropText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> DB에 저장 중...';
      
      let successCount = 0;
      if (isOnline) {
        for(let doc of state.pendingExcelDocs) {
           try {
             // Create a copy without isPending
             const payload = { ...doc };
             delete payload.isPending;
             const res = await fetch(`${API_URL}/admin/instructors/bulk-add`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${state.adminToken}` },
               body: JSON.stringify(payload)
             });
             if (res.ok) successCount++;
           } catch(err) {}
        }
      } else {
         const offlineDocs = state.pendingExcelDocs.map(d => {
           const copy = { ...d };
           delete copy.isPending;
           return copy;
         });
         state.instructorDocs.unshift(...offlineDocs);
         successCount = offlineDocs.length;
      }
      
      const savedIds = state.pendingExcelDocs.map(d => d.id);
      state.pendingExcelDocs = [];
      if (btnGroup) btnGroup.classList.add('hidden');
      if (dropText) dropText.textContent = "엑셀 파일을 이곳에 드래그하거나 클릭하여 업로드하세요.";
      showToast(`${successCount}명의 데이터가 DB에 최종 등록되었습니다.`, "success");
      
      if (isOnline) {
        await initInstructorDocs();
      } else { 
        populateDatalists(); 
      }
      
      // Tag as saved
      state.instructorDocs.forEach(d => {
        if (savedIds.includes(d.id)) d.isSaved = true;
      });
      renderInstructorDocs();
      
      // Remove badge after 5 seconds
      setTimeout(() => {
        state.instructorDocs.forEach(d => d.isSaved = false);
        renderInstructorDocs();
      }, 5000);
    });
  }
  
  if (btnExcelCancel) {
    btnExcelCancel.addEventListener("click", () => {
      state.pendingExcelDocs = [];
      const btnGroup = document.getElementById('excel-action-buttons');
      if (btnGroup) btnGroup.classList.add('hidden');
      showToast("엑셀 업로드가 취소되었습니다.", "info");
      
      // Remove pending docs from existing state and re-render
      state.instructorDocs = state.instructorDocs.filter(d => !d.isPending);
      renderInstructorDocs();
    });
  }
  
  // Add enter key support for text inputs
  ['filterProgram', 'filterName', 'filterSchool', 'filterMissing'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          currentPage = 1;
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
