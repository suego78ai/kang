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
  countReview: document.getElementById("count-review"),
  countPending: document.getElementById("count-pending"),
  toastContainer: document.getElementById("toast-container"),
  submissionDetailsModal: document.getElementById("submission-details-modal"),
  
  filterStatus: document.getElementById("filter-status"),
  filterRole: document.getElementById("filter-role"),
  filterName: document.getElementById("filter-name"),
  
  modalClassName: document.getElementById("modal-class-name"),
  modalStudentName: document.getElementById("modal-student-name"),
  modalEmail: document.getElementById("modal-email"),
  modalStatus: document.getElementById("modal-status"),
  modalRole: document.getElementById("modal-role"),
  btnSaveInstructorInfo: document.getElementById("btn-save-instructor-info"),
  modalDocsContainer: document.getElementById("modal-docs-container"),
  submissionDetailsClose: document.getElementById("submission-details-close")
};

const DOC_TYPES = {
  1: "성범죄 경력 조회 동의서",
  2: "성범죄 및 아동학대 사실 부존재 확인 서약서",
  3: "현직 교원의 디지털새싹 출강을 위한 안내 및 확인서",
  4: "프로그램 결과보고서(양식)",
  5: "식·다과 수령 확인서(스캔본)",
  6: "강사비 신청서",
  7: "일용직 근로자 근로계약서",
  8: "디지털새싹 프로그램 출강 확인서",
  9: "운영 전 체크리스트(매회 제출)",
  10: "운영 후 체크리스트(매회 제출)",
  11: "안전관리 서약서"
};

