'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '../components/Nav';
import { trackPageView } from '../lib/clickStats';
import styles from './page.module.css';

const stats = [
  { label: 'Engineering', value: 95, iconSrc: '/icon-engineering.png' },
  { label: 'Semiconductor', value: 80, iconSrc: '/icon-semiconductor.png' },
  { label: 'Embedded', value: 65, iconSrc: '/icon-embedded.png' },
  { label: 'Hardware', value: 90, iconSrc: '/icon-hardware.png' },
  { label: 'Problem Solving', value: 85, icon: '💡' },
];

const quickMenu = [
  { key: 'education', imgSrc: '/quickmenu-education.png', label: '학력' },
  { key: 'career', imgSrc: '/quickmenu-career.png', label: '경력' },
  { key: 'certificates', imgSrc: '/quickmenu-certificates.png', label: '자격증' },
  { key: 'projects', imgSrc: '/quickmenu-projects.png', label: '프로젝트' },
];

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [fading, setFading] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 400);
    const t2 = setTimeout(() => setLoading(false), 650);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    trackPageView('profile');
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.container}>
      {loading && (
        <div className={`${styles.splash} ${fading ? styles.splashFadeOut : ''}`}>
          <span className={styles.splashFruit}>🍉</span>
          <p className={styles.splashText}>ENTERING PROFILE...</p>
        </div>
      )}

      <Nav />

      <main className={styles.content}>
        <section className={styles.panel}>
          <div className={styles.panelLeft}>
            <span className={styles.sectionBadge}>★ PLAYER PROFILE ★</span>

            <div className={styles.avatarRing}>
              <Image
                src="/profile-photo.jpg"
                alt="프로필 사진"
                width={170}
                height={170}
                className={styles.avatarImg}
                unoptimized
              />
              <span className={styles.fruitBadge}>🍉</span>
              <span className={styles.levelBadge}>LV.27</span>
            </div>
            <h1 className={styles.playerName}>YounHyeRin</h1>
            <p className={styles.playerSubtitle}>Mega Hit Engineer</p>
            <div className={styles.quoteBox}>
              <p>게임 좋아하고 요리도 잘하는 집순이</p>
              <p>새로운 기술을 탐구하고,</p>
              <p>문제를 해결하는 엔지니어</p>
            </div>
            <div className={styles.fruitRow}>
              <span>🍉</span>
              <span>🍑</span>
              <span>🍏</span>
              <span>🫐</span>
              <span>🍓</span>
            </div>
          </div>

          <div className={styles.panelRight} ref={statsRef}>
            <div className={styles.statsTitleRow}>
              <span className={styles.statsTitle}>★ PLAYER STATS</span>
              <span className={styles.statsDots} />
              <span className={styles.statsSparkle}>✦</span>
            </div>

            {stats.map((s) => (
              <div key={s.label} className={styles.statRow}>
                <div className={styles.statLabelRow}>
                  <span className={styles.statIconBox}>
                    {s.iconSrc ? (
                      <Image src={s.iconSrc} alt="" width={34} height={34} unoptimized />
                    ) : (
                      s.icon
                    )}
                  </span>
                  <span className={styles.statLabel}>{s.label}</span>
                  <span className={styles.statPercent}>{s.value}%</span>
                </div>
                <div className={styles.statBarTrack}>
                  <div
                    className={styles.statBarFill}
                    style={{ width: statsVisible ? `${s.value}%` : '0%' }}
                  />
                </div>
              </div>
            ))}

            <div className={styles.metaRow}>
              <div className={styles.metaBox}>
                <span className={styles.metaIcon}>⭐</span>
                <span className={styles.metaLabel}>LEVEL</span>
                <span className={styles.metaValue}>27</span>
                <span className={styles.metaSub}>BIRTH 2000.12.05</span>
              </div>
              <div className={styles.metaBox}>
                <span className={styles.metaIcon}>👑</span>
                <span className={styles.metaLabel}>RANK</span>
                <span className={styles.metaValue}>Mega Hit</span>
              </div>
              <div className={styles.metaBox}>
                <Image src="/icon-hp.png" alt="HP" width={16} height={16} unoptimized />
                <span className={styles.metaLabel}>HP</span>
                <span className={styles.metaValue}>
                  <Image src="/icon-hp.png" alt="" width={18} height={18} unoptimized />
                  <Image src="/icon-hp.png" alt="" width={18} height={18} unoptimized />
                  <Image src="/icon-hp.png" alt="" width={18} height={18} unoptimized />
                </span>
              </div>
            </div>
          </div>
        </section>

        <span className={styles.chevron}>⌄</span>

        <section className={styles.inventoryTeaser}>
          <span className={`${styles.sectionBadge} ${styles.badgeOverlap}`}>INVENTORY</span>
          <div className={styles.inventoryRow}>
            <Image
              src="/inventory-box.png"
              alt=""
              width={170}
              height={133}
              className={styles.inventoryIcon}
              unoptimized
            />
            <div className={styles.inventoryText}>
              <p className={styles.inventoryTitle}>더 많은 정보는 인벤토리에서 확인할 수 있어요!</p>
              <p className={styles.inventoryDesc}>
                자격증, 경력, 프로젝트, 논문, 학회 등 다양한 기록들을 모아두었어요.
              </p>
            </div>
            <Link href="/inventory" className={styles.inventoryButton}>
              <Image
                src="/btn-inventory-open.png"
                alt="인벤토리 열기"
                width={701}
                height={212}
                className={styles.inventoryButtonImg}
                unoptimized
              />
            </Link>
          </div>
        </section>

        <section className={styles.quickMenuSection}>
          <span className={`${styles.sectionBadge} ${styles.badgeOverlap}`}>QUICK MENU</span>
          <div className={styles.quickMenuRow}>
            {quickMenu.map((q) => (
              <div key={q.key} className={styles.quickMenuCell}>
                <Link href={`/inventory/${q.key}`} className={styles.quickMenuButton}>
                  <Image
                    src={q.imgSrc}
                    alt={q.label}
                    width={302}
                    height={320}
                    className={styles.quickMenuImg}
                    unoptimized
                  />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
