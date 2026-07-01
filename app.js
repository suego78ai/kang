let state = {
  instructorDocs: [],
  isAdminAuthenticated: sessionStorage.getItem("digitalsaessak-admin-auth") === "true",
  adminToken: sessionStorage.getItem("digitalsaessak-admin-token") || ""
};
const API_URL = "http://localhost:3000/api";
let isOnline = false;
\nconst DOM = {
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
};\n\nconst APIService = {
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
};\n\nasync function saveInstructorDocs() {
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
}\n\n\n\nasync function initInstructorDocs() {
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
}\n\nfunction loadInstructorDocsFromLocalStorage() {
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
}\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nfunction showToast(message) {
  clearTimeout(toastTimeout);
  DOM.toastMessage.textContent = message;
  DOM.toast.classList.add("active");
  
  toastTimeout = setTimeout(() => {
    DOM.toast.classList.remove("active");
  }, 3500);
}\n\n
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
\n
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
