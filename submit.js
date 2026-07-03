const API_URL = "/api";

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch(`${API_URL}/public/programs`);
    const data = await res.json();
    const programSelect = document.getElementById('auth-program');
    if (data.success && data.data && data.data.length > 0) {
      programSelect.innerHTML = '<option value="" disabled selected>프로그램을 선택하세요</option>';
      data.data.forEach(p => {
        programSelect.innerHTML += `<option value="${p}">${p}</option>`;
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

let currentStep = 0;
let instructorData = null;
let roundCount = { 9: 1, 10: 1 };

const DOM = {
  step0: document.getElementById('step-0'),
  step1: document.getElementById('step-1'),
  step2: document.getElementById('step-2'),
  step3: document.getElementById('step-3'),
  step4: document.getElementById('step-4'),
  stepComplete: document.getElementById('step-complete'),
  
  navButtons: document.getElementById('nav-buttons'),
  btnPrev: document.getElementById('btn-prev'),
  btnNext: document.getElementById('btn-next'),
  btnSubmit: document.getElementById('btn-submit'),
  
  btnAuth: document.getElementById('btn-auth'),
  authName: document.getElementById('auth-name'),
  authPhone: document.getElementById('auth-phone'),
  authError: document.getElementById('auth-error'),
  
  infoDisplay: document.getElementById('info-display'),
  statusRadios: document.querySelectorAll('input[name="instructor-status"]'),
  roleRadios: document.querySelectorAll('input[name="instructor-role"]'),
  
  docGroupStep2: document.getElementById('doc-group-step2'),
  docGroupStep3Basic: document.getElementById('doc-group-step3-basic'),
  
  stepIndicator: document.getElementById('step-indicator'),
  progressBar: document.getElementById('progress-bar'),
  toastContainer: document.getElementById('toast-container'),
  submitForm: document.getElementById('submit-form')
};

const DOC_NAMES = {
  1: "보안서약서 및 개인정보 동의서",
  2: "성범죄 및 아동학대 사실 부존재 확인 서약서",
  3: "현직 교원 출강 안내 및 확인서",
  4: "프로그램 결과보고서",
  5: "식·다과 수령 확인서",
  6: "이력서 (신분증/통장 포함)",
  7: "일일 근로일지 (신분증/통장 포함)",
  8: "디지털새싹 프로그램 출강 확인서",
  9: "운영 전 체크리스트(매회)",
  10: "운영 후 체크리스트(매회)",
  11: "안전관리 서약서"
};

// Prevent default form submission via enter key
if (DOM.submitForm) {
  DOM.submitForm.addEventListener('submit', e => e.preventDefault());
}

// Add event listeners for radio styling
DOM.statusRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.type-radio').forEach(label => {
      label.classList.remove('border-inha-blue', 'bg-blue-50');
      label.classList.add('border-slate-200');
    });
    if (radio.checked) {
      const label = radio.closest('.type-radio');
      if (label) {
        label.classList.add('border-inha-blue', 'bg-blue-50');
        label.classList.remove('border-slate-200');
      }
    }
  });
});

DOM.roleRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.role-radio').forEach(label => {
      label.classList.remove('border-emerald-600', 'bg-emerald-50');
      label.classList.add('border-slate-200');
    });
    if (radio.checked) {
      const label = radio.closest('.role-radio');
      if (label) {
        label.classList.add('border-emerald-600', 'bg-emerald-50');
        label.classList.remove('border-slate-200');
      }
    }
  });
});

