import type { CvExperienceEntry, CvEducationEntry } from "@/lib/ai/cv-template";

export type ExperienceEntry = CvExperienceEntry & { id: string };
export type EducationEntry = CvEducationEntry & { id: string };

export type ProfileFields = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  languages: string;
};

export function emptyExperienceEntry(): ExperienceEntry {
  return {
    id: crypto.randomUUID(),
    title: "",
    dateRange: "",
    organization: "",
    location: "",
    bullets: [],
  };
}

export function emptyEducationEntry(): EducationEntry {
  return {
    id: crypto.randomUUID(),
    institution: "",
    dateRange: "",
    degree: "",
    location: "",
    bullets: [],
  };
}

export function fieldsToProfile(f: ProfileFields): Record<string, unknown> {
  const skills = f.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    fullName: f.fullName.trim(),
    email: f.email.trim(),
    phone: f.phone.trim(),
    location: f.location.trim(),
    summary: f.summary.trim(),
    skills,
    experience: f.experience.map((e) => ({
      title: e.title,
      dateRange: e.dateRange,
      organization: e.organization,
      location: e.location,
      bullets: e.bullets,
    })),
    education: f.education.map((e) => ({
      institution: e.institution,
      dateRange: e.dateRange,
      degree: e.degree,
      location: e.location,
      bullets: e.bullets,
    })),
    languages: f.languages.trim(),
  };
}

function parseExperienceArray(arr: unknown[]): ExperienceEntry[] {
  return arr.map((row) => {
    const r = (typeof row === "object" && row !== null ? row : {}) as Record<string, unknown>;
    return {
      id: typeof r.id === "string" ? r.id : crypto.randomUUID(),
      title: String(r.title ?? ""),
      dateRange: String(r.dateRange ?? ""),
      organization: String(r.organization ?? ""),
      location: String(r.location ?? ""),
      bullets: Array.isArray(r.bullets) ? r.bullets.map(String) : [],
    };
  });
}

function parseEducationArray(arr: unknown[]): EducationEntry[] {
  return arr.map((row) => {
    const r = (typeof row === "object" && row !== null ? row : {}) as Record<string, unknown>;
    return {
      id: typeof r.id === "string" ? r.id : crypto.randomUUID(),
      institution: String(r.institution ?? ""),
      dateRange: String(r.dateRange ?? ""),
      degree: String(r.degree ?? ""),
      location: String(r.location ?? ""),
      bullets: Array.isArray(r.bullets) ? r.bullets.map(String) : [],
    };
  });
}

export function mergeProfilePatch(
  prev: ProfileFields,
  patch: Record<string, unknown>,
): ProfileFields {
  const next = { ...prev };

  const str = (k: "fullName" | "email" | "phone" | "location" | "summary" | "languages") => {
    const v = patch[k];
    if (v === undefined) return;
    if (typeof v === "string") next[k] = v;
  };
  str("fullName");
  str("email");
  str("phone");
  str("location");
  str("summary");
  str("languages");

  if ("experience" in patch && patch.experience !== undefined) {
    if (Array.isArray(patch.experience)) {
      next.experience = parseExperienceArray(patch.experience);
    } else if (typeof patch.experience === "string") {
      const text = patch.experience.trim();
      if (text) {
        next.experience = [{
          id: crypto.randomUUID(),
          title: "",
          dateRange: "",
          organization: "",
          location: "",
          bullets: [text],
        }];
      }
    }
  }

  if ("education" in patch && patch.education !== undefined) {
    if (Array.isArray(patch.education)) {
      next.education = parseEducationArray(patch.education);
    } else if (typeof patch.education === "string") {
      const text = patch.education.trim();
      if (text) {
        next.education = [{
          id: crypto.randomUUID(),
          institution: "",
          dateRange: "",
          degree: "",
          location: "",
          bullets: [text],
        }];
      }
    }
  }

  if ("skills" in patch && patch.skills !== undefined) {
    const s = patch.skills;
    if (Array.isArray(s)) {
      next.skills = s.map((x) => String(x).trim()).filter(Boolean).join(", ");
    } else if (typeof s === "string") {
      next.skills = s;
    }
  }

  return next;
}
