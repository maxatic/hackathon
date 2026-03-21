/**
 * CV layout copied from the project's reference `main.tex` (preamble + section structure).
 * Dynamic content is injected via `CvStructuredContent`; the outline and macros stay fixed.
 */

export type CvExperienceEntry = {
  title: string;
  dateRange: string;
  organization: string;
  location: string;
  bullets: string[];
};

export type CvEducationEntry = {
  institution: string;
  dateRange: string;
  degree: string;
  location: string;
  bullets: string[];
};

export type CvProjectEntry = {
  title: string;
  subtitle: string;
  dateRange: string;
  bullets: string[];
};

export type CvSkillsBlock = {
  technical?: string;
  design?: string;
  projectManagement?: string;
  artificialIntelligence?: string;
  /** Plain line(s) for languages, e.g. "German (native), English (C1)" */
  languages?: string;
};

export type CvCertificationEntry = {
  name: string;
  issuer?: string;
  url?: string;
  date: string;
};

export type CvHeader = {
  name: string;
  /** Lines under the name (street, city/ZIP, etc.) */
  addressLines: string[];
  email?: string;
  websiteLabel?: string;
  websiteUrl?: string;
  websiteDisplay?: string;
  linkedinLabel?: string;
  linkedinUrl?: string;
  linkedinDisplay?: string;
  phone?: string;
  born?: string;
  /** Image file name when compiling LaTeX (must sit next to the .tex file). */
  photoFilename?: string;
  /** City for the closing line (e.g. Munich, Berlin). */
  signatureCity?: string;
};

export type CvStructuredContent = {
  header: CvHeader;
  summary: string;
  experience: CvExperienceEntry[];
  education: CvEducationEntry[];
  projects: CvProjectEntry[];
  skills: CvSkillsBlock;
  certifications: CvCertificationEntry[];
};

const DEFAULT_PHOTO = "cv-photo.png";

/** Hyperref `\href{url}{...}` first argument — avoid breaking URLs. */
export function escapeHrefUrl(url: string): string {
  return url.replace(/%/g, "\\%").replace(/#/g, "\\#").replace(/_/g, "\\_");
}

function escapeGraphicsFilename(name: string): string {
  return name.trim().replace(/\\/g, "/").replace(/ /g, "\\ ");
}

/** Escape text for LaTeX (minimal safe set for resume body). */
export function escapeLatex(raw: string): string {
  return raw
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/[&%$#_{}~^]/g, (ch) => {
      const map: Record<string, string> = {
        "&": "\\&",
        "%": "\\%",
        $: "\\$",
        "#": "\\#",
        _: "\\_",
        "{": "\\{",
        "}": "\\}",
        "~": "\\textasciitilde{}",
        "^": "\\textasciicircum{}",
      };
      return map[ch] ?? ch;
    });
}

const PREAMBLE = String.raw`\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}
\usepackage{graphicx}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

\pdfgentounicode=1

\newcommand{\resumeItem}[1]{\item\small{{#1 \vspace{-2pt}}}}
\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}
\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}
\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}
\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}
\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}
`;

