import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Nav from './components/Nav';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Nav />

      {/* 은은한 반짝임(sparkle) 효과 */}
      <div className={`${styles.sparkle} ${styles.s1}`}>✦</div>
      <div className={`${styles.sparkle} ${styles.s2}`}>✦</div>
      <div className={`${styles.sparkle} ${styles.s3}`}>✦</div>
      <div className={`${styles.sparkle} ${styles.s4}`}>✦</div>
      <div className={`${styles.sparkle} ${styles.s5}`}>✦</div>

      <main className={styles.mainContent}>
        {/* 메인 타이틀 로고 이미지 */}
        <div className={styles.titleContainer}>
          <Image
            src="/title-logo.png"
            alt="Youn Hye Rin - Mega Hit Engineer"
            width={1536}
            height={1024}
            className={styles.titleImage}
            unoptimized
            priority
          />
        </div>

        {/* PLAY NOW 스타일의 CHECK NOW! 버튼 */}
        <div className={styles.buttonWrapper}>
          <Link href="/profile" className={styles.jellyButton}>
            CHECK NOW!
          </Link>
        </div>
      </main>
    </div>
  );
}
