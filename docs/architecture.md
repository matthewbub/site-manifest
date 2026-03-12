# Architecture

## Goal

`site-manifest` formalizes a contract between:

- an editing surface that needs to know what fields exist
- a tenant/runtime layer that needs resolved labels

The package intentionally stays framework-agnostic. It is a TypeScript/JavaScript library, not a React package.

## Three Layers

### 1. JSON Schema

The JSON Schema in [`src/schema/site-manifest.schema.json`](../src/schema/site-manifest.schema.json) is the formal contract.

It is the right layer for:

- runtime validation
- CI enforcement
- interoperability across package boundaries
- future tooling such as manifest linting or codegen

### 2. TypeScript Authoring API

The TypeScript surface gives developers an ergonomic way to define manifests:

- `defineSiteManifest()`
- typed field definitions
- typed section definitions

This layer is for authoring convenience and editor support. It does not replace schema validation.

### 3. Runtime Resolver

`createLabelSet()` is the runtime access layer.

It binds:

- a manifest
- persisted labels
- a locale
- hidden metadata settings

into a small object API:

- `section()`
- `value()`
- `group()`
- `items()`
- `hidden()`

This avoids repeating ad hoc default/override merge logic in each tenant runtime or editor.

## Why The Vocabulary Is Small

The field vocabulary is intentionally limited to:

- `text`
- `textarea`
- `group`
- `repeater`

This keeps the contract generic and reusable. FAQ is modeled as a `repeater`, not as a hard-coded domain concept.

## Boundaries

This package owns:

- section definitions
- label field definitions
- locale-aware defaults
- manifest validation
- label resolution rules

This package does not own:

- React components
- visual theming
- page rendering
- media uploads
- full content document schemas

Those can be layered on later, but they are intentionally out of scope for v1.
