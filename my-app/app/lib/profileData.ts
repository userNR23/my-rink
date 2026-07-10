export type DetailItem = {
  title: string;
  subtitle?: string; // secondary description line (e.g. major, role)
  meta?: string; // short badge/tag text (e.g. "GPA 3.27 / 4.5", "발표 완료")
  period?: string;
  percent?: number; // 0-100, used by progress-bar style categories (e.g. Languages)
  url?: string; // optional link, used by button-style categories (e.g. Contact, Research)
};

export type Category = {
  key: string;
  icon: string;
  label: string;
  description: string;
  items: DetailItem[];
};

export const categories: Category[] = [
  {
    key: 'education',
    icon: '🎓',
    label: 'Education',
    description: '학력 사항',
    items: [
      {
        title: '광운대학교',
        subtitle: '전자통신공학과',
        period: '2023.03 ~ 2027.02',
        meta: 'GPA 3.65 / 4.5',
      },
    ],
  },
  {
    key: 'career',
    icon: '💼',
    label: 'Career',
    description: '경력 사항',
    items: [
      { title: '(주)초이스테크놀로지', subtitle: 'PCB Artwork', period: '2019.02 ~ 2020.07' },
    ],
  },
  {
    key: 'extracurricular',
    icon: '🎮',
    label: 'Extracurricular',
    description: '학내외활동',
    items: [
      {
        title: '학술동아리 활동',
        period: '2024.09 ~ 2027.02',
        meta: '반도체 학술동아리 SELA 운영진 · PCB Artwork Seminar 개최',
      },
    ],
  },
  {
    key: 'certificates',
    icon: '📜',
    label: 'Certificates',
    description: '자격증',
    items: [
      { title: '전기기사' },
      { title: '전자기기기능사' },
      { title: '전자캐드기능사' },
    ],
  },
  {
    key: 'languages',
    icon: '💬',
    label: 'Languages',
    description: '외국어',
    items: [
      { title: 'English', meta: 'Intermediate Mid 1', percent: 70 },
      { title: '日本語 (Japanese)', meta: 'JLPT N1', percent: 80 },
    ],
  },
  {
    key: 'research',
    icon: '🔬',
    label: 'Research',
    description: '연구/논문',
    items: [
      { title: '2D 전기열 모델링을 통한 CFET 방열 구조 설계', url: '/research-paper.pdf' },
    ],
  },
  {
    key: 'conference',
    icon: '🏆',
    label: 'Conference',
    description: '학회 발표',
    items: [
      {
        title: '2026 한국하계종합학술대회',
        subtitle: '2D 전기열해석을 이용한 CFET 소자의 자가발열 분석',
        meta: '발표 완료',
      },
    ],
  },
  {
    key: 'projects',
    icon: '📂',
    label: 'Projects',
    description: '프로젝트',
    items: [
      { title: '프로젝트 갤러리 준비 중', meta: '/projects 페이지에서 계속 업데이트됩니다' },
    ],
  },
  {
    key: 'contact',
    icon: '📧',
    label: 'Contact',
    description: '연락처',
    items: [
      { title: 'NAVER MAIL', url: 'mailto:wkqrha@naver.com' },
      { title: 'YOUTUBE', url: 'https://www.youtube.com/@%EC%9C%A4%ED%98%9C%EB%A6%B0-x2s' },
      { title: 'INSTAGRAM', url: 'https://www.instagram.com/hyerin834?igsh=dWk0dGkza3Y3dXI0' },
    ],
  },
];
