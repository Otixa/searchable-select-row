# Searchable Select Row

An entities-card row for Home Assistant that replaces the `input_select` / `select` dropdown with a searchable text field.

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE)
[![HACS][hacs-shield]][hacs]
[![Validate][validate-shield]][validate]
[![Buy Me a Coffee][bmac-shield]][bmac]

![Searchable Select Row][screenshot]

---

## Overview

The standard select row becomes difficult to use once an entity has more than a handful of options. This row keeps the same place in an entities card but lets the user type to narrow the list, then pick with a tap, a click, or the keyboard. The selected option is applied with `input_select.select_option` or `select.select_option`.

Typical uses:

- Selects with dozens of options, such as media sources, scenes, recipes or inventory items
- Options with long or similar names
- Pickers inside popups (for example browser_mod), where a long native dropdown is awkward on touch screens

Features:

- Multi-word matching in any order (`grey earl` matches *Earl Grey*)
- Case- and accent-insensitive matching (`creme` matches *Crème Brûlée*)
- Ranked results: prefix matches first, then word-start matches, then substring matches
- Matched text highlighted, current value marked
- Keyboard navigation: ↑ / ↓ to move, Enter to select, Esc to close the list without closing a surrounding dialog
- Optional "nothing selected" option with a clear button
- Options read live from the entity, so changes from `input_select.set_options` or an integration appear immediately
- Styled entirely with Home Assistant theme variables; no dependency on Home Assistant frontend internals
- No build step and no runtime dependencies

---

## Installation

### HACS (recommended)

The row is not yet in the default HACS store. Add it as a custom repository:

1. Open HACS in Home Assistant.
2. Open the menu (⋮) → **Custom repositories**.
3. Enter `https://github.com/Otixa/searchable-select-row`, select type **Dashboard**, and click **Add**.
4. Search for **Searchable Select Row** and click **Download**.
5. Reload the browser.

HACS registers the dashboard resource automatically.

### Manual

1. Download `searchable-select-row.js` from the [latest release][releases].
2. Copy it to `<config>/www/searchable-select-row.js`.
3. Add a dashboard resource, either in **Settings → Dashboards → ⋮ → Resources** (type **JavaScript module**) or in YAML:

```yaml
resources:
  - url: /local/searchable-select-row.js?v=1.0.0
    type: module
```

4. Reload the browser.

Change the `?v=` value whenever the file is updated so that browsers do not keep a cached copy.

---

## Configuration

The row is used inside an `entities` card, or anywhere else that accepts entity rows. Configuration is YAML-only; the entities card editor does not expose options for custom rows.

### Minimal example

```yaml
type: entities
entities:
  - type: custom:searchable-select-row
    entity: input_select.tea
```

### Full example

```yaml
type: entities
title: Evening tea
entities:
  - type: custom:searchable-select-row
    entity: input_select.tea
    name: Tea
    icon: mdi:tea
    placeholder: Search teas…
  - type: custom:searchable-select-row
    entity: input_select.sweetener
    none_option: "—"
```

---

## Options

| Name          | Type   | Required     | Description                                                                 | Default              |
| ------------- | ------ | ------------ | --------------------------------------------------------------------------- | -------------------- |
| `type`        | string | **Required** | `custom:searchable-select-row`                                              |                      |
| `entity`      | string | **Required** | An `input_select.*` or `select.*` entity ID                                 |                      |
| `name`        | string | **Optional** | Label shown above the field                                                 | Entity friendly name |
| `icon`        | string | **Optional** | MDI icon (e.g. `mdi:tea`)                                                   | Entity icon          |
| `none_option` | string | **Optional** | Option that represents "nothing selected". See below.                      | `none`               |
| `placeholder` | string | **Optional** | Hint text shown in an empty field                                           | `Type to search…`    |

### `none_option`

An `input_select` always has a value, so selects that may be left empty usually include a placeholder option such as `—` or `None`. When `none_option` names that option:

- it is excluded from the list;
- the field is shown empty while it is selected;
- a clear (×) button appears while any other option is selected, and selects `none_option` when pressed.

The clear button is only shown if the entity's options actually contain `none_option`.

---

## Behaviour

- Only options that exist on the entity can be selected. Typed text is used for filtering and is never sent to Home Assistant.
- The list opens inline and pushes the rows below it down, rather than floating above them. This avoids clipping inside cards and dialogs that hide overflow.
- If the entity is `unavailable`, the row is disabled. If the entity does not exist, the row displays an error label.

