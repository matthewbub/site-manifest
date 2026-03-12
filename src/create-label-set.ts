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

function isStringRecord(value: unknown): value is Record<string, string> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function toNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined;
}

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

function getSectionOverrides(
  labels: PersistedLabels,
  locale: SiteLocale,
  sectionId: string,
): PersistedSectionLabels {
  return labels[locale]?.[sectionId] ?? {};
}

export function createLabelSet({
  manifest,
  labels,
  locale,
  hiddenKey = "_hidden",
}: CreateLabelSetArgs): LabelSet {
  const sectionCache = new Map<string, Record<string, unknown>>();
  const hiddenCache = new Map<string, Record<string, boolean>>();

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
    section(sectionId) {
      return getResolvedSection(sectionId);
    },

    value(sectionId, key) {
      const rawValue = getResolvedSection(sectionId)[key];
      return typeof rawValue === "string" ? rawValue : "";
    },

    group(sectionId, key) {
      const rawValue = getResolvedSection(sectionId)[key];
      return isStringRecord(rawValue) ? rawValue : {};
    },

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

    hidden(sectionId, key) {
      return getHiddenMap(sectionId)[key] === true;
    },
  };
}
