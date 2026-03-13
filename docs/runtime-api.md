# Runtime API

## `createLabelSet()`

```ts
createLabelSet({
  manifest,
  labels,
  locale,
  hiddenKey,
});
```

## Return shape

```ts
type LabelSet = {
  section(sectionId: string): Record<string, unknown>;
  value(sectionId: string, key: string): string;
  group(sectionId: string, key: string): Record<string, string>;
  items(sectionId: string, key: string): Array<Record<string, string>>;
  hidden(sectionId: string, key: string): boolean;
};
```

## Quick behavior

### `value()`

```ts
labelSet.value("hero", "title");
// "Welcome"
```

Returns `""` for missing or non-string fields.

### `group()`

```ts
labelSet.group("navigation", "links");
// { home: "Home", features: "Features" }
```

Returns `{}` for missing or non-group fields.

### `items()`

```ts
labelSet.items("faq", "items");
// [{ question: "Question", answer: "Answer" }]
```

Reads persisted JSON string overrides when present and falls back to manifest defaults.

### `hidden()`

```ts
labelSet.hidden("hero", "title");
// false
```

Reads hidden metadata from `labels[locale][sectionId][hiddenKey]`.

## Precedence

1. valid non-empty persisted overrides
2. manifest defaults
3. empty fallback

Blank string overrides do not replace defaults.
