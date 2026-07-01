
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

const API_URL = "http://localhost:3000/api";
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
  1: "성범죄 경력 조회 동의서",
  2: "성범죄 및 아동학대 사실 부존재 확인 서약서",
  3: "현직 교원 출강 안내 및 확인서",
  4: "프로그램 결과보고서",
  5: "식·다과 수령 확인서",
  8: "디지털새싹 프로그램 출강 확인서",
  11: "안전관리 서약서"
};

function getRequiredDocs(status) {
  if (status === "교원") return [2, 3, 4, 5, 8, 11]; // step2: 2,8,11 | step3: 3,4,5
  else return [1, 2, 4, 5, 8, 11]; // step2: 1,2,8,11 | step3: 4,5
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
    
    // Update indicator UI
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
    
    // Nav buttons
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
  formData.append('status', status);
  formData.append('role', role);

  try {
    const res = await fetch(`${API_URL}/instructor/submit`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      currentStep = 5;
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
