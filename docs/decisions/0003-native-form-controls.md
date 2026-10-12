# 0003: Native form controls

Status: adopted, 2026-10-12

## Decision

- Checkbox and radio are native inputs, coloured with `accent-color` and sized to the 24 by 24 pixel minimum target. Select is a native `<select>` with the field's frame and an arrow drawn in `currentColor`.
- All three follow the field contract (`label`, `input`, `hint`, `error`), so one core handler validates every field-like control. It listens on the field's root, so a radio group is checked as a whole, and only when focus leaves the group.
- Tag and Card ship no script. A removable tag's button does whatever the page decides.

## Why

Native controls bring keyboard handling, screen-reader names and form participation from the browser, on every device. A custom checkbox or listbox has to rebuild all of that and tends to get it wrong. The research behind Saral found custom selects and comboboxes to be where funded libraries still lag.
