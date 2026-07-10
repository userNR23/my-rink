import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

// 링크 클릭 통계를 저장하는 단일 문서 경로.
const STATS_DOC_PATH = 'users/anonymous/stats/linkClicks';
// 페이지별 방문 횟수를 저장하는 단일 문서 경로.
const PAGE_VIEWS_DOC_PATH = 'users/anonymous/stats/pageViews';

export type ClickStats = {
  total: number;
  byLink: Record<string, { label: string; count: number }>;
};

const emptyStats: ClickStats = { total: 0, byLink: {} };

export async function trackLinkClick(key: string, label: string): Promise<void> {
  try {
    await setDoc(
      doc(db, STATS_DOC_PATH),
      {
        total: increment(1),
        byLink: { [key]: { label, count: increment(1) } },
      },
      { merge: true }
    );
  } catch {
    // 클릭 집계 실패가 사용자 액션(메일 열기/외부 링크 이동)을 막으면 안 되므로 조용히 무시
  }
}

export async function loadClickStats(): Promise<ClickStats> {
  const snap = await getDoc(doc(db, STATS_DOC_PATH));
  if (!snap.exists()) return emptyStats;
  const data = snap.data();
  return {
    total: typeof data.total === 'number' ? data.total : 0,
    byLink: data.byLink ?? {},
  };
}

export async function trackPageView(page: string): Promise<void> {
  try {
    await setDoc(doc(db, PAGE_VIEWS_DOC_PATH), { [page]: increment(1) }, { merge: true });
  } catch {
    // 방문 집계 실패가 페이지 렌더링을 막으면 안 되므로 조용히 무시
  }
}

export async function loadPageViews(): Promise<Record<string, number>> {
  const snap = await getDoc(doc(db, PAGE_VIEWS_DOC_PATH));
  if (!snap.exists()) return {};
  return snap.data() as Record<string, number>;
}
