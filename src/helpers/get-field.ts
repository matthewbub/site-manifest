import { getSection } from "./get-section.js";
import type { LabelFieldDefinition, SiteManifest } from "../types.js";

/**
 * Looks up a field within a specific section so callers can work with manifest metadata by section and key.
 */
export function getField(
  manifest: SiteManifest,
  sectionId: string,
  key: string,
): LabelFieldDefinition | undefined {
  return getSection(manifest, sectionId)?.labels.find((field) => field.key === key);
}
