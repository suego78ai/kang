const fs = require('fs');

const submitHtml = fs.readFileSync('submit.html', 'utf8');

const newStep0 = `
        <!-- STEP 0: Authentication -->
        <div id="step-0" class="step-section block space-y-5">
          <div class="text-center mb-6">
            <h2 class="text-xl font-bold text-slate-800">본인 인증</h2>
            <p class="text-sm text-slate-500">관리자가 엑셀로 사전 등록한 명단에서 조회합니다.</p>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">프로그램 선택</label>
            <select id="auth-program" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-inha-blue focus:border-inha-blue transition bg-white" required>
              <option value="" disabled selected>선택 중...</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">강사명</label>
            <input type="text" id="auth-name" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-inha-blue focus:border-inha-blue transition" placeholder="이름을 입력하세요" required>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">전화번호</label>
            <input type="text" id="auth-phone" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-inha-blue focus:border-inha-blue transition" placeholder="010-XXXX-XXXX" required>
          </div>
          <button type="button" id="btn-auth" class="w-full bg-inha-navy hover:bg-inha-blue text-white font-bold py-3 px-4 rounded-lg shadow mt-2 transition disabled:opacity-50 disabled:cursor-not-allowed">
            조회 및 시작하기
          </button>
          <div id="auth-error" class="text-rose-500 text-sm font-bold text-center mt-2 hidden"></div>
        </div>
`;

let updatedSubmitHtml = submitHtml.replace(
  /<!-- STEP 0: Authentication -->[\s\S]*?<!-- STEP 1: Basic Info & Type -->/,
  `${newStep0}\n\n        <!-- STEP 1: Basic Info & Type -->`
);

fs.writeFileSync('submit.html', updatedSubmitHtml, 'utf8');
console.log('Updated submit.html with Program Dropdown');
