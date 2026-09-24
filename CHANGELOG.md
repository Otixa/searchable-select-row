# Changelog

All notable changes to this project are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/).

## [1.0.1](https://github.com/Otixa/searchable-select-row/compare/v1.0.0...v1.0.1) (2026-09-24)

No functional changes.

### Documentation

- README restructured, with a screenshot, configuration examples, a theming reference and troubleshooting.
- Added a contributing guide, issue forms, a pull request template and funding information.

### Code

- The accent-stripping pattern is written with `\u` escapes instead of literal combining characters. Behaviour is unchanged.

### Build

- HACS validation runs with every check enabled.
- The release workflow validates that the tag is a semantic version.

## [1.0.0](https://github.com/Otixa/searchable-select-row/releases/tag/v1.0.0) (2026-09-24)

Initial release.

### Features

- Entity row for `input_select` and `select` entities that filters options as the user types.
- Multi-word matching in any order, ignoring case and accents; prefix matches ranked first, then word-start matches.
- Matched text highlighted; current value marked.
- Keyboard navigation: arrow keys, Enter to select, Esc to close the list without closing a surrounding dialog.
- Optional `none_option`, excluded from the list and selected by a clear button.
- Options read live from the entity.
