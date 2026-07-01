const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const modalMatch = content.match(/<!-- Submission Details Modal -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/);
const modalHtml = modalMatch ? modalMatch[0] : '';

let dashboardHtml = '';
const dashboardMatch = content.match(/<!-- 실시간 통계 요약[\s\S]*?(?=<\/section>)/);
if (dashboardMatch) {
    dashboardHtml = dashboardMatch[0];
    const idx = dashboardHtml.lastIndexOf('</div>');
    if (idx !== -1) {
        dashboardHtml = dashboardHtml.substring(0, idx + 6);
    }
}

const newHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>인하대학교 디지털새싹 캠프 관리자 포털</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      corePlugins: { preflight: false },
      theme: { extend: { colors: { inha: { navy: '#1e3a8a', blue: '#1e40af', cyan: '#06b6d4', light: '#f1f5f9', dark: '#0f172a' } } } }
    }
  </script>
  <link rel="stylesheet" href="./style.css">
</head>
<body class="bg-slate-50 min-h-screen text-slate-800 flex flex-col font-sans">
  
  <header class="bg-white shadow-sm border-b border-slate-200 py-4 px-6 flex justify-between items-center z-10 sticky top-0">
    <div class="logo flex items-center gap-3">
      <img src="./Signature/Signature_LR01.png" alt="인하대학교 로고" class="h-9 object-contain">
      <span class="font-bold text-lg text-slate-700 tracking-tight"><span class="text-cyan-500">디지털</span>새싹 캠프 관리자 포털</span>
    </div>
    <div class="flex items-center gap-4">
      <button id="btn-admin-logout" style="display: none;" class="text-sm font-semibold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded transition"><i class="fa-solid fa-right-from-bracket"></i> 로그아웃</button>
    </div>
  </header>

  <main class="flex-grow flex flex-col items-center justify-center p-6 w-full" id="main-content">
    
    <!-- Login Section -->
    <section id="login-section" class="w-full max-w-md">
      <div class="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-inha-blue">
            <i class="fa-solid fa-user-shield text-2xl"></i>
          </div>
          <h2 class="text-2xl font-extrabold text-slate-800">관리자 로그인</h2>
          <p class="text-sm text-slate-500 mt-2">허가된 관리자만 접근할 수 있습니다.</p>
        </div>
        
        <form id="admin-login-form" autocomplete="off" class="space-y-5">
          <div>
            <label for="login-id" class="block text-sm font-bold text-slate-700 mb-1">관리자 ID</label>
            <input type="text" id="login-id" class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-inha-blue focus:border-inha-blue transition outline-none" placeholder="아이디를 입력하세요" required>
          </div>
          <div>
            <label for="login-pw" class="block text-sm font-bold text-slate-700 mb-1">비밀번호</label>
            <input type="password" id="login-pw" class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-inha-blue focus:border-inha-blue transition outline-none" placeholder="비밀번호를 입력하세요" required>
          </div>
          
          <div id="login-error-msg" style="display:none;" class="text-sm text-rose-500 bg-rose-50 p-3 rounded border border-rose-100 flex items-center gap-2">
            <i class="fa-solid fa-circle-exclamation"></i> ID 또는 비밀번호가 올바르지 않습니다.
          </div>
          
          <button type="submit" class="w-full bg-inha-navy hover:bg-inha-blue text-white font-bold py-3 px-4 rounded-lg shadow transition duration-200 mt-4 flex justify-center items-center gap-2">
            로그인 <i class="fa-solid fa-arrow-right-to-bracket"></i>
          </button>
        </form>
      </div>
    </section>

    <!-- Admin Dashboard Section -->
    <section id="admin-section" class="w-full max-w-[1400px]" style="display: none;">
      <div class="mb-6 flex justify-between items-end">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-800"><i class="fa-solid fa-file-excel text-emerald-600 mr-2"></i>강사 서류 자동화 관리</h2>
          <p class="text-sm text-slate-500 mt-1">강사들의 서류 제출 현황을 한눈에 파악하고 관리하세요.</p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <button type="button" class="btn btn-secondary" id="btn-admin-refresh" style="background: white; border: 1px solid #ccc; padding: 0.5rem 1rem; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-rotate"></i> 새로고침</button>
        </div>
      </div>
      
${dashboardHtml}
    </section>
  </main>

${modalHtml}

  <div id="toast-container" class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"></div>
  <script src="./app.js"></script>
</body>
</html>
`;

fs.writeFileSync('index.html', newHtml, 'utf8');
console.log('done');
