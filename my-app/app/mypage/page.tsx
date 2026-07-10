'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from 'firebase/auth';
import Nav from '../components/Nav';
import {
  loadCategories,
  upsertCategory,
  deleteCategory,
  resetCategories,
  slugify,
  type Category,
  type DetailItem,
} from '../lib/categoryStore';
import { watchAuth, isOwner, signInWithGoogle, signOutUser, OWNER_EMAIL } from '../lib/auth';
import { loadClickStats, loadPageViews, type ClickStats } from '../lib/clickStats';
import styles from './page.module.css';

type CategoryForm = { key: string; icon: string; label: string; description: string };
type ItemForm = { title: string; subtitle: string; meta: string; period: string; percent: string; url: string };

const emptyCategoryForm: CategoryForm = { key: '', icon: '📁', label: '', description: '' };
const emptyItemForm: ItemForm = { title: '', subtitle: '', meta: '', period: '', percent: '', url: '' };

export default function MyPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState('');

  const [categories, setCategories] = useState<Category[] | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [clickStats, setClickStats] = useState<ClickStats | null>(null);
  const [pageViews, setPageViews] = useState<Record<string, number> | null>(null);

  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCategoryForm, setNewCategoryForm] = useState<CategoryForm>(emptyCategoryForm);
  const [newCategoryError, setNewCategoryError] = useState('');

  const [editingCategoryKey, setEditingCategoryKey] = useState<string | null>(null);
  const [editCategoryForm, setEditCategoryForm] = useState<CategoryForm>(emptyCategoryForm);
  const [editCategoryError, setEditCategoryError] = useState('');

  const [addingItemFor, setAddingItemFor] = useState<string | null>(null);
  const [newItemForm, setNewItemForm] = useState<ItemForm>(emptyItemForm);
  const [newItemError, setNewItemError] = useState('');

  useEffect(() => {
    const unsubscribe = watchAuth((u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isOwner(user)) return;
    loadCategories()
      .then(setCategories)
      .catch((e) => setSaveError(`불러오기 실패: ${e instanceof Error ? e.message : String(e)}`));
    loadClickStats()
      .then(setClickStats)
      .catch(() => setClickStats({ total: 0, byLink: {} }));
    loadPageViews()
      .then(setPageViews)
      .catch(() => setPageViews({}));
  }, [user]);

  const handleGoogleSignIn = async () => {
    setAuthError('');
    try {
      await signInWithGoogle();
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : String(e));
    }
  };

  const flashSaved = () => {
    setSaveError('');
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const handleFirestoreError = (e: unknown) => {
    setSaveError(`저장 실패: ${e instanceof Error ? e.message : String(e)}`);
  };

  const handleReset = async () => {
    if (!window.confirm('기본 데이터로 초기화할까요? 지금까지 수정한 내용은 사라집니다.')) return;
    try {
      const next = await resetCategories();
      setCategories(next);
      flashSaved();
    } catch (e) {
      handleFirestoreError(e);
    }
  };

  const handleAddCategory = async () => {
    if (!categories) return;
    const label = newCategoryForm.label.trim();
    if (!label) {
      setNewCategoryError('카테고리 이름을 입력해주세요.');
      return;
    }
    const key = slugify(newCategoryForm.key || label);
    if (!key) {
      setNewCategoryError('카테고리 키를 확인해주세요 (영문/숫자/하이픈).');
      return;
    }
    if (categories.some((c) => c.key === key)) {
      setNewCategoryError(`이미 사용 중인 키입니다: ${key}`);
      return;
    }
    const newCategory: Category = {
      key,
      icon: newCategoryForm.icon.trim() || '📁',
      label,
      description: newCategoryForm.description.trim(),
      items: [],
    };
    try {
      await upsertCategory(newCategory);
      setCategories([...categories, newCategory]);
      flashSaved();
      setNewCategoryForm(emptyCategoryForm);
      setNewCategoryError('');
      setNewCategoryOpen(false);
    } catch (e) {
      handleFirestoreError(e);
    }
  };

  const handleDeleteCategory = async (key: string) => {
    if (!categories) return;
    if (!window.confirm('이 카테고리를 삭제할까요?')) return;
    try {
      await deleteCategory(key);
      setCategories(categories.filter((c) => c.key !== key));
      flashSaved();
    } catch (e) {
      handleFirestoreError(e);
    }
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategoryKey(cat.key);
    setEditCategoryForm({ key: cat.key, icon: cat.icon, label: cat.label, description: cat.description });
    setEditCategoryError('');
  };

  const handleSaveEditCategory = async (originalKey: string) => {
    if (!categories) return;
    const label = editCategoryForm.label.trim();
    if (!label) {
      setEditCategoryError('카테고리 이름을 입력해주세요.');
      return;
    }
    const key = slugify(editCategoryForm.key || label);
    if (!key) {
      setEditCategoryError('카테고리 키를 확인해주세요 (영문/숫자/하이픈).');
      return;
    }
    if (key !== originalKey && categories.some((c) => c.key === key)) {
      setEditCategoryError(`이미 사용 중인 키입니다: ${key}`);
      return;
    }
    const original = categories.find((c) => c.key === originalKey);
    if (!original) return;
    const updated: Category = {
      ...original,
      key,
      icon: editCategoryForm.icon.trim() || '📁',
      label,
      description: editCategoryForm.description.trim(),
    };
    try {
      if (key !== originalKey) {
        await deleteCategory(originalKey);
      }
      await upsertCategory(updated);
      setCategories(categories.map((c) => (c.key === originalKey ? updated : c)));
      flashSaved();
      setEditingCategoryKey(null);
    } catch (e) {
      handleFirestoreError(e);
    }
  };

  const handleAddItem = async (categoryKey: string) => {
    if (!categories) return;
    const title = newItemForm.title.trim();
    if (!title) {
      setNewItemError('항목 제목을 입력해주세요.');
      return;
    }
    let percent: number | undefined;
    if (newItemForm.percent.trim()) {
      const parsed = Number(newItemForm.percent.trim());
      if (Number.isNaN(parsed) || parsed < 0 || parsed > 100) {
        setNewItemError('퍼센트는 0~100 사이의 숫자여야 합니다.');
        return;
      }
      percent = parsed;
    }
    const newItem: DetailItem = {
      title,
      subtitle: newItemForm.subtitle.trim() || undefined,
      meta: newItemForm.meta.trim() || undefined,
      period: newItemForm.period.trim() || undefined,
      percent,
      url: newItemForm.url.trim() || undefined,
    };
    const target = categories.find((c) => c.key === categoryKey);
    if (!target) return;
    const updated: Category = { ...target, items: [...target.items, newItem] };
    try {
      await upsertCategory(updated);
      setCategories(categories.map((c) => (c.key === categoryKey ? updated : c)));
      flashSaved();
      setNewItemForm(emptyItemForm);
      setNewItemError('');
      setAddingItemFor(null);
    } catch (e) {
      handleFirestoreError(e);
    }
  };

  const handleDeleteItem = async (categoryKey: string, index: number) => {
    if (!categories) return;
    const target = categories.find((c) => c.key === categoryKey);
    if (!target) return;
    const updated: Category = { ...target, items: target.items.filter((_, i) => i !== index) };
    try {
      await upsertCategory(updated);
      setCategories(categories.map((c) => (c.key === categoryKey ? updated : c)));
      flashSaved();
    } catch (e) {
      handleFirestoreError(e);
    }
  };

  if (!authChecked) {
    return (
      <div className={styles.container}>
        <Nav />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <Nav />
        <main className={styles.content}>
          <div className={styles.authCard}>
            <h1 className={styles.title}>🔒 MY PAGE</h1>
            <p className={styles.subtitle}>이 페이지는 사이트 소유자만 접근할 수 있습니다.</p>
            {authError && <p className={styles.errorText}>{authError}</p>}
            <button type="button" className={styles.saveButton} onClick={handleGoogleSignIn}>
              Google로 로그인
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!isOwner(user)) {
    return (
      <div className={styles.container}>
        <Nav />
        <main className={styles.content}>
          <div className={styles.authCard}>
            <h1 className={styles.title}>🚫 접근 권한 없음</h1>
            <p className={styles.subtitle}>
              {user.email} 계정은 이 페이지에 접근할 수 없습니다. ({OWNER_EMAIL} 계정만 허용)
            </p>
            <button type="button" className={styles.cancelButton} onClick={() => signOutUser()}>
              로그아웃
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!categories) {
    return (
      <div className={styles.container}>
        <Nav />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Nav />

      <main className={styles.content}>
        <Link href="/inventory" className={styles.backLink}>
          ← Back to Inventory
        </Link>

        <div className={styles.headerRow}>
          <h1 className={styles.title}>🛠 MY PAGE</h1>
          <div className={styles.headerActions}>
            {savedFlash && <span className={styles.savedFlash}>저장됨 ✓</span>}
            <button type="button" className={styles.resetButton} onClick={handleReset}>
              기본값으로 초기화
            </button>
            <button type="button" className={styles.smallButtonDanger} onClick={() => signOutUser()}>
              로그아웃
            </button>
          </div>
        </div>
        <p className={styles.subtitle}>
          여기서 수정한 내용은 Firestore(users/anonymous/items)에 저장되며, /inventory 상세 페이지에 바로 반영됩니다.
        </p>
        {saveError && <p className={styles.errorText}>{saveError}</p>}

        <section className={styles.statsCard}>
          <h2 className={styles.statsTitle}>📊 통계</h2>
          {!clickStats ? (
            <p className={styles.emptyText}>불러오는 중...</p>
          ) : (
            <>
              <p className={styles.statsTotal}>
                총 클릭수 <span>{clickStats.total}</span>
              </p>
              {Object.keys(clickStats.byLink).length === 0 ? (
                <p className={styles.emptyText}>아직 집계된 클릭이 없습니다.</p>
              ) : (
                <div className={styles.statsList}>
                  {Object.entries(clickStats.byLink)
                    .sort((a, b) => b[1].count - a[1].count)
                    .map(([key, stat]) => (
                      <div key={key} className={styles.statsRow}>
                        <span className={styles.statsLabel}>{stat.label}</span>
                        <span className={styles.statsCount}>{stat.count}</span>
                      </div>
                    ))}
                </div>
              )}

              <p className={styles.statsSubTitle}>페이지 방문수</p>
              {!pageViews ? (
                <p className={styles.emptyText}>불러오는 중...</p>
              ) : (
                <div className={styles.statsList}>
                  <div className={styles.statsRow}>
                    <span className={styles.statsLabel}>Profile 페이지</span>
                    <span className={styles.statsCount}>{pageViews.profile ?? 0}</span>
                  </div>
                  <div className={styles.statsRow}>
                    <span className={styles.statsLabel}>Inventory 페이지</span>
                    <span className={styles.statsCount}>{pageViews.inventory ?? 0}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {categories.map((cat) => (
          <section key={cat.key} className={styles.categoryCard}>
            {editingCategoryKey === cat.key ? (
              <div className={styles.editForm}>
                <div className={styles.fieldRow}>
                  <input
                    className={styles.input}
                    style={{ width: 56 }}
                    value={editCategoryForm.icon}
                    onChange={(e) => setEditCategoryForm({ ...editCategoryForm, icon: e.target.value })}
                    aria-label="아이콘"
                  />
                  <input
                    className={styles.input}
                    placeholder="카테고리 이름 (예: Education)"
                    value={editCategoryForm.label}
                    onChange={(e) => setEditCategoryForm({ ...editCategoryForm, label: e.target.value })}
                  />
                  <input
                    className={styles.input}
                    placeholder="키 (예: education)"
                    value={editCategoryForm.key}
                    onChange={(e) => setEditCategoryForm({ ...editCategoryForm, key: e.target.value })}
                  />
                </div>
                <input
                  className={styles.input}
                  placeholder="설명 (예: 학력 사항)"
                  value={editCategoryForm.description}
                  onChange={(e) => setEditCategoryForm({ ...editCategoryForm, description: e.target.value })}
                />
                {editCategoryError && <p className={styles.errorText}>{editCategoryError}</p>}
                <div className={styles.fieldRow}>
                  <button
                    type="button"
                    className={styles.saveButton}
                    onClick={() => handleSaveEditCategory(cat.key)}
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setEditingCategoryKey(null)}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.categoryHeader}>
                <div className={styles.categoryHeaderInfo}>
                  <span className={styles.categoryIcon}>{cat.icon}</span>
                  <div>
                    <p className={styles.categoryLabel}>{cat.label}</p>
                    <p className={styles.categoryMeta}>
                      key: {cat.key} · {cat.description || '설명 없음'}
                    </p>
                  </div>
                </div>
                <div className={styles.categoryHeaderActions}>
                  <button type="button" className={styles.smallButton} onClick={() => startEditCategory(cat)}>
                    수정
                  </button>
                  <button
                    type="button"
                    className={styles.smallButtonDanger}
                    onClick={() => handleDeleteCategory(cat.key)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            )}

            <div className={styles.itemList}>
              {cat.items.length === 0 && <p className={styles.emptyText}>아직 항목이 없습니다.</p>}
              {cat.items.map((item, i) => (
                <div key={i} className={styles.itemRow}>
                  <div>
                    <p className={styles.itemTitle}>{item.title}</p>
                    {(item.subtitle || item.period || item.meta) && (
                      <p className={styles.itemMeta}>
                        {[item.subtitle, item.period, item.meta].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    {typeof item.percent === 'number' && (
                      <p className={styles.itemMeta}>{item.percent}%</p>
                    )}
                    {item.url && <p className={styles.itemMeta}>🔗 {item.url}</p>}
                  </div>
                  <button
                    type="button"
                    className={styles.smallButtonDanger}
                    onClick={() => handleDeleteItem(cat.key, i)}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>

            {addingItemFor === cat.key ? (
              <div className={styles.editForm}>
                <input
                  className={styles.input}
                  placeholder="제목 (필수)"
                  value={newItemForm.title}
                  onChange={(e) => setNewItemForm({ ...newItemForm, title: e.target.value })}
                />
                <input
                  className={styles.input}
                  placeholder="부제목 (선택, 예: 전공/직책)"
                  value={newItemForm.subtitle}
                  onChange={(e) => setNewItemForm({ ...newItemForm, subtitle: e.target.value })}
                />
                <div className={styles.fieldRow}>
                  <input
                    className={styles.input}
                    placeholder="기간 (선택)"
                    value={newItemForm.period}
                    onChange={(e) => setNewItemForm({ ...newItemForm, period: e.target.value })}
                  />
                  <input
                    className={styles.input}
                    placeholder="부가 정보 (선택)"
                    value={newItemForm.meta}
                    onChange={(e) => setNewItemForm({ ...newItemForm, meta: e.target.value })}
                  />
                </div>
                <div className={styles.fieldRow}>
                  <input
                    className={styles.input}
                    placeholder="퍼센트 0-100 (선택, 진행바용)"
                    value={newItemForm.percent}
                    onChange={(e) => setNewItemForm({ ...newItemForm, percent: e.target.value })}
                  />
                  <input
                    className={styles.input}
                    placeholder="링크 URL (선택, 버튼용)"
                    value={newItemForm.url}
                    onChange={(e) => setNewItemForm({ ...newItemForm, url: e.target.value })}
                  />
                </div>
                {newItemError && <p className={styles.errorText}>{newItemError}</p>}
                <div className={styles.fieldRow}>
                  <button type="button" className={styles.saveButton} onClick={() => handleAddItem(cat.key)}>
                    추가
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setAddingItemFor(null);
                      setNewItemForm(emptyItemForm);
                      setNewItemError('');
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className={styles.addItemButton}
                onClick={() => {
                  setAddingItemFor(cat.key);
                  setNewItemForm(emptyItemForm);
                  setNewItemError('');
                }}
              >
                + 항목 추가
              </button>
            )}
          </section>
        ))}

        {newCategoryOpen ? (
          <section className={styles.categoryCard}>
            <div className={styles.editForm}>
              <div className={styles.fieldRow}>
                <input
                  className={styles.input}
                  style={{ width: 56 }}
                  placeholder="🎯"
                  value={newCategoryForm.icon}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, icon: e.target.value })}
                  aria-label="아이콘"
                />
                <input
                  className={styles.input}
                  placeholder="카테고리 이름 (예: Awards)"
                  value={newCategoryForm.label}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, label: e.target.value })}
                />
                <input
                  className={styles.input}
                  placeholder="키 (비우면 이름에서 자동 생성)"
                  value={newCategoryForm.key}
                  onChange={(e) => setNewCategoryForm({ ...newCategoryForm, key: e.target.value })}
                />
              </div>
              <input
                className={styles.input}
                placeholder="설명 (예: 수상 내역)"
                value={newCategoryForm.description}
                onChange={(e) => setNewCategoryForm({ ...newCategoryForm, description: e.target.value })}
              />
              {newCategoryError && <p className={styles.errorText}>{newCategoryError}</p>}
              <div className={styles.fieldRow}>
                <button type="button" className={styles.saveButton} onClick={handleAddCategory}>
                  추가
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setNewCategoryOpen(false);
                    setNewCategoryForm(emptyCategoryForm);
                    setNewCategoryError('');
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          </section>
        ) : (
          <button type="button" className={styles.addCategoryButton} onClick={() => setNewCategoryOpen(true)}>
            + 새 카테고리 추가
          </button>
        )}
      </main>
    </div>
  );
}
