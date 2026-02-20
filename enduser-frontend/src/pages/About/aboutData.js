const aboutData = {
  header: {
    title: 'Optimized Program',
    subtitle:
      '개인별 진단 결과를 바탕으로 효과적인 변화와 성장을 지원하는 맞춤형 프로그램을 제공합니다.',
    buttonLink: '#scroll-target',
    buttonText: '프로그램 더 알아보기',
  },

  sections: [
    {
      id: 1,
      en: 'Self Development',
      title: '나의 내일을 설계합니다',
      text: `
자기 이해를 출발점으로 심리, 진로, 관계를 통합적으로 진단하여
흔들리지 않는 삶의 방향을 찾고 지속 가능한 성장을 준비합니다.
현재의 나를 정확히 이해하는 과정이 더 나은 내일을 만드는 첫걸음입니다.
      `,
      image: '/images/about/pf1.jpg',
      reverse: false,
    },

    {
      id: 2,
      en: 'Integrated Personal Growth',
      title: '통합적 자아 성장',
      text: `
자아 인식에서 방향 설정, 그리고 실제 변화까지 연결되는 체계적인 성장 경험을 제공합니다.
삶의 여러 영역을 균형 있게 돌보며 회복력과 자기 신뢰를 강화해
스스로 삶을 이끌어 갈 수 있는 힘을 기릅니다.
      `,
      image: '/images/about/pf2.jpg',
      reverse: true,
    },

    {
      id: 3,
      en: 'Optimal Program',
      title: '최적의 프로그램',
      text: `
개인의 현재 상태와 필요 역량을 기반으로 심리·진로·관계 영역을 아우르는 맞춤형 커리큘럼을 설계합니다.
단순한 상담이 아닌, 실제 변화를 만들어내는 실행 중심 프로그램으로
각자의 속도에 맞는 성장을 지원합니다.
      `,
      image: '/images/about/pf3.jpg',
      reverse: false,
    },

    {
      id: 4,
      en: 'Consulting',
      title: '컨설팅',
      text: `
마음 지도(Map of Emotions)를 통해 감정과 내면을 깊이 탐색하고,
자기 이해 지도(Self-Map)로 성향과 사고 패턴을 파악하며,
인생 설계 지도(Life Map)를 통해 진로와 목표, 관계까지 삶의 방향을 구체적으로 그립니다.
다양한 심리 검사와 코칭을 바탕으로 나만의 삶의 지도를 완성합니다.
      `,
      image: '/images/about/pf4.jpg',
      reverse: true,
    },

    {
      id: 5,
      en: 'Education',
      title: '교육',
      text: `
1:1 맞춤 코칭부터 소그룹 워크숍, 그룹 프로그램, 원데이 클래스까지
참여 목적과 상황에 맞는 다양한 교육 방식을 제공합니다.
안전하고 편안한 환경 속에서 서로의 경험을 나누며 실질적인 변화를 만들어 갑니다.
      `,
      image: '/images/about/pf5.jpg',
      reverse: false,
    },

    {
      id: 6,
      en: 'Network',
      title: '네트워크',
      text: `
Mentor Meet-up과 Coffee Chat을 통해 현직자와 선배들을 직접 만나
현실적인 진로 조언과 삶의 경험을 나눕니다.
사람과 사람을 연결하는 네트워크 속에서 새로운 기회와 가능성을 발견합니다.
      `,
      image: '/images/about/pf6.jpg',
      reverse: true,
    },
  ],

  team: {
    title: 'Our Team',
    subtitle: 'Dedicated to quality and your success',
    members: [
      {
        name: 'IMAP Team',
        role: '전문 컨설턴트',
        image: '/images/about/p1.jpg',
      },
      {
        name: 'IMAP Team',
        role: '검증된 강사진',
        image: '/images/about/p2.jpg',
      },
      {
        name: 'IMAP Team',
        role: '네트워크 코디네이터',
        image: '/images/about/p3.jpg',
      },
      {
        name: 'IMAP Team',
        role: '프로그램 디렉터',
        image: '/images/about/p4.jpg',
      },
    ],
  },
};

export default aboutData;
