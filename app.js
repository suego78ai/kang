// ============================================================================
// 1. Course Data Catalog (디지털새싹 SW·AI 교육캠프 데이터)
// ============================================================================
const DEFAULT_COURSES = [
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

let COURSES = [...DEFAULT_COURSES];

// ============================================================================
// 2. Application State Management
// ============================================================================
let state = {
  activeCategory: "all",
  searchQuery: "",
  theme: "dark", // 'dark' or 'light'
  applications: [], // localStorage 데이터
  instructorDocs: [], // 강사 서류 데이터
  activeAdminTab: "applications", // 현재 활성화된 관리자 서브 탭
  currentApplyCourse: null, // 신청 모달을 띄웠을 때 선택한 코스 정보
  isAdminAuthenticated: sessionStorage.getItem("digitalsaessak-admin-auth") === "true",
  adminToken: sessionStorage.getItem("digitalsaessak-admin-token") || ""
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
  
  // Admin Dashboard
  adminSection: document.getElementById("admin-section"),
  adminStatTotal: document.getElementById("admin-stat-total"),
  adminStatPending: document.getElementById("admin-stat-pending"),
  adminStatApproved: document.getElementById("admin-stat-approved"),
  adminStatRejected: document.getElementById("admin-stat-rejected"),
  btnAdminRefresh: document.getElementById("btn-admin-refresh"),
  adminTableBody: document.getElementById("admin-table-body"),
  navLinkAdmin: document.getElementById("nav-link-admin"),
  navLinkCatalog: document.getElementById("nav-link-catalog"),
  navLinkStatus: document.getElementById("nav-link-status"),
  catalogSection: document.getElementById("catalog-section"),
  statusSection: document.getElementById("status-section"),
  
  // Admin Login Modal Elements
  adminLoginModal: document.getElementById("admin-login-modal"),
  adminLoginClose: document.getElementById("admin-login-close"),
  adminLoginForm: document.getElementById("admin-login-form"),
  loginId: document.getElementById("login-id"),
  loginPw: document.getElementById("login-pw"),
  loginErrorMsg: document.getElementById("login-error-msg"),
  btnAdminLogout: document.getElementById("btn-admin-logout"),
  
  // Toast
  toast: document.getElementById("toast"),
  toastMessage: document.querySelector(".toast-message"),

  // Admin Course Management Elements
  excelDropZone: document.getElementById("excel-drop-zone"),
  excelFileInput: document.getElementById("excel-file-input"),
  btnDownloadSample: document.getElementById("btn-download-sample"),
  btnResetCourses: document.getElementById("btn-reset-courses"),
  adminCourseTotal: document.getElementById("admin-course-total"),
  adminCoursesTableBody: document.getElementById("admin-courses-table-body"),

  // Instructor Document Dashboard & Spreadsheet Simulator Elements
  spreadsheetTbody: document.getElementById("spreadsheet-tbody"),
  parentFolderIdInput: document.getElementById("parent-folder-id-input"),
  btnCopyAppsScript: document.getElementById("btn-copy-apps-script"),
  appsScriptCodeBlock: document.getElementById("apps-script-code-block"),
  btnResetInstDemo: document.getElementById("btn-reset-inst-demo"),
  btnExportDocsCSV: document.getElementById("btn-export-docs-csv"),
  btnAddInstRow: document.getElementById("btn-add-inst-row"),
  
  // Document File Inputs & Submit docs button
  docFile1: document.getElementById("doc-file-1"),
  docFile2: document.getElementById("doc-file-2"),
  docFile3: document.getElementById("doc-file-3"),
  docFile4: document.getElementById("doc-file-4"),
  docFile5: document.getElementById("doc-file-5"),
  btnHeroSubmitDocs: document.getElementById("btn-hero-submit-docs"),
  
  // Document Preview Elements
  previewModal: document.getElementById("preview-modal"),
  previewModalClose: document.getElementById("preview-modal-close"),
  previewFileTitle: document.getElementById("preview-file-title"),
  previewIframe: document.getElementById("preview-iframe"),
  previewImg: document.getElementById("preview-img"),
  previewUnsupportedMsg: document.getElementById("preview-unsupported-msg"),
  btnPreviewDownload: document.getElementById("btn-preview-download"),
  btnPreviewFallbackDownload: document.getElementById("btn-preview-fallback-download")
};

// ============================================================================
// 4. Initializer & Theme Config & APIService
// ============================================================================
const API_URL = "http://localhost:3000/api";
let isOnline = false;

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  loadApplications();
  setupEventListeners();
  updateStatusDashboard();
  await checkConnection();
  await initCourses();
  await initInstructorDocs();
  renderCourses();
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

// ============================================================================
// 4.5 APIService & Real-Time Sync
// ============================================================================
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, password })
    });
    if (!res.ok) {
      const err = new Error("ID 또는 비밀번호가 올바르지 않습니다.");
      err.status = res.status;
      throw err;
    }
    return await res.json();
  },

  async getAllApplications() {
    const headers = {};
    if (state.adminToken) {
      headers["Authorization"] = `Bearer ${state.adminToken}`;
    }
    const res = await fetch(`${API_URL}/applications`, { headers });
    if (!res.ok) throw new Error("Failed to fetch applications");
    return await res.json();
  },

  async getApplicationsBySearch(studentName, guardianPhone) {
    const params = new URLSearchParams({ studentName, guardianPhone });
    const res = await fetch(`${API_URL}/applications?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to search applications");
    return await res.json();
  },

  async getApplication(id) {
    const res = await fetch(`${API_URL}/applications/${id}`);
    if (res.status === 404) {
      const err = new Error("Not Found");
      err.status = 404;
      throw err;
    }
    if (!res.ok) throw new Error("Failed to fetch application");
    return await res.json();
  },

  async createApplication(applicationData) {
    const res = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(applicationData)
    });
    if (!res.ok) throw new Error("Failed to create application");
    return await res.json();
  },

  async updateApplicationStatus(id, status) {
    const headers = {
      "Content-Type": "application/json"
    };
    if (state.adminToken) {
      headers["Authorization"] = `Bearer ${state.adminToken}`;
    }
    const res = await fetch(`${API_URL}/applications/${id}/status`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to update status");
    return await res.json();
  },

  async deleteApplication(id) {
    const headers = {};
    if (state.adminToken) {
      headers["Authorization"] = `Bearer ${state.adminToken}`;
    }
    const res = await fetch(`${API_URL}/applications/${id}`, {
      method: "DELETE",
      headers
    });
    if (!res.ok) throw new Error("Failed to delete application");
    return await res.json();
  },

  async getCourses() {
    const res = await fetch(`${API_URL}/courses`);
    if (!res.ok) throw new Error("Failed to fetch courses");
    return await res.json();
  },

  async saveCourses(coursesArray) {
    const headers = {
      "Content-Type": "application/json"
    };
    if (state.adminToken) {
      headers["Authorization"] = `Bearer ${state.adminToken}`;
    }
    const res = await fetch(`${API_URL}/courses`, {
      method: "POST",
      headers,
      body: JSON.stringify({ courses: coursesArray })
    });
    if (!res.ok) throw new Error("Failed to save courses");
    return await res.json();
  },

  async resetCourses() {
    const headers = {};
    if (state.adminToken) {
      headers["Authorization"] = `Bearer ${state.adminToken}`;
    }
    const res = await fetch(`${API_URL}/courses/reset`, {
      method: "POST",
      headers
    });
    if (!res.ok) throw new Error("Failed to reset courses");
    return await res.json();
  },

  async getInstructorDocs() {
    const res = await fetch(`${API_URL}/instructor-docs`);
    if (!res.ok) throw new Error("Failed to fetch instructor docs");
    return await res.json();
  },

  async saveInstructorDocs(docsArray) {
    const headers = {
      "Content-Type": "application/json"
    };
    if (state.adminToken) {
      headers["Authorization"] = `Bearer ${state.adminToken}`;
    }
    const res = await fetch(`${API_URL}/instructor-docs`, {
      method: "POST",
      headers,
      body: JSON.stringify({ docs: docsArray })
    });
    if (!res.ok) throw new Error("Failed to save instructor docs");
    return await res.json();
  },

  async resetInstructorDocs() {
    const headers = {};
    if (state.adminToken) {
      headers["Authorization"] = `Bearer ${state.adminToken}`;
    }
    const res = await fetch(`${API_URL}/instructor-docs/reset`, {
      method: "POST",
      headers
    });
    if (!res.ok) throw new Error("Failed to reset instructor docs");
    return await res.json();
  },

  async uploadInstructorDocs(formData) {
    const res = await fetch(`${API_URL}/instructor-docs/upload`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error("Failed to upload instructor documents");
    return await res.json();
  }
};

async function checkConnection() {
  const badge = document.getElementById("db-status-badge");
  const textEl = document.getElementById("db-status-text");
  
  if (!badge || !textEl) return;
  
  const connected = await APIService.checkHealth();
  if (connected) {
    isOnline = true;
    badge.className = "db-status-badge online";
    textEl.innerHTML = "실시간 DB 모드";
    showToast("🟢 실시간 데이터베이스가 연결되었습니다.");
    await syncApplications();
  } else {
    isOnline = false;
    badge.className = "db-status-badge offline";
    textEl.innerHTML = "로컬 저장소 모드";
    showToast("⚠️ 실시간 DB 연결이 제한되어 로컬 저장소 모드로 작동합니다.");
  }
}

async function syncApplications() {
  if (state.applications.length === 0) return;
  
  let updated = false;
  const promises = state.applications.map(async (app) => {
    try {
      const fresh = await APIService.getApplication(app.id);
      if (fresh && fresh.status !== app.status) {
        app.status = fresh.status;
        updated = true;
      }
    } catch (e) {
      if (e.status === 404) {
        try {
          await APIService.createApplication(app);
        } catch (uploadErr) {
          console.error("Failed to sync application to server", uploadErr);
        }
      }
    }
  });
  
  await Promise.allSettled(promises);
  if (updated) {
    localStorage.setItem("digitalsaessak-apps", JSON.stringify(state.applications));
    updateStatusDashboard();
    updateBadgeCount();
  }
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
// 4.5.5 Instructor Documents Master Dashboard & Automation Logic
// ============================================================================

const DEFAULT_INSTRUCTOR_DOCS_DEMO = [
  { id: 1, class: "AI 기초 엔트리 코딩 A반", name: "홍길동", email: "gildong.hong@gmail.com", phone: "010-1111-2222", folder: "https://drive.google.com/drive/folders/demo_hong", doc1: "완료", doc2: "완료", doc3: "검토중", doc4: "미제출", doc5: "미제출", status: "검토중" },
  { id: 2, class: "파이썬 데이터 분석 B반", name: "성춘향", email: "chunhyang.seong@gmail.com", phone: "010-3333-4444", folder: "https://drive.google.com/drive/folders/demo_seong", doc1: "완료", doc2: "완료", doc3: "완료", doc4: "완료", doc5: "완료", status: "제출 완료" },
  { id: 3, class: "아두이노 피지컬 IoT C반", name: "이순신", email: "soonshin.lee@gmail.com", phone: "010-5555-6666", folder: "https://drive.google.com/drive/folders/demo_lee", doc1: "완료", doc2: "검토중", doc3: "완료", doc4: "미제출", doc5: "완료", status: "검토중" },
  { id: 4, class: "메타버스 제페토 빌더 D반", name: "임꺽정", email: "kkukjung.lim@gmail.com", phone: "010-7777-8888", folder: "", doc1: "미제출", doc2: "미제출", doc3: "미제출", doc4: "미제출", doc5: "미제출", status: "검토중" }
];

window.switchAdminTab = function(tabName) {
  state.activeAdminTab = tabName;
  
  const tabButtons = document.querySelectorAll(".admin-tab-btn");
  tabButtons.forEach(btn => {
    if (btn.id === `admin-tab-btn-${tabName}`) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const tabContents = document.querySelectorAll(".admin-tab-content");
  tabContents.forEach(content => {
    if (content.id === `admin-tab-content-${tabName}`) {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  });

  if (tabName === 'instructor-docs') {
    renderInstructorDocs();
  } else if (tabName === 'courses') {
    renderAdminCourses();
  } else if (tabName === 'applications') {
    loadAdminDashboard();
  }
};

async function initInstructorDocs() {
  if (isOnline) {
    try {
      const data = await APIService.getInstructorDocs();
      if (data && data.length > 0) {
        state.instructorDocs = data;
      } else {
        state.instructorDocs = [...DEFAULT_INSTRUCTOR_DOCS_DEMO];
      }
    } catch (e) {
      console.error("Failed to load instructor docs from server, trying local storage", e);
      loadInstructorDocsFromLocalStorage();
    }
  } else {
    loadInstructorDocsFromLocalStorage();
  }
}

function loadInstructorDocsFromLocalStorage() {
  const savedDocs = localStorage.getItem("digitalsaessak-instructor-docs");
  if (savedDocs) {
    try {
      state.instructorDocs = JSON.parse(savedDocs);
    } catch (e) {
      state.instructorDocs = [...DEFAULT_INSTRUCTOR_DOCS_DEMO];
    }
  } else {
    state.instructorDocs = [...DEFAULT_INSTRUCTOR_DOCS_DEMO];
  }
}

async function saveInstructorDocs() {
  if (isOnline) {
    try {
      await APIService.saveInstructorDocs(state.instructorDocs);
    } catch (e) {
      console.error("Failed to save instructor docs to server, saving locally", e);
      localStorage.setItem("digitalsaessak-instructor-docs", JSON.stringify(state.instructorDocs));
    }
  } else {
    localStorage.setItem("digitalsaessak-instructor-docs", JSON.stringify(state.instructorDocs));
  }
}

function renderInstructorDocs() {
  if (!DOM.spreadsheetTbody) return;
  
  DOM.spreadsheetTbody.innerHTML = "";
  
  // 헬퍼: 셀 및 개별 파일 다운로드 링크 & 미리보기 트리거 렌더링
  const renderDocCellHtml = (inst, fieldName, instFieldVal) => {
    const isFile = instFieldVal && instFieldVal !== "완료" && instFieldVal !== "검토중" && instFieldVal !== "미제출";
    let selectVal = instFieldVal;
    let fileLinkHtml = "";
    
    if (isFile) {
      selectVal = "완료";
      const fileUrl = `http://localhost:3000${inst.folder}/${instFieldVal}`;
      const cleanFileName = instFieldVal.substring(instFieldVal.indexOf("_") + 1);
      fileLinkHtml = `
        <div style="margin-top: 4px; font-size: 0.7rem; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 120px; display: flex; align-items: center; gap: 4px;">
          <a href="${fileUrl}" target="_blank" style="color: #06b6d4; text-decoration: underline;" title="${cleanFileName} 다운로드">
            <i class="fa-solid fa-paperclip"></i> ${cleanFileName}
          </a>
          <a href="#" onclick="event.preventDefault(); openPreviewDoc(${inst.id}, '${fieldName}', '${instFieldVal}')" style="color: #fbbf24; text-decoration: none; padding: 2px;" title="미리보기">
            <i class="fa-regular fa-eye" style="font-size: 0.75rem;"></i>
          </a>
        </div>
      `;
    }
    
    return `
      <select onchange="updateDocCell(${inst.id}, '${fieldName}', this.value)" class="status-select w-full px-2 py-1 rounded text-xs text-center border ${getStatusClass(selectVal)}">
        <option value="완료" ${selectVal === '완료' ? 'selected' : ''}>완료</option>
        <option value="검토중" ${selectVal === '검토중' ? 'selected' : ''}>검토중</option>
        <option value="미제출" ${selectVal === '미제출' ? 'selected' : ''}>미제출</option>
      </select>
      ${fileLinkHtml}
    `;
  };
  
  state.instructorDocs.forEach((inst, index) => {
    const rowNum = index + 2; 
    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-50/80 transition-colors";
    
    const isLocal = inst.folder && !inst.folder.startsWith("http");
    const folderCellHtml = isLocal ? 
      `<div style="display: flex; flex-direction: column; gap: 4px; align-items: center; justify-content: center; padding: 2px;">
        <a href="http://localhost:3000/api/instructor-docs/download-zip/${inst.id}?type=admin" target="_blank" class="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-white bg-slate-600 hover:bg-slate-700 px-2 py-1 rounded transition w-full text-center shadow-sm" title="행정서약서, 강의계획서 일괄 ZIP 다운로드">
          <i class="fa-solid fa-file-zipper"></i> 행정 ZIP
        </a>
        <a href="http://localhost:3000/api/instructor-docs/download-zip/${inst.id}?type=process" target="_blank" class="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-white bg-amber-500 hover:bg-amber-600 px-2 py-1 rounded transition w-full text-center shadow-sm" title="출석부, 최종수업일지, 정산영수증 일괄 ZIP 다운로드">
          <i class="fa-solid fa-file-zipper"></i> 진행 ZIP
        </a>
        <a href="http://localhost:3000/api/instructor-docs/download-zip/${inst.id}?type=all" target="_blank" class="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2 py-1 rounded transition w-full text-center shadow-sm" title="제출된 전체 서류 일괄 ZIP 다운로드">
          <i class="fa-solid fa-file-zipper"></i> 전체 ZIP
        </a>
       </div>` : 
      (inst.folder ? 
        `<a href="${inst.folder}" target="_blank" class="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-600 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 px-2 py-1 rounded-full transition shadow-sm">
          <i class="fa-solid fa-folder-open"></i> 구글 드라이브
         </a>` : 
        `<span class="text-xs text-slate-400 italic">폴더 미개설</span>`
      );
      
    tr.innerHTML = `
      <td class="row-header">${rowNum}</td>
      <td class="p-2 text-center text-xs text-slate-400 font-bold font-mono">${inst.id}</td>
      <td class="p-2 border-r">
          <input type="text" value="${inst.class}" onchange="updateDocCell(${inst.id}, 'class', this.value)" class="w-full bg-transparent focus:bg-white border-0 focus:ring-1 focus:ring-cyan-500 px-1 py-0.5 rounded text-slate-800 font-medium">
      </td>
      <td class="p-2 border-r">
          <input type="text" value="${inst.name}" onchange="updateDocCell(${inst.id}, 'name', this.value)" class="w-full bg-transparent focus:bg-white border-0 focus:ring-1 focus:ring-cyan-500 px-1 py-0.5 rounded text-slate-800 font-semibold">
      </td>
      <td class="p-2 border-r">
          <input type="email" value="${inst.email}" onchange="updateDocCell(${inst.id}, 'email', this.value)" class="w-full bg-transparent focus:bg-white border-0 focus:ring-1 focus:ring-cyan-500 px-1 py-0.5 rounded font-mono text-xs text-slate-600">
      </td>
      <td class="p-2 border-r text-center">
          ${folderCellHtml}
      </td>
      <td class="p-2 border-r text-center bg-blue-50/10">
          ${renderDocCellHtml(inst, 'doc1', inst.doc1)}
      </td>
      <td class="p-2 border-r text-center bg-blue-50/10">
          ${renderDocCellHtml(inst, 'doc2', inst.doc2)}
      </td>
      <td class="p-2 border-r text-center bg-blue-50/10">
          ${renderDocCellHtml(inst, 'doc3', inst.doc3)}
      </td>
      <td class="p-2 border-r text-center bg-blue-50/10">
          ${renderDocCellHtml(inst, 'doc4', inst.doc4)}
      </td>
      <td class="p-2 border-r text-center bg-blue-50/10">
          ${renderDocCellHtml(inst, 'doc5', inst.doc5)}
      </td>
      <td class="p-2 text-center">
          <button onclick="removeInstructorDocRow(${inst.id})" class="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded transition" title="행 삭제">
              <i class="fa-regular fa-trash-can"></i>
          </button>
      </td>
    `;
    DOM.spreadsheetTbody.appendChild(tr);
  });
  
  updateInstructorDocStats();
  updateAppsScript();
  document.getElementById("row-count-indicator").innerText = state.instructorDocs.length;
}