function getRequiredDocs(status, role) {
  if (status === "교원") {
    if (role === "주강사") return [3, 4, 5, 6, 8];
    if (role === "보조강사") return [6];
    if (role === "운영요원") return [1, 2, 7, 9, 10, 11];
    if (role === "안전요원") return [1, 2, 7, 11];
  } else if (status === "프리랜서") {
    if (role === "주강사") return [1, 2, 4, 5, 6];
    if (role === "보조강사") return [6];
    if (role === "운영요원") return [1, 2, 7, 9, 10, 11];
    if (role === "안전요원") return [1, 2, 7, 11];
  }
  return [];
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
    const res = await fetch(\`\${API_URL}/admin/instructor-docs\`, { headers });
    if (!res.ok) throw new Error("Failed to fetch documents");
    const data = await res.json();
    return data.data;
  },
  async updateInstructorDoc(id, docData) {
    const headers = { "Content-Type": "application/json" };
    if (state.adminToken) headers["Authorization"] = \`Bearer \${state.adminToken}\`;
    const res = await fetch(\`\${API_URL}/admin/instructor-docs/\${id}\`, {
      method: "PUT",
      headers,
      body: JSON.stringify(docData)
    });
    if (!res.ok) throw new Error("Failed to update document");
    return await res.json();
  },
  async deleteInstructorDoc(id) {
    const headers = {};
    if (state.adminToken) headers["Authorization"] = \`Bearer \${state.adminToken}\`;
    const res = await fetch(\`\${API_URL}/admin/instructor-docs/\${id}\`, {
      method: "DELETE",
      headers
    });
    if (!res.ok) throw new Error("Failed to delete document");
    return await res.json();
  }
};

async function initInstructorDocs() {
  if (isOnline) {
    try {
      state.instructorDocs = await APIService.getInstructorDocs();
      saveInstructorDocs();
    } catch (err) {
      showToast("서버에서 데이터를 불러오는데 실패했습니다.", "error");
      loadInstructorDocsFromLocalStorage();
    }
  } else {
    loadInstructorDocsFromLocalStorage();
  }
  renderInstructorDocs();
}

function loadInstructorDocsFromLocalStorage() {
  const saved = localStorage.getItem("digitalsaessak-instructor-docs");
  if (saved) {
    try {
      state.instructorDocs = JSON.parse(saved);
    } catch(e) {
      state.instructorDocs = [];
    }
  } else {
    state.instructorDocs = [];
  }
}

function saveInstructorDocs() {
  localStorage.setItem("digitalsaessak-instructor-docs", JSON.stringify(state.instructorDocs));
  if (isOnline && state.instructorDocs.length > 0) {
    // Only saving to local for offline sim mostly, real save happens on edit
  }
}

function renderInstructorDocs() {
  if (!DOM.spreadsheetTbody) return;
  DOM.spreadsheetTbody.innerHTML = "";
  
  const fStatus = DOM.filterStatus ? DOM.filterStatus.value : "all";
  const fRole = DOM.filterRole ? DOM.filterRole.value : "all";
  const fName = DOM.filterName ? DOM.filterName.value.toLowerCase() : "";

  let filteredDocs = state.instructorDocs.filter(doc => {
    if (fStatus !== "all" && doc.status !== fStatus) return false;
    if (fRole !== "all" && doc.role !== fRole) return false;
    if (fName && !doc.studentName.toLowerCase().includes(fName)) return false;
    return true;
  });

  if (filteredDocs.length === 0) {
    DOM.spreadsheetTbody.innerHTML = \`
      <tr>
        <td colspan="5" class="py-8 text-center text-slate-500">
          <i class="fa-solid fa-folder-open text-3xl mb-2 text-slate-300"></i>
          <p>등록된 강사 서류가 없습니다.</p>
        </td>
      </tr>
    \`;
    updateDashboardStats();
    return;
  }

  filteredDocs.forEach((doc, index) => {
    const required = getRequiredDocs(doc.status, doc.role);
    let approvedCount = 0;
    let missingDocs = [];

    required.forEach(docId => {
      const docStatus = doc[\`doc\${docId}Status\`] || "pending";
      if (docStatus === "approved") {
        approvedCount++;
      } else {
        missingDocs.push(DOC_TYPES[docId]);
      }
    });

    const isComplete = required.length > 0 && approvedCount === required.length;
    let statusHtml = '';
    if (required.length === 0) {
      statusHtml = \`<span class="text-slate-400 text-xs">필요 서류 없음</span>\`;
    } else if (isComplete) {
      statusHtml = \`<span class="text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-1 rounded">제출 \${approvedCount}/\${required.length} (완료)</span>\`;
    } else {
      statusHtml = \`
        <div class="text-rose-600 font-bold text-sm bg-rose-50 px-2 py-1 rounded inline-block mb-1">제출 \${approvedCount}/\${required.length} (미비)</div>
        <div class="text-[10px] text-slate-500 leading-tight max-w-[200px] truncate" title="\${missingDocs.join(', ')}">
          미제출: \${missingDocs.join(', ')}
        </div>
      \`;
    }

    const tr = document.createElement("tr");
    tr.className = "border-b border-slate-100 hover:bg-slate-50 transition";
    tr.innerHTML = \`
      <td class="p-3 border-r text-center text-slate-400 font-mono text-xs">\${index + 1}</td>
      <td class="p-3 border-r">
        <div class="font-bold text-slate-800 text-sm">\${doc.className || '-'}</div>
      </td>
      <td class="p-3 border-r">
        <div class="font-bold text-slate-800">\${doc.studentName || '-'}</div>
        <div class="text-xs text-slate-500 mt-0.5"><span class="bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">\${doc.status || '미지정'}</span> <span class="bg-inha-light text-inha-navy px-1.5 py-0.5 rounded">\${doc.role || '미지정'}</span></div>
      </td>
      <td class="p-3 border-r">
        \${statusHtml}
      </td>
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
    if (DOM.countComplete) DOM.countComplete.textContent = "0개";
    if (DOM.countReview) DOM.countReview.textContent = "0개";
    if (DOM.countPending) DOM.countPending.textContent = "0개";
    return;
  }

  let totalRequiredDocs = 0;
  let totalApprovedDocs = 0;
  let totalPendingDocs = 0; // count of required but pending
  let totalReviewDocs = 0; // count of required but review

  state.instructorDocs.forEach(doc => {
    const required = getRequiredDocs(doc.status, doc.role);
    totalRequiredDocs += required.length;
    required.forEach(docId => {
      const st = doc[\`doc\${docId}Status\`] || "pending";
      if (st === "approved") totalApprovedDocs++;
      else if (st === "review") totalReviewDocs++;
      else totalPendingDocs++;
    });
  });

  const rate = totalRequiredDocs === 0 ? 0 : Math.round((totalApprovedDocs / totalRequiredDocs) * 100);

  if (DOM.overallCompletionRate) DOM.overallCompletionRate.textContent = \`\${rate}%\`;
  if (DOM.overallProgressBar) DOM.overallProgressBar.style.width = \`\${rate}%\`;
  if (DOM.countComplete) DOM.countComplete.textContent = \`\${totalApprovedDocs}개\`;
  if (DOM.countReview) DOM.countReview.textContent = \`\${totalReviewDocs}개\`;
  if (DOM.countPending) DOM.countPending.textContent = \`\${totalPendingDocs}개\`;
}

let currentEditingId = null;

function showSubmissionDetails(id) {
  const doc = state.instructorDocs.find(d => d.id === id);
  if (!doc) return;
  currentEditingId = id;

  if (DOM.modalClassName) DOM.modalClassName.value = doc.className || '';
  if (DOM.modalStudentName) DOM.modalStudentName.value = doc.studentName || '';
  if (DOM.modalEmail) DOM.modalEmail.value = doc.guardianEmail || '';
  if (DOM.modalStatus) DOM.modalStatus.value = doc.status || '교원';
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
  
  const required = getRequiredDocs(doc.status || '교원', doc.role || '주강사');

  for (let i = 1; i <= 11; i++) {
    const isRequired = required.includes(i);
    const docStatus = doc[\`doc\${i}Status\`] || 'pending';
    const docUrl = doc[\`doc\${i}Url\`] || '';

    const bgClass = isRequired ? 'bg-white' : 'bg-slate-100 opacity-60 grayscale';
    const reqBadge = isRequired ? \`<span class="bg-rose-100 text-rose-600 text-[10px] px-1.5 py-0.5 rounded font-bold ml-2">필수</span>\` : \`<span class="bg-slate-200 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-bold ml-2">비대상</span>\`;
    
    let statusSelect = '';
    if (isRequired) {
      statusSelect = \`
        <select class="status-select border border-slate-300 rounded text-xs px-2 py-1 focus:ring-inha-blue" data-doc-id="\${i}">
          <option value="pending" \${docStatus === 'pending' ? 'selected' : ''}>미제출</option>
          <option value="review" \${docStatus === 'review' ? 'selected' : ''}>검토중</option>
          <option value="approved" \${docStatus === 'approved' ? 'selected' : ''}>승인완료</option>
        </select>
      \`;
    }

    const html = \`
      <div class="p-3 border border-slate-200 rounded-lg \${bgClass} flex flex-col md:flex-row gap-3 items-center">
        <div class="flex-1 w-full">
          <div class="text-sm font-bold text-slate-800">\${i}. \${DOC_TYPES[i]} \${reqBadge}</div>
          \${isRequired ? \`<input type="text" class="url-input w-full mt-1 border border-slate-300 rounded px-2 py-1 text-xs" placeholder="파일 URL 입력" value="\${docUrl}" data-doc-id="\${i}">\` : \`<div class="text-xs text-slate-400 mt-1">이 신분/직종은 제출 대상이 아닙니다.</div>\`}
        </div>
        \${isRequired ? \`
        <div class="flex gap-2 shrink-0 w-full md:w-auto mt-2 md:mt-0">
          \${statusSelect}
          \${docUrl ? \`<a href="\${docUrl}" target="_blank" class="bg-inha-blue text-white text-xs px-3 py-1.5 rounded hover:bg-inha-navy transition"><i class="fa-solid fa-download"></i> 확인</a>\` : ''}
        </div>
        \` : ''}
      </div>
    \`;
    DOM.modalDocsContainer.insertAdjacentHTML('beforeend', html);
  }

  document.querySelectorAll('.status-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const docId = e.target.getAttribute('data-doc-id');
      const val = e.target.value;
      updateLocalDocField(currentEditingId, \`doc\${docId}Status\`, val);
    });
  });
  document.querySelectorAll('.url-input').forEach(inp => {
    inp.addEventListener('change', (e) => {
      const docId = e.target.getAttribute('data-doc-id');
      const val = e.target.value;
      updateLocalDocField(currentEditingId, \`doc\${docId}Url\`, val);
    });
  });
}

async function updateLocalDocField(id, field, value) {
  const docIndex = state.instructorDocs.findIndex(d => d.id === id);
  if (docIndex > -1) {
    state.instructorDocs[docIndex][field] = value;
    saveInstructorDocs();
    
    if (isOnline) {
      try {
        await APIService.updateInstructorDoc(id, state.instructorDocs[docIndex]);
      } catch(e) {
        console.error(e);
      }
    }
  }
}

if (DOM.btnSaveInstructorInfo) {
  DOM.btnSaveInstructorInfo.addEventListener('click', async () => {
    if (!currentEditingId) return;
    const docIndex = state.instructorDocs.findIndex(d => d.id === currentEditingId);
    if (docIndex > -1) {
      const oldStatus = state.instructorDocs[docIndex].status;
      const oldRole = state.instructorDocs[docIndex].role;

      state.instructorDocs[docIndex].className = DOM.modalClassName.value;
      state.instructorDocs[docIndex].studentName = DOM.modalStudentName.value;
      state.instructorDocs[docIndex].guardianEmail = DOM.modalEmail.value;
      state.instructorDocs[docIndex].status = DOM.modalStatus.value;
      state.instructorDocs[docIndex].role = DOM.modalRole.value;
      
      saveInstructorDocs();
      
      if (isOnline) {
        try { await APIService.updateInstructorDoc(currentEditingId, state.instructorDocs[docIndex]); } catch(e) {}
      }

      showToast("기본 정보가 저장되었습니다.", "success");
      
      // If status or role changed, re-render docs
      if (oldStatus !== DOM.modalStatus.value || oldRole !== DOM.modalRole.value) {
        renderModalDocs(state.instructorDocs[docIndex]);
      }
      
      renderInstructorDocs();
    }
  });
}

if (DOM.submissionDetailsClose) {
  DOM.submissionDetailsClose.addEventListener("click", () => {
    DOM.submissionDetailsModal.style.opacity = '0';
    setTimeout(() => { DOM.submissionDetailsModal.style.display = 'none'; }, 300);
    renderInstructorDocs(); // Refresh table when closing modal
  });
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
  } else {
    if (DOM.loginSection) DOM.loginSection.style.display = "block";
    if (DOM.adminDashboardSection) DOM.adminDashboardSection.style.display = "none";
    if (DOM.btnAdminLogout) DOM.btnAdminLogout.style.display = "none";
  }

  // Filter Event Listeners
  if (DOM.filterStatus) DOM.filterStatus.addEventListener("change", renderInstructorDocs);
  if (DOM.filterRole) DOM.filterRole.addEventListener("change", renderInstructorDocs);
  if (DOM.filterName) DOM.filterName.addEventListener("input", renderInstructorDocs);
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
    DOM.loginId.value = "";
    DOM.loginPw.value = "";
    DOM.loginErrorMsg.style.display = "none";
  });
}

if (DOM.btnAdminRefresh) {
    DOM.btnAdminRefresh.addEventListener("click", () => {
        initInstructorDocs();
        showToast("데이터를 새로고침했습니다.", "success");
    });
}

const btnAddRow = document.getElementById("btn-add-inst-row");
if (btnAddRow) {
  btnAddRow.addEventListener("click", async () => {
    const newId = \`doc-\${Date.now()}\`;
    const newDoc = {
        id: newId,
        studentName: "신규 강사",
        className: "새 프로그램",
        guardianEmail: "",
        status: "교원",
        role: "주강사",
        date: new Date().toLocaleDateString()
    };
    for (let i = 1; i <= 11; i++) {
        newDoc[\`doc\${i}Url\`] = "";
        newDoc[\`doc\${i}Status\`] = "pending";
    }
    state.instructorDocs.unshift(newDoc);
    saveInstructorDocs();
    if (isOnline) {
      // POST if there's an endpoint, skipping for now
    }
    renderInstructorDocs();
    showToast("신규 강사 행이 추가되었습니다. 상세를 눌러 정보를 입력하세요.", "success");
  });
}
`;

fs.writeFileSync('app.js', appJsCode, 'utf8');
console.log('Successfully updated app.js');
