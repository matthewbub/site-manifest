export type SiteLocale = string;

export type ImageValue = {
  url: string;
  alt?: string;
  caption?: string;
  desktopPosition?: string;
  mobilePosition?: string;
};

export type RepeaterItemValue = string | ImageValue | null;

export type RepeaterItem = Record<string, RepeaterItemValue>;

export type StringFieldDefinition = {
  key: string;
  label: string;
  kind: "string";
  hideable?: boolean;
  multiline?: boolean;
  defaultValue?: Partial<Record<SiteLocale, string>>;
};

export type ImageFieldDefinition = {
  key: string;
  label: string;
  kind: "image";
  hideable?: boolean;
  withAlt?: boolean;
  withCaption?: boolean;
  defaultValue?: Partial<Record<SiteLocale, ImageValue | null>>;
};

export type GroupChildFieldDefinition = {
  key: string;
  label: string;
  defaultValue?: Partial<Record<SiteLocale, string>>;
};

export type GroupFieldDefinition = {
  key: string;
  label: string;
  kind: "group";
  fields: GroupChildFieldDefinition[];
};

export type RepeaterItemFieldDefinition = {
  key: string;
  label: string;
} & (
  | {
      kind: "string";
      multiline?: boolean;
    }
  | {
      kind: "image";
      withAlt?: boolean;
      withCaption?: boolean;
    }
);

export type RepeaterFieldDefinition = {
  key: string;
  label: string;
  kind: "repeater";
  hideable?: boolean;
  minItems?: number;
  maxItems?: number;
  itemFields: RepeaterItemFieldDefinition[];
  defaultItems?: Partial<Record<SiteLocale, RepeaterItem[]>>;
};

export type LabelFieldDefinition =
  | StringFieldDefinition
  | ImageFieldDefinition
  | GroupFieldDefinition
  | RepeaterFieldDefinition;

export type SectionManifest = {
  id: string;
  title: string;
  enabledByDefault: boolean;
  labels: LabelFieldDefinition[];
};

export type SiteManifest = {
  id: string;
  locales: SiteLocale[];
  sections: SectionManifest[];
};

export type PersistedSectionLabels = Record<string, unknown>;

export type PersistedLabels = Record<string, Record<string, PersistedSectionLabels>>;

export type LabelSet = {
  section(sectionId: string): Record<string, unknown>;
  value(sectionId: string, key: string): string;
  image(sectionId: string, key: string): ImageValue | null;
  group(sectionId: string, key: string): Record<string, string>;
  items(sectionId: string, key: string): RepeaterItem[];
  hidden(sectionId: string, key: string): boolean;
};