function getStatusClass(val) {
  switch(val) {
    case '완료':
    case '제출 완료': return 'status-complete';
    case '검토중': return 'status-review';
    case '미제출':
    case '반려': return 'status-pending';
    default: return '';
  }
}

window.updateDocCell = function(id, key, value) {
  const index = state.instructorDocs.findIndex(item => item.id === id);
  if (index !== -1) {
    state.instructorDocs[index][key] = value;
    
    if ((key === 'class' || key === 'name') && state.instructorDocs[index].class && state.instructorDocs[index].name && !state.instructorDocs[index].folder) {
      state.instructorDocs[index].folder = `https://drive.google.com/drive/folders/simulated_${id}`;
      renderInstructorDocs();
    } else if (key === 'email') {
      renderInstructorDocs();
    } else {
      updateInstructorDocStats();
    }
    updateStatusDashboard();
    saveInstructorDocs();
  }
};

function updateInstructorDocStats() {
  let totalDocs = state.instructorDocs.length * 5;
  let completeCount = 0;
  let reviewCount = 0;
  let pendingCount = 0;
  
  state.instructorDocs.forEach(inst => {
    [inst.doc1, inst.doc2, inst.doc3, inst.doc4, inst.doc5].forEach(status => {
      const isFile = status && status !== "완료" && status !== "검토중" && status !== "미제출";
      if (status === '완료' || isFile) completeCount++;
      else if (status === '검토중') reviewCount++;
      else if (status === '미제출') pendingCount++;
    });
  });
  
  const compEl = document.getElementById("count-complete");
  const revEl = document.getElementById("count-review");
  const pendEl = document.getElementById("count-pending");
  const rateEl = document.getElementById("overall-completion-rate");
  const barEl = document.getElementById("overall-progress-bar");
  
  if (compEl) compEl.innerText = completeCount + "개";
  if (revEl) revEl.innerText = reviewCount + "개";
  if (pendEl) pendEl.innerText = pendingCount + "개";
  
  const rate = totalDocs > 0 ? Math.round((completeCount / totalDocs) * 100) : 0;
  if (rateEl) rateEl.innerText = rate + "%";
  if (barEl) barEl.style.width = rate + "%";
}

