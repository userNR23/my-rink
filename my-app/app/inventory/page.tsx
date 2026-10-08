
'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '../components/Nav';
import { loadCategories, type Category } from '../lib/categoryStore';
import styles from './page.module.css';

// 기존 프로젝트 카드 디자인 유지
const projectCardStyle: CSSProperties = {
  display: 'block',
  padding: '16px',
  borderRadius: '14px',
  background: '#fff8ed',
  border: '2px solid #e8cfa7',
  color: '#594333',
  textDecoration: 'none',
  textAlign: 'left',
  boxSizing: 'border-box',
  width: '100%',
};

export default function ProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] =
    useState<Category['items'] | null>(null);

  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    loadCategories()
      .then((categories) => {
        if (!active) return;

        const category = categories.find(
          (cat) => cat.key === 'projects'
        );

        setProjects(category?.items ?? []);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/profile');
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        minHeight: '100vh',
        height: 'auto',
        overflowY: 'auto',
      }}
    >
      <Nav />

      {/* 뒤로 가기 */}
      <button
        type="button"
        onClick={handleBack}
        style={{
          position: 'fixed',
          top: '165px',
          left: '28px',
          zIndex: 20,
          background: 'transparent',
          border: 'none',
          color: '#4e8541',
          fontSize: '18px',
          fontWeight: 900,
          cursor: 'pointer',
          padding: '8px',
        }}
      >
        ← Back
      </button>

      {/* 기존 반짝이 효과 */}
      <div className={`${styles.sparkle} ${styles.s1}`}>✦</div>
      <div className={`${styles.sparkle} ${styles.s2}`}>✦</div>
      <div className={`${styles.sparkle} ${styles.s3}`}>✦</div>

      <main
        className={styles.card}
        style={{
          height: 'auto',
          maxWidth: '560px',
          boxSizing: 'border-box',
        }}
      >
        <span className={styles.icon}>🍓</span>

        <h1 className={styles.title}>PROJECTS</h1>

        <p className={styles.subtitle}>
          My Engineering Portfolio
        </p>

        <div
          style={{
            display: 'grid',
            gap: '12px',
            width: '100%',
            marginTop: '24px',
          }}
        >
          {loadError && (
            <p>프로젝트를 불러오지 못했습니다.</p>
          )}

          {!loadError && projects === null && (
            <p>Loading projects...</p>
          )}

          {!loadError && projects?.length === 0 && (
            <p>아직 등록된 프로젝트가 없습니다.</p>
          )}

          {projects?.map((project, index) => {
            const content = (
              <>
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    lineHeight: 1.5,
                  }}
                >
                  📄 {project.title}
                  {project.url ? ' ↗' : ''}
                </div>

                {project.subtitle && (
                  <p style={{
                    fontSize: '13px',
                    margin: '10px 0 4px',
                  }}>
                    📚 과목 · {project.subtitle}
                  </p>
                )}

                {project.period && (
                  <p style={{
                    fontSize: '13px',
                    margin: '4px 0',
                  }}>
                    📅 기간 · {project.period}
                  </p>
                )}

                {project.meta && (
                  <p style={{
                    fontSize: '13px',
                    color: '#776b5c',
                    lineHeight: 1.6,
                    margin: '12px 0',
                    whiteSpace: 'pre-line',
                  }}>
                    {project.meta}
                  </p>
                )}

                <small style={{
                  display: 'block',
                  marginTop: '12px',
                }}>
                  {project.url
                    ? 'PDF · 자료 보기'
                    : '자료 준비 중'}
                </small>
              </>
            );

            return project.url ? (
              <a
                key={index}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...projectCardStyle,
                  cursor: 'pointer',
                }}
              >
                {content}
              </a>
            ) : (
              <div
                key={index}
                style={projectCardStyle}
              >
                {content}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
