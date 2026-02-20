/**
 * 프로그램 ID(progId) → 상세 페이지 이미지 파일명 매핑
 * public/images/program/ 폴더에 해당 파일이 있어야 합니다.
 */
export const PROG_ID_IMAGE_MAP = {
    1: 'child.jpg',       // 내면아이 찾기 프로그램
    2: 'emotion.jpg',     // 핵심감정 프로그램
    3: 'selfesteem.jpg', // 자존감 회복 프로그램
    4: 'think.jpg',      // 생각을 말로 표현하기 프로그램
    5: 'draw.jpg',       // 그림심리 프로그램
    6: 'mbti.avif',      // 애니어그램 프로그램
    7: 'sentence.jpg',   // 문장완성검사 프로그램
    8: 'life.jpg',       // 인생그래프 프로그램
    9: 'career.jpg',     // 진로적성검사 프로그램
    10: 'buildlife.jpg', // 인생설계 프로그램
    11: 'one.jpg',       // 1:1 맞춤 코칭 프로그램
    12: 'smallgroup.jpg', // 소그룹 워크숍 프로그램
    13: 'smallgroup.jpg', // 그룹 프로그램 프로그램
    14: 'oneday.jpg',    // 원데이 클래스 프로그램
    15: 'mentor.jpg',    // Mentor Meet-up 프로그램
    16: 'coffeechat.jpg', // Coffee Chat 프로그램
};

// Vite base URL (배포 시 subpath 대응)
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '';
const PROGRAM_IMAGE_BASE = `${BASE}/images/program`;

/**
 * progId로 이미지 URL 반환. 매핑 없으면 progId.jpg → default.jpg
 * 마이페이지 등에서 progId만 있을 때: getProgramImageUrlByProgId(progId)
 */
export function getProgramImageUrl(_progNm, progId) {
    const id = progId != null ? String(progId).trim() : '';
    const filename = id && PROG_ID_IMAGE_MAP[id];
    if (filename) {
        return `${PROGRAM_IMAGE_BASE}/${filename}`;
    }
    return id ? `${PROGRAM_IMAGE_BASE}/${id}.jpg` : PROGRAM_IMAGE_FALLBACK;
}

export const PROGRAM_IMAGE_FALLBACK = `${PROGRAM_IMAGE_BASE}/default.jpg`;

/** progId만으로 이미지 URL (마이페이지 등에서 사용) */
export function getProgramImageUrlByProgId(progId) {
    return getProgramImageUrl(null, progId);
}