window.addInstructorDocRow = function() {
  const newId = state.instructorDocs.length > 0 ? Math.max(...state.instructorDocs.map(i => i.id)) + 1 : 1;
  state.instructorDocs.push({
    id: newId,
    class: `신규 SW·AI 과정 ${newId}반`,
    name: "강사명",
    email: "instructor@inha.ac.kr",
    folder: `https://drive.google.com/drive/folders/simulated_${newId}`,
    doc1: "미제출",
    doc2: "미제출",
    doc3: "미제출",
    doc4: "미제출",
    doc5: "미제출"
  });
  renderInstructorDocs();
  saveInstructorDocs();
  showToast("➕ 새로운 강사 행이 가상 스프레드시트에 추가되었습니다.");
};

window.removeInstructorDocRow = function(id) {
  state.instructorDocs = state.instructorDocs.filter(item => item.id !== id);
  renderInstructorDocs();
  saveInstructorDocs();
  showToast("🗑️ 행이 스프레드시트에서 성공적으로 제거되었습니다.");
};

window.resetInstructorDocsDemo = async function() {
  if (!confirm("정말로 강사 서류 현황판을 기본 데모 데이터셋으로 복구하시겠습니까? 현재까지의 수정사항은 유실됩니다.")) {
    return;
  }
  
  if (isOnline) {
    try {
      const res = await APIService.resetInstructorDocs();
      state.instructorDocs = res.docs;
      showToast("🔄 서버 강사 서류 데이터베이스 복구가 완수되었습니다.");
    } catch (e) {
      console.error(e);
      state.instructorDocs = [...DEFAULT_INSTRUCTOR_DOCS_DEMO];
      showToast("⚠️ 서버 통신 오류로 인해 로컬에서만 데모로 복구했습니다.");
    }
  } else {
    state.instructorDocs = [...DEFAULT_INSTRUCTOR_DOCS_DEMO];
    showToast("🔄 로컬 메모리 내 강사 서류 데이터베이스가 복구되었습니다.");
  }
  
  localStorage.removeItem("digitalsaessak-instructor-docs");
  renderInstructorDocs();
};

window.downloadDocsCSV = function() {
  let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; 
  csvContent += "순번,분반 프로그램명,담당 강사명,강사 이메일 주소,서약서,강의계획서,출석부,최종수업일지,정산 영수증\n";
  
  state.instructorDocs.forEach((inst, index) => {
    let row = [
      index + 2,
      `"${inst.class}"`,
      `"${inst.name}"`,
      `"${inst.email}"`,
      `"${inst.doc1}"`,
      `"${inst.doc2}"`,
      `"${inst.doc3}"`,
      `"${inst.doc4}"`,
      `"${inst.doc5}"`
    ].join(",");
    csvContent += row + "\n";
  });
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "인하대_디지털새싹_강사_제출현황판.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("📊 CSV 파일 다운로드가 시작되었습니다.");
};

window.updateAppsScript = function() {
  if (!DOM.appsScriptCodeBlock) return;
  const folderIdInput = DOM.parentFolderIdInput ? DOM.parentFolderIdInput.value.trim() : "";
  const actualFolderID = folderIdInput || "YOUR_GOOGLE_DRIVE_FOLDER_ID_GOES_HERE";
  
  const codeText = `/**
 * 인하대학교 디지털새싹 서류 간소화 및 폴더 생성 자동화 시스템
 * [가이드] 구글 스프레드시트 -> [확장 프로그램] -> [Apps Script] 코드 교체 후 저장
 */
function createInstructorFolders() {
  // 1. 강사 전용 서류가 자동 저장될 구글 드라이브 상위 부모 폴더 ID
  var PARENT_FOLDER_ID = "${actualFolderID}"; 
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var startRow = 2; // 데이터 시작 행 (헤더를 제외한 2행부터)
  var numRows = sheet.getLastRow() - 1;
  
  if (numRows <= 0) {
    SpreadsheetApp.getUi().alert("❌ 처리할 데이터 행이 존재하지 않습니다.");
    return;
  }
  
  // A열(분반)부터 D열(이메일)까지의 범위 로딩
  var dataRange = sheet.getRange(startRow, 1, numRows, 4);
  var data = dataRange.getValues();
  var parentFolder;
  
  try {
    parentFolder = DriveApp.getFolderById(PARENT_FOLDER_ID);
  } catch (e) {
    SpreadsheetApp.getUi().alert("⚠️ 지정된 구글 부모 폴더 ID를 발견할 수 없거나 권한이 없습니다.");
    return;
  }
  
  var createdCount = 0;
  
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var className = row[1];       // B열: 분반 프로그램명
    var instructorName = row[2];  // C열: 담당 강사명
    var email = row[3];           // D열: 강사 이메일 주소
    var folderCell = sheet.getRange(startRow + i, 5); // E열: 개인제출폴더 주소 기록 셀
    
    // 분반명과 강사명이 있고, 아직 개인 드라이브 폴더가 개설되지 않았을 때만 트리거
    if (className && instructorName && !folderCell.getValue()) {
      try {
        // [자동생성 1] 강사용 폴더 이름 네이밍 표준 생성
        var folderName = "[" + className + "_" + instructorName + "] 서류제출함";
        var newFolder = parentFolder.createFolder(folderName);
        
        // [자동생성 2] 이메일 주소가 있으면 강사에게 편집자(Upload) 권한 자동 지정
        if (email && email.indexOf("@") !== -1) {
          newFolder.addEditor(email);
        }
        
        // [자동생성 3] 구글 시트 E열에 아름다운 하이퍼링크 문장으로 자동 변환 기입
        var richText = SpreadsheetApp.newRichTextValue()
          .setText("📁 드라이브 이동")
          .setLinkUrl(newFolder.getUrl())
          .build();
        folderCell.setRichTextValue(richText);
        
        // [자동생성 4] 우측 서류 상태 기본값 '❌ 미제출' 자동 세팅
        for (var col = 6; col <= 10; col++) {
          var statusCell = sheet.getRange(startRow + i, col);
          if (!statusCell.getValue()) {
            statusCell.setValue("❌ 미제출");
          }
        }
        
        createdCount++;
      } catch (err) {
        Logger.log("⚠️ (" + instructorName + ") 폴더 처리 중 오류 발생: " + err.toString());
      }
    }
  }
  
  SpreadsheetApp.getUi().alert("🎉 총 " + createdCount + "명의 강사용 폴더 개설 및 계정 공유 작업이 모두 완수되었습니다!");
}

/**
 * 구글 스프레드시트가 처음 로드될 때 상단 조작 퀵메뉴를 바에 추가하는 트리거
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("📁 스마트 폴더 자동화")
    .addItem("🚀 신규 강사 폴더 자동 생성 및 이메일 공유", "createInstructorFolders")
    .addToUi();
}`;

  DOM.appsScriptCodeBlock.innerText = codeText;
};

