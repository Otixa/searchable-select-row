# Changelog

## 1.0.0

First public release.

- Entity row for `input_select` and `select` entities that filters options as
  you type.
- Every word of the query must match, in any order. Case and accents are
  ignored. Prefix matches are listed first, then matches at the start of a word.
- Matched text is highlighted, and the current value is marked with a tick.
- Keyboard support: arrow keys move, Enter picks, Esc closes the list without
  closing a surrounding dialog.
- Optional `none_option`, hidden from the list and set by a clear button.
- Options are read live from the entity, so `input_select.set_options` changes
  appear straight away.
