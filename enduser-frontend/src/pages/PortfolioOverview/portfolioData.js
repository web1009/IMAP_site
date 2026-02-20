// 페이지 메타 (Helmet)
export const PAGE_META = {
  title: '수강안내 - IMAP 성장 컨설팅',
  description: '나를 진단하고, 내일을 설계하다. 심리·진로·관계 통합 진단부터 1:1 맞춤 코칭까지.',
};

// Hero 섹션
export const HERO = {
  title: '나를 진단하고, 내일을 설계하다',
  desc: '심리 · 진로 · 관계 통합 진단부터 1:1 맞춤 코칭까지',
  ctaText: '프로그램 신청하기',
};

// Step Flow 섹션
export const STEP_FLOW = [
  { icon: 'bi-cpu', label: '진단' },
  { icon: 'bi-search', label: '자기이해' },
  { icon: 'bi-map', label: '설계' },
  { icon: 'bi-bullseye', label: '코칭' },
  { icon: 'bi-people', label: '네트워킹' },
];
export const STEP_HEADING = 'Program Process';

// Consulting 섹션
export const CONSULTING_TITLE = {
  iconSrc: '/images/program/consulting.png',
  text: 'CONSULTING',
};
export const CONSULTING_CARDS = [
  {
    title: '마음 지도',
    items: ['핵심감정 탐색', '자존감 회복', '그림 심리'],
  },
  {
    title: '자기 이해 지도',
    items: ['성향 분석', '가치 탐색', '강점 진단'],
  },
  {
    title: '인생 설계 지도',
    items: ['진로 설계', '목표 설정', '실행 플랜'],
  },
];

// Education 섹션
export const EDUCATION_TITLE = {
  iconSrc: '/images/program/education.png',
  text: 'EDUCATION',
};
export const EDUCATION_ITEMS = [
  { icon: 'bi-person-check', label: '1:1 코칭', desc: '나만을 위한 맞춤 코칭' },
  { icon: 'bi-people', label: '그룹 세션', desc: '함께 성장하는 그룹 프로그램' },
  { icon: 'bi-lightbulb', label: '워크숍', desc: '집중 체험형 워크숍' },
  { icon: 'bi-calendar-day', label: '원데이 클래스', desc: '한 번에 몰입하는 원데이' },
];

// Network 섹션
export const NETWORK_TITLE = {
  iconSrc: '/images/program/network.png',
  text: 'NETWORK',
};
export const NETWORK_ITEMS = [
  {
    title: 'Mentor Meet-up',
    desc: '선배 멘토와 직접 만나는 현실 조언',
    icon: 'bi-chat-heart',
  },
  {
    title: 'Coffee Chat',
    desc: '현직자와 편안하게 나누는 커리어 이야기',
    icon: 'bi-cup-hot',
  },
];

// Before / After 섹션
export const BEFORE_AFTER = {
  sectionTitle: 'Designing a Better You',
  subTitle: 'From Uncertainty to Clarity',
  before: {
    label: 'Before',
    items: [
      '진로와 목표가 막연하다',
      '무엇을 잘하는지 모르겠다',
      '선택할 때마다 불안하다',
      '혼자 고민만 반복한다',
    ],
  },
  after: {
    label: 'After',
    items: [
      '나의 성향과 강점을 명확히 이해한다',
      '나에게 맞는 진로 방향이 정리된다',
      '구체적인 실행 계획이 생긴다',
      '스스로 선택하고 행동할 수 있다',
    ],
  },
};

// CTA 섹션
export const CTA = {
  // 프로그램 파노라마 섹션에서 사용할 이미지들 (public/images/program)
  panoramaImages: [
    '/images/program/child.jpg',
    '/images/program/emotion.jpg',
    '/images/program/selfesteem.jpg',
    '/images/program/think.jpg',
    '/images/program/draw.jpg',
    '/images/program/mbti.avif',
    '/images/program/sentence.jpg',
    '/images/program/life.jpg',
    '/images/program/career.jpg',
    '/images/program/buildlife.jpg',
    '/images/program/one.jpg',
    '/images/program/smallgroup.jpg',
    '/images/program/oneday.jpg',
    '/images/program/mentor.jpg',
    '/images/program/coffeechat.jpg',
  ],
};
