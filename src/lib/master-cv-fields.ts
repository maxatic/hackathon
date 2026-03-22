export type ProfileFields = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;
  experience: string;
  education: string;
  languages: string;
};

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
    experience: f.experience.trim(),
    education: f.education.trim(),
    languages: f.languages.trim(),
  };
}

export function mergeProfilePatch(
  prev: ProfileFields,
  patch: Record<string, unknown>,
): ProfileFields {
  const next = { ...prev };
  const str = (k: keyof ProfileFields) => {
    const v = patch[k];
    if (v === undefined) return;
    if (typeof v === "string") next[k] = v;
  };
  str("fullName");
  str("email");
  str("phone");
  str("location");
  str("summary");
  str("experience");
  str("education");
  str("languages");
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
