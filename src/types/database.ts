export type ApplicationStatus =
  | "draft"
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export type ApplicationLocale = "de" | "en";

export type DocumentKind = "cv" | "cover_letter" | "bundle";

export type MasterProfile = {
  user_id: string;
  profile: Record<string, unknown>;
  updated_at: string | null;
};

export type Application = {
  id: string;
  user_id: string;
  company: string;
  role_title: string;
  jd_text: string;
  locale: ApplicationLocale;
  status: ApplicationStatus;
  applied_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GeneratedDocument = {
  id: string;
  user_id: string;
  application_id: string;
  kind: DocumentKind;
  latex_source: string | null;
  pdf_storage_path: string | null;
  meta: Record<string, unknown>;
  created_at: string;
};
