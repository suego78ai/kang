const fs = require('fs');

// --- Update submit.html ---
let submitHtml = fs.readFileSync('submit.html', 'utf8');

const roleUI = `
          <div class="mt-6">
            <label class="block text-sm font-bold text-slate-700 mb-2">역할 선택 (제출할 서류가 자동으로 변경됩니다)</label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label class="flex flex-col items-center justify-center p-3 border-2 border-emerald-600 bg-emerald-50 rounded-xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-600 transition role-radio">
                <input type="radio" name="instructor-role" value="주강사" class="hidden" checked>
                <i class="fa-solid fa-chalkboard text-2xl text-slate-500 mb-1"></i>
                <span class="font-bold text-slate-700 text-sm">주강사</span>
              </label>
              <label class="flex flex-col items-center justify-center p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-600 transition role-radio">
                <input type="radio" name="instructor-role" value="보조강사" class="hidden">
                <i class="fa-solid fa-users text-2xl text-slate-500 mb-1"></i>
                <span class="font-bold text-slate-700 text-sm">보조강사</span>
              </label>
              <label class="flex flex-col items-center justify-center p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-600 transition role-radio">
                <input type="radio" name="instructor-role" value="운영요원" class="hidden">
                <i class="fa-solid fa-clipboard-check text-2xl text-slate-500 mb-1"></i>
                <span class="font-bold text-slate-700 text-sm">운영요원</span>
              </label>
              <label class="flex flex-col items-center justify-center p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:bg-emerald-50 hover:border-emerald-600 transition role-radio">
                <input type="radio" name="instructor-role" value="안전요원" class="hidden">
                <i class="fa-solid fa-helmet-safety text-2xl text-slate-500 mb-1"></i>
                <span class="font-bold text-slate-700 text-sm">안전요원</span>
              </label>
            </div>
          </div>
`;

submitHtml = submitHtml.replace(
  /<\/div>\s*<\/div>\s*<!-- STEP 2: Basic Agreements -->/,
  `    </div>\n${roleUI}\n        </div>\n\n        <!-- STEP 2: Basic Agreements -->`
);

fs.writeFileSync('submit.html', submitHtml, 'utf8');


// --- Update index.html ---
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Table Header
indexHtml = indexHtml.replace(
  /<th class="p-3 border-r w-20">유형<\/th>/,
  '<th class="p-3 border-r w-20">유형</th>\n                        <th class="p-3 border-r w-24">역할</th>'
);

// Modal UI
const newModalUI = `
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">신분 (유형)</label>
                <select id="modal-status" class="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:ring-inha-blue">
                  <option value="일반">일반 강사</option>
                  <option value="교원">현직 교원</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">역할</label>
                <select id="modal-role" class="w-full border border-slate-300 rounded px-3 py-1.5 text-sm focus:ring-inha-blue">
                  <option value="주강사">주강사</option>
                  <option value="보조강사">보조강사</option>
                  <option value="운영요원">운영요원</option>
                  <option value="안전요원">안전요원</option>
                </select>
              </div>
`;

indexHtml = indexHtml.replace(
  /<div>\s*<label class="block text-xs font-bold text-slate-600 mb-1">신분 \(유형\)<\/label>[\s\S]*?<\/select>\s*<\/div>/,
  newModalUI
);

fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Successfully patched UI files');
