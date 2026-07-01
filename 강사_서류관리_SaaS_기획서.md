# 강사 서류관리 SaaS 기획서

## 개요

본 시스템은 강사들이 프로그램별 제출 서류를 온라인으로 제출하고 관리자는
실시간으로 제출 현황, 미제출 서류, 보완 필요 서류를 확인·검색·다운로드할
수 있는 SaaS입니다.

## 제출 서류

1.  성범죄 경력 조회 동의서 (교원 제외)
2.  성범죄 및 아동학대 사실 부존재 확인 서약서
3.  현직 교원의 디지털새싹 출강 안내 및 확인서 (교원만)
4.  프로그램 결과보고서 (사진 6장, 최소 4장 필수)
5.  식·다과 수령 확인서
6.  강사비 신청서 (신분증, 통장사본, 이력서 필수)
7.  일용직 근로자 근로계약서 (신분증, 통장사본, 일일 근로일지 필수)
8.  디지털새싹 프로그램 출강 확인서
9.  운영 전 체크리스트 (매회 제출)
10. 운영 후 체크리스트 (매회 제출)
11. 안전관리 서약서

## 제출 플로우

1.  학교명 / 프로그램(드롭다운) / 강사명 / 연락처 입력
2.  교원 또는 프리랜서 선택
3.  역할 선택(주강사/보조강사/운영요원/안전요원)
4.  해당 역할에 필요한 서류만 활성화
5.  단계별 업로드
6.  최종 제출

## 역할별 제출 규칙

### 교원

-   주강사: 3,4,5,6,8
-   보조강사: 6
-   운영요원: 1,2,7,9,10,11
-   안전요원: 1,2,7,11

### 프리랜서

-   주강사: 1,2,4,5,6
-   보조강사: 6
-   운영요원: 1,2,7,9,10,11
-   안전요원: 1,2,7,11

## 관리자 기능

-   실시간 제출 현황
-   미제출 서류 검색
-   학교명/강사명/미제출 서류 검색
-   보완 필요 표시
-   강사별 다운로드
-   다중 선택 ZIP 다운로드

## 엑셀 업로드 형식

  학교명         권역   담당자   전화번호      프로그램
  -------------- ------ -------- ------------- ------------------------
  양산초등학교   경남   심효찬   01024421903   3\. 다문화 AI 큐레이터

프로그램은 강사 제출 페이지에서 드롭다운으로 선택한다.

## ZIP 구조

``` text
선택_강사_서류.zip
 ├── 홍길동-20260701/
 │    ├── 01_성범죄_경력_조회_동의서.pdf
 │    ├── 04_프로그램_결과보고서.pdf
 │    ├── 06_강사비신청서_첨부/
 │    │    ├── 신분증.png
 │    │    ├── 통장사본.pdf
 │    │    └── 이력서.pdf
 │    └── 09_운영전_체크리스트/
 └── 김철수-20260702/
```

## SQL - 미제출 조회

``` sql
SELECT
i.school_name,
i.name,
d.document_name
FROM instructors i
JOIN document_requirements dr
ON i.identity_type=dr.identity_type
AND i.role_type=dr.role_type
JOIN documents d
ON dr.document_id=d.id
LEFT JOIN submissions s
ON i.id=s.instructor_id
AND d.id=s.document_id
WHERE s.id IS NULL;
```

## SQL - 다운로드 대상

``` sql
SELECT
i.name,
DATE_FORMAT(i.first_submission_date,'%Y%m%d') first_date,
d.id,
d.document_name,
s.file_path,
s.file_name
FROM instructors i
JOIN submissions s ON i.id=s.instructor_id
JOIN documents d ON s.document_id=d.id
WHERE i.id IN (3,5);
```

## 기술스택

-   Frontend: React
-   Backend: FastAPI 또는 Express
-   DB: PostgreSQL
-   Storage: AWS S3 / Ncloud Object Storage
-   ZIP: zipfile 또는 archiver
-   실시간: WebSocket
