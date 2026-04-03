import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
  type CollectionReference,
} from "firebase/firestore";
import { getDb } from "./firebase";
import { DEFAULT_SETTINGS, type ThemeKey, type ThemeSettings, type BgStyle } from "./themes";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Project {
  id?: string;
  title: string;
  shortDesc: string;
  description: string;
  images: string[];
  video?: string;
  technologies: string[];
  github?: string;
  live?: string;
  featured: boolean;
  order: number;
  createdAt?: Date;
}

export interface Experience {
  id?: string;
  company: string;
  role: string;
  type: string;
  period: string;
  description: string[];
  technologies: string[];
  current: boolean;
  order: number;
}

export interface Education {
  id?: string;
  degree: string;
  school: string;
  location?: string;
  period: string;
  description: string;
  current: boolean;
  order: number;
}

export interface SkillCategory {
  id?: string;
  category: string;
  color: string;
  order: number;
  items: { name: string; icon: string; imageUrl?: string }[];
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function col(path: string): CollectionReference {
  return collection(getDb(), path);
}

function docsToArray<T>(snapshot: Awaited<ReturnType<typeof getDocs>>): T[] {
  return snapshot.docs.map((d) => {
    const data = d.data() as Record<string, unknown>;
    return { id: d.id, ...data } as unknown as T;
  });
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export const subscribeProjects = (cb: (data: Project[]) => void): Unsubscribe =>
  onSnapshot(query(col("projects"), orderBy("order")), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Project)))
  );

export const getProjects = async (): Promise<Project[]> =>
  docsToArray<Project>(await getDocs(query(col("projects"), orderBy("order"))));

export const addProject = (data: Omit<Project, "id">) =>
  addDoc(col("projects"), { ...data, createdAt: serverTimestamp() });

export const updateProject = (id: string, data: Partial<Project>) =>
  updateDoc(doc(getDb(), "projects", id), data as Record<string, unknown>);

export const deleteProject = (id: string) =>
  deleteDoc(doc(getDb(), "projects", id));

// ─── Experience ───────────────────────────────────────────────────────────────

export const subscribeExperience = (cb: (data: Experience[]) => void): Unsubscribe =>
  onSnapshot(query(col("experience"), orderBy("order")), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Experience)))
  );

export const getExperience = async (): Promise<Experience[]> =>
  docsToArray<Experience>(await getDocs(query(col("experience"), orderBy("order"))));

export const addExperience = (data: Omit<Experience, "id">) =>
  addDoc(col("experience"), data);

export const updateExperience = (id: string, data: Partial<Experience>) =>
  updateDoc(doc(getDb(), "experience", id), data as Record<string, unknown>);

export const deleteExperience = (id: string) =>
  deleteDoc(doc(getDb(), "experience", id));

// ─── Education ────────────────────────────────────────────────────────────────

export const subscribeEducation = (cb: (data: Education[]) => void): Unsubscribe =>
  onSnapshot(query(col("education"), orderBy("order")), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Education)))
  );

export const getEducation = async (): Promise<Education[]> =>
  docsToArray<Education>(await getDocs(query(col("education"), orderBy("order"))));

export const addEducation = (data: Omit<Education, "id">) =>
  addDoc(col("education"), data);

export const updateEducation = (id: string, data: Partial<Education>) =>
  updateDoc(doc(getDb(), "education", id), data as Record<string, unknown>);

export const deleteEducation = (id: string) =>
  deleteDoc(doc(getDb(), "education", id));

// ─── Skills ───────────────────────────────────────────────────────────────────

export const subscribeSkills = (cb: (data: SkillCategory[]) => void): Unsubscribe =>
  onSnapshot(query(col("skills"), orderBy("order")), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as SkillCategory)))
  );

export const addSkillCategory = (data: Omit<SkillCategory, "id">) =>
  addDoc(col("skills"), data);

export const updateSkillCategory = (id: string, data: Partial<SkillCategory>) =>
  updateDoc(doc(getDb(), "skills", id), data as Record<string, unknown>);

export const deleteSkillCategory = (id: string) =>
  deleteDoc(doc(getDb(), "skills", id));

// ─── Theme settings ───────────────────────────────────────────────────────────

export const getThemeSettings = async (): Promise<ThemeSettings> => {
  const snap = await getDoc(doc(getDb(), "settings", "theme"));
  if (snap.exists()) {
    const data = snap.data() as Partial<ThemeSettings>;
    return {
      key:          (data.key          as ThemeKey)  ?? DEFAULT_SETTINGS.key,
      customAccent: data.customAccent,
      bgStyle:      (data.bgStyle      as BgStyle)   ?? DEFAULT_SETTINGS.bgStyle,
    };
  }
  return { ...DEFAULT_SETTINGS };
};

// Raccourcis rétro-compatibles
export const getTheme = async (): Promise<ThemeKey> =>
  (await getThemeSettings()).key;

export const setThemeSetting = (key: ThemeKey) =>
  setDoc(doc(getDb(), "settings", "theme"), { key }, { merge: true });

export const saveThemeSettings = (s: ThemeSettings) => {
  // Firestore interdit les valeurs `undefined` — on les retire proprement
  const data: Record<string, unknown> = { key: s.key, bgStyle: s.bgStyle };
  if (s.customAccent !== undefined) data.customAccent = s.customAccent;
  return setDoc(doc(getDb(), "settings", "theme"), data, { merge: true });
};