### Theming

The row reads these standard theme variables:

| Variable                        | Used for                                  |
| ------------------------------- | ----------------------------------------- |
| `--primary-color`               | Focus underline, label, highlights, tick  |
| `--primary-text-color`          | Field and option text                     |
| `--secondary-text-color`        | Label, placeholder, buttons               |
| `--secondary-background-color`  | Field background fallback, button hover   |
| `--input-fill-color`            | Field background                          |
| `--input-idle-line-color`       | Field underline                           |
| `--card-background-color`       | List background                           |
| `--divider-color`               | List border                               |
| `--state-icon-color`            | Row icon                                  |
| `--error-color`                 | Missing-entity label                      |

---

## Developer Guide

### Prerequisites

| Tool    | Minimum version | Notes                         |
| ------- | --------------- | ----------------------------- |
| Node.js | 20              | Tests only; nothing is built  |

The file in the repository root is the file that ships. There are no dependencies to install.

### Available scripts

| Command         | Description                                              |
| --------------- | -------------------------------------------------------- |
| `npm run check` | Syntax-check `searchable-select-row.js`                  |
| `npm test`      | Run the unit tests for matching and highlighting         |

### Project structure

```
searchable-select-row.js   # The row element and its pure matching helpers
test/                      # node:test unit tests
demo/index.html            # Standalone demo with a stub hass object
assets/                    # README images
```

### Demo

`demo/index.html` renders the row with a stub `hass` object and Home Assistant's default dark theme values. Serve the repository root over HTTP and open `/demo/index.html`; append `?state=open` to render the list open, as in the screenshot.

```bash
python -m http.server 8765
# http://127.0.0.1:8765/demo/index.html?state=open
```

### Releasing

1. Update `VERSION` in `searchable-select-row.js` and `version` in `package.json`.
2. Add a section for the version to `CHANGELOG.md`.
3. Push a tag `v<version>`.

The release workflow validates the tag, checks that the three versions agree, runs the tests, and publishes a GitHub release with `searchable-select-row.js` attached.

### Contributing

1. Fork the repository and create a branch from `main`.
2. Run `npm run check` and `npm test` before opening a pull request.
3. Keep pull requests focused on a single change.

---

## Troubleshooting

**Row shows as a red error card, or `Custom element doesn't exist: searchable-select-row`**
The resource is not loaded. Check that it is listed under dashboard resources as a JavaScript module, then clear the browser cache or hard-reload (`Ctrl+Shift+R` / `Cmd+Shift+R`).

**An older version is still shown after updating**
The browser is using a cached copy. For manual installs, change the `?v=` value on the resource. For HACS installs, reload the browser after the download completes.

**`entity must be an input_select or select`**
The row only supports those two domains.

**General dashboard plugin troubleshooting**
See the [thomasloven wiki][troubleshooting].

---

## Support

Bug reports and feature requests are handled through [GitHub issues][issues].

If this project is useful to you, you can support its development:

<a href="https://buymeacoffee.com/otixa"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" width="180"></a>

---

## License

Released under the [MIT License](LICENSE).

<!-- References -->

[screenshot]: https://raw.githubusercontent.com/Otixa/searchable-select-row/main/assets/screenshot.png
[releases-shield]: https://img.shields.io/github/release/Otixa/searchable-select-row.svg?style=for-the-badge
[releases]: https://github.com/Otixa/searchable-select-row/releases
[license-shield]: https://img.shields.io/github/license/Otixa/searchable-select-row.svg?style=for-the-badge
[hacs-shield]: https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge
[hacs]: https://hacs.xyz
[validate-shield]: https://img.shields.io/github/actions/workflow/status/Otixa/searchable-select-row/validate.yml?branch=main&style=for-the-badge&label=validate
[validate]: https://github.com/Otixa/searchable-select-row/actions/workflows/validate.yml
[bmac-shield]: https://img.shields.io/badge/buy%20me%20a%20coffee-support-ffdd00.svg?style=for-the-badge&logo=buymeacoffee&logoColor=black
[bmac]: https://buymeacoffee.com/otixa
[issues]: https://github.com/Otixa/searchable-select-row/issues
[troubleshooting]: https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins
