import { getSection } from "./get-section.js";
import type { LabelFieldDefinition, SiteManifest } from "../types.js";

export function getField(
  manifest: SiteManifest,
  sectionId: string,
  key: string,
): LabelFieldDefinition | undefined {
  return getSection(manifest, sectionId)?.labels.find((field) => field.key === key);
}
