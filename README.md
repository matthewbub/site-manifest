# site-manifest

Framework-agnostic manifest contract for labels and sections.

`site-manifest` gives you:

- JSON Schema validation
- typed manifest authoring
- runtime label resolution

## Install

```bash
pnpm add site-manifest
```

## Mental model

- `string` = one label
- `group` = keyed labels
- `repeater` = array of structured items

`input: "text" | "textarea"` is optional editor metadata for `string` fields.

## Define fields

```ts
{
  key: "title",
  label: "Title",
  kind: "string",
  input: "text",
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
    { key: "question", label: "Question", kind: "string", input: "text" },
    { key: "answer", label: "Answer", kind: "string", input: "textarea" },
  ],
}
```

## Define a small manifest

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

```ts
import { validateManifest } from "site-manifest";

validateManifest(manifest);
```

## Resolve values

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

```ts
labelSet.group("navigation", "links");
// { home: "Home", features: "Features" }

labelSet.items("faq", "items");
// [{ question: "Question", answer: "Answer" }]
```

## API

- `defineSiteManifest(manifest)`
- `validateManifest(manifest)`
- `isValidManifest(manifest)`
- `getManifestValidationErrors(manifest)`
- `createLabelSet({ manifest, labels, locale, hiddenKey? })`
- `getSection(manifest, sectionId)`
- `getField(manifest, sectionId, key)`
