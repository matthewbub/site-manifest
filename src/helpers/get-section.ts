import type { SectionManifest, SiteManifest } from "../types.js";

export function getSection(manifest: SiteManifest, sectionId: string): SectionManifest | undefined {
  return manifest.sections.find((section) => section.id === sectionId);
}
