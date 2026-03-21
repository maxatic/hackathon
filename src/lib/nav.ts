/**
 * App map — one place the team can read to see routes and intended ownership.
 * Adjust owners as you split work.
 */
export type NavItem = {
  href: string;
  label: string;
  /** Short description for the skeleton UI */
  description: string;
  /** Suggested owner role — edit freely */
  owner: "frontend" | "backend" | "ai" | "automation" | "tbd";
};

export const mainNav: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Overview, stats, next actions",
    owner: "frontend",
  },
  {
    href: "/master-cv",
    label: "Master CV",
    description: "Single source profile for tailoring",
    owner: "frontend",
  },
  {
    href: "/applications",
    label: "Applications",
    description: "Tracker + list of roles",
    owner: "frontend",
  },
  {
    href: "/interview",
    label: "Interview coach",
    description: "Voice mock interviews (ElevenLabs)",
    owner: "ai",
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Account, DE/EN, Gmail & Sheets hooks",
    owner: "automation",
  },
];
