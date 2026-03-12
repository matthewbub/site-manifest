# Manifest Schema

## Top-Level Shape

```ts
type SiteManifest = {
  id: string;
  locales: string[];
  sections: SectionManifest[];
};
```

## Section Shape

```ts
type SectionManifest = {
  id: string;
  title: string;
  enabledByDefault: boolean;
  labels: LabelFieldDefinition[];
};
```

## Field Kinds

### `text`

Single-line label values.

```ts
{
  key: "titleLabel",
  label: "Title",
  kind: "text",
  defaultValue: {
    en: "Welcome",
    es: "Bienvenidos",
  },
}
```

### `textarea`

Multi-line label values.

```ts
{
  key: "descriptionLabel",
  label: "Description",
  kind: "textarea",
  defaultValue: {
    en: "Longer body copy",
  },
}
```

### `group`

Nested string maps such as navigation labels.

```ts
{
  key: "navLabels",
  label: "Navigation Labels",
  kind: "group",
  fields: [
    {
      key: "home",
      label: "Home",
      defaultValue: { en: "Home" },
    },
    {
      key: "faq",
      label: "FAQ",
      defaultValue: { en: "FAQ" },
    },
  ],
}
```

### `repeater`

Structured arrays of items such as FAQ entries, testimonials, or timelines.

```ts
{
  key: "faqItems",
  label: "FAQ Items",
  kind: "repeater",
  itemFields: [
    { key: "question", label: "Question", kind: "text" },
    { key: "answer", label: "Answer", kind: "textarea" },
  ],
  defaultItems: {
    en: [
      { question: "When?", answer: "At 4pm" },
    ],
  },
}
```

## Validation Rules

The JSON Schema enforces these core rules:

- `id`, `locales`, and `sections` are required at the top level
- `group` fields must include `fields`
- `repeater` fields must include `itemFields`
- `repeater.itemFields` may only use `text` or `textarea`
- unknown field kinds fail validation
- unknown top-level or section-level extra properties fail validation

## Defaulting Semantics

- text-like fields read `defaultValue[locale]`
- group children read their own `defaultValue[locale]`
- repeater fields read `defaultItems[locale]`
- missing defaults resolve as empty strings or empty arrays at runtime
