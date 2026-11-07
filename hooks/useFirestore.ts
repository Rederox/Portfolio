"use client";

import { useEffect, useState } from "react";
import {
  subscribeProjects,
  subscribeExperience,
  subscribeEducation,
  subscribeSkills,
  subscribeCvSettings,
  type CvSettings,
  type Project,
  type Experience,
  type Education,
  type SkillCategory,
} from "@/lib/firestore";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  projects as localProjects,
  experiences as localExperiences,
  education as localEducation,
  skillCategories as localSkills,
  personal,
} from "@/data/portfolio";

// ─── Projects ─────────────────────────────────────────────────────────────────

export function useProjects() {
  const [data, setData] = useState<Project[]>(localProjects as Project[]);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsub = subscribeProjects((items) => {
      if (items.length > 0) setData(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { data, loading };
}

// ─── Experience ───────────────────────────────────────────────────────────────

export function useExperience() {
  const [data, setData] = useState<Experience[]>(localExperiences as Experience[]);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsub = subscribeExperience((items) => {
      if (items.length > 0) setData(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { data, loading };
}

// ─── Education ────────────────────────────────────────────────────────────────

export function useEducation() {
  const [data, setData] = useState<Education[]>(localEducation as Education[]);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsub = subscribeEducation((items) => {
      if (items.length > 0) setData(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { data, loading };
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export function useSkills() {
  const [data, setData] = useState<SkillCategory[]>(localSkills as SkillCategory[]);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsub = subscribeSkills((items) => {
      if (items.length > 0) setData(items);
      setLoading(false);
    });
    return unsub;
  }, []);

  return { data, loading };
}

// ─── CV ───────────────────────────────────────────────────────────────────────

/** URLs des CV à télécharger : Firestore (uploadés depuis l'admin) ou PDF statiques par défaut */
export function useCv() {
  const [settings, setSettings] = useState<CvSettings>({});

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    try {
      return subscribeCvSettings(setSettings);
    } catch {
      // Firestore indisponible → on garde les PDF statiques
    }
  }, []);

  return {
    classic: settings.classic?.url ?? personal.cv,
    ats: settings.ats?.url ?? personal.cvAts,
    settings,
  };
}
