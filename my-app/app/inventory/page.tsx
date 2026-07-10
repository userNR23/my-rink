'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '../components/Nav';
import { loadCategories, type Category } from '../lib/categoryStore';
import { trackLinkClick, trackPageView } from '../lib/clickStats';
import styles from './page.module.css';

const KNOWN_KEYS = [
  'education',
  'career',
  'certificates',
  'languages',
  'research',
  'conference',
  'extracurricular',
  'contact',
];

function parseGpa(meta?: string): { value: number; max: number } | null {
  if (!meta) return null;
  const match = meta.match(/([\d.]+)\s*\/\s*([\d.]+)/);
  if (!match) return null;
  const value = parseFloat(match[1]);
  const max = parseFloat(match[2]);
  if (Number.isNaN(value) || Number.isNaN(max) || max === 0) return null;
  return { value, max };
}

function contactButtonStyle(item: { title: string; url?: string }): { className: string; iconSrc?: string } {
  const key = `${item.title} ${item.url ?? ''}`.toLowerCase();
  if (key.includes('mailto') || key.includes('mail')) return { className: styles.mailBtn, iconSrc: '/logo-navermail.png' };
  if (key.includes('youtu')) return { className: styles.youtubeBtn, iconSrc: '/logo-youtube.png' };
  if (key.includes('instagram') || key.includes('insta')) return { className: styles.instagramBtn, iconSrc: '/logo-instagram.png' };
  return { className: styles.resumeBtn };
}

