import { collection, doc, getDocs, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { categories as defaultCategories, type Category, type DetailItem } from './profileData';

export type { Category, DetailItem };

// 인벤토리 카테고리(=아이템)를 저장하는 Firestore 경로: users/anonymous/items/{categoryKey}
const COLLECTION_PATH = 'users/anonymous/items';

function itemsCollection() {
  return collection(db, COLLECTION_PATH);
}

// Firestore rejects fields explicitly set to `undefined` (e.g. an optional
// DetailItem.meta left blank) — drop those keys entirely before writing.
function stripUndefined<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

async function seedDefaults(): Promise<void> {
  const batch = writeBatch(db);
  defaultCategories.forEach((cat) => {
    batch.set(doc(db, COLLECTION_PATH, cat.key), stripUndefined(cat));
  });
  await batch.commit();
}

export async function loadCategories(): Promise<Category[]> {
  const snapshot = await getDocs(itemsCollection());
  if (snapshot.empty) {
    await seedDefaults();
    return defaultCategories;
  }
  return snapshot.docs.map((d) => d.data() as Category);
}

export async function upsertCategory(category: Category): Promise<void> {
  await setDoc(doc(db, COLLECTION_PATH, category.key), stripUndefined(category));
}

export async function deleteCategory(key: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_PATH, key));
}

export async function resetCategories(): Promise<Category[]> {
  const snapshot = await getDocs(itemsCollection());
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  await seedDefaults();
  return defaultCategories;
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
