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

### `string`

String values such as titles, subtitles, descriptions, and CTA labels.

```ts
{
  key: "descriptionLabel",
  label: "Description",
  kind: "string",
  defaultValue: {
    en: "Longer body copy",
  },
}
```

### `image`

Media objects such as hero images, story photos, gallery items, or team member portraits.

```ts
{
  key: "heroImage",
  label: "Hero Image",
  kind: "image",
  withAlt: true,
  withCaption: true,
  defaultValue: {
    en: {
      url: "https://example.com/hero.jpg",
      alt: "Couple portrait",
      caption: "Summer engagement session",
      desktopPosition: "center",
      mobilePosition: "top",
    },
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
    { key: "image", label: "Image", kind: "image", withAlt: true },
    { key: "caption", label: "Caption", kind: "string" },
  ],
  defaultItems: {
    en: [
      {
        image: { url: "https://example.com/photo.jpg", alt: "Gallery image" },
        caption: "At sunset",
      },
    ],
  },
}
```

## Validation Rules

The JSON Schema enforces these core rules:

- `id`, `locales`, and `sections` are required at the top level
- `string` fields may include `defaultValue`
- `image` fields may include `defaultValue`
- `group` fields must include `fields`
- `repeater` fields must include `itemFields`
- `repeater.itemFields` may use `kind: "string"` or `kind: "image"`
- unknown field kinds fail validation
- legacy `text` and `textarea` kinds fail validation
- unknown top-level or section-level extra properties fail validation

## Defaulting Semantics

- `string` fields read `defaultValue[locale]`
- `image` fields read `defaultValue[locale]`
- group children read their own `defaultValue[locale]`
- repeater fields read `defaultItems[locale]`
- missing defaults resolve as empty strings, `null`, or empty arrays at runtime
