import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

/**
 * Env files (project root, same folder as package.json):
 * - `.env.local` — local secrets/overrides; gitignored; loaded for `next dev` / `next build`
 * - `.env` — optional defaults (often committed empty)
 * - `.env.example` — template only (copy to `.env.local`)
 *
 * @see https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
 * Restart the dev server after changing env files.
 */
const nextConfig: NextConfig = {};

export default nextConfig;
