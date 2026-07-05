import React from 'react';
import styles from './page.module.css';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className={styles.container}>
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
      
      <Link href="/" className={styles.backButton}>
        ← GO BACK
      </Link>
      
      <main className={styles.card}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>👩🏻‍💻</div>
        </div>
        
        <h1 className={styles.name}>윤혜린</h1>
        <h2 className={styles.title}>광운대학교 전자통신공학과</h2>
        
        <div className={styles.divider}></div>
        
        <p className={styles.description}>
          안녕하세요! 광운대학교 전자통신공학과 4학년에 재학중인 <b>윤혜린</b>입니다.
          <br /><br />
          새로운 기술을 배우고 적용하는 것을 좋아하며, 
          사용자에게 매력적이고 혁신적인 경험을 제공하는 개발자가 되는 것을 목표로 하고 있습니다.
        </p>

        <div className={styles.tags}>
          <span className={styles.tag}>Student</span>
          <span className={styles.tag}>Engineering</span>
          <span className={styles.tag}>Senior</span>
        </div>
      </main>
    </div>
  );
}
