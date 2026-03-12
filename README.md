# site-manifest

Framework-agnostic site manifest contract for labels and sections.

`site-manifest` gives you:

- a JSON Schema-backed manifest format
- a typed `defineSiteManifest()` authoring API
- a runtime `createLabelSet()` resolver for defaults + overrides

## Install

```bash
pnpm add site-manifest
```

## Define a simple manifest

```ts
import { defineSiteManifest } from "site-manifest";

const manifest = defineSiteManifest({
  id: "marketing-site",
  locales: ["en"],
  sections: [
    {
      id: "hero",
      title: "Hero",
      enabledByDefault: true,
      labels: [
        {
          key: "titleLabel",
          label: "Title",
          kind: "text",
          defaultValue: {
            en: "Welcome to our site",
          },
        },
        {
          key: "descriptionLabel",
          label: "Description",
          kind: "textarea",
          defaultValue: {
            en: "Built with a schema-backed contract.",
          },
        },
      ],
    },
  ],
});
```

## Define a repeater-backed FAQ section

```ts
import { defineSiteManifest } from "site-manifest";

const manifest = defineSiteManifest({
  id: "wedding",
  locales: ["en", "es"],
  sections: [
    {
      id: "faq",
      title: "FAQ",
      enabledByDefault: true,
      labels: [
        {
          key: "titleLabel",
          label: "Title",
          kind: "text",
          defaultValue: {
            en: "FAQ",
            es: "Preguntas",
          },
        },
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
              {
                question: "When should I arrive?",
                answer: "Please arrive by 4pm.",
              },
            ],
          },
        },
      ],
    },
  ],
});
```

## Validate a manifest

```ts
import { validateManifest } from "site-manifest";

validateManifest(manifest);
```

## Create a label set from manifest + persisted labels

```ts
import {
  createLabelSet,
  defineSiteManifest,
  validateManifest,
} from "site-manifest";

const manifest = defineSiteManifest({
  id: "wedding",
  locales: ["en", "es"],
  sections: [
    {
      id: "faq",
      title: "FAQ",
      enabledByDefault: true,
      labels: [
        {
          key: "titleLabel",
          label: "Title",
          kind: "text",
          defaultValue: {
            en: "FAQ",
            es: "Preguntas",
          },
        },
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
              {
                question: "When should I arrive?",
                answer: "Please arrive by 4pm.",
              },
            ],
          },
        },
      ],
    },
    {
      id: "stickyNav",
      title: "Sticky Navigation",
      enabledByDefault: true,
      labels: [
        {
          key: "navLabels",
          label: "Navigation Labels",
          kind: "group",
          fields: [
            {
              key: "home",
              label: "Home",
              defaultValue: { en: "Home", es: "Inicio" },
            },
            {
              key: "faq",
              label: "FAQ",
              defaultValue: { en: "FAQ", es: "Preguntas" },
            },
          ],
        },
      ],
    },
  ],
});

validateManifest(manifest);

const labelSet = createLabelSet({
  manifest,
  locale: "en",
  labels: {
    en: {
      faq: {
        titleLabel: "Questions",
        faqItems: JSON.stringify([
          {
            question: "Where should I park?",
            answer: "Use the north lot.",
          },
        ]),
      },
      stickyNav: {
        navLabels: {
          faq: "Questions",
        },
      },
    },
  },
});
```

## Read section labels

```ts
const faqSection = labelSet.section("faq");
```

## Read one value

```ts
const faqTitle = labelSet.value("faq", "titleLabel");
// "Questions"
```

## Read one group

```ts
const navLabels = labelSet.group("stickyNav", "navLabels");
// { home: "Home", faq: "Questions" }
```

## Read one repeater

```ts
const faqItems = labelSet.items("faq", "faqItems");
// [{ question: "Where should I park?", answer: "Use the north lot." }]
```

## Hidden label metadata

```ts
const hiddenLabelSet = createLabelSet({
  manifest,
  locale: "en",
  labels: {
    en: {
      faq: {
        _hidden: JSON.stringify({
          titleLabel: true,
        }),
      },
    },
  },
});

hiddenLabelSet.hidden("faq", "titleLabel");
// true
```

## API

- `defineSiteManifest(manifest)`
- `validateManifest(manifest)`
- `isValidManifest(manifest)`
- `getManifestValidationErrors(manifest)`
- `createLabelSet({ manifest, labels, locale, hiddenKey? })`
- `getSection(manifest, sectionId)`
- `getField(manifest, sectionId, key)`

## Documentation

- [`docs/architecture.md`](./docs/architecture.md)
- [`docs/manifest-schema.md`](./docs/manifest-schema.md)
- [`docs/runtime-api.md`](./docs/runtime-api.md)
- [`docs/migration-guide.md`](./docs/migration-guide.md)
