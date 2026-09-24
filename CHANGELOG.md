# Changelog

All notable changes to this project are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/).

## [1.0.0](https://github.com/Otixa/searchable-select-row/releases/tag/v1.0.0) (2026-09-24)

Initial release.

### Features

- Entity row for `input_select` and `select` entities that filters options as the user types.
- Multi-word matching in any order, ignoring case and accents; prefix matches ranked first, then word-start matches.
- Matched text highlighted; current value marked.
- Keyboard navigation: arrow keys, Enter to select, Esc to close the list without closing a surrounding dialog.
- Optional `none_option`, excluded from the list and selected by a clear button.
- Options read live from the entity.
