import type { SiteManifest } from "./types.js";

export function defineSiteManifest<const T extends SiteManifest>(manifest: T): T {
  return manifest;
}
