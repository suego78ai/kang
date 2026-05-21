// ============================================================================
// 1. Course Data Catalog (디지털새싹 SW·AI 교육캠프 데이터)
// ============================================================================
const COURSES = [
  {
    id: "course-dev-01",
    category: "elementary",
    title: "블록코딩과 AI 펭귄 비서 만들기",
    desc: "엔트리와 스크래치를 사용하여 나만의 인공지능 펭귄 비서를 코딩하고, 재미있는 동작과 음성 비서 기능까지 구현해보는 초등 맞춤형 캠프입니다.",
    longDesc: "코딩을 처음 접하는 초등학생들을 위한 맞춤형 SW·AI 교육 과정입니다. 블록 코딩의 기본 개념을 쉽고 직관적으로 배우며, 머신러닝 블록을 활용하여 사람의 표정과 음성을 인식하고 반응하는 '나만의 인공지능 펭귄 비서'를 완성합니다. 재미있는 문제 해결 퀘스트와 다양한 시각 프로젝트를 바탕으로 컴퓨터 사고력과 창의력을 동시에 기릅니다.",
    duration: "4주 (총 32시간)",
    instructor: "김민수 강사",
    instructorBio: "초등 코딩 교육 전문 멘토, '쉽게 배우는 엔트리 AI' 저자 및 주니어 SW 창의력 경진대회 심사위원.",
    schedule: "매주 토요일 09:30 ~ 13:30 (대면 오프라인)",
    target: "코딩을 처음 접하는 초등학생(3~6학년 권장) 및 블록코딩 기초를 다지고 싶은 어린이",
    price: "전액 무료 (교육부·창의재단 지원)",
    capacity: "20명 정원",
    image: "./assets/dev_course.png",
    curriculum: [
      { title: "1주차: 블록코딩과 친해지기", desc: "코딩 프로그램 인터페이스 탐색, 순차·반복·조건 블록을 이용한 움직이는 캐릭터 게임 개발" },
      { title: "2주차: 인공지능의 첫걸음", desc: "인공지능이란 무엇일까요? 엔트리 AI 인식 기능(이미지 인식, 텍스트 음성 변환) 활용하기" },
      { title: "3주차: AI 펭귄 비서 설계", desc: "스마트 펭귄 캐릭터 음성 인식 제어, 실시간 질문에 맞춰 알맞은 대답을 하는 지능형 비서 알고리즘 코딩" },
      { title: "4주차: 프로젝트 발표회 및 축제", desc: "나만의 인공지능 펭귄 비서를 발표하고 친구들의 비서와 상호작용하기, 이수증 수여식" }
    ]
  },
  {
    id: "course-dev-02",
    category: "middle",
    title: "파이썬 아두이노 스마트홈 자율제어",
    desc: "파이썬 프로그래밍과 아두이노 키트를 활용해 온도 조절, 자동 조명, 무인 경보 시스템 등 직접 스마트홈을 구현하고 제어해보는 중등 심화 캠프입니다.",
    longDesc: "물리 컴퓨팅과 텍스트 코딩을 한 번에 배울 수 있는 하드웨어+소프트웨어 융합 교육과정입니다. 대중적인 프로그래밍 언어인 파이썬을 기반으로 다양한 센서와 액추에이터를 직접 조작해 봅니다. 실생활에서 사용되는 IoT 스마트홈 자율 제어 장치를 미니어처 하우스 키트 위에 조립하고 작동시키며, 미래의 스마트시티 아키텍처를 이해합니다.",
    duration: "4주 (총 32시간)",
    instructor: "이진우 교수",
    instructorBio: "IoT 융합 공학 박사, 다수의 청소년 스마트시티 해커톤 기획 및 진행 경력 보유.",
    schedule: "매주 토요일 14:00 ~ 18:00 (대면 오프라인)",
    target: "파이썬 기본 개념을 접해 보았거나, 스마트 디바이스 제작에 관심이 높은 중학생(1~3학년)",
    price: "전액 무료 (교육부·창의재단 지원 / 교구재 무상 대여)",
    capacity: "15명 정원",
    image: "./assets/ai_course.png",
    curriculum: [
      { title: "1주차: 파이썬 및 아두이노 기초", desc: "파이썬 기본 문법 복습 및 아두이노 보드, 브레드보드 핀 구조와 LED 제어 실습" },
      { title: "2주차: 스마트 센서 모니터링", desc: "조도 센서, 온·습도 센서, 초음파 센서 값을 파이썬 콘솔 및 LCD 모듈로 실시간 시각화하기" },
      { title: "3주차: 스마트홈 액추에이터 자율제어", desc: "센서 값을 기준으로 서보 모터(창문/문), 쿨링팬, 부저 등을 자동으로 동작시키는 자율 알고리즘 설계" },
      { title: "4주차: 스마트홈 빌드 및 시연", desc: "스마트 미니어처 하우스 조립 및 전체 통합 제어 프로그램 구동, 피드백 및 시상식" }
    ]
  },
  {
    id: "course-pm-01",
    category: "high",
    title: "데이터 사이언스 & 머신러닝 모델러",
    desc: "실제 데이터를 파이썬으로 가공하고 머신러닝 라이브러리를 활용해 예측 모델을 구현하며 실무 데이터 과학자의 업무를 체험하는 고등 심화 캠프입니다.",
    longDesc: "AI 시대를 이끌어갈 고등학생들을 위한 본격적인 데이터 과학 입문 과정입니다. 파이썬 pandas, numpy 라이브러리를 이용하여 정형 데이터를 분석하고, scikit-learn을 통해 분류 및 회귀 머신러닝 모델을 설계해 봅니다. 공공 데이터 API를 활용해 내 주변 생활 안전 위험이나 트렌드를 분석하는 미니 리서치 프로젝트를 주도합니다.",
    duration: "5주 (총 40시간)",
    instructor: "박지윤 수석",
    instructorBio: "전 IT 대기업 데이터 분석가, 파이썬 기반 데이터 시각화 교육 리드 멘토.",
    schedule: "매주 일요일 10:00 ~ 18:00 (오프라인 실습 및 멘토링)",
    target: "AI 알고리즘의 동작 원리에 호기심이 많고 데이터 시각화 및 머신러닝 분석에 관심 있는 고등학생(1~3학년)",
    price: "전액 무료 (교육부·창의재단 지원)",
    capacity: "20명 정원",
    image: "./assets/pm_course.png",
    curriculum: [
      { title: "1주차: 데이터 사이언스의 정의와 Pandas", desc: "데이터 수집, 전처리의 중요성 학습 및 pandas 데이터프레임 조작과 결측치 처리" },
      { title: "2주차: 데이터 시각화 마스터", desc: "Matplotlib, Seaborn 라이브러리를 사용해 데이터를 차트와 그래프로 그리고 숨겨진 인사이트 발견하기" },
      { title: "3주차: 머신러닝 개념 및 분류 모델", desc: "지도학습의 이해, 의사결정나무(Decision Tree) 알고리즘을 이용한 분류 모델 생성 및 정확도 평가" },
      { title: "4주차: 실생활 데이터 예측 프로젝트", desc: "날씨 데이터 또는 트래픽 데이터를 바탕으로 특정 조건의 결과 값을 예측하는 머신러닝 모델 튜닝" },
      { title: "5주차: 데이터 포스터 발표 및 졸업식", desc: "팀별 공공 데이터 분석 포스터 피칭 및 전문가 피드백, 디지털새싹 우수 수료증 발급" }
    ]
  },
  {
    id: "course-design-01",
    category: "family",
    title: "메타버스 제페토 맵 제작 & 협동 퀘스트",
    desc: "보호자와 자녀가 함께 메타버스 월드를 빌드업하고 제페토 빌드잇으로 가상 맵 디자인 및 인터랙티브 퀘스트를 설계해보는 가족 참여형 주말 캠프입니다.",
    longDesc: "보호자와 자녀가 2인 1조가 되어 참여하는 온가족 메타버스 크리에이터 도전 캠프입니다. 네이버 제페토 빌드잇(ZEPETO Build It) 스튜디오를 조작하며 상상 속의 놀이공원, 스쿨 캠퍼스를 가상현실 맵으로 디자인합니다. 문을 열거나 아이템을 획득하는 간단한 루아(Lua) 스크립트 기반 이벤트를 작성해 맵 안에서 즐길 수 있는 협동 미션 퀘스트를 설계합니다.",
    duration: "2주 (총 16시간)",
    instructor: "최성욱 디렉터",
    instructorBio: "메타버스 공간 디자이너, 제페토 공식 빌더 스튜디오 파트너 크리에이터.",
    schedule: "매주 일요일 13:00 ~ 21:00 (온/오프라인 하이브리드)",
    target: "디지털 공간 제작에 흥미가 있으며, 주말을 활용해 의미 있는 SW 창작 경험을 나누고 싶은 학생 및 보호자 커플",
    price: "전액 무료 (교육부·창의재단 지원 / 온가족 간식 제공)",
    capacity: "12팀 정원 (학생 1명 + 보호자 1명)",
    image: "./assets/design_course.png",
    curriculum: [
      { title: "1주차: 메타버스 기초와 빌드잇 인터페이스", desc: "가상현실 월드 트렌드 이해, 제페토 빌드잇 오브젝트 배치 및 물리 법칙 설정, 지형 디자인" },
      { title: "2주차: 트리거와 인터랙션 설계", desc: "포탈 이동, 비밀 통로 스위치 등 Lua 스크립트 트리거 구현 및 완성된 가상의 가족 캠핑장 맵 빌드 및 퍼블리싱" }
    ]
  }
];

