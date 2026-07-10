import Nav from '../components/Nav';
import styles from './page.module.css';

export default function ProjectsPage() {
  return (
    <div className={styles.container}>
      <Nav />

      <div className={`${styles.sparkle} ${styles.s1}`}>✦</div>
      <div className={`${styles.sparkle} ${styles.s2}`}>✦</div>
      <div className={`${styles.sparkle} ${styles.s3}`}>✦</div>

      <main className={styles.card}>
        <span className={styles.icon}>🍓</span>
        <h1 className={styles.title}>PROJECTS</h1>
        <p className={styles.subtitle}>Coming Soon!</p>
      </main>
    </div>
  );
}
