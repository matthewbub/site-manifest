# site-manifest

Framework-agnostic manifest contract for labels and sections.

`site-manifest` gives you:

- **JSON Schema validation** — catch structural errors before they reach production
- **Typed manifest authoring** — define fields, sections, and locales with full TypeScript inference
- **Runtime label resolution** — merge persisted values with manifest defaults for a given locale

## Install

```bash
pnpm add site-manifest
```

## Mental model

- `string` = one label
- `group` = keyed labels
- `repeater` = array of structured items

## Define fields

Each label field has a `kind` that determines its shape. A `string` holds a single localised value, a `group` holds named key-value pairs, and a `repeater` holds an ordered list of structured items.

```ts
{
  key: "title",
  label: "Title",
  kind: "string",
  defaultValue: { en: "Welcome" },
}
```

```ts
{
  key: "links",
  label: "Links",
  kind: "group",
  fields: [
    { key: "home", label: "Home", defaultValue: { en: "Home" } },
    { key: "features", label: "Features", defaultValue: { en: "Features" } },
  ],
}
```

```ts
{
  key: "items",
  label: "Items",
  kind: "repeater",
  itemFields: [
    { key: "question", label: "Question", kind: "string" },
    { key: "answer", label: "Answer", kind: "string" },
  ],
}
```

## Define a manifest

`defineSiteManifest` returns the same object you pass in but preserves its literal types, giving you full autocomplete and type checking across sections and fields.

```ts
import { defineSiteManifest } from "site-manifest";

const manifest = defineSiteManifest({
  id: "example-site",
  locales: ["en"],
  sections: [
    {
      id: "hero",
      title: "Hero",
      enabledByDefault: true,
      labels: [
        {
          key: "title",
          label: "Title",
          kind: "string",
          defaultValue: { en: "Welcome" },
        },
      ],
    },
  ],
});
```

## Validate

Validate a manifest against the built-in JSON Schema (Draft 2020-12). `validateManifest` throws on the first error; use `isValidManifest` or `getManifestValidationErrors` for non-throwing alternatives.

```ts
import { validateManifest } from "site-manifest";

validateManifest(manifest);
```

## Resolve values

`createLabelSet` merges persisted label overrides with manifest defaults for a given locale, returning a resolver that caches lookups.

```ts
import { createLabelSet } from "site-manifest";

const labelSet = createLabelSet({
  manifest,
  locale: "en",
  labels: {
    en: {
      hero: {
        title: "Hello",
      },
    },
  },
});

labelSet.value("hero", "title");
// "Hello"
```

## Resolve groups and repeaters

Groups return a flat key-value object; repeaters return an array of objects keyed by each item field.

```ts
labelSet.group("navigation", "links");
// { home: "Home", features: "Features" }

labelSet.items("faq", "items");
// [{ question: "Question", answer: "Answer" }]
```

## API

| Function                                                   | Description                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
| `defineSiteManifest(manifest)`                             | Identity function that preserves literal types for authoring |
| `validateManifest(manifest)`                               | Throws if the manifest fails schema validation               |
| `isValidManifest(manifest)`                                | Type-guard that returns `true` for a valid manifest          |
| `getManifestValidationErrors(manifest)`                    | Returns an array of validation error objects                 |
| `createLabelSet({ manifest, labels, locale, hiddenKey? })` | Builds a cached locale-aware label resolver                  |
| `getSection(manifest, sectionId)`                          | Look up a section by ID                                      |
| `getField(manifest, sectionId, key)`                       | Look up a field by section and key                           |
