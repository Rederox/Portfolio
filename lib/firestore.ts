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
  deleteField,
  type Unsubscribe,
  type CollectionReference,
} from "firebase/firestore";

function sanitizeForAdd(data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
}

function sanitizeForUpdate(data: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v === undefined ? deleteField() : v]));
}
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

// ─── Job Board ────────────────────────────────────────────────────────────────

export const JOB_STATUSES = [
  { key: "wishlist",  label: "À postuler",  color: "#8b5cf6", bg: "rgba(139,92,246,0.12)",  border: "rgba(139,92,246,0.25)" },
  { key: "applied",   label: "Postulé",     color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.25)" },
  { key: "interview", label: "Entretien",   color: "#f59e0b", bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)" },
  { key: "offer",     label: "Offre",       color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.25)" },
  { key: "rejected",  label: "Refusé",      color: "#ef4444", bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)" },
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number]["key"];

export interface JobBoardTab {
  id?: string;
  name: string;
  order: number;
}

export interface JobDoc {
  url: string;
  name: string;
}

export interface AIAnalysisRoadmapStep {
  step: number;
  title: string;
  description: string;
}

export interface CompatibilityResult {
  score: number;
  strengths: string[];
  gaps: string[];
  recommendation: string;
  analyzedAt: string;
}

export interface AIAnalysis {
  summary: string;
  skills_required: string[];
  skills_nice: string[];
  roadmap: AIAnalysisRoadmapStep[];
  tips: string[];
  salary_estimate: string | null;
  analyzedAt?: string;
  compatibility?: CompatibilityResult;
}

export interface JobApplication {
  id?: string;
  tabId: string;
  title: string;
  company: string;
  location: string;
  lat?: number;
  lng?: number;
  description: string;
  status: JobStatus;
  notes: string;
  screenshots: string[];
  documents: JobDoc[];
  link: string;
  order: number;
  createdAt?: Date;
  aiAnalysis?: AIAnalysis;
  lastContactAt?: string;
  relanceCount?: number;
  coverLetter?: string;
  coverLetterGeneratedAt?: string;
  priority?: "low" | "medium" | "high";
}

export type InterviewType = "phone" | "video" | "onsite" | "technical";

export interface Interview {
  id?: string;
  jobId: string;
  title: string;
  company: string;
  date: string;
  time: string;
  type: InterviewType;
  notes: string;
  createdAt?: Date;
}

export const subscribeJobTabs = (cb: (tabs: JobBoardTab[]) => void): Unsubscribe =>
  onSnapshot(query(col("jobTabs"), orderBy("order")), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as JobBoardTab)))
  );

export const addJobTab = (data: Omit<JobBoardTab, "id">) =>
  addDoc(col("jobTabs"), data);

export const updateJobTab = (id: string, data: Partial<JobBoardTab>) =>
  updateDoc(doc(getDb(), "jobTabs", id), data as Record<string, unknown>);

export const deleteJobTab = (id: string) =>
  deleteDoc(doc(getDb(), "jobTabs", id));

export const subscribeJobApplications = (cb: (apps: JobApplication[]) => void): Unsubscribe =>
  onSnapshot(query(col("jobApplications"), orderBy("order")), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as JobApplication)))
  );

export const addJobApplication = (data: Omit<JobApplication, "id">) =>
  addDoc(col("jobApplications"), sanitizeForAdd({ ...data, createdAt: serverTimestamp() } as Record<string, unknown>));

export const updateJobApplication = (id: string, data: Partial<JobApplication>) =>
  updateDoc(doc(getDb(), "jobApplications", id), sanitizeForUpdate(data as Record<string, unknown>));

export const deleteJobApplication = (id: string) =>
  deleteDoc(doc(getDb(), "jobApplications", id));

// ─── Interviews ───────────────────────────────────────────────────────────────

export const subscribeInterviews = (cb: (interviews: Interview[]) => void): Unsubscribe =>
  onSnapshot(query(col("interviews"), orderBy("date")), (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as unknown as Interview)))
  );

export const addInterview = (data: Omit<Interview, "id">) =>
  addDoc(col("interviews"), { ...data, createdAt: serverTimestamp() });

export const updateInterview = (id: string, data: Partial<Interview>) =>
  updateDoc(doc(getDb(), "interviews", id), data as Record<string, unknown>);

export const deleteInterview = (id: string) =>
  deleteDoc(doc(getDb(), "interviews", id));

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