function buildHeaderLatex(h: CvHeader): string {
  const photo = escapeGraphicsFilename(h.photoFilename?.trim() || DEFAULT_PHOTO);
  const name = escapeLatex(h.name || "Name");
  const addr = (h.addressLines ?? [])
    .map((line) => escapeLatex(line))
    .join("\\\\\n    ");
  const email = h.email
    ? `\\href{mailto:${escapeHrefUrl(h.email)}}{${escapeLatex(h.email)}}`
    : "";
  const web =
    h.websiteUrl && h.websiteDisplay
      ? `${escapeLatex(h.websiteLabel || "Website")} -- \\href{${escapeHrefUrl(h.websiteUrl)}}{${escapeLatex(h.websiteDisplay)}}`
      : h.websiteUrl
        ? `\\href{${escapeHrefUrl(h.websiteUrl)}}{${escapeLatex(h.websiteDisplay || h.websiteUrl)}}`
        : "";
  const li =
    h.linkedinUrl && h.linkedinDisplay
      ? `${escapeLatex(h.linkedinLabel || "LinkedIn")} -- \\href{${escapeHrefUrl(h.linkedinUrl)}}{${escapeLatex(h.linkedinDisplay)}}`
        : "";
  const phone = h.phone ? escapeLatex(h.phone) : "";
  const born = h.born ? escapeLatex(h.born) : "";

  const contactLines = [email, web, li, phone].filter(Boolean);
  const contactBlock = contactLines.join("\\\\\n    ");
  const bornLine = born ? `\\\\[20pt]\n    Born: ${born}` : "";

  return String.raw`
%-----------HEADER WITH PHOTO-----------
\noindent
\begin{minipage}[t]{0.22\textwidth}
    \vspace*{-15pt}
    \includegraphics[width=\linewidth]{${photo}}
\end{minipage}
\hspace{0.2cm}
\begin{minipage}[t]{0.7\textwidth}
    \vspace*{-0.43cm}
    {\fontsize{26pt}{28pt}\selectfont\scshape ${name}}\\[2pt]
    \large
    ${addr}\\[15pt]
    \normalsize
    ${contactBlock}${bornLine}
\end{minipage}
\vspace{12pt}
`;
}

function buildSummaryLatex(summary: string): string {
  const text = escapeLatex(summary.trim() || "—");
  return String.raw`
%-----------SUMMARY-----------
\section{Summary}
\begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     ${text}
    }}
\end{itemize}
`;
}

function buildExperienceLatex(rows: CvExperienceEntry[]): string {
  if (!rows.length) {
    return String.raw`
%-----------EXPERIENCE-----------
\section{Professional Experience}
\resumeSubHeadingListStart
\resumeSubHeadingListEnd
`;
  }
  const blocks = rows
    .map((e) => {
      const bullets =
        e.bullets?.length > 0
          ? String.raw`
    \resumeItemListStart
${e.bullets.map((b) => `\\resumeItem{${escapeLatex(b)}}`).join("\n")}
    \resumeItemListEnd`
          : "";
      return String.raw`
    \resumeSubheading
    {${escapeLatex(e.title)}}{${escapeLatex(e.dateRange)}}
    {${escapeLatex(e.organization)}}{${escapeLatex(e.location)}}${bullets}
`;
    })
    .join("\n");

  return String.raw`
%-----------EXPERIENCE-----------
\section{Professional Experience}
\resumeSubHeadingListStart    
${blocks}
\resumeSubHeadingListEnd
`;
}

function buildEducationLatex(rows: CvEducationEntry[]): string {
  if (!rows.length) {
    return String.raw`
%-----------EDUCATION-----------
\section{Education}
\resumeSubHeadingListStart
\resumeSubHeadingListEnd
`;
  }
  const blocks = rows
    .map((e) => {
      const bullets =
        e.bullets?.length > 0
          ? String.raw`
      \resumeItemListStart
${e.bullets.map((b) => `      \\resumeItem{${escapeLatex(b)}}`).join("\n")}
      \resumeItemListEnd`
          : "";
      return String.raw`
  \resumeSubheading
    {${escapeLatex(e.institution)}}{${escapeLatex(e.dateRange)}}
    {${escapeLatex(e.degree)}}{${escapeLatex(e.location)}}${bullets}
`;
    })
    .join("\n");

  return String.raw`
%-----------EDUCATION-----------
\section{Education}
\resumeSubHeadingListStart
${blocks}
\resumeSubHeadingListEnd
`;
}

function buildProjectsLatex(rows: CvProjectEntry[]): string {
  if (!rows.length) {
    return String.raw`
%-----------PROJECTS-----------
\section{Selected Projects}
\resumeSubHeadingListStart
\resumeSubHeadingListEnd
`;
  }
  const blocks = rows
    .map((p) => {
      const heading = String.raw`\textbf{${escapeLatex(p.title)}} $|$  \emph{${escapeLatex(p.subtitle)}}`;
      const bullets =
        p.bullets?.length > 0
          ? String.raw`
    \resumeItemListStart
${p.bullets.map((b) => `    \\resumeItem{${escapeLatex(b)}}`).join("\n")}
    \resumeItemListEnd`
          : "";
      return String.raw`
  \resumeProjectHeading
    {${heading}}{${escapeLatex(p.dateRange)}}${bullets}
`;
    })
    .join("\n");

  return String.raw`
%-----------PROJECTS-----------
\section{Selected Projects}
\resumeSubHeadingListStart
${blocks}
\resumeSubHeadingListEnd
`;
}

