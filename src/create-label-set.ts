import { getField } from "./helpers/get-field.js";
import { getSection } from "./helpers/get-section.js";
import type {
  GroupChildFieldDefinition,
  LabelSet,
  PersistedLabels,
  PersistedSectionLabels,
  RepeaterItem,
  SiteLocale,
  SiteManifest,
} from "./types.js";

export type CreateLabelSetArgs = {
  manifest: SiteManifest;
  labels: PersistedLabels;
  locale: SiteLocale;
  hiddenKey?: string;
};

/**
 * Narrows unknown values into simple string dictionaries used by group and repeater label data.
 */
function isStringRecord(value: unknown): value is Record<string, string> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/**
 * Normalizes persisted values so empty strings fall back to defaults the same way missing values do.
 */
function toNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined;
}

/**
 * Merges persisted group overrides with the manifest defaults for the requested locale.
 */
function resolveGroupValue(
  fields: GroupChildFieldDefinition[],
  rawValue: unknown,
  locale: SiteLocale,
): Record<string, string> {
  const overrides = isStringRecord(rawValue) ? rawValue : {};
  const resolved: Record<string, string> = {};

  for (const field of fields) {
    resolved[field.key] =
      toNonEmptyString(overrides[field.key]) ?? field.defaultValue?.[locale] ?? "";
  }

  return resolved;
}

/**
 * Accepts either already-parsed repeater data or the serialized format commonly stored in persistence layers.
 */
function parseRepeaterValue(rawValue: unknown): RepeaterItem[] | undefined {
  if (Array.isArray(rawValue)) {
    return rawValue.filter(isStringRecord);
  }

  if (typeof rawValue !== "string" || rawValue === "") {
    return undefined;
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isStringRecord) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Converts persisted hidden-state data into a predictable boolean lookup map.
 */
function parseHiddenState(rawValue: unknown): Record<string, boolean> {
  if (rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)) {
    return Object.fromEntries(
      Object.entries(rawValue).map(([key, value]) => [key, value === true]),
    );
  }

  if (typeof rawValue !== "string" || rawValue === "") {
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [key, value === true]),
    );
  } catch {
    return {};
  }
}

/**
 * Returns the persisted overrides for one locale and section, or an empty object when none were saved.
 */
function getSectionOverrides(
  labels: PersistedLabels,
  locale: SiteLocale,
  sectionId: string,
): PersistedSectionLabels {
  return labels[locale]?.[sectionId] ?? {};
}

/**
 * Builds a read-focused helper around persisted labels so consumers can resolve defaults, groups, repeaters,
 * and hidden state without repeating manifest traversal logic.
 */
export function createLabelSet({
  manifest,
  labels,
  locale,
  hiddenKey = "_hidden",
}: CreateLabelSetArgs): LabelSet {
  const sectionCache = new Map<string, Record<string, unknown>>();
  const hiddenCache = new Map<string, Record<string, boolean>>();

  /**
   * Resolves all non-repeater values for a section once and caches the result for repeated reads.
   */
  const getResolvedSection = (sectionId: string): Record<string, unknown> => {
    const cached = sectionCache.get(sectionId);
    if (cached) {
      return cached;
    }

    const section = getSection(manifest, sectionId);
    if (!section) {
      return {};
    }

    const overrides = getSectionOverrides(labels, locale, sectionId);
    const resolved: Record<string, unknown> = {};

    for (const field of section.labels) {
      if (field.kind === "group") {
        resolved[field.key] = resolveGroupValue(field.fields, overrides[field.key], locale);
        continue;
      }

      if (field.kind === "repeater") {
        continue;
      }

      resolved[field.key] =
        toNonEmptyString(overrides[field.key]) ?? field.defaultValue?.[locale] ?? "";
    }

    sectionCache.set(sectionId, resolved);
    return resolved;
  };

  /**
   * Lazily parses the persisted hidden flags for a section and caches the boolean map.
   */
  const getHiddenMap = (sectionId: string): Record<string, boolean> => {
    const cached = hiddenCache.get(sectionId);
    if (cached) {
      return cached;
    }

    const hiddenMap = parseHiddenState(getSectionOverrides(labels, locale, sectionId)[hiddenKey]);
    hiddenCache.set(sectionId, hiddenMap);
    return hiddenMap;
  };

  return {
    /** Returns the resolved label values for a section, with manifest defaults already applied. */
    section(sectionId) {
      return getResolvedSection(sectionId);
    },

    /** Returns a single string value for a field, defaulting to an empty string for missing or non-string values. */
    value(sectionId, key) {
      const rawValue = getResolvedSection(sectionId)[key];
      return typeof rawValue === "string" ? rawValue : "";
    },

    /** Returns the resolved child values for a group field. */
    group(sectionId, key) {
      const rawValue = getResolvedSection(sectionId)[key];
      return isStringRecord(rawValue) ? rawValue : {};
    },

    /** Returns repeater items from persisted data when available, otherwise falling back to localized defaults. */
    items(sectionId, key) {
      const field = getField(manifest, sectionId, key);
      if (!field || field.kind !== "repeater") {
        return [];
      }

      const overrides = getSectionOverrides(labels, locale, sectionId);
      return (
        parseRepeaterValue(overrides[key]) ??
        field.defaultItems?.[locale] ??
        []
      );
    },

    /** Indicates whether a field is marked hidden in persisted section metadata. */
    hidden(sectionId, key) {
      return getHiddenMap(sectionId)[key] === true;
    },
  };
}