// ============================================================================
// 2. Application State Management
// ============================================================================
let state = {
  activeCategory: "all",
  searchQuery: "",
  theme: "dark", // 'dark' or 'light'
  applications: [], // localStorage 데이터
  currentApplyCourse: null // 신청 모달을 띄웠을 때 선택한 코스 정보
};

// ============================================================================
// 3. DOM Elements Cache
// ============================================================================
const DOM = {
  body: document.body,
  courseGrid: document.getElementById("course-grid"),
  categoryFilters: document.getElementById("category-filters"),
  courseSearch: document.getElementById("course-search"),
  searchClearBtn: document.getElementById("search-clear-btn"),
  themeToggle: document.getElementById("theme-toggle"),
  mobileMenuToggle: document.getElementById("mobile-menu-toggle"),
  navMenu: document.getElementById("nav-menu"),
  appBadge: document.getElementById("app-badge"),
  backToTop: document.getElementById("back-to-top"),
  logoLink: document.getElementById("logo-link"),
  
  // Modals
  detailsModal: document.getElementById("details-modal"),
  detailsModalClose: document.getElementById("details-modal-close"),
  detailsModalBody: document.getElementById("details-modal-body"),
  
  applyModal: document.getElementById("apply-modal"),
  applyModalClose: document.getElementById("apply-modal-close"),
  applyForm: document.getElementById("apply-form"),
  
  // Form Steps Tracker
  formSteps: document.querySelectorAll(".form-step"),
  stepIndicators: document.querySelectorAll(".step-indicator"),
  stepLine1: document.getElementById("step-line-1"),
  stepLine2: document.getElementById("step-line-2"),
  stepLine3: document.getElementById("step-line-3"),
  
  // Step 1 Inputs
  studentName: document.getElementById("student-name"),
  studentSchoolType: document.getElementById("student-school-type"),
  studentSchool: document.getElementById("student-school"),
  studentGrade: document.getElementById("student-grade"),
  btnNext1: document.getElementById("btn-next-1"),
  
  // Step 2 Inputs
  selectedCourseTitle: document.getElementById("selected-course-title"),
  selectedCourseId: document.getElementById("selected-course-id"),
  guardianName: document.getElementById("guardian-name"),
  guardianPhone: document.getElementById("guardian-phone"),
  guardianEmail: document.getElementById("guardian-email"),
  userMotivation: document.getElementById("user-motivation"),
  motivationLength: document.getElementById("motivation-length"),
  studentNotes: document.getElementById("student-notes"),
  btnPrev2: document.getElementById("btn-prev-2"),
  btnNext2: document.getElementById("btn-next-2"),
  
  // Step 3 Inputs
  agreeSafety: document.getElementById("agree-safety"),
  agreePrivacy: document.getElementById("agree-privacy"),
  btnPrev3: document.getElementById("btn-prev-3"),
  btnSubmit: document.getElementById("btn-submit"),
  
  // Step 4 Outputs
  receiptNo: document.getElementById("receipt-no"),
  receiptCourse: document.getElementById("receipt-course"),
  receiptStudentName: document.getElementById("receipt-student-name"),
  receiptSchoolGrade: document.getElementById("receipt-school-grade"),
  receiptGuardianName: document.getElementById("receipt-guardian-name"),
  receiptDate: document.getElementById("receipt-date"),
  btnViewStatus: document.getElementById("btn-view-status"),
  
  // Status Dashboard
  applicationsContainer: document.getElementById("applications-container"),
  summaryTotal: document.getElementById("summary-total"),
  summaryPending: document.getElementById("summary-pending"),
  summaryApproved: document.getElementById("summary-approved"),
  
  // Toast
  toast: document.getElementById("toast"),
  toastMessage: document.querySelector(".toast-message")
};

