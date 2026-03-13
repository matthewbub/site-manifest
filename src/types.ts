export type SiteLocale = string;

export type RepeaterItem = Record<string, string>;

export type StringFieldInput = "text" | "textarea";

export type StringFieldDefinition = {
  key: string;
  label: string;
  kind: "string";
  hideable?: boolean;
  input?: StringFieldInput;
  defaultValue?: Partial<Record<SiteLocale, string>>;
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
  kind: "string";
  input?: StringFieldInput;
};

export type RepeaterFieldDefinition = {
  key: string;
  label: string;
  kind: "repeater";
  hideable?: boolean;
  itemFields: RepeaterItemFieldDefinition[];
  defaultItems?: Partial<Record<SiteLocale, RepeaterItem[]>>;
};

export type LabelFieldDefinition =
  | StringFieldDefinition
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
  group(sectionId: string, key: string): Record<string, string>;
  items(sectionId: string, key: string): RepeaterItem[];
  hidden(sectionId: string, key: string): boolean;
};