window.copyAppsScriptCode = function() {
  if (!DOM.appsScriptCodeBlock) return;
  navigator.clipboard.writeText(DOM.appsScriptCodeBlock.innerText).then(() => {
    const btn = document.getElementById("btn-copy-apps-script");
    if (btn) {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-check"></i> 복사 완료!`;
      setTimeout(() => {
        btn.innerHTML = originalHTML;
      }, 1500);
    }
    showToast("📋 Apps Script 자동화 코드가 클립보드에 복사되었습니다.");
  }).catch(err => {
    console.error("클립보드 복사 오류:", err);
  });
};

window.copyFormula = function(formulaId, btn) {
  const codeEl = document.getElementById(formulaId);
  if (!codeEl) return;
  navigator.clipboard.writeText(codeEl.innerText).then(() => {
    if (btn) {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-check"></i> 복사 완료!`;
      setTimeout(() => {
        btn.innerHTML = originalHTML;
      }, 1500);
    }
    showToast("📋 포뮬러 수식이 클립보드에 복사되었습니다. 구글 시트에 붙여넣으세요.");
  }).catch(err => {
    console.error("클립보드 복사 오류:", err);
  });
};

// --------------------------------------------------------------------------
// 4.6 Excel Import & Course Management Logic
// --------------------------------------------------------------------------
async function initCourses() {
  if (isOnline) {
    try {
      const serverCourses = await APIService.getCourses();
      if (serverCourses && serverCourses.length > 0) {
        COURSES = serverCourses;
      } else {
        COURSES = [...DEFAULT_COURSES];
      }
    } catch (e) {
      console.error("Failed to load courses from server, trying local storage", e);
      loadCoursesFromLocalStorage();
    }
  } else {
    loadCoursesFromLocalStorage();
  }
}

function loadCoursesFromLocalStorage() {
  const savedCourses = localStorage.getItem("digitalsaessak-courses");
  if (savedCourses) {
    try {
      COURSES = JSON.parse(savedCourses);
    } catch (e) {
      COURSES = [...DEFAULT_COURSES];
    }
  } else {
    COURSES = [...DEFAULT_COURSES];
  }
}

function renderAdminCourses() {
  if (!DOM.adminCoursesTableBody) return;
  
  DOM.adminCourseTotal.textContent = COURSES.length;
  
  if (COURSES.length === 0) {
    DOM.adminCoursesTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="loading-td">
          <i class="fa-solid fa-circle-info"></i> 등록된 교육과정이 없습니다. 엑셀을 통해 등록해 주세요.
        </td>
      </tr>
    `;
    return;
  }
  
  DOM.adminCoursesTableBody.innerHTML = COURSES.map(course => {
    const categoryName = getCategoryName(course.category);
    const location = course.location || "장소 미지정";
    const assistant = course.assistantInstructor || "-";
    const instructorStr = `${course.instructor} (${assistant})`;
    const titleStr = `
      <div class="course-title-sub" style="font-weight: 600;">${course.title}</div>
      <div class="course-id-sub" style="font-size: 0.8rem; color: var(--text-secondary);">${course.duration}</div>
    `;
    
    // Truncate longDesc for summary
    const summary = course.longDesc && course.longDesc.length > 50 
      ? course.longDesc.substring(0, 50) + "..." 
      : (course.longDesc || "-");
      
    return `
      <tr>
        <td><span class="course-cat-tag" style="position: static; transform: none; display: inline-block;">${categoryName}</span></td>
        <td>${titleStr}</td>
        <td>${instructorStr}</td>
        <td>${location}</td>
        <td>${course.capacity || "-"}</td>
        <td>
          <span style="font-size: 0.85rem; color: var(--text-secondary);" title="${course.longDesc || ''}">
            ${summary}
          </span>
        </td>
      </tr>
    `;
  }).join("");
}

function downloadSampleExcel() {
  try {
    const sampleData = [
      {
        "날짜": "2026.06.01 ~ 2026.06.28",
        "교육과정": "초등 과정",
        "과정이름": "블록코딩과 AI 펭귄 비서 만들기",
        "장소": "서울창의캠퍼스 102호",
        "주강사": "김민수 강사",
        "보조강사": "이지은 강사",
        "신청인원": "20",
        "결과보고": "초등학생들을 위한 맞춤형 SW·AI 교육 과정입니다. 블록 코딩의 기본 개념을 배우며 나만의 인공지능 펭귄 비서를 만듭니다."
      },
      {
        "날짜": "2026.07.05 ~ 2026.07.26",
        "교육과정": "중등 과정",
        "과정이름": "파이썬 아두이노 스마트홈 자율제어",
        "장소": "IT비전센터 4층 대강당",
        "주강사": "이진우 교수",
        "보조강사": "박영희 강사",
        "신청인원": "15",
        "결과보고": "파이썬 프로그래밍과 아두이노 키트를 활용해 스마트홈을 구현하고 자율 제어해보는 중등 심화 캠프입니다."
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "교육과정 등록 양식");

    // 컬럼 너비 지정
    worksheet['!cols'] = [
      { wch: 25 }, // 날짜
      { wch: 15 }, // 교육과정
      { wch: 35 }, // 과정이름
      { wch: 25 }, // 장소
      { wch: 15 }, // 주강사
      { wch: 15 }, // 보조강사
      { wch: 10 }, // 신청인원
      { wch: 50 }  // 결과보고
    ];

    XLSX.writeFile(workbook, "디지털새싹_교육과정_등록양식.xlsx");
    showToast("🟢 샘플 엑셀 파일이 다운로드되었습니다.");
  } catch (err) {
    console.error("샘플 다운로드 오류:", err);
    showToast("⚠️ 샘플 다운로드 중 오류가 발생했습니다.");
  }
}

function parseExcelFile(file) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (jsonData.length === 0) {
        showToast("⚠️ 엑셀 파일에 데이터가 없습니다.");
        return;
      }
      
      // 필수 열 체크
      const firstRow = jsonData[0];
      const requiredColumns = ['날짜', '교육과정', '과정이름', '장소', '주강사', '보조강사', '신청인원', '결과보고'];
      const missing = requiredColumns.filter(col => !(col in firstRow));
      
      if (missing.length > 0) {
        showToast(`⚠️ 필수 열이 누락되었습니다: ${missing.join(', ')}`);
        return;
      }
      
      const newCourses = jsonData.map((row, index) => {
        const catStr = String(row['교육과정'] || '');
        let category = 'elementary';
        if (catStr.includes('중등')) category = 'middle';
        else if (catStr.includes('고등')) category = 'high';
        else if (catStr.includes('가족') || catStr.includes('부모')) category = 'family';
        
        const title = String(row['과정이름'] || `교육과정 ${index + 1}`);
        const duration = String(row['날짜'] || '기간 미지정');
        const location = String(row['장소'] || '장소 미지정');
        const instructor = String(row['주강사'] || '미지정');
        const assistantInstructor = String(row['보조강사'] || '미지정');
        const capacityVal = String(row['신청인원'] || '0');
        const capacity = capacityVal.includes('명') ? capacityVal : `${capacityVal}명 정원`;
        const longDesc = String(row['결과보고'] || '');
        const desc = longDesc.length > 100 ? longDesc.substring(0, 100) + '...' : longDesc;
        
        let image = "./assets/dev_course.png";
        if (category === 'middle') image = "./assets/ai_course.png";
        else if (category === 'high') image = "./assets/pm_course.png";
        else if (category === 'family') image = "./assets/design_course.png";
        
        const id = `course-excel-${Date.now()}-${index}`;
        
        // 커리큘럼 자동 생성
        const curriculum = [
          { title: "1주차: 교육과정 개요 및 기초", desc: `${title}의 핵심 개념 파악 및 기본 실습` },
          { title: "2주차: 기술 분석 및 실습", desc: `${location}에서 진행되는 센서/도구 실용 실습` },
          { title: "3주차: 심화 문제 해결 프로젝트", desc: `주강사 ${instructor} 및 보조강사 ${assistantInstructor}와 함께하는 심화 미션` },
          { title: "4주차: 최종 프로젝트 시연 및 결과보고", desc: `수행된 결과보고를 기반으로 결과물 공유 및 이수식` }
        ];
        
        return {
          id,
          category,
          title,
          desc,
          longDesc,
          duration,
          schedule: duration,
          location,
          instructor,
          assistantInstructor,
          instructorBio: `주강사: ${instructor} (보조강사: ${assistantInstructor})`,
          price: "전액 무료 (교육부·창의재단 지원)",
          capacity,
          target: category === 'elementary' ? '초등학생(3~6학년 권장)' :
                  category === 'middle' ? '중학생' :
                  category === 'high' ? '고등학생' : '초·중·고교생 및 학부모(가족)',
          image,
          curriculum
        };
      });
      
      if (isOnline) {
        try {
          await APIService.saveCourses(newCourses);
          showToast("🎉 교육과정이 서버에 등록되었습니다.");
        } catch (serverErr) {
          console.error("Failed to save to server, saving locally", serverErr);
          localStorage.setItem("digitalsaessak-courses", JSON.stringify(newCourses));
          showToast("⚠️ 서버 저장에 실패하여 로컬 저장소에 저장했습니다.");
        }
      } else {
        localStorage.setItem("digitalsaessak-courses", JSON.stringify(newCourses));
        showToast("🎉 교육과정이 로컬 저장소에 등록되었습니다 (오프라인).");
      }
      
      COURSES = newCourses;
      renderCourses();
      renderAdminCourses();
      
    } catch (err) {
      console.error(err);
      showToast("⚠️ 엑셀 파일 처리 중 오류가 발생했습니다.");
    }
  };
  reader.readAsArrayBuffer(file);
}

async function resetCoursesAndRerender() {
  if (!confirm("정말로 교육과정을 기본값으로 초기화하시겠습니까? 업로드된 데이터는 모두 삭제됩니다.")) {
    return;
  }
  
  if (isOnline) {
    try {
      await APIService.resetCourses();
      showToast("🔄 교육과정이 기본값으로 초기화되었습니다 (서버).");
    } catch (err) {
      console.error("Failed to reset courses on server", err);
      showToast("⚠️ 서버에서 초기화하지 못했습니다. 로컬을 초기화합니다.");
    }
  } else {
    showToast("🔄 교육과정이 기본값으로 초기화되었습니다 (로컬).");
  }
  
  localStorage.removeItem("digitalsaessak-courses");
  COURSES = [...DEFAULT_COURSES];
  renderCourses();
  renderAdminCourses();
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

function openPreviewModal(fileUrl, fileName) {
  if (!DOM.previewModal) return;
  
  const cleanFileName = fileName.indexOf("_") !== -1 ? fileName.substring(fileName.indexOf("_") + 1) : fileName;
  DOM.previewFileTitle.innerHTML = `<i class="fa-regular fa-file-lines" style="color: var(--primary); margin-right: 8px;"></i> 미리보기: ${cleanFileName}`;
  DOM.btnPreviewDownload.href = fileUrl;
  DOM.btnPreviewFallbackDownload.href = fileUrl;
  
  DOM.previewIframe.style.display = "none";
  DOM.previewImg.style.display = "none";
  DOM.previewUnsupportedMsg.style.display = "none";
  
  DOM.previewIframe.src = "";
  DOM.previewImg.src = "";
  
  const ext = fileName.split('.').pop().toLowerCase();
  
  if (ext === "pdf") {
    DOM.previewIframe.src = fileUrl;
    DOM.previewIframe.style.display = "block";
  } else if (["png", "jpg", "jpeg", "gif"].includes(ext)) {
    DOM.previewImg.src = fileUrl;
    DOM.previewImg.style.display = "block";
  } else {
    DOM.previewUnsupportedMsg.style.display = "block";
  }
  
  DOM.previewModal.classList.add("active");
  DOM.body.style.overflow = "hidden"; // 스크롤 잠금
}

window.openPreviewDoc = function(id, key, fileName) {
  const inst = state.instructorDocs.find(item => item.id === id);
  if (inst && inst.folder) {
    const fileUrl = inst.folder.startsWith("http") ? `${inst.folder}/${fileName}` : `http://localhost:3000${inst.folder}/${fileName}`;
    openPreviewModal(fileUrl, fileName);
  }
};

