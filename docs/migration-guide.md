# Migration Guide

## Goal

Move from a legacy label config to:

1. a manifest
2. schema validation
3. `createLabelSet()` for runtime resolution

## Shape mapping

### Section

Before:

```ts
{ id: "hero", displayName: "Hero", labels: [...] }
```

After:

```ts
{ id: "hero", title: "Hero", enabledByDefault: true, labels: [...] }
```

### Single label

Before:

```ts
{ key: "title", defaults: { en: "Welcome" } }
```

After:

```ts
{
  key: "title",
  label: "Title",
  kind: "string",
  defaultValue: { en: "Welcome" },
}
```

### Grouped labels

Before:

```ts
{ key: "links", value: { home: "Home" } }
```

After:

```ts
{
  key: "links",
  label: "Links",
  kind: "group",
  fields: [{ key: "home", label: "Home", defaultValue: { en: "Home" } }],
}
```

### Repeatable items

Before:

```ts
{ key: "items", defaults: [{ question: "Q", answer: "A" }] }
```

After:

```ts
{
  key: "items",
  label: "Items",
  kind: "repeater",
  itemFields: [
    { key: "question", label: "Question", kind: "string" },
    { key: "answer", label: "Answer", kind: "string" },
  ],
  defaultItems: { en: [{ question: "Q", answer: "A" }] },
}
```

## Migration steps

1. Convert the old config into a manifest.
2. Validate it with `validateManifest()`.
3. Replace custom default-merging logic with `createLabelSet()`.
4. Keep persisted label storage unchanged until a separate migration is needed.
