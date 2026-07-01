import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

def extract_func(func_name, code):
    match = re.search(r'(async )?function ' + func_name + r'\s*\([^)]*\)\s*\{', code)
    if not match: return ''
    
    start = match.start()
    depth = 0
    in_string = False
    string_char = ''
    in_comment = False
    
    for i in range(start, len(code)):
        char = code[i]
        
        if not in_comment and not in_string:
            if char == '/' and i+1 < len(code) and code[i+1] == '/':
                in_comment = True
            elif char in ['"', "'", '`']:
                in_string = True
                string_char = char
            elif char == '{':
                depth += 1
            elif char == '}':
                depth -= 1
                if depth == 0:
                    return code[start:i+1]
        elif in_string:
            if char == string_char and code[i-1] != '\\':
                in_string = False
        elif in_comment:
            if char == '\n':
                in_comment = False

    return ''

def extract_const(var_name, code):
    match = re.search(r'const\s+' + var_name + r'\s*=\s*\{', code)
    if not match: return ''
    
    start = match.start()
    depth = 0
    for i in range(start, len(code)):
        if code[i] == '{': depth += 1
        elif code[i] == '}':
            depth -= 1
            if depth == 0:
                # include trailing semicolon or just stop
                end = i+1
                if end < len(code) and code[end] == ';': end += 1
                return code[start:end]
    return ''

# Extract APIService
api_service = extract_const('APIService', content)
if not api_service:
    # try let APIService
    pass

api_service_match = re.search(r'const APIService = \{[\s\S]*?\n\};', content)
if api_service_match: api_service = api_service_match.group(0)

dom_elements = '''const DOM = {
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
};'''

variables = '''let state = {
  instructorDocs: [],
  isAdminAuthenticated: sessionStorage.getItem("digitalsaessak-admin-auth") === "true",
  adminToken: sessionStorage.getItem("digitalsaessak-admin-token") || ""
};
const API_URL = "http://localhost:3000/api";
let isOnline = false;
'''

funcs = [
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
]

funcs_code = []
for f in funcs:
    c = extract_func(f, content)
    funcs_code.append(c)


# Event listeners
event_listeners = '''
document.addEventListener("DOMContentLoaded", async () => {
  try {
    isOnline = await APIService.checkHealth();
  } catch(e) { isOnline = false; }
  
  if (state.isAdminAuthenticated) {
    DOM.loginSection.style.display = "none";
    DOM.adminDashboardSection.style.display = "block";
    DOM.btnAdminLogout.style.display = "flex";
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

DOM.btnAdminRefresh.addEventListener("click", () => {
    initInstructorDocs();
});
'''

# Optional add row logic
add_row = '''
const btnAddRow = document.getElementById("btn-add-inst-row");
if (btnAddRow) {
  btnAddRow.addEventListener("click", () => {
    const newId = `doc-${Date.now()}`;
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
'''


full_code = f"""
{variables}
{dom_elements}

{api_service}

{'\\n\\n'.join(funcs_code)}

{event_listeners}
{add_row}
"""

with open('app_new.js', 'w', encoding='utf-8') as f:
    f.write(full_code)

print("Created app_new.js")