// ============================================================================
// 7. Multi-step Form Flow & Validations
// ============================================================================
let currentFormStep = 1;

function resetForm() {
  currentFormStep = 1;
  DOM.applyForm.reset();
  
  const errGroups = DOM.applyForm.querySelectorAll(".form-group.has-error");
  errGroups.forEach(g => g.classList.remove("has-error"));
  
  if (DOM.motivationLength) {
    DOM.motivationLength.textContent = "0";
  }
  
  // Reset drag-and-drop file zone descriptions
  document.querySelectorAll(".file-drag-text").forEach(txt => {
    txt.textContent = "클릭하거나 파일을 드래그하여 업로드하세요.";
  });
  
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

// Step 1 유효성 검사 (강사 및 프로그램 정보)
function validateStep1() {
  let isAllValid = true;
  
  // 강사 이름: 2글자 이상의 한글 또는 영어
  const nameRegex = /^[a-zA-Z가-힣\s]{2,15}$/;
  if (!validateField(DOM.studentName, nameRegex)) {
    isAllValid = false;
  }
  
  // 강사 연락처: 010-XXXX-XXXX 형식
  const phoneRegex = /^01[016789]-\d{3,4}-\d{4}$/;
  if (!validateField(DOM.guardianPhone, phoneRegex)) {
    isAllValid = false;
  }
  
  // 강사 이메일: 표준 규격 이메일
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!validateField(DOM.guardianEmail, emailRegex)) {
    isAllValid = false;
  }
  
  // 담당 프로그램명: 2자 이상
  const classVal = DOM.selectedCourseTitle.value.trim();
  const titleGroup = DOM.selectedCourseTitle.closest(".form-group");
  if (classVal.length < 2) {
    if (titleGroup) titleGroup.classList.add("has-error");
    isAllValid = false;
  } else {
    if (titleGroup) titleGroup.classList.remove("has-error");
  }
  
  return isAllValid;
}

// Step 2 유효성 검사 (필수 행정 서류 파일 첨부)
function validateStep2() {
  let isAllValid = true;
  
  // 강사서약서 파일 존재 확인
  const file1Group = DOM.docFile1.closest(".form-group");
  if (!DOM.docFile1.files || DOM.docFile1.files.length === 0) {
    if (file1Group) file1Group.classList.add("has-error");
    isAllValid = false;
  } else {
    if (file1Group) file1Group.classList.remove("has-error");
  }
  
  // 강의계획서 파일 존재 확인
  const file2Group = DOM.docFile2.closest(".form-group");
  if (!DOM.docFile2.files || DOM.docFile2.files.length === 0) {
    if (file2Group) file2Group.classList.add("has-error");
    isAllValid = false;
  } else {
    if (file2Group) file2Group.classList.remove("has-error");
  }
  
  return isAllValid;
}

