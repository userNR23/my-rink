'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Nav from '../../components/Nav';
import { loadCategories, type Category } from '../../lib/categoryStore';
import styles from './page.module.css';

export default function CategoryDetailPage() {
  const params = useParams<{ category: string }>();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    loadCategories().then(setCategories);
  }, []);

  if (!categories) {
    return (
      <div className={styles.container}>
        <Nav />
      </div>
    );
  }

  const activeCategory = categories.find((c) => c.key === params.category);

  return (
    <div className={styles.container}>
      <Nav />

      <main className={styles.content}>
        <button type="button" onClick={() => router.back()} className={styles.backLink}>
          ← Back
        </button>

        {!activeCategory ? (
          <div className={styles.card}>
            <p className={styles.notFoundText}>존재하지 않는 카테고리입니다.</p>
          </div>
        ) : (
          <div className={styles.card}>
            <span className={styles.panelBadge}>
              {activeCategory.icon} {activeCategory.label.toUpperCase()}
            </span>

            <div className={styles.list}>
              {activeCategory.items.map((item, i) => (
                <div key={i} className={styles.item}>
                  <p className={styles.itemTitle}>{item.title}</p>
                  {(item.period || item.meta) && (
                    <p className={styles.itemMeta}>
                      {[item.period, item.meta].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {activeCategory.key === 'projects' && (
              <Link href="/projects" className={styles.ctaButton}>
                프로젝트 갤러리로 이동 →
              </Link>
            )}

            {activeCategory.key === 'contact' && (
              <a href="mailto:wkqrha@naver.com" className={styles.ctaButton}>
                메일 보내기 →
              </a>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
