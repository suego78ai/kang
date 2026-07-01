const fs = require('fs');

const content = fs.readFileSync('app.js', 'utf8');

function extractFunc(funcName, code) {
    const regex = new RegExp(`(?:async\\s+)?function\\s+${funcName}\\s*\\([^)]*\\)\\s*\\{`);
    const match = code.match(regex);
    if (!match) return '';

    const start = match.index;
    let depth = 0;
    let inString = false;
    let stringChar = '';
    let inComment = false;

    for (let i = start; i < code.length; i++) {
        const char = code[i];

        if (!inComment && !inString) {
            if (char === '/' && i + 1 < code.length && code[i + 1] === '/') {
                inComment = true;
            } else if (char === '"' || char === "'" || char === '`') {
                inString = true;
                stringChar = char;
            } else if (char === '{') {
                depth++;
            } else if (char === '}') {
                depth--;
                if (depth === 0) {
                    return code.substring(start, i + 1);
                }
            }
        } else if (inString) {
            if (char === stringChar && code[i - 1] !== '\\') {
                inString = false;
            }
        } else if (inComment) {
            if (char === '\\n') {
                inComment = false;
            }
        }
    }
    return '';
}

function extractConst(varName, code) {
    const regex = new RegExp(`const\\s+${varName}\\s*=\\s*\\{`);
    const match = code.match(regex);
    if (!match) return '';

    const start = match.index;
    let depth = 0;
    for (let i = start; i < code.length; i++) {
        if (code[i] === '{') depth++;
        else if (code[i] === '}') {
            depth--;
            if (depth === 0) {
                let end = i + 1;
                if (end < code.length && code[end] === ';') end++;
                return code.substring(start, end);
            }
        }
    }
    return '';
}

let apiService = extractConst('APIService', content);
if (!apiService) {
    const apiServiceMatch = content.match(/const APIService = \\{[\\s\\S]*?\\n\\};/);
    if (apiServiceMatch) apiService = apiServiceMatch[0];
}

const domElements = `const DOM = {
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
  submissionDetailsModal: document.getElementById("submission-details-modal")
};`;

const variables = `let state = {
  instructorDocs: [],
  isAdminAuthenticated: sessionStorage.getItem("digitalsaessak-admin-auth") === "true",
  adminToken: sessionStorage.getItem("digitalsaessak-admin-token") || ""
};
const API_URL = "http://localhost:3000/api";
let isOnline = false;
`;

const funcs = [
    'saveInstructorDocs',
    'renderInstructorDocs',
    'initInstructorDocs',
    'loadInstructorDocsFromLocalStorage',
    'updateDashboardStats',
    'updateDocStatus',
    'updateDocStatusField',
    'deleteDocRecord',
    'downloadDocFile',
    'previewDocFile',
    'showSubmissionDetails',
    'closeSubmissionDetails',
    'showToast'
];

const funcsCode = funcs.map(f => extractFunc(f, content));

const eventListeners = `
document.addEventListener("DOMContentLoaded", async () => {
  try {
    isOnline = await APIService.checkHealth();
  } catch(e) { isOnline = false; }
  
  if (state.isAdminAuthenticated) {
    DOM.loginSection.style.display = "none";
    DOM.adminDashboardSection.style.display = "flex";
    DOM.btnAdminLogout.style.display = "block";
    initInstructorDocs();
  } else {
    DOM.loginSection.style.display = "block";
    DOM.adminDashboardSection.style.display = "none";
    DOM.btnAdminLogout.style.display = "none";
  }
});

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
        DOM.adminDashboardSection.style.display = "flex";
        DOM.btnAdminLogout.style.display = "block";
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
      DOM.adminDashboardSection.style.display = "flex";
      DOM.btnAdminLogout.style.display = "block";
      initInstructorDocs();
    } else {
      DOM.loginErrorMsg.style.display = "flex";
    }
  }
});

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

if (DOM.btnAdminRefresh) {
    DOM.btnAdminRefresh.addEventListener("click", () => {
        initInstructorDocs();
    });
}
`;

const addRow = `
const btnAddRow = document.getElementById("btn-add-inst-row");
if (btnAddRow) {
  btnAddRow.addEventListener("click", () => {
    const newId = 'doc-' + Date.now();
    state.instructorDocs.unshift({
        id: newId,
        studentName: "신규 강사",
        className: "새 프로그램",
        guardianEmail: "",
        date: new Date().toLocaleDateString(),
        doc1Url: "", doc1Status: "pending", doc1Message: "",
        doc2Url: "", doc2Status: "pending", doc2Message: "",
        doc3Url: "", doc3Status: "pending", doc3Message: "",
        doc4Url: "", doc4Status: "pending", doc4Message: "",
        doc5Url: "", doc5Status: "pending", doc5Message: ""
    });
    saveInstructorDocs();
    renderInstructorDocs();
  });
}
`;

const fullCode = variables + "\\n" + domElements + "\\n\\n" + apiService + "\\n\\n" + funcsCode.join("\\n\\n") + "\\n\\n" + eventListeners + "\\n" + addRow;

fs.writeFileSync('app_new.js', fullCode, 'utf8');
console.log('Created app_new.js');
