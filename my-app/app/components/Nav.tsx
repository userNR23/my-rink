'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Nav.module.css';

export default function Nav() {
  const pathname = usePathname();
  // 홈에서는 로고가 mypage로 가는 숨겨진 입구 역할, 다른 페이지에서는 홈으로 돌아가는 버튼
  const logoHref = pathname === '/' ? '/mypage' : '/';

  return (
    <header className={styles.nav}>
      <Link href={logoHref} className={styles.logo}>
        <span className={styles.logoMain}>YounHyeRin</span>
        <span className={styles.logoSub}>MEGA HIT ENGINEER</span>
      </Link>
    </header>
  );
}