// ============================================================================
// 4. Initializer & Theme Config
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  loadApplications();
  renderCourses();
  setupEventListeners();
  updateStatusDashboard();
});

// 테마 로드 및 설정
function initTheme() {
  const savedTheme = localStorage.getItem("digitalsaessak-theme");
  if (savedTheme) {
    state.theme = savedTheme;
  } else {
    // OS 기본 테마 설정 감지
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    state.theme = prefersDark ? "dark" : "light";
  }
  applyTheme();
}

function applyTheme() {
  if (state.theme === "dark") {
    DOM.body.classList.add("dark-theme");
    DOM.body.classList.remove("light-theme");
  } else {
    DOM.body.classList.add("light-theme");
    DOM.body.classList.remove("dark-theme");
  }
  localStorage.setItem("digitalsaessak-theme", state.theme);
}

// 신청 내역 로컬스토리지 로드
function loadApplications() {
  const savedApps = localStorage.getItem("digitalsaessak-apps");
  if (savedApps) {
    try {
      state.applications = JSON.parse(savedApps);
    } catch (e) {
      state.applications = [];
    }
  } else {
    // 마이그레이션 호환 (이전 키 지원)
    const legacyApps = localStorage.getItem("eduenroll-apps");
    if (legacyApps) {
      try {
        state.applications = JSON.parse(legacyApps);
        localStorage.setItem("digitalsaessak-apps", legacyApps);
        localStorage.removeItem("eduenroll-apps");
      } catch (e) {
        state.applications = [];
      }
    }
  }
  updateBadgeCount();
}

function updateBadgeCount() {
  const count = state.applications.length;
  DOM.appBadge.textContent = count;
  if (count > 0) {
    DOM.appBadge.style.display = "inline-block";
  } else {
    DOM.appBadge.style.display = "none";
  }
}

