const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// 1. Add filter controls to index.html
let newIndex = indexHtml.replace(
    '<div class="flex items-center gap-3">',
    `<div class="flex flex-wrap items-center gap-3 w-full">
        <div class="flex gap-2 items-center">
          <select id="filter-status" class="bg-white border border-slate-300 text-sm rounded-lg px-3 py-1.5 focus:ring-inha-blue focus:border-inha-blue">
            <option value="all">신분 (전체)</option>
            <option value="교원">교원</option>
            <option value="프리랜서">프리랜서</option>
          </select>
          <select id="filter-role" class="bg-white border border-slate-300 text-sm rounded-lg px-3 py-1.5 focus:ring-inha-blue focus:border-inha-blue">
            <option value="all">직종 (전체)</option>
            <option value="주강사">주강사</option>
            <option value="보조강사">보조강사</option>
            <option value="운영요원">운영요원</option>
            <option value="안전요원">안전요원</option>
          </select>
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs"></i>
            <input type="text" id="filter-name" placeholder="강사명 검색" class="pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm w-32 focus:ring-inha-blue focus:border-inha-blue">
          </div>
        </div>
        <div class="ml-auto flex items-center gap-2">
`
).replace('</div>\n          <div class="overflow-x-auto w-full">', '</div></div>\n          <div class="overflow-x-auto w-full">');

// 2. Simplify the table header
const tableHeaderRegex = /<table class="w-full text-sm text-left border-collapse" style="min-width: 1200px;">[\s\S]*?<\/thead>/;
const newTableHeader = `<table class="w-full text-sm text-left border-collapse" style="min-width: 800px;">
                  <thead>
                      <tr class="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-center uppercase tracking-wider text-[12px]">
                          <th class="p-3 border-r w-12">#</th>
                          <th class="p-3 border-r w-48">분반 프로그램명</th>
                          <th class="p-3 border-r w-48">강사 정보 (신분/직종)</th>
                          <th class="p-3 border-r">서류 진행 상태</th>
                          <th class="p-3 w-20">관리</th>
                      </tr>
                  </thead>`;
newIndex = newIndex.replace(tableHeaderRegex, newTableHeader);

// 3. Update Modal structure
const modalContentRegex = /<div class="p-5 border-b border-slate-200 flex justify-between items-start bg-slate-50 rounded-t-2xl">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
const newModalContent = `<div class="p-5 border-b border-slate-200 flex justify-between items-start bg-slate-50 rounded-t-2xl">
      <div>
        <h3 class="text-xl font-extrabold text-slate-800 flex items-center gap-2">
          <i class="fa-solid fa-folder-open text-inha-blue"></i> 강사 서류 상세 관리
        </h3>
        <p class="text-xs text-slate-500 mt-1">강사 신분과 직종에 따라 필수 제출 서류가 동적으로 활성화됩니다.</p>
      </div>
      <button id="submission-details-close" class="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition">
        <i class="fa-solid fa-xmark text-xl"></i>
      </button>
    </div>

    <!-- Modal Body -->
    <div class="p-6 max-h-[70vh] overflow-y-auto bg-slate-50/50">
      <div id="modal-content-area" class="max-w-4xl mx-auto space-y-6">
        
        <!-- 강사 기본 정보 수정 영역 -->
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h4 class="font-bold text-slate-800 mb-4 border-b pb-2"><i class="fa-solid fa-user-pen mr-2 text-slate-500"></i>강사 기본 정보</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">분반 프로그램명</label>
              <input type="text" id="modal-class-name" class="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:ring-inha-blue">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">강사명</label>
              <input type="text" id="modal-student-name" class="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:ring-inha-blue">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">이메일/연락처</label>
              <input type="text" id="modal-email" class="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:ring-inha-blue">
            </div>
            <div class="flex gap-2">
              <div class="flex-1">
                <label class="block text-xs font-bold text-slate-600 mb-1">신분</label>
                <select id="modal-status" class="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:ring-inha-blue">
                  <option value="교원">교원</option>
                  <option value="프리랜서">프리랜서</option>
                </select>
              </div>
              <div class="flex-1">
                <label class="block text-xs font-bold text-slate-600 mb-1">직종</label>
                <select id="modal-role" class="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:ring-inha-blue">
                  <option value="주강사">주강사</option>
                  <option value="보조강사">보조강사</option>
                  <option value="운영요원">운영요원</option>
                  <option value="안전요원">안전요원</option>
                </select>
              </div>
            </div>
          </div>
          <div class="mt-4 flex justify-end">
            <button id="btn-save-instructor-info" class="bg-slate-800 text-white px-4 py-1.5 rounded text-sm hover:bg-slate-700 transition">정보 저장</button>
          </div>
        </div>

        <!-- 동적 서류 업로드 영역 -->
        <div id="modal-docs-container" class="space-y-3">
          <!-- JS will inject doc sections here -->
        </div>
      </div>
    </div>
  </div>
</div>`;

newIndex = newIndex.replace(modalContentRegex, newModalContent);
fs.writeFileSync('index.html', newIndex, 'utf8');
console.log('Updated index.html');