export default function InventoryPage() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [mailModalEmail, setMailModalEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadCategories().then(setCategories);
  }, []);

  useEffect(() => {
    trackPageView('inventory');
  }, []);

  const openMailModal = (url: string) => {
    setMailModalEmail(url.replace(/^mailto:/i, ''));
    setCopied(false);
    trackLinkClick('mail', 'NAVER MAIL');
  };

  const handleCopyEmail = async () => {
    if (!mailModalEmail) return;
    try {
      await navigator.clipboard.writeText(mailModalEmail);
      setCopied(true);
    } catch {
      // clipboard API unavailable — silently ignore, user can still select the text
    }
  };

  if (!categories) {
    return (
      <div className={styles.container}>
        <Nav />
      </div>
    );
  }

  const byKey = (key: string) => categories.find((c) => c.key === key);
  const education = byKey('education');
  const career = byKey('career');
  const certificates = byKey('certificates');
  const languages = byKey('languages');
  const research = byKey('research');
  const conference = byKey('conference');
  const extracurricular = byKey('extracurricular');
  const contact = byKey('contact');
  const extraCategories = categories.filter((c) => !KNOWN_KEYS.includes(c.key));

  return (
    <div className={styles.container}>
      <Nav />

      <main className={styles.content}>
        <Link href="/profile" className={styles.backLink}>
          ← Back to Profile
        </Link>

        <div className={styles.wrapper}>
          <span className={styles.wrapperBadge}>INVENTORY</span>

          <div className={styles.grid}>
            {education && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{education.icon}</span>
                  <span className={styles.cardLabel}>{education.label.toUpperCase()}</span>
                </div>
                {education.items.map((item, i) => {
                  const gpa = parseGpa(item.meta);
                  const gpaStars = gpa ? Math.round((gpa.value / gpa.max) * 5) : 0;
                  return (
                    <div key={i} className={i > 0 ? styles.subEntry : undefined}>
                      <p className={styles.eduName}>{item.title}</p>
                      {item.subtitle && <p className={styles.eduSub}>{item.subtitle}</p>}
                      {item.period && <p className={styles.eduPeriod}>{item.period}</p>}
                      {gpa && (
                        <div className={styles.gpaBox}>
                          <span className={styles.gpaLabel}>GPA</span>
                          <span className={styles.stars}>
                            {'★'.repeat(gpaStars)}
                            {'☆'.repeat(5 - gpaStars)}
                          </span>
                          <span className={styles.gpaValue}>{gpa.value} / {gpa.max}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {career && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{career.icon}</span>
                  <span className={styles.cardLabel}>{career.label.toUpperCase()}</span>
                </div>
                {career.items.map((item, i) => (
                  <div key={i} className={i > 0 ? styles.subEntry : undefined}>
                    <div className={styles.timeline}>
                      <span className={styles.timelineDot} />
                      <div className={styles.timelineContent}>
                        <p className={styles.careerCompany}>{item.title}</p>
                        {item.subtitle && <p className={styles.careerRole}>{item.subtitle}</p>}
                        {item.period && <p className={styles.careerPeriod}>{item.period}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {certificates && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{certificates.icon}</span>
                  <span className={styles.cardLabel}>LICENSES</span>
                </div>
                <div className={styles.licenseList}>
                  {certificates.items.map((item, i) => (
                    <div key={i} className={styles.licenseItem}>
                      <span className={styles.licenseIcon}>{['🥇', '🥈', '🎖️'][i] ?? '🏅'}</span>
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languages && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{languages.icon}</span>
                  <span className={styles.cardLabel}>{languages.label.toUpperCase()}</span>
                </div>
                {languages.items.map((item, i) => (
                  <div key={i} className={styles.langBlock}>
                    <p className={styles.langName}>{item.title}</p>
                    <div className={styles.progressTrack}>
                      <div className={styles.progressFill} style={{ width: `${item.percent ?? 0}%` }} />
                    </div>
                    {item.meta && <p className={styles.langLevel}>{item.meta}</p>}
                  </div>
                ))}
              </div>
            )}

            {research && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{research.icon}</span>
                  <span className={styles.cardLabel}>{research.label.toUpperCase()}</span>
                </div>
                {research.items.map((item, i) => (
                  <div key={i} className={i > 0 ? styles.subEntry : undefined}>
                    <p className={styles.researchTitle}>{item.title}</p>
                    <a href={item.url || '#'} className={styles.viewPaperBtn}>
                      VIEW PAPER ▶
                    </a>
                  </div>
                ))}
              </div>
            )}

            {conference && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{conference.icon}</span>
                  <span className={styles.cardLabel}>{conference.label.toUpperCase()}</span>
                </div>
                {conference.items.map((item, i) => (
                  <div key={i} className={i > 0 ? styles.subEntry : undefined}>
                    <p className={styles.confTitle}>{item.title}</p>
                    {item.subtitle && <p className={styles.confDesc}>{item.subtitle}</p>}
                    {item.meta && <span className={styles.confTag}>{item.meta}</span>}
                  </div>
                ))}
              </div>
            )}

            {extracurricular && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{extracurricular.icon}</span>
                  <span className={styles.cardLabel}>{extracurricular.label.toUpperCase()}</span>
                </div>
                {extracurricular.items.map((item, i) => (
                  <div key={i} className={i > 0 ? styles.subEntry : undefined}>
                    <p className={styles.extraTitle}>{item.title}</p>
                    {item.period && <p className={styles.extraPeriod}>{item.period}</p>}
                    {item.meta?.split('·').map((line, j) => (
                      <p key={j} className={styles.extraDetail}>{line.trim()}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {contact && (
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{contact.icon}</span>
                  <span className={styles.cardLabel}>{contact.label.toUpperCase()}</span>
                </div>
                <div className={styles.contactButtons}>
                  {contact.items.map((item, i) => {
                    const style = contactButtonStyle(item);
                    const isMail = item.url?.toLowerCase().startsWith('mailto:');
                    const icon = style.iconSrc && (
                      <Image
                        src={style.iconSrc}
                        alt=""
                        width={30}
                        height={30}
                        className={styles.contactBtnIcon}
                        unoptimized
                      />
                    );
                    if (isMail) {
                      return (
                        <button
                          key={i}
                          type="button"
                          className={`${styles.contactBtn} ${style.className}`}
                          onClick={() => openMailModal(item.url!)}
                        >
                          {icon}
                          {item.title}
                        </button>
                      );
                    }
                    return (
                      <a
                        key={i}
                        href={item.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.contactBtn} ${style.className}`}
                        onClick={() => trackLinkClick(item.title.toLowerCase(), item.title)}
                      >
                        {icon}
                        {item.title}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {extraCategories.map((cat) => (
              <div key={cat.key} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{cat.icon}</span>
                  <span className={styles.cardLabel}>{cat.label.toUpperCase()}</span>
                </div>
                <div className={styles.licenseList}>
                  {cat.items.length === 0 && <p className={styles.eduSub}>아직 항목이 없습니다.</p>}
                  {cat.items.map((item, i) => (
                    <div key={i} className={styles.licenseItem}>
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {mailModalEmail && (
        <div className={styles.mailModalOverlay} onClick={() => setMailModalEmail(null)}>
          <div className={styles.mailModal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.mailModalClose}
              onClick={() => setMailModalEmail(null)}
              aria-label="닫기"
            >
              ✕
            </button>
            <Image src="/logo-navermail.png" alt="" width={40} height={24} className={styles.mailModalIcon} unoptimized />
            <p className={styles.mailModalTitle}>메일 주소</p>
            <p className={styles.mailModalEmail}>{mailModalEmail}</p>
            <div className={styles.mailModalActions}>
              <button type="button" className={styles.mailModalCopyBtn} onClick={handleCopyEmail}>
                {copied ? '복사됨 ✓' : '주소 복사하기'}
              </button>
              <a href={`mailto:${mailModalEmail}`} className={styles.mailModalSendBtn}>
                메일 앱으로 보내기
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
