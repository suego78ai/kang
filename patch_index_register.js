const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

const uploadSection = `
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-slate-800"><i class="fa-solid fa-file-import text-inha-blue mr-2"></i>강사 명단 엑셀 일괄 등록</h3>
          <button id="btn-excel-register" class="bg-emerald-600 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-emerald-500 transition shadow-sm hidden">
            <i class="fa-solid fa-cloud-arrow-up"></i> DB에 최종 등록하기
          </button>
        </div>
        <div id="excel-drop-zone" class="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 hover:border-inha-blue transition cursor-pointer">
          <i class="fa-solid fa-file-excel text-4xl text-emerald-500 mb-3"></i>
          <p class="font-bold text-slate-700 mb-1" id="excel-drop-text">엑셀 파일을 이곳에 드래그하거나 클릭하여 업로드하세요.</p>
          <p class="text-sm text-slate-500" id="excel-drop-subtext">필수 컬럼: 학교명, 권역, 담당자, 전화번호, 프로그램</p>
          <input type="file" id="excel-file-input" accept=".xlsx, .xls" class="hidden">
        </div>
      </div>
`;

let updatedIndexHtml = indexHtml.replace(
  /<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">[\s\S]*?<input type="file" id="excel-file-input" accept="\.xlsx, \.xls" class="hidden">\s*<\/div>\s*<\/div>/,
  uploadSection
);

fs.writeFileSync('index.html', updatedIndexHtml, 'utf8');
console.log('Added Register button to index.html');