function buildSkillsLatex(sk: CvSkillsBlock): string {
  const technical = sk.technical?.trim()
    ? `\\textbf{Technical}{: ${escapeLatex(sk.technical)}} \\\\`
    : "";
  const design = sk.design?.trim()
    ? `\\textbf{Design}{: ${escapeLatex(sk.design)}} \\\\`
    : "";
  const pm = sk.projectManagement?.trim()
    ? `\\textbf{Project Management}{: ${escapeLatex(sk.projectManagement)}} \\\\`
    : "";
  const ai = sk.artificialIntelligence?.trim()
    ? `\\textbf{Artificial Intelligence}{: ${escapeLatex(sk.artificialIntelligence)}} \\\\`
    : "";
  const lang = sk.languages?.trim()
    ? `\\textbf{Languages}{: ${escapeLatex(sk.languages)}} \\\\`
    : "\\textbf{Languages}{} \\\\";
  const anySkill =
    technical || design || pm || ai || sk.languages?.trim();
  const filler = anySkill
    ? ""
    : `\\textbf{Technical}{: ${escapeLatex("—")}} \\\\`;

  return String.raw`
%-----------SKILLS-----------
\section{Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     ${filler}
     ${technical}
     ${design}
     ${pm}
     ${ai}
    ${lang}
    }
    }
 \end{itemize}
`;
}

function buildCertificationsLatex(rows: CvCertificationEntry[]): string {
  if (!rows.length) {
    return String.raw`
%-----------CERTIFICATIONS-----------
\section{Certifications}
\resumeSubHeadingListStart
\resumeSubHeadingListEnd
`;
  }
  const blocks = rows
    .map((c) => {
      const boldTitle = c.issuer?.trim()
        ? `${escapeLatex(c.issuer.trim())} - ${escapeLatex(c.name)}`
        : escapeLatex(c.name);
      const label = c.url?.trim()
        ? String.raw`\href{${escapeHrefUrl(c.url.trim())}}{\textbf{${boldTitle}}}`
        : String.raw`\textbf{${boldTitle}}`;
      return String.raw`
    \resumeProjectHeading{${label}}{${escapeLatex(c.date)}}`;
    })
    .join("\n");

  return String.raw`
%-----------CERTIFICATIONS-----------
\section{Certifications}
\resumeSubHeadingListStart
${blocks}
\resumeSubHeadingListEnd
`;
}

function buildSignatureLatex(city: string): string {
  const c = escapeLatex(city.trim() || "Munich");
  return String.raw`
%-----------SIGNATURE-----------
\vfill
\begin{center}
    ${c}, \today
\end{center}
`;
}

/** Full LaTeX document using the fixed resume template. */
export function buildCvLatexFromStructured(content: CvStructuredContent): string {
  const h = content.header;
  const city = h.signatureCity || (h.addressLines?.[1]?.split(/\s+/).pop() ?? "Munich");

  const body = [
    buildHeaderLatex(h),
    buildSummaryLatex(content.summary),
    buildExperienceLatex(content.experience),
    buildEducationLatex(content.education),
    buildProjectsLatex(content.projects),
    buildSkillsLatex(content.skills),
    buildCertificationsLatex(content.certifications),
    buildSignatureLatex(city),
  ].join("\n");

  return `${PREAMBLE}\n\\begin{document}\n${body}\n\\end{document}\n`;
}

