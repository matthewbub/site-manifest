import type { SectionManifest, SiteManifest } from "../types.js";

/**
 * Finds a section definition by id from the manifest.
 * This keeps section access centralized for higher-level label and validation helpers.
 */
export function getSection(manifest: SiteManifest, sectionId: string): SectionManifest | undefined {
  return manifest.sections.find((section) => section.id === sectionId);
}
