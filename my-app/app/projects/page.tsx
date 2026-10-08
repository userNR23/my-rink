
'use client';

import { useEffect, useState } from 'react';
import { loadCategories, type Category } from '../lib/categoryStore';

import Nav from '../components/Nav';
import styles from './page.module.css';

const projects = [
  {
    title: 'CFET 소자 자가발열 분석 및 구조 최적화',
    description: '2D 전기·열 해석 기반 CFET 구조 최적화 연구',
    file: '/' + encodeURIComponent(
      '2D 전기열해석을 이용한 CFET 소자의 자가발열 분석 및 구조 최적화 (1).pdf'
    ),
    type: 'PDF',
  },
];

export default function ProjectsPage() {
  const [cmsProjects, setCmsProjects] =
    useState<Category['items']>([]);

  useEffect(() => {
    let active = true;

    loadCategories()
      .then((categories) => {
        if (!active) return;

        const category = categories.find(
          (cat) => cat.key === 'projects'
        );

        setCmsProjects(category?.items ?? []);
      })
      .catch((error) => {
        console.error('프로젝트 CMS 로딩 실패:', error);
      });

    return () => {
      active = false;
    };
  }, []);

  const allProjects = [
    ...projects,
    ...cmsProjects
      .filter(
        (item) =>
          Boolean(item.url?.trim()) &&
          item.title !== projects[0].title
      )
      .map((item) => ({
        title: item.title,
        description: [
          item.subtitle ? `과목 · ${item.subtitle}` : '',
          item.period ? `기간 · ${item.period}` : '',
          item.meta ?? '',
        ]
          .filter(Boolean)
          .join('\n'),
        file: item.url?.trim() ?? '',
        type: 'PDF',
      })),
  ];

  return (

    <div className={styles.container}>
      <Nav />

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

        <div style={{
          display: 'grid',
          gap: '12px',
          width: '100%',
          marginTop: '24px',
        }}>
         {allProjects.map((project) => (
            <a
              key={project.title}
              href={project.file}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '16px',
                borderRadius: '14px',
                background: '#fff8ed',
                border: '2px solid #e8cfa7',
                color: '#594333',
                textDecoration: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ fontWeight: 'bold' }}>
                📄 {project.title} ↗
              </div>
              <p style={{
  fontSize: '13px',
  margin: '8px 0',
  whiteSpace: 'pre-line',
}}>
                {project.description}
              </p>
              <small>{project.type} · 자료 보기</small>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
