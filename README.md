# Searchable Select Row

A Home Assistant entities-card row for `input_select` and `select` entities
that filters the options as you type.

The built-in dropdown is fine for five options and painful for fifty. This row
replaces it with a text box: type a few letters and the list narrows to what
matches. Pick with a tap, a click, or the keyboard.

- **Matches words in any order.** `grey earl` finds *Earl Grey*.
- **Ignores case and accents.** `creme` finds *Crème Brûlée*.
- **Sensible ordering.** Options that start with what you typed come first, then
  options with a word that starts with it, then everything else.
- **Live options.** Options are read from the entity every time, so changes made
  with `input_select.set_options` (or by an integration's `select`) show up
  straight away.
- **Keyboard support.** ↑/↓ move, Enter picks, Esc closes the list. Esc does
  not close the dialog the row sits in, such as a browser_mod popup.
- **Follows your theme.** It uses Home Assistant's theme variables and no
  frontend internals, so HA updates are unlikely to break it.

## Installation

### HACS

1. HACS → ⋮ → **Custom repositories**.
2. Add `https://github.com/Otixa/searchable-select-row` with type **Dashboard**.
3. Install **Searchable Select Row**, then reload your browser.

HACS registers the dashboard resource for you.

### Manual

1. Download `searchable-select-row.js` from the
   [latest release](https://github.com/Otixa/searchable-select-row/releases/latest)
   into `config/www/`.
2. Settings → Dashboards → ⋮ → **Resources** → **Add resource**:
   - URL: `/local/searchable-select-row.js?v=1.0.0`
   - Type: **JavaScript module**
3. Reload your browser.

When you update the file, change the `?v=` on the resource too. Otherwise
browsers keep using the copy they cached.

## Usage

Use it anywhere an entity row is accepted. Most often that's an `entities` card:

```yaml
type: entities
entities:
  - type: custom:searchable-select-row
    entity: input_select.favourite_tea
```

With every option set:

```yaml
type: entities
entities:
  - type: custom:searchable-select-row
    entity: input_select.mix_part_1
    name: First tobacco
    icon: mdi:numeric-1-circle
    none_option: "—"
    placeholder: Start typing a flavour…
```

### Options

| Option        | Required | Default                        | Description |
|---------------|----------|--------------------------------|-------------|
| `entity`      | yes      |                                | An `input_select.*` or `select.*` entity. |
| `name`        | no       | the entity's friendly name     | Label shown above the text box. |
| `icon`        | no       | the entity's icon              | Any `mdi:` icon. |
| `none_option` | no       | *none*                         | An option that means "nothing chosen", such as `—` or `None`. It is left out of the list, the box shows empty while it's selected, and a **×** button appears to switch back to it. |
| `placeholder` | no       | `Type to search…`              | Hint shown in the empty text box. |

### The "nothing chosen" pattern

An `input_select` always has a value, so a picker that can be left blank
usually gets a placeholder option first, like `—`. Set `none_option` to that
option. The row then hides it from the list, shows an empty box while it's
selected, and offers a clear button to go back to it:

```yaml
- type: custom:searchable-select-row
  entity: input_select.mix_part_3
  none_option: "—"
```

## Behaviour notes

- Selecting an option calls `input_select.select_option` or
  `select.select_option`, whichever matches the entity's domain.
- Only options that exist on the entity can be chosen. Free text you typed is
  never sent to Home Assistant.
- If the entity is `unavailable`, the row is disabled. If the entity doesn't
  exist at all, the row says so instead of failing silently.
- The list opens inline and pushes the rows below it down, rather than floating
  over them. That means it isn't clipped inside cards or dialogs that hide
  overflow.

## Theming

The row reads these standard theme variables:
`--primary-color`, `--primary-text-color`, `--secondary-text-color`,
`--secondary-background-color`, `--card-background-color`, `--divider-color`,
`--state-icon-color`, `--input-fill-color`, `--input-idle-line-color`,
`--error-color`.

## Development

There is no build step. The file in the repository is the file that ships.

```sh
npm run check   # syntax check
npm test        # unit tests for matching and highlighting (Node 20+)
```

To release, bump the version in `searchable-select-row.js` (`VERSION`) and in
`package.json`, add a `## <version>` section to `CHANGELOG.md`, then push a
matching `v<version>` tag. The release workflow checks that all three agree and
attaches the file to a GitHub release.

## License

[MIT](LICENSE) © 2026 Mihail Cherkasov
