const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Replace the filter section
const newFilters = \`
        <div class="bg-slate-50 border-b border-slate-200 p-4 flex flex-col gap-3">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex flex-wrap items-center gap-3 w-full">
                    
                    <!-- Datalists for Autocomplete -->
                    <datalist id="program-list"></datalist>
                    <datalist id="name-list"></datalist>
                    
                    <div class="flex flex-col">
                        <label class="text-[10px] font-bold text-slate-500 mb-0.5">프로그램명</label>
                        <input type="text" id="filter-program" list="program-list" placeholder="프로그램 검색" class="border border-slate-300 rounded px-3 py-1.5 text-sm focus:ring-inha-blue w-40">
                    </div>
                    
                    <div class="flex flex-col">
                        <label class="text-[10px] font-bold text-slate-500 mb-0.5">강사명</label>
                        <input type="text" id="filter-name" list="name-list" placeholder="강사명 검색" class="border border-slate-300 rounded px-3 py-1.5 text-sm focus:ring-inha-blue w-28">
                    </div>

                    <div class="flex flex-col">
                        <label class="text-[10px] font-bold text-slate-500 mb-0.5">학교명</label>
                        <input type="text" id="filter-school" placeholder="소속 검색" class="border border-slate-300 rounded px-3 py-1.5 text-sm focus:ring-inha-blue w-32">
                    </div>
                    
                    <div class="flex flex-col">
                        <label class="text-[10px] font-bold text-slate-500 mb-0.5">제출 기간 (시작 ~ 종료)</label>
                        <div class="flex items-center gap-1">
                            <input type="date" id="filter-date-start" class="border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-inha-blue">
                            <span class="text-slate-400">~</span>
                            <input type="date" id="filter-date-end" class="border border-slate-300 rounded px-2 py-1.5 text-sm focus:ring-inha-blue">
                        </div>
                    </div>
                    
                    <div class="flex flex-col">
                        <label class="text-[10px] font-bold text-slate-500 mb-0.5">유형</label>
                        <select id="filter-status" class="border border-slate-300 rounded px-3 py-1.5 text-sm focus:ring-inha-blue">
                          <option value="all">전체</option>
                          <option value="교원">교원</option>
                          <option value="일반">일반강사</option>
                        </select>
                    </div>

                    <div class="flex flex-col">
                        <label class="text-[10px] font-bold text-slate-500 mb-0.5">누락 서류</label>
                        <input type="text" id="filter-missing" placeholder="서류명 (예: 신분증)" class="border border-slate-300 rounded px-3 py-1.5 text-sm focus:ring-inha-blue w-32">
                    </div>
                    
                    <div class="ml-auto mt-auto">
                        <button id="btn-download-zip" class="bg-inha-blue text-white font-bold text-sm px-4 py-1.5 rounded-lg hover:bg-inha-navy transition flex items-center gap-2 shadow-sm h-[34px]">
                            <i class="fa-solid fa-file-zipper"></i> 선택 ZIP 다운로드
                        </button>
                    </div>
                </div>
            </div>
        </div>
\`;

let updatedIndexHtml = indexHtml.replace(
  /<div class="bg-slate-50 border-b border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">[\s\S]*?<\/div>\s*<\/div>/,
  newFilters
);

// Replace Table headers
const newHeaders = \`
                <thead>
                    <tr class="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-center uppercase tracking-wider text-[12px]">
                        <th class="p-3 border-r w-10"><input type="checkbox" id="chk-all" class="rounded text-inha-blue focus:ring-inha-blue"></th>
                        <th class="p-3 border-r w-48">프로그램명</th>
                        <th class="p-3 border-r w-32">소속 (학교)</th>
                        <th class="p-3 border-r w-24">강사명</th>
                        <th class="p-3 border-r w-32">연락처</th>
                        <th class="p-3 border-r w-40">최종 제출일시</th>
                        <th class="p-3 border-r w-20">유형</th>
                        <th class="p-3 border-r">서류 현황 (❌ 미제출)</th>
                        <th class="p-3 w-16">관리</th>
                    </tr>
                </thead>
\`;

updatedIndexHtml = updatedIndexHtml.replace(
  /<thead>[\s\S]*?<\/thead>/,
  newHeaders
);

fs.writeFileSync('index.html', updatedIndexHtml, 'utf8');
console.log('Updated index.html with new UI');
