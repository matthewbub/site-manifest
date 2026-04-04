# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-04-04

### Added

- Added first-class `image` field support to the manifest type system and runtime label resolver.
- Added `labelSet.image(sectionId, key)` for reading resolved image values.
- Added schema validation for top-level `image` fields and repeater item fields with `kind: "image"`.
- Added support for repeater items that contain mixed string and image values.
- Added examples, tests, and documentation covering image fields and image-aware repeaters.

### Changed

- Expanded repeater item typing from string-only values to support strings, image objects, and `null`.
- Updated the public docs and example manifest to reflect the new image field model.