// ============================================================================
// 5. Course Catalog Rendering & Filter Logic
// ============================================================================
function renderCourses() {
  const filtered = COURSES.filter(course => {
    const categoryMatch = state.activeCategory === "all" || course.category === state.activeCategory;
    const query = state.searchQuery.toLowerCase().trim();
    const searchMatch = !query || 
      course.title.toLowerCase().includes(query) || 
      course.desc.toLowerCase().includes(query) ||
      course.instructor.toLowerCase().includes(query);
      
    return categoryMatch && searchMatch;
  });
  
  if (filtered.length === 0) {
    DOM.courseGrid.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-magnifying-glass-minus empty-icon"></i>
        <p>검색 조건에 맞는 교육과정이 없습니다.</p>
        <p class="empty-sub">다른 키워드를 입력하거나 카테고리 필터를 변경해 보세요.</p>
      </div>
    `;
    return;
  }
  
  DOM.courseGrid.innerHTML = filtered.map(course => `
    <div class="course-card glass-card" data-id="${course.id}">
      <div class="course-banner">
        <img src="${course.image}" alt="${course.title}" onerror="this.src='https://placehold.co/600x400/1e293b/fff?text=${encodeURIComponent(course.title)}'">
        <span class="course-cat-tag">${getCategoryName(course.category)}</span>
      </div>
      <div class="course-info">
        <h3 class="course-title">${course.title}</h3>
        <p class="course-desc">${course.desc}</p>
        <div class="course-meta">
          <span><i class="fa-regular fa-clock"></i> ${course.duration}</span>
          <span><i class="fa-regular fa-user"></i> ${course.instructor}</span>
        </div>
        <div class="course-actions">
          <button class="btn btn-secondary btn-detail" onclick="openDetails('${course.id}')">상세 보기</button>
          <button class="btn btn-primary btn-apply" onclick="openRegistration('${course.id}')">신청하기</button>
        </div>
      </div>
    </div>
  `).join("");
}

function getCategoryName(cat) {
  switch (cat) {
    case "elementary": return "초등 과정";
    case "middle": return "중등 과정";
    case "high": return "고등 과정";
    case "family": return "가족 과정";
    default: return "기타";
  }
}

// ============================================================================
// 6. Modals & Detail Modal Generator
// ============================================================================
function openDetails(courseId) {
  const course = COURSES.find(c => c.id === courseId);
  if (!course) return;
  
  DOM.detailsModalBody.innerHTML = `
    <div class="details-hero">
      <img src="${course.image}" alt="${course.title}" onerror="this.src='https://placehold.co/600x400/1e293b/fff?text=${encodeURIComponent(course.title)}'">
    </div>
    <h2 class="details-title">${course.title}</h2>
    
    <div class="details-meta-grid">
      <div class="meta-item">
        <i class="fa-regular fa-calendar-check"></i>
        <div>
          <div class="meta-info-label">교육 기간</div>
          <div class="meta-info-value">${course.duration}</div>
        </div>
      </div>
      <div class="meta-item">
        <i class="fa-regular fa-clock"></i>
        <div>
          <div class="meta-info-label">수업 일정</div>
          <div class="meta-info-value">${course.schedule}</div>
        </div>
      </div>
      <div class="meta-item">
        <i class="fa-solid fa-won-sign"></i>
        <div>
          <div class="meta-info-label">수강료</div>
          <div class="meta-info-value text-success" style="font-weight: 700;">${course.price}</div>
        </div>
      </div>
      <div class="meta-item">
        <i class="fa-solid fa-users"></i>
        <div>
          <div class="meta-info-label">모집 정원</div>
          <div class="meta-info-value">${course.capacity}</div>
        </div>
      </div>
    </div>
    
    <div class="details-content-block">
      <h3 class="block-title"><i class="fa-solid fa-circle-info"></i> 과정 소개</h3>
      <p style="font-size: 0.95rem; color: var(--text-secondary); white-space: pre-line;">${course.longDesc}</p>
    </div>
    
    <div class="details-content-block">
      <h3 class="block-title"><i class="fa-solid fa-bullseye"></i> 교육 대상</h3>
      <p style="font-size: 0.95rem; color: var(--text-secondary);">${course.target}</p>
    </div>

    <div class="details-content-block">
      <h3 class="block-title"><i class="fa-solid fa-chalkboard-user"></i> 강사 소개</h3>
      <div class="instructor-card">
        <div class="instructor-avatar">
          <i class="fa-solid fa-user-tie"></i>
        </div>
        <div>
          <div class="instructor-name">${course.instructor}</div>
          <div class="instructor-bio">${course.instructorBio}</div>
        </div>
      </div>
    </div>
    
    <div class="details-content-block">
      <h3 class="block-title"><i class="fa-solid fa-graduation-cap"></i> 주차별 커리큘럼</h3>
      <div class="curriculum-list">
        ${course.curriculum.map((curr, idx) => `
          <div class="curriculum-step">
            <span class="step-index-badge">${idx + 1}</span>
            <div>
              <div class="step-title">${curr.title}</div>
              <div class="step-desc">${curr.desc}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
    
    <div class="details-actions">
      <button class="btn btn-secondary" onclick="closeModal('details-modal')">닫기</button>
      <button class="btn btn-primary btn-glow" onclick="closeModal('details-modal'); openRegistration('${course.id}')">수강 신청하러 가기 <i class="fa-solid fa-arrow-right"></i></button>
    </div>
  `;
  
  DOM.detailsModal.classList.add("active");
  DOM.body.style.overflow = "hidden"; // 스크롤 잠금
}

function openRegistration(courseId) {
  const course = COURSES.find(c => c.id === courseId);
  if (!course) return;
  
  state.currentApplyCourse = course;
  DOM.selectedCourseTitle.value = course.title;
  DOM.selectedCourseId.value = course.id;
  
  resetForm();
  
  DOM.applyModal.classList.add("active");
  DOM.body.style.overflow = "hidden"; // 스크롤 잠금
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    DOM.body.style.overflow = ""; // 스크롤 복원
  }
}

// ============================================================================
// 7. Multi-step Form Flow & Validations
// ============================================================================
let currentFormStep = 1;

function resetForm() {
  currentFormStep = 1;
  DOM.applyForm.reset();
  
  const errGroups = DOM.applyForm.querySelectorAll(".form-group.has-error");
  errGroups.forEach(g => g.classList.remove("has-error"));
  
  DOM.motivationLength.textContent = "0";
  goToStep(1);
}

function goToStep(step) {
  currentFormStep = step;
  
  DOM.formSteps.forEach(el => {
    if (parseInt(el.dataset.step) === step) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
  
  DOM.stepIndicators.forEach(indicator => {
    const indStep = parseInt(indicator.dataset.step);
    if (indStep < step) {
      indicator.classList.add("completed");
      indicator.classList.remove("active");
    } else if (indStep === step) {
      indicator.classList.add("active");
      indicator.classList.remove("completed");
    } else {
      indicator.classList.remove("active", "completed");
    }
  });
  
  // Progress tracker lines
  if (step >= 2) {
    DOM.stepLine1.classList.add("active");
    DOM.stepLine1.style.background = "linear-gradient(90deg, var(--primary), var(--secondary))";
  } else {
    DOM.stepLine1.classList.remove("active");
    DOM.stepLine1.style.background = "var(--border-color)";
  }
  
  if (step >= 3) {
    DOM.stepLine2.classList.add("active");
    DOM.stepLine2.style.background = "linear-gradient(90deg, var(--primary), var(--secondary))";
  } else {
    DOM.stepLine2.classList.remove("active");
    DOM.stepLine2.style.background = "var(--border-color)";
  }

  if (step >= 4) {
    DOM.stepLine3.classList.add("active");
    DOM.stepLine3.style.background = "linear-gradient(90deg, var(--primary), var(--secondary))";
  } else {
    DOM.stepLine3.classList.remove("active");
    DOM.stepLine3.style.background = "var(--border-color)";
  }
}

// 실시간 입력값 유효성 검증
function validateField(inputElement, validationFnOrRegex) {
  const value = inputElement.value.trim();
  let isValid;
  
  if (validationFnOrRegex instanceof RegExp) {
    isValid = validationFnOrRegex.test(value);
  } else if (typeof validationFnOrRegex === 'function') {
    isValid = validationFnOrRegex(value);
  } else {
    isValid = !!value;
  }
  
  const formGroup = inputElement.closest(".form-group");
  if (!isValid) {
    formGroup.classList.add("has-error");
  } else {
    formGroup.classList.remove("has-error");
  }
  return isValid;
}

// Step 1 유효성 검사 (학생 정보)
function validateStep1() {
  let isAllValid = true;
  
  // 학생 이름: 2글자 이상의 한글 또는 영어
  const nameRegex = /^[a-zA-Z가-힣\s]{2,15}$/;
  if (!validateField(DOM.studentName, nameRegex)) {
    isAllValid = false;
  }
  
  // 학교 구분 선택
  if (!DOM.studentSchoolType.value) {
    DOM.studentSchoolType.closest(".form-group").classList.add("has-error");
    isAllValid = false;
  } else {
    DOM.studentSchoolType.closest(".form-group").classList.remove("has-error");
  }
  
  // 학교 이름: 2자 이상
  const schoolVal = DOM.studentSchool.value.trim();
  if (schoolVal.length < 2) {
    DOM.studentSchool.closest(".form-group").classList.add("has-error");
    isAllValid = false;
  } else {
    DOM.studentSchool.closest(".form-group").classList.remove("has-error");
  }
  
  // 학년 선택
  if (!DOM.studentGrade.value) {
    DOM.studentGrade.closest(".form-group").classList.add("has-error");
    isAllValid = false;
  } else {
    DOM.studentGrade.closest(".form-group").classList.remove("has-error");
  }
  
  return isAllValid;
}

// Step 2 유효성 검사 (보호자 및 상세 정보)
function validateStep2() {
  let isAllValid = true;
  
  // 보호자 이름: 2글자 이상의 한글 또는 영어
  const nameRegex = /^[a-zA-Z가-힣\s]{2,15}$/;
  if (!validateField(DOM.guardianName, nameRegex)) {
    isAllValid = false;
  }
  
  // 보호자 전화번호: 010-XXXX-XXXX 형식
  const phoneRegex = /^01[016789]-\d{3,4}-\d{4}$/;
  if (!validateField(DOM.guardianPhone, phoneRegex)) {
    isAllValid = false;
  }
  
  // 보호자 이메일: 표준 규격 이메일
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!validateField(DOM.guardianEmail, emailRegex)) {
    isAllValid = false;
  }
  
  // 지원 동기 (최소 20자)
  const motivationVal = DOM.userMotivation.value.trim();
  if (motivationVal.length < 20) {
    DOM.userMotivation.closest(".form-group").classList.add("has-error");
    isAllValid = false;
  } else {
    DOM.userMotivation.closest(".form-group").classList.remove("has-error");
  }
  
  return isAllValid;
}

// Step 3 유효성 검사 (서약 및 동의)
function validateStep3() {
  let isAllValid = true;
  
  // 안전 서약 동의 체크
  if (!DOM.agreeSafety.checked) {
    DOM.agreeSafety.closest(".form-group").classList.add("has-error");
    isAllValid = false;
  } else {
    DOM.agreeSafety.closest(".form-group").classList.remove("has-error");
  }
  
  // 개인정보 동의 체크
  if (!DOM.agreePrivacy.checked) {
    DOM.agreePrivacy.closest(".form-group").classList.add("has-error");
    isAllValid = false;
  } else {
    DOM.agreePrivacy.closest(".form-group").classList.remove("has-error");
  }
  
  return isAllValid;
}

// 전화번호 자동 하이픈
function formatPhoneNumber(value) {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 8) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
}

// ============================================================================
// 8. Application Form Submission
// ============================================================================
function handleFormSubmit(e) {
  e.preventDefault();
  
  if (!validateStep3()) {
    showToast("⚠️ 필수 서약 및 동의 사항에 체크해야 신청서 제출이 가능합니다.");
    return;
  }
  
  const timestamp = Date.now();
  const appId = `DS-${Math.floor(100000 + Math.random() * 900000)}`; // DS prefix for 디지털새싹
  
  const newApp = {
    id: appId,
    courseId: DOM.selectedCourseId.value,
    courseTitle: DOM.selectedCourseTitle.value,
    studentName: DOM.studentName.value.trim(),
    studentSchoolType: DOM.studentSchoolType.value,
    studentSchool: DOM.studentSchool.value.trim(),
    studentGrade: DOM.studentGrade.value,
    guardianName: DOM.guardianName.value.trim(),
    guardianPhone: DOM.guardianPhone.value.trim(),
    guardianEmail: DOM.guardianEmail.value.trim(),
    userMotivation: DOM.userMotivation.value.trim(),
    studentNotes: DOM.studentNotes.value.trim(),
    date: new Date(timestamp).toLocaleDateString("ko-KR", {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    }),
    status: "pending" // pending | approved
  };
  
  // 로컬 스토리지 저장
  state.applications.unshift(newApp);
  localStorage.setItem("digitalsaessak-apps", JSON.stringify(state.applications));
  
  updateBadgeCount();
  
  // Step 4 Receipt UI mapping
  DOM.receiptNo.textContent = newApp.id;
  DOM.receiptCourse.textContent = newApp.courseTitle;
  DOM.receiptStudentName.textContent = newApp.studentName;
  DOM.receiptSchoolGrade.textContent = `${newApp.studentSchool} ${newApp.studentGrade}학년`;
  DOM.receiptGuardianName.textContent = newApp.guardianName;
  DOM.receiptDate.textContent = newApp.date;
  
  goToStep(4);
  updateStatusDashboard();
  
  showToast("🎉 디지털새싹 캠프 신청서가 정상 접수되었습니다!");
}

// ============================================================================
// 9. Status Dashboard Rendering & Cancel Logic
// ============================================================================
function updateStatusDashboard() {
  const apps = state.applications;
  
  DOM.summaryTotal.textContent = apps.length;
  DOM.summaryPending.textContent = apps.filter(a => a.status === "pending").length;
  DOM.summaryApproved.textContent = apps.filter(a => a.status === "approved").length;
  
  if (apps.length === 0) {
    DOM.applicationsContainer.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-clipboard empty-icon"></i>
        <p>신청된 교육 캠프가 없습니다.</p>
        <p class="empty-sub">상단의 교육과정 탐색에서 원하는 캠프를 선택하여 신청해 보세요!</p>
      </div>
    `;
    return;
  }
  
  DOM.applicationsContainer.innerHTML = `
    <div class="app-list">
      ${apps.map(app => `
        <div class="app-item" data-appid="${app.id}">
          <div class="app-details">
            <span class="app-no">${app.id}</span>
            <h4 class="app-course-name">${app.courseTitle}</h4>
            <div class="app-meta">
              <span><i class="fa-regular fa-user"></i> 학생: ${app.studentName} (${app.studentSchool} ${app.studentGrade}학년)</span>
              <span><i class="fa-regular fa-circle-user"></i> 보호자: ${app.guardianName}</span>
              <span><i class="fa-regular fa-clock"></i> 접수일: ${app.date}</span>
            </div>
          </div>
          <div class="app-actions">
            <span class="status-badge ${app.status === 'approved' ? 'badge-approved' : 'badge-pending'}">
              <i class="fa-solid ${app.status === 'approved' ? 'fa-check' : 'fa-spinner fa-spin'}"></i> 
              ${app.status === 'approved' ? '승인 완료' : '접수 완료 (대기)'}
            </span>
            <button class="btn btn-secondary btn-cancel" onclick="cancelApplication('${app.id}')">신청 취소</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function cancelApplication(appId) {
  if (!confirm("정말로 해당 디지털새싹 캠프 신청을 취소하시겠습니까?\n취소 후에는 신청 내용 복구가 불가능합니다.")) {
    return;
  }
  
  state.applications = state.applications.filter(a => a.id !== appId);
  localStorage.setItem("digitalsaessak-apps", JSON.stringify(state.applications));
  
  updateBadgeCount();
  updateStatusDashboard();
  
  showToast("🗑️ 신청이 성공적으로 취소되었습니다.");
}

// ============================================================================
// 10. Event Listeners setups
// ============================================================================
function setupEventListeners() {
  
  // 로고 클릭 시 최상단 스크롤 및 홈 리셋
  DOM.logoLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    resetSearchAndFilters();
  });
  
  // 카테고리 필터 클릭
  DOM.categoryFilters.addEventListener("click", (e) => {
    const chip = e.target.closest(".filter-chip");
    if (!chip) return;
    
    DOM.categoryFilters.querySelectorAll(".filter-chip").forEach(btn => {
      btn.classList.remove("active");
    });
    chip.classList.add("active");
    
    state.activeCategory = chip.dataset.category;
    renderCourses();
  });
  
  // 검색바 동작
  DOM.courseSearch.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    if (state.searchQuery.length > 0) {
      DOM.searchClearBtn.style.display = "block";
    } else {
      DOM.searchClearBtn.style.display = "none";
    }
    renderCourses();
  });
  
  // 검색어 초기화 버튼
  DOM.searchClearBtn.addEventListener("click", () => {
    DOM.courseSearch.value = "";
    state.searchQuery = "";
    DOM.searchClearBtn.style.display = "none";
    renderCourses();
    DOM.courseSearch.focus();
  });
  
  // 테마 토글 버튼
  DOM.themeToggle.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme();
    showToast(`🌗 ${state.theme === 'dark' ? '다크 모드' : '라이트 모드'}로 변경되었습니다.`);
  });
  
  // 모바일 메뉴 토글
  DOM.mobileMenuToggle.addEventListener("click", () => {
    DOM.navMenu.classList.toggle("active");
    const icon = DOM.mobileMenuToggle.querySelector("i");
    if (DOM.navMenu.classList.contains("active")) {
      icon.className = "fa-solid fa-xmark";
    } else {
      icon.className = "fa-solid fa-bars";
    }
  });
  
  // 모바일 메뉴 링크 클릭 시 메뉴 닫기
  DOM.navMenu.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      DOM.navMenu.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      
      DOM.navMenu.classList.remove("active");
      const icon = DOM.mobileMenuToggle.querySelector("i");
      icon.className = "fa-solid fa-bars";
    });
  });
  
  // 모달 영역 바깥 클릭 시 닫기
  DOM.detailsModal.addEventListener("click", (e) => {
    if (e.target === DOM.detailsModal) closeModal("details-modal");
  });
  DOM.applyModal.addEventListener("click", (e) => {
    if (e.target === DOM.applyModal && currentFormStep !== 4) {
      closeModal("apply-modal");
    }
  });
  
  // 모달 닫기 X 버튼
  DOM.detailsModalClose.addEventListener("click", () => closeModal("details-modal"));
  DOM.applyModalClose.addEventListener("click", () => {
    if (currentFormStep === 4) {
      closeModal("apply-modal");
    } else {
      if (confirm("신청서 작성을 취소하시겠습니까? 입력 중인 내용은 저장되지 않습니다.")) {
        closeModal("apply-modal");
      }
    }
  });
  
  // 스크롤 시 Back-to-top 노출 및 헤더 스타일 스위칭
  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY;
    
    if (scrollPos > 300) {
      DOM.backToTop.classList.add("visible");
    } else {
      DOM.backToTop.classList.remove("visible");
    }
    
    const header = document.querySelector(".main-header");
    if (scrollPos > 50) {
      header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
      header.style.padding = "8px 0";
    } else {
      header.style.boxShadow = "none";
      header.style.padding = "";
    }
  });
  
  DOM.backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // --------------------------------------------------------------------------
  // Form Wizard Input & Validation Listeners
  // --------------------------------------------------------------------------
  
  // 전화번호 자동 하이픈 실시간 바인딩
  DOM.guardianPhone.addEventListener("input", (e) => {
    e.target.value = formatPhoneNumber(e.target.value);
  });
  
  // 지원동기 글자 수 카운팅
  DOM.userMotivation.addEventListener("input", (e) => {
    const count = e.target.value.trim().length;
    DOM.motivationLength.textContent = count;
  });
  
  // 실시간 포커스 아웃 시 필드 개별 검증
  DOM.studentName.addEventListener("blur", () => {
    const nameRegex = /^[a-zA-Z가-힣\s]{2,15}$/;
    validateField(DOM.studentName, nameRegex);
  });
  
  DOM.studentSchoolType.addEventListener("change", () => {
    if (DOM.studentSchoolType.value) {
      DOM.studentSchoolType.closest(".form-group").classList.remove("has-error");
    }
  });
  
  DOM.studentSchool.addEventListener("blur", () => {
    const schoolVal = DOM.studentSchool.value.trim();
    if (schoolVal.length >= 2) {
      DOM.studentSchool.closest(".form-group").classList.remove("has-error");
    } else {
      DOM.studentSchool.closest(".form-group").classList.add("has-error");
    }
  });
  
  DOM.studentGrade.addEventListener("change", () => {
    if (DOM.studentGrade.value) {
      DOM.studentGrade.closest(".form-group").classList.remove("has-error");
    }
  });
  
  DOM.guardianName.addEventListener("blur", () => {
    const nameRegex = /^[a-zA-Z가-힣\s]{2,15}$/;
    validateField(DOM.guardianName, nameRegex);
  });
  
  DOM.guardianPhone.addEventListener("blur", () => {
    const phoneRegex = /^01[016789]-\d{3,4}-\d{4}$/;
    validateField(DOM.guardianPhone, phoneRegex);
  });
  
  DOM.guardianEmail.addEventListener("blur", () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    validateField(DOM.guardianEmail, emailRegex);
  });
  
  DOM.userMotivation.addEventListener("blur", () => {
    if (DOM.userMotivation.value.trim().length >= 20) {
      DOM.userMotivation.closest(".form-group").classList.remove("has-error");
    }
  });
  
  DOM.agreeSafety.addEventListener("change", () => {
    if (DOM.agreeSafety.checked) {
      DOM.agreeSafety.closest(".form-group").classList.remove("has-error");
    }
  });
  
  DOM.agreePrivacy.addEventListener("change", () => {
    if (DOM.agreePrivacy.checked) {
      DOM.agreePrivacy.closest(".form-group").classList.remove("has-error");
    }
  });
  
  // Step 1 -> Step 2
  DOM.btnNext1.addEventListener("click", () => {
    if (validateStep1()) {
      goToStep(2);
    } else {
      showToast("⚠️ 입력 양식에 오류가 있습니다. 학생 정보를 다시 확인해 주세요.");
    }
  });
  
  // Step 2 -> Step 1
  DOM.btnPrev2.addEventListener("click", () => {
    goToStep(1);
  });
  
  // Step 2 -> Step 3
  DOM.btnNext2.addEventListener("click", () => {
    if (validateStep2()) {
      goToStep(3);
    } else {
      showToast("⚠️ 입력 양식에 오류가 있습니다. 보호자 정보를 다시 확인해 주세요.");
    }
  });
  
  // Step 3 -> Step 2
  DOM.btnPrev3.addEventListener("click", () => {
    goToStep(2);
  });
  
  // 폼 제출
  DOM.applyForm.addEventListener("submit", handleFormSubmit);
  
  // Step 4 -> 완료 화면에서 나의 신청 현황 보기 이동
  DOM.btnViewStatus.addEventListener("click", () => {
    closeModal("apply-modal");
    
    // 내 신청 현황 섹션으로 부드러운 스크롤 이동
    const statusSection = document.getElementById("status-section");
    const offset = statusSection.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: offset, behavior: 'smooth' });
    
    // 메뉴 하이라이트 동기화
    DOM.navMenu.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    document.getElementById("nav-link-status").classList.add("active");
  });
}

function resetSearchAndFilters() {
  DOM.courseSearch.value = "";
  state.searchQuery = "";
  DOM.searchClearBtn.style.display = "none";
  
  DOM.categoryFilters.querySelectorAll(".filter-chip").forEach(btn => {
    btn.classList.remove("active");
  });
  DOM.categoryFilters.querySelector("[data-category='all']").classList.add("active");
  state.activeCategory = "all";
  
  DOM.navMenu.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
  document.getElementById("nav-link-catalog").classList.add("active");
  
  renderCourses();
}

// ============================================================================
// 11. Toast System
// ============================================================================
let toastTimeout;
function showToast(message) {
  clearTimeout(toastTimeout);
  DOM.toastMessage.textContent = message;
  DOM.toast.classList.add("active");
  
  toastTimeout = setTimeout(() => {
    DOM.toast.classList.remove("active");
  }, 3500);
}
