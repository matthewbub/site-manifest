# Migration Guide

## Goal

Move from a theme-specific label registry to a shared manifest contract without changing persisted label storage up front.

## Current Registry Pattern

Many existing systems use a shape like:

- section ids
- label definitions
- locale defaults
- special-case helpers for grouped labels or FAQ defaults

That typically spreads logic across:

- registry config
- editor rendering logic
- runtime default-merging logic

## Target Pattern

Replace that with:

1. a single manifest definition
2. schema validation
3. `createLabelSet()` for runtime resolution

## Mapping Guide

### Registry section

Old:

```ts
{
  id: "faq",
  displayName: "FAQ",
  labels: [...]
}
```

New:

```ts
{
  id: "faq",
  title: "FAQ",
  enabledByDefault: true,
  labels: [...]
}
```

### Text field

Old:

```ts
{
  key: "titleLabel",
  displayName: "Title",
  defaults: {
    en: "FAQ",
    es: "Preguntas",
  },
}
```

New:

```ts
{
  key: "titleLabel",
  label: "Title",
  kind: "text",
  defaultValue: {
    en: "FAQ",
    es: "Preguntas",
  },
}
```

### FAQ items

Old:

```ts
{
  key: "faqItems",
  type: "faqItems",
  faqDefaults: {
    en: [...],
    es: [...],
  },
}
```

New:

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
    en: [...],
    es: [...],
  },
}
```

### Nav labels

Old:

- special `navLabels` object merging

New:

```ts
{
  key: "navLabels",
  label: "Navigation Labels",
  kind: "group",
  fields: [
    { key: "home", label: "Home", defaultValue: { en: "Home" } },
    { key: "faq", label: "FAQ", defaultValue: { en: "FAQ" } },
  ],
}
```

## Migration Steps

1. Convert the existing registry data into a manifest file.
2. Validate the new manifest with `validateManifest()`.
3. Replace default lookup helpers with `createLabelSet()`.
4. Update the editor to render by `kind` instead of registry-specific switch logic.
5. Keep persisted labels unchanged until a later phase.

## What Does Not Need To Change Yet

- tenant site rendering components
- React architecture
- persisted label storage shape
- media/content modeling
