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

Arguments:

- `manifest`: validated site manifest
- `labels`: persisted label overrides grouped by locale and section
- `locale`: active locale
- `hiddenKey`: optional metadata key for hidden label state

Default `hiddenKey`:

```ts
"_hidden"
```

## Return Shape

```ts
type LabelSet = {
  section(sectionId: string): Record<string, unknown>;
  value(sectionId: string, key: string): string;
  group(sectionId: string, key: string): Record<string, string>;
  items(sectionId: string, key: string): Array<Record<string, string>>;
  hidden(sectionId: string, key: string): boolean;
};
```

## Resolution Rules

### `section(sectionId)`

Returns the resolved label object for one section.

Behavior:

- resolves defaults from the manifest
- overlays non-empty persisted string overrides
- overlays group child overrides over group defaults
- does not include repeater values directly in the returned section object

### `value(sectionId, key)`

Returns a single string field.

Behavior:

- intended for `string` fields
- returns `""` for unknown sections, unknown keys, or non-string values

### `group(sectionId, key)`

Returns a string map for a `group` field.

Behavior:

- merges child defaults with child overrides
- ignores blank string overrides
- returns `{}` for missing or non-group fields

### `items(sectionId, key)`

Returns structured repeater items.

Behavior:

- reads persisted JSON string overrides when present
- accepts array values if the caller already parsed them
- falls back to manifest defaults when parsing fails
- returns `[]` for unknown sections or non-repeater fields

### `hidden(sectionId, key)`

Resolves hidden metadata for a field.

Behavior:

- reads from `labels[locale][sectionId][hiddenKey]`
- accepts a JSON string or plain object map
- only `true` is treated as hidden
- invalid metadata falls back to `false`

## Override Precedence

Precedence is:

1. valid non-empty persisted overrides
2. manifest defaults
3. empty value fallback

Blank string overrides do not replace defaults in v1.
