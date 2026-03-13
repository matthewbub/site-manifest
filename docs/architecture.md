# Architecture

## Purpose

`site-manifest` is a small contract layer between:

- an editor that needs to know what fields exist
- a runtime that needs resolved values

It is framework-agnostic and owns only manifest structure, validation, and value resolution.

## Three layers

### JSON Schema

Formal validation for manifests.

### TypeScript authoring

`defineSiteManifest()` gives a typed authoring surface.

### Runtime resolver

`createLabelSet()` merges:

- manifest defaults
- persisted overrides
- locale
- hidden metadata

## Core vocabulary

- `string`
- `group`
- `repeater`

## Out of scope

- React components
- rendering systems
- media/content models
- tenant-specific business logic
