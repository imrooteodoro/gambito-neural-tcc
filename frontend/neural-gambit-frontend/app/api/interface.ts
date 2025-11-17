import { loadEnvConfig } from "@next/env";

const dev = process.env.NODE_ENV !== "production";

if (dev) {
  loadEnvConfig(process.cwd());
}

export const BACKEND_URL = process.env.BACKEND_URL;