/** Plain text CV with the same section order and headings as the LaTeX template. */
export function buildCvPlainFromStructured(content: CvStructuredContent): string {
  const h = content.header;
  const lines: string[] = [];

  lines.push(h.name || "Name");
  for (const a of h.addressLines ?? []) lines.push(a);
  if (h.email) lines.push(h.email);
  if (h.websiteUrl)
    lines.push(
      `${h.websiteLabel || "Website"}: ${h.websiteDisplay || h.websiteUrl} (${h.websiteUrl})`,
    );
  if (h.linkedinUrl)
    lines.push(
      `${h.linkedinLabel || "LinkedIn"}: ${h.linkedinDisplay || h.linkedinUrl}`,
    );
  if (h.phone) lines.push(h.phone);
  if (h.born) lines.push(`Born: ${h.born}`);
  lines.push("");
  lines.push("SUMMARY");
  lines.push("—".repeat(40));
  lines.push(content.summary.trim() || "—");
  lines.push("");

  lines.push("PROFESSIONAL EXPERIENCE");
  lines.push("—".repeat(40));
  for (const e of content.experience) {
    lines.push(`${e.title}  |  ${e.dateRange}`);
    lines.push(`${e.organization}  |  ${e.location}`);
    for (const b of e.bullets ?? []) lines.push(`  - ${b}`);
    lines.push("");
  }

  lines.push("EDUCATION");
  lines.push("—".repeat(40));
  for (const e of content.education) {
    lines.push(`${e.institution}  |  ${e.dateRange}`);
    lines.push(`${e.degree}  |  ${e.location}`);
    for (const b of e.bullets ?? []) lines.push(`  - ${b}`);
    lines.push("");
  }

  lines.push("SELECTED PROJECTS");
  lines.push("—".repeat(40));
  for (const p of content.projects) {
    lines.push(`${p.title} | ${p.subtitle}  (${p.dateRange})`);
    for (const b of p.bullets ?? []) lines.push(`  - ${b}`);
    lines.push("");
  }

  lines.push("SKILLS");
  lines.push("—".repeat(40));
  const sk = content.skills;
  const hasAnySkill =
    sk.technical ||
    sk.design ||
    sk.projectManagement ||
    sk.artificialIntelligence ||
    sk.languages;
  if (!hasAnySkill) {
    lines.push("—");
  } else {
    if (sk.technical) lines.push(`Technical: ${sk.technical}`);
    if (sk.design) lines.push(`Design: ${sk.design}`);
    if (sk.projectManagement) lines.push(`Project Management: ${sk.projectManagement}`);
    if (sk.artificialIntelligence)
      lines.push(`Artificial Intelligence: ${sk.artificialIntelligence}`);
    if (sk.languages) lines.push(`Languages: ${sk.languages}`);
  }
  lines.push("");

  lines.push("CERTIFICATIONS");
  lines.push("—".repeat(40));
  for (const c of content.certifications) {
    const prefix = c.issuer ? `${c.issuer} — ${c.name}` : c.name;
    lines.push(`${prefix}  (${c.date})${c.url ? `  ${c.url}` : ""}`);
  }
  lines.push("");

  const cityPlain =
    h.signatureCity?.trim() ||
    h.addressLines?.[1]?.split(/\s+/).pop()?.trim() ||
    "Munich";
  lines.push(`${cityPlain}, ${new Date().toLocaleDateString("en-GB")}`);

  return lines.join("\n").trim();
}