// Step 3 유효성 검사 (진행 및 정산 서류 파일 첨부)
function validateStep3() {
  let isAllValid = true;
  
  // 출석부 파일 존재 확인
  const file3Group = DOM.docFile3.closest(".form-group");
  if (!DOM.docFile3.files || DOM.docFile3.files.length === 0) {
    if (file3Group) file3Group.classList.add("has-error");
    isAllValid = false;
  } else {
    if (file3Group) file3Group.classList.remove("has-error");
  }
  
  // 최종수업일지 파일 존재 확인
  const file4Group = DOM.docFile4.closest(".form-group");
  if (!DOM.docFile4.files || DOM.docFile4.files.length === 0) {
    if (file4Group) file4Group.classList.add("has-error");
    isAllValid = false;
  } else {
    if (file4Group) file4Group.classList.remove("has-error");
  }
  
  // 정산 영수증 파일 존재 확인
  const file5Group = DOM.docFile5.closest(".form-group");
  if (!DOM.docFile5.files || DOM.docFile5.files.length === 0) {
    if (file5Group) file5Group.classList.add("has-error");
    isAllValid = false;
  } else {
    if (file5Group) file5Group.classList.remove("has-error");
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
async function handleFormSubmit(e) {
  e.preventDefault();
  
  if (!validateStep3()) {
    showToast("⚠️ 필수 서류 파일들을 모두 첨부해야 서류 제출이 가능합니다.");
    return;
  }
  
  const timestamp = Date.now();
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  const docId = Math.floor(100000 + Math.random() * 900000);
  const instructorName = DOM.studentName.value.trim();
  const className = DOM.selectedCourseTitle.value.trim();
  const email = DOM.guardianEmail.value.trim();
  const phone = DOM.guardianPhone.value.trim();
  
  let newDocRecord = {
    id: docId,
    class: className,
    name: instructorName,
    email: email,
    phone: phone,
    folder: "",
    doc1: DOM.docFile1.files[0] ? DOM.docFile1.files[0].name : "❌ 미제출",
    doc2: DOM.docFile2.files[0] ? DOM.docFile2.files[0].name : "❌ 미제출",
    doc3: DOM.docFile3.files[0] ? DOM.docFile3.files[0].name : "❌ 미제출",
    doc4: DOM.docFile4.files[0] ? DOM.docFile4.files[0].name : "❌ 미제출",
    doc5: DOM.docFile5.files[0] ? DOM.docFile5.files[0].name : "❌ 미제출",
    date: dateStr
  };
  
  if (isOnline) {
    try {
      const formData = new FormData();
      formData.append("instructorName", instructorName);
      formData.append("className", className);
      formData.append("email", email);
      formData.append("phone", phone);
      
      if (DOM.docFile1.files[0]) formData.append("docFile1", DOM.docFile1.files[0]);
      if (DOM.docFile2.files[0]) formData.append("docFile2", DOM.docFile2.files[0]);
      if (DOM.docFile3.files[0]) formData.append("docFile3", DOM.docFile3.files[0]);
      if (DOM.docFile4.files[0]) formData.append("docFile4", DOM.docFile4.files[0]);
      if (DOM.docFile5.files[0]) formData.append("docFile5", DOM.docFile5.files[0]);
      
      const res = await APIService.uploadInstructorDocs(formData);
      if (res && res.record) {
        newDocRecord = res.record;
      }
    } catch (err) {
      console.error("서버로 강사 서류 업로드 실패:", err);
      showToast("⚠️ 실시간 DB 업로드에 실패하여 로컬 저장소 모드로 임시 접수합니다.");
      newDocRecord.folder = `https://drive.google.com/drive/folders/simulated_${docId}`;
    }
  } else {
    newDocRecord.folder = `https://drive.google.com/drive/folders/simulated_${docId}`;
  }
  
  state.instructorDocs.unshift(newDocRecord);
  localStorage.setItem("digitalsaessak-instructor-docs", JSON.stringify(state.instructorDocs));
  
  // 강사 본인의 조회용 로컬스토리지 목록에 추가
  state.applications.unshift({ id: newDocRecord.id });
  localStorage.setItem("digitalsaessak-apps", JSON.stringify(state.applications));
  
  // 성공 화면 UI 바인딩
  DOM.receiptNo.textContent = `DOC-${newDocRecord.id}`;
  DOM.receiptStudentName.textContent = newDocRecord.name;
  DOM.receiptCourse.textContent = newDocRecord.class;
  DOM.receiptSchoolGrade.textContent = `${phone} / ${newDocRecord.email}`;
  DOM.receiptDate.textContent = newDocRecord.date;
  
  goToStep(4);
  renderInstructorDocs();
  updateInstructorDocStats();
  updateStatusDashboard();
  
  showToast("🎉 강사 프로그램 제출이 성공적으로 처리되었습니다!");
}

// ============================================================================
// 9. Status Dashboard Rendering & Cancel Logic
// ============================================================================
function updateStatusDashboard() {
  const docs = state.instructorDocs;
  
  // 강사가 이 브라우저에서 제출했거나 검색을 통해 등록한 IDs만 필터링하여 조회
  const localAppIds = state.applications.map(a => Number(a.id));
  const filteredDocs = docs.filter(d => localAppIds.includes(Number(d.id)));
  
  let completeCount = 0;
  let pendingCount = 0;
  
  filteredDocs.forEach(inst => {
    [inst.doc1, inst.doc2, inst.doc3, inst.doc4, inst.doc5].forEach(status => {
      if (status && status !== "미제출") {
        completeCount++;
      } else {
        pendingCount++;
      }
    });
  });
  
  DOM.summaryTotal.textContent = filteredDocs.length + "건";
  DOM.summaryPending.textContent = filteredDocs.filter(d => d.status === "검토중" || !d.status).length + "건";
  DOM.summaryApproved.textContent = filteredDocs.filter(d => d.status === "제출 완료").length + "건";
  
  if (filteredDocs.length === 0) {
    DOM.applicationsContainer.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-clipboard empty-icon"></i>
        <p>조회된 제출 서류가 없습니다.</p>
        <p class="empty-sub">본인의 강사 이름과 휴대폰 번호로 검색하여 제출 내역을 조회해 보세요!</p>
      </div>
    `;
    return;
  }
  
  DOM.applicationsContainer.innerHTML = `
    <div class="app-list">
      ${filteredDocs.map(doc => {
        const isLocalFolder = doc.folder && !doc.folder.startsWith("http");
        const status = doc.status || '검토중';
        let statusBadgeHtml = '';
        
        if (status === '제출 완료') {
          statusBadgeHtml = `
            <span class="status-badge badge-approved" style="font-size: 0.72rem; padding: 4px 10px;">
              <i class="fa-solid fa-circle-check"></i> 제출 완료 (승인)
            </span>
          `;
        } else if (status === '반려') {
          statusBadgeHtml = `
            <span class="status-badge badge-rejected" style="font-size: 0.72rem; padding: 4px 10px;">
              <i class="fa-solid fa-circle-xmark"></i> 반려 (서류 보완 필요)
            </span>
          `;
        } else {
          statusBadgeHtml = `
            <span class="status-badge badge-pending" style="font-size: 0.72rem; padding: 4px 10px;">
              <i class="fa-solid fa-spinner fa-spin"></i> 검토 중
            </span>
          `;
        }
        
        return `
        <div class="app-item" data-appid="${doc.id}">
          <div class="app-details">
            <span class="app-no">제출번호: DOC-${doc.id}</span>
            <h4 class="app-course-name">${doc.class}</h4>
            <div class="app-meta">
              <span><i class="fa-regular fa-user"></i> 담당 강사: <strong>${doc.name}</strong> (${doc.email})</span>
              <span><i class="fa-regular fa-clock"></i> 최종 제출일: ${doc.date || '-'}</span>
              <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 8px; font-size: 0.75rem;">
                <span class="badge" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--text-secondary); max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">서약서: ${doc.doc1.startsWith("docFile1") || doc.doc1 !== "미제출" && doc.doc1 !== "완료" && doc.doc1 !== "검토중" ? `📎 완료` : doc.doc1}</span>
                <span class="badge" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--text-secondary); max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">계획서: ${doc.doc2.startsWith("docFile2") || doc.doc2 !== "미제출" && doc.doc2 !== "완료" && doc.doc2 !== "검토중" ? `📎 완료` : doc.doc2}</span>
                <span class="badge" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--text-secondary); max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">출석부: ${doc.doc3.startsWith("docFile3") || doc.doc3 !== "미제출" && doc.doc3 !== "완료" && doc.doc3 !== "검토중" ? `📎 완료` : doc.doc3}</span>
                <span class="badge" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--text-secondary); max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">수업일지: ${doc.doc4.startsWith("docFile4") || doc.doc4 !== "미제출" && doc.doc4 !== "완료" && doc.doc4 !== "검토중" ? `📎 완료` : doc.doc4}</span>
                <span class="badge" style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); color: var(--text-secondary); max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">영수증: ${doc.doc5.startsWith("docFile5") || doc.doc5 !== "미제출" && doc.doc5 !== "완료" && doc.doc5 !== "검토중" ? `📎 완료` : doc.doc5}</span>
              </div>
            </div>
          </div>
          <div class="app-actions">
            ${statusBadgeHtml}
            <button class="btn btn-secondary btn-cancel" onclick="cancelApplication('${doc.id}')">목록에서 삭제</button>
          </div>
        </div>
      `}).join("")}
    </div>
  `;
}

async function cancelApplication(appId) {
  if (!confirm("정말로 해당 디지털새싹 캠프 신청을 취소하시겠습니까?\n취소 후에는 신청 내용 복구가 불가능합니다.")) {
    return;
  }
  
  if (isOnline) {
    try {
      await APIService.deleteApplication(appId);
    } catch (err) {
      console.error("Failed to delete application on server:", err);
      showToast("⚠️ 실시간 DB에서 삭제하는 데 실패했습니다. 로컬 데이터를 먼저 삭제합니다.");
    }
  }
  
  state.applications = state.applications.filter(a => a.id !== appId);
  localStorage.setItem("digitalsaessak-apps", JSON.stringify(state.applications));
  
  updateBadgeCount();
  updateStatusDashboard();
  
  showToast("🗑️ 신청이 성공적으로 취소되었습니다.");
}
window.cancelApplication = cancelApplication;

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
  
  // 네비게이션 탭 뷰 라우팅 및 모바일 메뉴 닫기
  DOM.navLinkCatalog.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab("catalog");
    window.scrollTo({ top: DOM.catalogSection.offsetTop - 80, behavior: 'smooth' });
    closeMobileMenu();
  });
  DOM.navLinkStatus.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab("status");
    window.scrollTo({ top: DOM.statusSection.offsetTop - 80, behavior: 'smooth' });
    closeMobileMenu();
  });
  DOM.navLinkAdmin.addEventListener("click", (e) => {
    e.preventDefault();
    switchTab("admin");
    window.scrollTo({ top: DOM.adminSection.offsetTop - 80, behavior: 'smooth' });
    closeMobileMenu();
  });

  function closeMobileMenu() {
    DOM.navMenu.classList.remove("active");
    const icon = DOM.mobileMenuToggle.querySelector("i");
    if (icon) icon.className = "fa-solid fa-bars";
  }
  
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
  if (DOM.previewModalClose) {
    DOM.previewModalClose.addEventListener("click", () => closeModal("preview-modal"));
  }
  if (DOM.previewModal) {
    DOM.previewModal.addEventListener("click", (e) => {
      if (e.target === DOM.previewModal) closeModal("preview-modal");
    });
  }
  
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
  
  // 강사 성함 실시간 개별 검증
  DOM.studentName.addEventListener("blur", () => {
    const nameRegex = /^[a-zA-Z가-힣\s]{2,15}$/;
    validateField(DOM.studentName, nameRegex);
  });
  
  // 강사 이메일 실시간 개별 검증
  DOM.guardianEmail.addEventListener("blur", () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    validateField(DOM.guardianEmail, emailRegex);
  });
  
  // 담당 프로그램명 실시간 개별 검증
  DOM.selectedCourseTitle.addEventListener("blur", () => {
    const classVal = DOM.selectedCourseTitle.value.trim();
    const titleGroup = DOM.selectedCourseTitle.closest(".form-group");
    if (classVal.length >= 2) {
      if (titleGroup) titleGroup.classList.remove("has-error");
    } else {
      if (titleGroup) titleGroup.classList.add("has-error");
    }
  });
  
  // 파일 드래그 앤 드롭 & 파일선택 상태 변경 핸들러
  [DOM.docFile1, DOM.docFile2, DOM.docFile3, DOM.docFile4, DOM.docFile5].forEach((fileInput, i) => {
    if (fileInput) {
      const wrapper = fileInput.closest(".file-upload-wrapper");
      if (wrapper) {
        const dragZone = wrapper.querySelector(".file-drag-zone");
        
        dragZone.addEventListener("dragover", (e) => {
          e.preventDefault();
          dragZone.style.borderColor = "var(--primary)";
          dragZone.style.background = "rgba(16, 185, 129, 0.05)";
        });
        
        dragZone.addEventListener("dragleave", () => {
          dragZone.style.borderColor = "";
          dragZone.style.background = "";
        });
        
        dragZone.addEventListener("drop", (e) => {
          e.preventDefault();
          dragZone.style.borderColor = "";
          dragZone.style.background = "";
          
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            const event = new Event("change");
            fileInput.dispatchEvent(event);
          }
        });
      }
      
      fileInput.addEventListener("change", () => {
        const formGroup = fileInput.closest(".form-group");
        if (fileInput.files && fileInput.files.length > 0) {
          if (formGroup) formGroup.classList.remove("has-error");
          const zoneText = formGroup.querySelector(".file-drag-text");
          if (zoneText) {
            zoneText.textContent = `📎 선택됨: ${fileInput.files[0].name}`;
            zoneText.style.color = "var(--primary)";
            zoneText.style.fontWeight = "bold";
          }
        }
      });
    }
  });
  
  // 메인 히어로 배너: 프로그램 제출하기 버튼 동작
  if (DOM.btnHeroSubmitDocs) {
    DOM.btnHeroSubmitDocs.addEventListener("click", () => {
      resetForm();
      DOM.applyModal.classList.add("active");
      DOM.body.style.overflow = "hidden";
    });
  }
  
  // Step 1 -> Step 2
  DOM.btnNext1.addEventListener("click", () => {
    if (validateStep1()) {
      goToStep(2);
    } else {
      showToast("⚠️ 입력 양식에 오류가 있습니다. 강사 및 프로그램 정보를 다시 확인해 주세요.");
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
      showToast("⚠️ 필수 행정 서류 파일 2종을 모두 첨부해 주세요.");
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
    switchTab("status");
  });

  // 신청 현황 다른 기기 내역 조회 버튼 및 연락처 필터링
  const btnLookup = document.getElementById("btn-lookup-apps");
  if (btnLookup) {
    btnLookup.addEventListener("click", handleLookup);
  }
  const lookupPhone = document.getElementById("lookup-doc-id");
  if (lookupPhone) {
    lookupPhone.addEventListener("input", (e) => {
      e.target.value = formatPhoneNumber(e.target.value);
    });
  }

  // 관리자 새로고침 버튼
  if (DOM.btnAdminRefresh) {
    DOM.btnAdminRefresh.addEventListener("click", loadAdminDashboard);
  }

  // 관리자 로그아웃 버튼
  if (DOM.btnAdminLogout) {
    DOM.btnAdminLogout.addEventListener("click", handleAdminLogout);
  }

  // 관리자 로그인 모달 관련 리스너
  if (DOM.adminLoginClose) {
    DOM.adminLoginClose.addEventListener("click", closeAdminLoginModal);
  }
  if (DOM.adminLoginForm) {
    DOM.adminLoginForm.addEventListener("submit", handleAdminLogin);
  }
  if (DOM.adminLoginModal) {
    DOM.adminLoginModal.addEventListener("click", (e) => {
      if (e.target === DOM.adminLoginModal) closeAdminLoginModal();
    });
  }

  // 엑셀 업로드 및 교육과정 관리 관련 리스너
  if (DOM.btnDownloadSample) {
    DOM.btnDownloadSample.addEventListener("click", downloadSampleExcel);
  }
  if (DOM.btnResetCourses) {
    DOM.btnResetCourses.addEventListener("click", resetCoursesAndRerender);
  }
  if (DOM.excelDropZone) {
    DOM.excelDropZone.addEventListener("click", () => {
      DOM.excelFileInput.click();
    });
    
    DOM.excelDropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      DOM.excelDropZone.classList.add("dragover");
    });
    
    DOM.excelDropZone.addEventListener("dragleave", () => {
      DOM.excelDropZone.classList.remove("dragover");
    });
    
    DOM.excelDropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      DOM.excelDropZone.classList.remove("dragover");
      if (e.dataTransfer.files.length > 0) {
        parseExcelFile(e.dataTransfer.files[0]);
      }
    });
  }
  if (DOM.excelFileInput) {
    DOM.excelFileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        parseExcelFile(e.target.files[0]);
      }
    });
  }

  // 강사 서류 자동화 대시보드 리스너
  if (DOM.btnAddInstRow) {
    DOM.btnAddInstRow.addEventListener("click", addInstructorDocRow);
  }
  if (DOM.btnResetInstDemo) {
    DOM.btnResetInstDemo.addEventListener("click", resetInstructorDocsDemo);
  }
  if (DOM.btnExportDocsCSV) {
    DOM.btnExportDocsCSV.addEventListener("click", downloadDocsCSV);
  }
  if (DOM.btnCopyAppsScript) {
    DOM.btnCopyAppsScript.addEventListener("click", copyAppsScriptCode);
  }
  if (DOM.parentFolderIdInput) {
    DOM.parentFolderIdInput.addEventListener("input", updateAppsScript);
  }
}

// --------------------------------------------------------------------------
// Admin Auth Helpers
// --------------------------------------------------------------------------
async function handleLookup() {
  const nameInput = document.getElementById("lookup-student-name");

  const docIdInput = document.getElementById("lookup-doc-id"); // 이 필드는 이제 휴대폰 번호를 담고 있습니다.
  const resultsInfo = document.getElementById("lookup-results-info");
  
  if (!nameInput || !docIdInput || !resultsInfo) return;
  
  const instructorName = nameInput.value.trim();
  let rawPhone = docIdInput.value.trim();
  
  if (!instructorName || !rawPhone) {
    showToast("⚠️ 강사 이름, 휴대폰 번호를 모두 입력해주세요.");
    return;
  }
  

  
  const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
  if (!phoneRegex.test(rawPhone)) {
    showToast("⚠️ 올바른 휴대폰 번호 형식(예: 010-1234-5678)으로 입력해주세요.");
    return;
  }
  
  resultsInfo.style.display = "flex";
  resultsInfo.className = "lookup-results-info";
  resultsInfo.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> 데이터베이스 검색 중...`;
  
  const filterRecord = (d) => {
    const cleanDbPhone = (d.phone || "").replace(/-/g, "");
    const cleanSearchPhone = rawPhone.replace(/-/g, "");
    return d.name === instructorName && 
           cleanDbPhone === cleanSearchPhone;
  };
  
  let matched = [];
  if (isOnline) {
    try {
      const allDocs = await APIService.getInstructorDocs();
      matched = allDocs.filter(filterRecord);
    } catch (err) {
      console.error("Failed to lookup instructor docs on server, trying local cache:", err);
      matched = state.instructorDocs.filter(filterRecord);
    }
  } else {
    matched = state.instructorDocs.filter(filterRecord);
  }
  
  if (matched && matched.length > 0) {
    let addedCount = 0;
    matched.forEach(doc => {
      const exists = state.applications.some(a => Number(a.id) === Number(doc.id));
      if (!exists) {
        state.applications.unshift({ id: doc.id });
        addedCount++;
      }
    });
    
    localStorage.setItem("digitalsaessak-apps", JSON.stringify(state.applications));
    updateStatusDashboard();
    
    resultsInfo.className = "lookup-results-info success";
    resultsInfo.innerHTML = `<i class="fa-solid fa-circle-check"></i> 성공: 본인 인증 및 내역 동기화에 성공했습니다.`;
    showToast(`🎉 제출 내역이 정상적으로 조회되었습니다!`);
  } else {
    resultsInfo.className = "lookup-results-info error";
    resultsInfo.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> 입력한 정보와 일치하는 제출 서류 기록을 찾을 수 없습니다. 제출번호를 다시 확인하세요.`;
  }
}

function openAdminLoginModal() {
  DOM.loginId.value = "";
  DOM.loginPw.value = "";
  DOM.loginErrorMsg.style.display = "none";
  DOM.adminLoginModal.classList.add("active");
  setTimeout(() => DOM.loginId.focus(), 100);
}

function closeAdminLoginModal() {
  DOM.adminLoginModal.classList.remove("active");
}

async function handleAdminLogin(e) {
  e.preventDefault();
  const id = DOM.loginId.value.trim();
  const password = DOM.loginPw.value.trim();
  DOM.loginErrorMsg.style.display = "none";

  if (isOnline) {
    try {
      const data = await APIService.login(id, password);
      if (data && data.success) {
        state.isAdminAuthenticated = true;
        state.adminToken = data.token;
        sessionStorage.setItem("digitalsaessak-admin-auth", "true");
        sessionStorage.setItem("digitalsaessak-admin-token", data.token);
        closeAdminLoginModal();
        showToast("🔓 관리자 인증에 성공했습니다.");
        switchTab("admin");
        window.scrollTo({ top: DOM.adminSection.offsetTop - 80, behavior: 'smooth' });
      }
    } catch (err) {
      DOM.loginErrorMsg.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ID 또는 비밀번호가 올바르지 않습니다.';
      DOM.loginErrorMsg.style.display = "flex";
      DOM.loginPw.value = "";
      DOM.loginPw.focus();
    }
  } else {
    // 오프라인 모드일 때 로컬 체크
    if (id === "dsadmin" && password === "ds2026!") {
      state.isAdminAuthenticated = true;
      state.adminToken = "dsadmin-session-token-2026";
      sessionStorage.setItem("digitalsaessak-admin-auth", "true");
      sessionStorage.setItem("digitalsaessak-admin-token", state.adminToken);
      closeAdminLoginModal();
      showToast("🔓 로컬 모드 관리자 인증에 성공했습니다.");
      switchTab("admin");
      window.scrollTo({ top: DOM.adminSection.offsetTop - 80, behavior: 'smooth' });
    } else {
      DOM.loginErrorMsg.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ID 또는 비밀번호가 올바르지 않습니다.';
      DOM.loginErrorMsg.style.display = "flex";
      DOM.loginPw.value = "";
      DOM.loginPw.focus();
    }
  }
}

function handleAdminLogout() {
  state.isAdminAuthenticated = false;
  state.adminToken = "";
  sessionStorage.removeItem("digitalsaessak-admin-auth");
  sessionStorage.removeItem("digitalsaessak-admin-token");
  showToast("🔒 성공적으로 로그아웃되었습니다.");
  switchTab("status");
  window.scrollTo({ top: DOM.statusSection.offsetTop - 80, behavior: 'smooth' });
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
  document.getElementById("nav-link-status").classList.add("active");
  
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

// ============================================================================
// 12. Routing & Admin Mode Logic
// ============================================================================
function switchTab(targetTab) {
  if (targetTab === 'admin') {
    if (!state.isAdminAuthenticated) {
      openAdminLoginModal();
      return;
    }
    DOM.catalogSection.style.display = 'none';
    DOM.statusSection.style.display = 'none';
    DOM.adminSection.style.display = 'block';
    
    DOM.navMenu.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    DOM.navLinkAdmin.classList.add('active');
    
    switchAdminTab(state.activeAdminTab);
  } else {
    DOM.catalogSection.style.display = 'none'; // Always hide catalog
    DOM.statusSection.style.display = 'block';
    DOM.adminSection.style.display = 'none';
    
    DOM.navMenu.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    DOM.navLinkStatus.classList.add('active'); // Set status nav link active
  }
}

async function loadAdminDashboard() {
  DOM.adminTableBody.innerHTML = `
    <tr>
      <td colspan="7" class="loading-td">
        <i class="fa-solid fa-spinner fa-spin"></i> 내역을 불러오는 중...
      </td>
    </tr>
  `;
  
  let apps = [];
  if (isOnline) {
    try {
      apps = await APIService.getAllApplications();
    } catch (err) {
      showToast("⚠️ 관리자 데이터를 불러오는 데 실패했습니다.");
      DOM.adminTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="loading-td" style="color: var(--accent);">
            <i class="fa-solid fa-triangle-exclamation"></i> 서버 통신 오류가 발생했습니다.
          </td>
        </tr>
      `;
      return;
    }
  } else {
    apps = state.applications;
  }
  
  DOM.adminStatTotal.textContent = apps.length;
  DOM.adminStatPending.textContent = apps.filter(a => a.status === "pending").length;
  DOM.adminStatApproved.textContent = apps.filter(a => a.status === "approved").length;
  DOM.adminStatRejected.textContent = apps.filter(a => a.status === "rejected").length;
  
  if (apps.length === 0) {
    DOM.adminTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="loading-td">
          <i class="fa-regular fa-clipboard"></i> 신청된 교육 캠프 내역이 없습니다.
        </td>
      </tr>
    `;
    return;
  }
  
  DOM.adminTableBody.innerHTML = apps.map(app => `
    <tr>
      <td>${app.id}</td>
      <td>
        <div class="course-title-sub">${app.courseTitle}</div>
        <div class="course-id-sub">${app.courseId}</div>
      </td>
      <td>
        <div class="user-info-main">${app.studentName}</div>
        <div class="user-info-sub">${getSchoolTypeKorean(app.studentSchoolType)} / ${app.studentSchool} ${app.studentGrade}학년</div>
      </td>
      <td>
        <div class="user-info-main">${app.guardianName}</div>
        <div class="user-info-sub">${app.guardianPhone}</div>
      </td>
      <td>${app.date}</td>
      <td>
        <span class="status-badge ${getStatusBadgeClass(app.status)}">
          <i class="fa-solid ${getStatusBadgeIcon(app.status)}"></i>
          ${getStatusTextKorean(app.status)}
        </span>
      </td>
      <td>
        <div class="btn-action-group">
          ${app.status === 'pending' ? `
            <button class="btn-action btn-approve" onclick="updateAppStatus('${app.id}', 'approved')">
              <i class="fa-solid fa-check"></i> 승인
            </button>
            <button class="btn-action btn-reject" onclick="updateAppStatus('${app.id}', 'rejected')">
              <i class="fa-solid fa-xmark"></i> 반려
            </button>
          ` : `
            <button class="btn-action btn-reject" style="opacity: 0.5;" onclick="updateAppStatus('${app.id}', 'pending')">
              <i class="fa-solid fa-rotate-left"></i> 대기 전환
            </button>
          `}
          <button class="btn-action btn-delete-admin" onclick="deleteAppAdmin('${app.id}')">
            <i class="fa-solid fa-trash-can"></i> 삭제
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function getSchoolTypeKorean(type) {
  switch(type) {
    case 'elementary': return '초등학교';
    case 'middle': return '중학교';
    case 'high': return '고등학교';
    default: return type;
  }
}

function getStatusBadgeClass(status) {
  switch(status) {
    case 'approved': return 'badge-approved';
    case 'rejected': return 'badge-rejected';
    default: return 'badge-pending';
  }
}

function getStatusBadgeIcon(status) {
  switch(status) {
    case 'approved': return 'fa-check';
    case 'rejected': return 'fa-xmark';
    default: return 'fa-spinner fa-spin';
  }
}

function getStatusTextKorean(status) {
  switch(status) {
    case 'approved': return '승인 완료';
    case 'rejected': return '반려됨';
    default: return '접수 완료 (대기)';
  }
}

window.updateAppStatus = async function(appId, newStatus) {
  if (isOnline) {
    try {
      const updated = await APIService.updateApplicationStatus(appId, newStatus);
      showToast(`💼 신청 상태가 '${getStatusTextKorean(newStatus)}'로 변경되었습니다.`);
      
      const localIdx = state.applications.findIndex(a => a.id === appId);
      if (localIdx !== -1) {
        state.applications[localIdx].status = newStatus;
        localStorage.setItem("digitalsaessak-apps", JSON.stringify(state.applications));
        updateStatusDashboard();
      }
      
      loadAdminDashboard();
    } catch (err) {
      showToast("⚠️ 상태 업데이트에 실패했습니다.");
    }
  } else {
    const localIdx = state.applications.findIndex(a => a.id === appId);
    if (localIdx !== -1) {
      state.applications[localIdx].status = newStatus;
      localStorage.setItem("digitalsaessak-apps", JSON.stringify(state.applications));
      showToast(`💼 [로컬] 신청 상태가 '${getStatusTextKorean(newStatus)}'로 변경되었습니다.`);
      updateStatusDashboard();
      loadAdminDashboard();
    } else {
      showToast("⚠️ 해당 내역을 찾을 수 없습니다.");
    }
  }
};

window.deleteAppAdmin = async function(appId) {
  if (!confirm("정말로 해당 신청 내역을 강제 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
    return;
  }
  
  if (isOnline) {
    try {
      await APIService.deleteApplication(appId);
      showToast("🗑️ 신청 내역이 서버에서 삭제되었습니다.");
      
      state.applications = state.applications.filter(a => a.id !== appId);
      localStorage.setItem("digitalsaessak-apps", JSON.stringify(state.applications));
      updateBadgeCount();
      updateStatusDashboard();
      
      loadAdminDashboard();
    } catch (err) {
      showToast("⚠️ 삭제 처리에 실패했습니다.");
    }
  } else {
    state.applications = state.applications.filter(a => a.id !== appId);
    localStorage.setItem("digitalsaessak-apps", JSON.stringify(state.applications));
    updateBadgeCount();
    updateStatusDashboard();
    loadAdminDashboard();
    showToast("🗑️ [로컬] 신청 내역이 삭제되었습니다.");
  }
};

