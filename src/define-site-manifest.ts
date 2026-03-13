import type { SiteManifest } from "./types.js";

/**
 * Preserves a manifest's literal types while making the declaration read like an explicit API boundary.
 * This is intended to be the entry point callers use when authoring manifests in code.
 */
export function defineSiteManifest<const T extends SiteManifest>(manifest: T): T {
  return manifest;
}