function getRequiredDocs(status, role) {
  role = role || "주강사";
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

function showToast(message, type = "info") {
  if (!DOM.toastContainer) return;
  const toast = document.createElement("div");
  let bgColor = "bg-slate-800";
  let icon = "fa-info-circle";
  if (type === "success") { bgColor = "bg-emerald-600"; icon = "fa-circle-check"; }
  if (type === "error") { bgColor = "bg-rose-600"; icon = "fa-circle-xmark"; }

  toast.className = `${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium transform transition-all duration-300 translate-y-4 opacity-0`;
  toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => { toast.classList.remove("translate-y-4", "opacity-0"); }, 10);
  setTimeout(() => {
    toast.classList.add("translate-y-4", "opacity-0");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function updateUI() {
  document.querySelectorAll('.step-section').forEach(el => el.classList.add('hidden'));
  
  if (currentStep === 0) {
    DOM.step0.classList.remove('hidden');
    DOM.navButtons.classList.add('hidden');
    DOM.stepIndicator.classList.add('hidden');
  } else if (currentStep > 0 && currentStep <= 4) {
    document.getElementById(`step-${currentStep}`).classList.remove('hidden');
    DOM.navButtons.classList.remove('hidden');
    DOM.stepIndicator.classList.remove('hidden');
    
    DOM.progressBar.style.width = `${(currentStep - 1) * 33.3}%`;
    for(let i=1; i<=4; i++) {
      const circle = document.getElementById(`indicator-${i}`);
      if (i <= currentStep) {
        circle.classList.remove('bg-slate-200', 'text-slate-400');
        circle.classList.add('bg-inha-blue', 'text-white');
      } else {
        circle.classList.add('bg-slate-200', 'text-slate-400');
        circle.classList.remove('bg-inha-blue', 'text-white');
      }
    }
    
    if (currentStep === 1) DOM.btnPrev.classList.add('hidden');
    else DOM.btnPrev.classList.remove('hidden');
    
    if (currentStep === 4) {
      DOM.btnNext.classList.add('hidden');
      DOM.btnSubmit.classList.remove('hidden');
    } else {
      DOM.btnNext.classList.remove('hidden');
      DOM.btnSubmit.classList.add('hidden');
    }
  } else if (currentStep === 5) {
    DOM.stepComplete.classList.remove('hidden');
    DOM.navButtons.classList.add('hidden');
    DOM.stepIndicator.classList.add('hidden');
  }
}

function renderDocInputs() {
  const status = document.querySelector('input[name="instructor-status"]:checked').value;
  const role = document.querySelector('input[name="instructor-role"]:checked').value;
  const reqs = getRequiredDocs(status, role);

  if (DOM.docGroupStep2) DOM.docGroupStep2.innerHTML = '';
  if (DOM.docGroupStep3Basic) DOM.docGroupStep3Basic.innerHTML = '';
  
  reqs.forEach(docId => {
    // skip 6, 7, 9, 10 as they are extra inputs
    if ([6, 7, 9, 10].includes(docId)) return;
    const container = [1, 2, 8, 11].includes(docId) ? DOM.docGroupStep2 : DOM.docGroupStep3Basic;
    if (container) {
      let isSubmitted = false;
      let fileStr = "";
      if (instructorData && instructorData.files) {
        if (docId === 9 || docId === 10) {
          isSubmitted = instructorData.files[docId] && instructorData.files[docId].length > 0;
          if (isSubmitted) fileStr = instructorData.files[docId].length + "개 파일 등록됨";
        } else {
          isSubmitted = !!instructorData.files[docId];
          if (isSubmitted) fileStr = instructorData.files[docId];
        }
      }
      
      const badgeHtml = isSubmitted ? `<span class="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold ml-2 relative top-[-1px]">✅ ${fileStr}</span>` : '';
      const reqAttr = isSubmitted ? '' : 'required';

      container.innerHTML += `
        <div class="p-4 border border-slate-200 rounded-lg bg-white relative">
          <label class="block text-sm font-bold text-slate-800 mb-1">${docId}. ${DOC_NAMES[docId] || ''} ${badgeHtml}</label>
          <input type="file" name="doc${docId}" class="w-full text-sm mt-1 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-slate-100 file:text-slate-700" ${reqAttr}>
        </div>
      `;
    }
  });

  // Handle dynamic visibility of containers
  const c6 = document.getElementById('doc6-container');
  const c7 = document.getElementById('doc7-container');
  const commonDocs = document.getElementById('common-docs-container');
  const c9 = document.getElementById('doc9-container');
  const c10 = document.getElementById('doc10-container');

  if (c6) c6.classList.toggle('hidden', !reqs.includes(6));
  if (c7) c7.classList.toggle('hidden', !reqs.includes(7));
  if (commonDocs) commonDocs.classList.toggle('hidden', !reqs.includes(6) && !reqs.includes(7));
  if (c9) c9.classList.toggle('hidden', !reqs.includes(9));
  if (c10) c10.classList.toggle('hidden', !reqs.includes(10));

  // Update hardcoded inputs (Step 3 and Step 4)
  ['common_id', 'common_bank', 'doc6_resume', 'doc7_log', 'doc9', 'doc10'].forEach(fieldName => {
    const input = document.querySelector(`input[name="${fieldName}"]`);
    if (input) {
      let isReq = false;
      if (fieldName === 'common_id' || fieldName === 'common_bank') isReq = reqs.includes(6) || reqs.includes(7);
      else if (fieldName === 'doc6_resume') isReq = reqs.includes(6);
      else if (fieldName === 'doc7_log') isReq = reqs.includes(7);
      else if (fieldName === 'doc9') isReq = reqs.includes(9);
      else if (fieldName === 'doc10') isReq = reqs.includes(10);

      let titleElem = (fieldName === 'doc9' || fieldName === 'doc10') 
        ? input.closest('.bg-white').querySelector('h3') 
        : input.previousElementSibling;
      
      if (titleElem) {
        const oldBadge = titleElem.querySelector('.submit-badge');
        if (oldBadge) oldBadge.remove();
      }
      
      let isSub = false;
      if (instructorData && instructorData.files) {
         if (fieldName === 'doc9' || fieldName === 'doc10') {
           const num = fieldName.replace('doc', '');
           isSub = instructorData.files[num] && instructorData.files[num].length > 0;
         } else {
           isSub = !!instructorData.files[fieldName];
         }
      }

      if (isSub && titleElem) {
        titleElem.innerHTML += `<span class="submit-badge text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold ml-2 relative top-[-1px]">✅ 기존 제출됨</span>`;
      }
      
      if (isReq && !isSub) input.setAttribute('required', 'true');
      else input.removeAttribute('required');
    }
  });
}

DOM.btnAuth.addEventListener('click', async () => {
  const className = document.getElementById('auth-program').value;
  const name = DOM.authName.value.trim();
  const phone = DOM.authPhone.value.trim();

  if (!className || !name || !phone) {
    DOM.authError.textContent = "모든 항목을 입력해주세요.";
    DOM.authError.classList.remove('hidden');
    return;
  }

  DOM.btnAuth.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 조회 중...';
  DOM.btnAuth.disabled = true;
  DOM.authError.classList.add('hidden');

  try {
    const res = await fetch(`${API_URL}/instructor/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ className, name, phone })
    });
    const data = await res.json();
    if (data.success) {
      instructorData = data.data;
      if (DOM.infoDisplay) {
        DOM.infoDisplay.innerHTML = `학교: <span class="text-inha-blue">${instructorData.school}</span>, 프로그램: <span class="text-inha-blue">${instructorData.className}</span>`;
      }
      
      const typeRadios = document.querySelectorAll('input[name="instructor-status"]');
      typeRadios.forEach(r => {
        if (r.value === instructorData.status) { 
          r.checked = true; 
          r.dispatchEvent(new Event('change')); // Trigger styling update
        }
      });
      
      const roleRadios = document.querySelectorAll('input[name="instructor-role"]');
      roleRadios.forEach(r => {
        if (r.value === instructorData.role) { 
          r.checked = true; 
          r.dispatchEvent(new Event('change')); // Trigger styling update
        }
      });

      // 항상 대시보드(Step 5)를 먼저 보여주어 제출 현황을 파악하게 함
      currentStep = 5;
      renderDashboard();
      updateUI();
    } else {
      DOM.authError.textContent = data.error || "일치하는 강사 정보가 없습니다.";
      DOM.authError.classList.remove('hidden');
    }
  } catch (e) {
    DOM.authError.textContent = "서버 연결에 실패했습니다.";
    DOM.authError.classList.remove('hidden');
  } finally {
    DOM.btnAuth.innerHTML = '조회 및 시작하기';
    DOM.btnAuth.disabled = false;
  }
});

DOM.btnNext.addEventListener('click', () => {
  if (currentStep === 1) renderDocInputs();
  if (currentStep < 4) { currentStep++; updateUI(); }
});

DOM.btnPrev.addEventListener('click', () => {
  if (currentStep > 1) { currentStep--; updateUI(); }
});

DOM.btnSubmit.addEventListener('click', async (e) => {
  e.preventDefault();
  if (!instructorData) return;
  DOM.btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 업로드 중...';
  DOM.btnSubmit.disabled = true;

  const formData = new FormData(DOM.submitForm);
  const status = document.querySelector('input[name="instructor-status"]:checked').value;
  const role = document.querySelector('input[name="instructor-role"]:checked').value;
  formData.append('status', status);
  formData.append('role', role);
  formData.append('instructorId', instructorData.id);
  formData.append('instructorName', instructorData.name);
  formData.append('className', instructorData.className);
  formData.append('phone', instructorData.phone);

  try {
    const res = await fetch(`${API_URL}/instructor-docs/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      instructorData = data.record; // Use updated record from server
      currentStep = 5;
      renderDashboard();
      updateUI();
    } else {
      showToast(data.error || "업로드 실패", "error");
    }
  } catch(e) {
    showToast("서버 오류가 발생했습니다.", "error");
  } finally {
    DOM.btnSubmit.innerHTML = '최종 제출하기';
    DOM.btnSubmit.disabled = false;
  }
});

function renderDashboard() {
  const listEl = document.getElementById('dashboard-file-list');
  const badgeEl = document.getElementById('dashboard-status-badge');
  if (!listEl) return;
  listEl.innerHTML = '';

  const status = instructorData.status || "일반";
  const role = instructorData.role || "주강사";
  const reqs = getRequiredDocs(status, role);
  
  let totalDocs = reqs.length;
  let submittedDocs = 0;

  reqs.forEach(docId => {
    let isSubmitted = false;
    let title = `${docId}. ${DOC_NAMES[docId] || ''}`;
    let subText = "미제출";

    if (instructorData && instructorData.files) {
      if (docId === 6) {
        title = "6. 이력서 (신분증/통장 포함)";
        const f = instructorData.files;
        if (f.doc6_resume && f.common_id && f.common_bank) isSubmitted = true;
      } else if (docId === 7) {
        title = "7. 일일 근로일지 (신분증/통장 포함)";
        const f = instructorData.files;
        if (f.doc7_log && f.common_id && f.common_bank) isSubmitted = true; 
      } else if (docId === 9 || docId === 10) {
        if (instructorData.files[docId] && instructorData.files[docId].length > 0) isSubmitted = true;
      } else {
        if (instructorData.files[docId]) isSubmitted = true;
      }
    }

    if (isSubmitted) {
      submittedDocs++;
      subText = "제출 완료";
    }

    listEl.innerHTML += `
      <li class="px-5 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full flex items-center justify-center ${isSubmitted ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}">
            <i class="fa-solid ${isSubmitted ? 'fa-check' : 'fa-xmark'}"></i>
          </div>
          <span class="font-bold text-slate-700">${title}</span>
        </div>
        <span class="text-xs font-bold px-2 py-1 rounded ${isSubmitted ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 'text-rose-700 bg-rose-50 border border-rose-100'}">
          ${subText}
        </span>
      </li>
    `;
  });

  if (totalDocs > 0) {
    const rate = Math.round((submittedDocs / totalDocs) * 100);
    badgeEl.textContent = `완료율 ${rate}%`;
    if (rate === 100) {
      badgeEl.className = "px-3 py-1 bg-inha-blue text-white text-xs font-bold rounded-full";
    } else {
      badgeEl.className = "px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full";
    }
    
    const btnEdit = document.getElementById('btn-edit-submission');
    const btnFinish = document.getElementById('btn-finish-submission');
    
    if (btnEdit) {
      if (submittedDocs === 0) {
        btnEdit.innerHTML = '<i class="fa-solid fa-upload"></i> 서류 제출 시작하기';
        if(btnFinish) btnFinish.classList.add('hidden');
      } else if (rate === 100) {
        btnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> 제출한 서류 수정하기';
        if(btnFinish) btnFinish.classList.remove('hidden');
      } else {
        btnEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> 미제출 서류 마저 등록하기 (수정)';
        if(btnFinish) btnFinish.classList.add('hidden');
      }
    }
  }
}

const btnEdit = document.getElementById('btn-edit-submission');
if (btnEdit) {
  btnEdit.addEventListener('click', () => {
    currentStep = 1; // 수정하기 버튼 누르면 1단계로 이동
    updateUI();
  });
}

const btnFinish = document.getElementById('btn-finish-submission');
if (btnFinish) {
  btnFinish.addEventListener('click', () => {
    window.location.href = 'https://digitalsaessak-camp.onrender.com/submit.html';
  });
}