function asStr(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function asStrOpt(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v : undefined;
}

function asStrArr(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string");
}

/**
 * JSON schema description for `cv_structured`, shared between generation and
 * PDF-upload parsing prompts so both produce the identical shape.
 */
export const CV_STRUCTURED_SCHEMA = `  "cv_structured": {
    "header": {
      "name": "string",
      "addressLines": ["string", "..."],
      "email": "string (optional)",
      "websiteLabel": "string (optional)",
      "websiteUrl": "string (optional)",
      "websiteDisplay": "string (optional)",
      "linkedinLabel": "string (optional)",
      "linkedinUrl": "string (optional)",
      "linkedinDisplay": "string (optional)",
      "phone": "string (optional)",
      "born": "string (optional)",
      "photoFilename": "string (optional, default cv-photo.png — file must sit next to the .tex when compiling)",
      "signatureCity": "string (optional, e.g. Munich)"
    },
    "summary": "string",
    "experience": [
      {
        "title": "string",
        "dateRange": "MM/YYYY -- MM/YYYY",
        "organization": "string",
        "location": "string",
        "bullets": ["string"]
      }
    ],
    "education": [
      {
        "institution": "string",
        "dateRange": "string",
        "degree": "string",
        "location": "string",
        "bullets": ["string"]
      }
    ],
    "projects": [
      {
        "title": "string",
        "subtitle": "string (short emphasis line after | in the CV)",
        "dateRange": "string",
        "bullets": ["string"]
      }
    ],
    "skills": {
      "technical": "string (optional)",
      "design": "string (optional)",
      "projectManagement": "string (optional)",
      "artificialIntelligence": "string (optional)",
      "languages": "string (optional)"
    },
    "certifications": [
      { "name": "string", "issuer": "string (optional)", "url": "string (optional)", "date": "string" }
    ]
  }`;

/** Coerce model JSON into `CvStructuredContent` with safe defaults. */
export function parseCvStructured(raw: unknown): CvStructuredContent {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("cv_structured must be a JSON object");
  }
  const o = raw as Record<string, unknown>;
  const headerRaw =
    typeof o.header === "object" && o.header !== null
      ? (o.header as Record<string, unknown>)
      : {};

  const expRaw = Array.isArray(o.experience) ? o.experience : [];
  const experience: CvExperienceEntry[] = expRaw.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      title: asStr(r.title),
      dateRange: asStr(r.dateRange),
      organization: asStr(r.organization),
      location: asStr(r.location),
      bullets: asStrArr(r.bullets),
    };
  });

  const eduRaw = Array.isArray(o.education) ? o.education : [];
  const education: CvEducationEntry[] = eduRaw.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      institution: asStr(r.institution),
      dateRange: asStr(r.dateRange),
      degree: asStr(r.degree),
      location: asStr(r.location),
      bullets: asStrArr(r.bullets),
    };
  });

  const projRaw = Array.isArray(o.projects) ? o.projects : [];
  const projects: CvProjectEntry[] = projRaw.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      title: asStr(r.title),
      subtitle: asStr(r.subtitle),
      dateRange: asStr(r.dateRange),
      bullets: asStrArr(r.bullets),
    };
  });

  const skRaw =
    typeof o.skills === "object" && o.skills !== null
      ? (o.skills as Record<string, unknown>)
      : {};
  const skills: CvSkillsBlock = {
    technical: asStrOpt(skRaw.technical),
    design: asStrOpt(skRaw.design),
    projectManagement: asStrOpt(skRaw.projectManagement ?? skRaw.project_management),
    artificialIntelligence: asStrOpt(
      skRaw.artificialIntelligence ?? skRaw.artificial_intelligence,
    ),
    languages: asStrOpt(skRaw.languages),
  };

  const certRaw = Array.isArray(o.certifications) ? o.certifications : [];
  const certifications: CvCertificationEntry[] = certRaw.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      name: asStr(r.name),
      issuer: asStrOpt(r.issuer),
      url: asStrOpt(r.url),
      date: asStr(r.date),
    };
  });

  const header: CvHeader = {
    name: asStr(headerRaw.name) || "Candidate",
    addressLines: asStrArr(headerRaw.addressLines ?? headerRaw.address_lines),
    email: asStrOpt(headerRaw.email),
    websiteLabel: asStrOpt(headerRaw.websiteLabel ?? headerRaw.website_label),
    websiteUrl: asStrOpt(headerRaw.websiteUrl ?? headerRaw.website_url),
    websiteDisplay: asStrOpt(
      headerRaw.websiteDisplay ?? headerRaw.website_display,
    ),
    linkedinLabel: asStrOpt(headerRaw.linkedinLabel ?? headerRaw.linkedin_label),
    linkedinUrl: asStrOpt(headerRaw.linkedinUrl ?? headerRaw.linkedin_url),
    linkedinDisplay: asStrOpt(
      headerRaw.linkedinDisplay ?? headerRaw.linkedin_display,
    ),
    phone: asStrOpt(headerRaw.phone),
    born: asStrOpt(headerRaw.born),
    photoFilename: asStrOpt(headerRaw.photoFilename ?? headerRaw.photo_filename),
    signatureCity: asStrOpt(headerRaw.signatureCity ?? headerRaw.signature_city),
  };

  return {
    header,
    summary: asStr(o.summary),
    experience,
    education,
    projects,
    skills,
    certifications,
  };
}
