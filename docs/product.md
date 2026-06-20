# Timeline Studio Product Notes

## Purpose

Timeline Studio lets a user create a personal horizontal timeline with events, periods, marker dates, annotation notes, text notes, and named lines. The timeline can be panned, zoomed, saved, loaded, and exported.

## Core Concepts

### Timeline

A horizontal date-based canvas. Time flows left to right.

### Line

A named horizontal lane used to group related items, such as School, Home, Work, Family, or Notes.
Lines can be reordered from the editor or directly from the timeline labels. Items assigned to a line move with that line.
Removing a line removes the items assigned to that line and shifts lower lines upward after confirmation.

### Event

A point-in-time item with a title, date, optional description, and assigned line. Event markers should be visually distinct from flat text and grid lines.

### Marker

A point-in-time item that draws a vertical line through every timeline line, such as a birthdate or other global reference date.

### Birth

A point-in-time item for a person's birthdate. It draws a prominent vertical line through every timeline line and acts as the source date for age calculations.
Its label should prefer the left side of the vertical line to avoid overlapping later timeline items.

### Note

A point-in-time annotation with a straight leader arrow pointing to a date and a balloon below all timeline lines. A note does not require a date range.

### Period

A date range with a start date and end date. Period bars should read as colored timeline sections with a soft background treatment.

### Item Color

Items store a hex color in timeline JSON. The editor should provide a curated preset palette for fast selection and keep custom color input available for arbitrary colors.
New items should start with a random color from the preset palette so adjacent created items are easier to distinguish.
The preset palette should include a broad range of modern readable colors, including neutrals, without requiring an external color picker dependency.

### Text Item

A freeform note attached to the timeline.

### Lock State

When items are locked, dragging the canvas should pan the timeline and should not accidentally move items.

### Item Commands

Selected timeline items can be copied, pasted, duplicated, and deleted from the timeline context menu or keyboard shortcuts.
Copy and paste use an in-app item clipboard. Pasted items should receive a new ID and should preserve the copied item's type, color, dates, notes, and display settings unless a timeline click location supplies a new start date or lane.

## Date Behavior

- Gregorian ISO dates are the internal source of truth.
- Timeline labels may show Iranian dates in English letters and numbers.
- Saved data should preserve exact dates.
- The timeline should support year, month, and day precision.
- The app should not show `AD` after Gregorian date labels.
- Age and duration text should be calculated live from saved Gregorian dates, not stored as generated text.
- A birth item is the source date for age calculations. If multiple birth items exist, the earliest birth item is used.

## Data Behavior

- The app starts with empty data.
- Personal timeline data should be created by the user or loaded from a file.
- The project should not include personal sample data as default app state.
- JSON is the primary save/load format.
- During the modern web app migration, local JSON load/edit/save behavior should remain available.
- When browser support allows a writable file handle, loading or saving a JSON file should make that file the current save target.
- When no writable file handle is available, saving should download a JSON copy instead of silently claiming direct file access.
- The app should show whether the current timeline has unsaved edits.
- `Ctrl+S` on Windows/Linux and `Command+S` on macOS should save the current timeline instead of opening the browser page-save flow.
- Period item display preferences for age and duration labels should be saved, but the calculated label text should remain derived.
- In the planned account-based app, signed-in users should be able to store private timeline data in cloud storage.
- Cloud storage should not replace JSON import/export; JSON remains the portable user-owned format.

## Account And Cloud Behavior

- Account sign-in is planned for a later slice, not the initial framework migration.
- Firebase Authentication is the planned sign-in provider.
- Firestore is the planned primary backend database for signed-in user timelines.
- Google Drive may be added later as an optional import/export or backup path, not as the primary database.

## Theme Behavior

- The app should support both light and dark system color schemes.
- The user should be able to choose System, Light, or Dark theme from the app UI.
- The chosen theme preference should be remembered in the browser.
- The visual theme should use accessible contrast for text, controls, timeline labels, and canvas grid details.
- Theme changes should not alter saved timeline data.

## Layout Behavior

- The timeline editor sidebar should be collapsible.
- The timeline action toolbar should be collapsible.
- The timeline editor sidebar should stay on the left side of the workspace on wider screens.
- The timeline action toolbar should stay near the top of the timeline stage.
- The current timeline title, date range, and Fit action should stay in the main app header.
- The timeline action toolbar should not duplicate the timeline title or date range.
- Timeline action buttons should use recognizable icons with short labels.
- Timeline action icons should use distinct accent color treatment while preserving text contrast.
- Create-item actions should be grouped separately from file and export actions.
- Item locking should be an icon toggle near toolbar controls instead of a checkbox mixed into create-item actions.
- Zoom controls should use recognizable icon buttons and should not allow the timeline to zoom out below the readable minimum.
- Collapse and expand controls should use panel-specific recognizable icon buttons rather than text characters or generic arrows.
- Collapse and expand transitions should be animated.
- The timeline viewport height should fit the rendered axis, lines, and note area instead of stretching to fill unused workspace height.
- Empty timelines should show a clear centered empty state instead of a visually unbalanced blank canvas.
- Timeline axis date labels should stack, simplify, or skip month and day labels when spacing is tight so date text does not overlap.
- Layout preferences should be remembered in the browser.
- Layout changes should not alter saved timeline data.

## Acceptance Scenarios

### Start Empty

Given the user opens the app for the first time
When no timeline file has been loaded
Then the timeline starts empty
And no personal sample data is displayed.

### Show Empty Timeline State

Given the timeline has no items
When the timeline renders
Then the empty canvas shows a clear centered empty state
And the timeline grid is not visually stretched or pushed to one side.

### Create An Event

Given an empty timeline
When the user creates an event on `2001-03-04`
Then the event appears at the correct date position
And it is still present after save/load.

### Distinguish Events Visually

Given a timeline has an event
When the event is rendered on the timeline
Then the event marker has a beveled or glass-like treatment
And the marker remains readable against the timeline canvas.

### Create A Marker

Given a timeline has multiple lines
When the user creates a marker on `2001-03-04`
Then a vertical line appears at the correct date position across all visible lines
And the marker is still present after save/load.

### Create A Birthdate

Given a timeline has multiple lines
When the user creates a birth item on `2001-03-04`
Then a prominent vertical line appears at the correct date position across all visible lines
And the birth label appears to the left of the vertical line when there is room
And the birth item is still present after save/load.

### Show Timeline Context

Given a timeline has a birth item on `2001-03-04`
When the user hovers over a date on the timeline
Then the app shows the hovered Gregorian date, Iranian date, and age calculated from the birth item in a stable info panel below the timeline
And updating the hover context does not move the timeline viewport
When the user selects a timeline item
Then the same panel shows the item type, title, Gregorian and Iranian date details, duration when the item has an end date, and age context when a birth item exists
And selection details are split across readable labeled lines instead of one dense sentence
And the calculated age text is not saved into the timeline JSON.

### Fit Timeline Height To Lines

Given the timeline has named lines
When the timeline renders
Then the viewport height fits the axis, visible lines, footer spacing, and note area when notes exist
And the viewport does not stretch vertically just because the workspace has extra height.

### Avoid Axis Label Collisions

Given the timeline spans many months
When the zoom level does not leave enough space for every full month label
Then the app stacks Gregorian and Iranian month names when there is room
And it simplifies or skips month labels when needed
And day labels are skipped when there is not enough horizontal room
And visible axis labels do not overlap.

### Create A Note

Given a timeline has a line with events
When the user creates a note on `2001-03-04`
Then a leader arrow points to the correct date position
And a balloon below all timeline lines displays the note title
And the note is still present after save/load.

### Create A Period

Given a timeline with a School line
When the user creates a period from `1998-09-01` to `2001-06-30`
Then the period spans that range horizontally.

### Distinguish Periods Visually

Given a timeline has a period
When the period is rendered on the timeline
Then the period bar uses a soft colored background with a light shadow
And the period keeps a moderate corner radius rather than becoming a fully rounded pill.

### Show Period Age And Duration Labels

Given a timeline has a birth item and a wide period item
When the period item renders with age and duration labels enabled
Then the period can show age at the start, age at the end, and period duration
And those values are calculated from the saved dates.

### Snap Items On Same Line

Given two range items are on the same line
When the user drags or resizes one item close to the other item's edge
Then the moving edge snaps to the nearby item edge
And range items on the same line do not overlap after the drag.

### Choose Item Color

Given a timeline item is selected
When the user picks a preset color swatch
Then the item updates to that color
And the selected swatch is visibly active
And the user can still choose a custom color.

### Assign New Item Palette Color

Given the user creates a new timeline item
When the item is added
Then its initial color is selected from the preset palette.

### Use Expanded Color Palette

Given an item is selected
When the editor renders the color presets
Then the user can choose from at least 18 preset colors
And the presets include warm, cool, accent, and neutral choices.

### Use Icon Toolbar

Given the timeline action toolbar is visible
When the user reviews available actions
Then create-item buttons show icons with short labels
And toolbar icons use distinct accent colors
And create, file, and export groups have visible titles and separators
And item locking is available as a lock/unlock icon toggle outside the create-item button group.

### Use Timeline Context Menu

Given a timeline item exists
When the user opens the context menu on the item
Then the app selects that item
And the menu offers Copy, Paste, Duplicate, Lock Items or Unlock Items, and Delete
And unavailable commands are disabled.

### Use Context Menu Zoom Commands

Given the user opens the timeline context menu
When the menu appears
Then Zoom in, Zoom out, and Fit commands are available with recognizable icons
And zoom out respects the readable minimum zoom.

### Use Timeline Command Shortcuts

Given a timeline item is selected
When the user presses `Ctrl+C` or `Command+C`
Then the item is copied to the app clipboard
When the user presses `Ctrl+V` or `Command+V`
Then a pasted copy is added with a new ID
When the user presses `Ctrl+D` or `Command+D`
Then the selected item is duplicated
When the user presses `Delete` or `Backspace`
Then the app asks before deleting the selected item
When the user presses `Ctrl+Shift+L` or `Command+Shift+L`
Then item locking toggles
And command shortcuts do not run while the user is typing in an editor field.

### Use Zoom Shortcuts

Given focus is not inside an editor field
When the user presses `+` or `-`
Then the timeline zooms in or out
And zoom out stops at the readable minimum.

### Rename A Line

Given a timeline line exists
When the user renames the line
Then the new name is shown on the timeline
And the name is preserved after save/load.

### Reorder Lines

Given a timeline has multiple named lines with items on them
When the user drags a line above or below another line in the editor or from the timeline label
Then the visible line order changes
And the items assigned to that line move with it
And the new line order is preserved after save/load.

### Remove A Line

Given a timeline has more than one line
When the user removes a line and confirms the destructive action
Then that line is removed
And items assigned to that line are removed
And lower lines shift up without leaving empty lane gaps.

### Lock Items

Given timeline items are locked
When the user click-drags the timeline
Then the canvas pans
And no item changes date or line.

### Zoom To Days

Given the user zooms into a timeline
When the zoom level is high enough for day-level detail
Then day ticks or day labels are visible.

### Keep Zoom Readable

Given the user repeatedly zooms out
When the readable minimum zoom is reached
Then the app stops zooming out
And axis labels and timeline items remain readable.

### Fit Timeline

Given the timeline contains items across a date range
When the user clicks Fit
Then the visible viewport adjusts to show the full timeline range when that can be done at a readable zoom
And long timelines do not zoom out below the readable Fit minimum
And the viewport resets to the beginning of the timeline when the full range cannot fit readably.

### Save And Load Timeline

Given the user has created timeline data
When the user saves the timeline as JSON
And later loads the JSON file
Then the title, date range, lines, events, periods, and text items are restored.

### Save Current File

Given the browser grants writable access to a loaded or saved JSON file
When the user edits the timeline
And clicks Save or presses `Ctrl+S` or `Command+S`
Then the app writes the current timeline JSON to that same file
And the unsaved changes indicator clears.

### Download When Direct File Save Is Unavailable

Given the browser does not grant writable access to a loaded JSON file
When the user saves the timeline
Then the app downloads a JSON copy
And the file state makes clear that direct file saving is not active.

### Show Unsaved Changes

Given a timeline has no unsaved edits
When the user changes timeline data
Then the app shows that there are unsaved changes
And saving the timeline clears that indicator.

### Preserve Local Editing During Framework Migration

Given the app has migrated to the Vite, React, and TypeScript frontend shell
When the user loads an existing timeline JSON file
And edits the timeline
And saves the timeline as JSON
Then the saved JSON preserves the edited timeline data
And the core timeline controls still work.

### Store Timelines For Signed-In Users

Given a user is signed in
When the user creates or edits a timeline
Then the app can save that timeline to the user's cloud account
And another signed-in session for the same user can load the timeline.

### Export

Given the user has a visible timeline
When the user exports PNG, SVG, or PDF
Then the exported file contains the current timeline view.

### System Theme

Given the user's operating system is set to light or dark appearance
When the user opens Timeline Studio
Then the app uses the matching visual theme
And the timeline controls and labels remain readable.

### Theme Preference

Given the user chooses Light or Dark from the theme control
When the app updates the visual theme
Then the selected theme overrides the system appearance
And the timeline data is unchanged
And the theme choice is remembered for the next browser session.

### Layout Preference

Given the user collapses the editor sidebar or timeline toolbar
When the workspace layout updates
Then the timeline data is unchanged
And the layout choice is remembered for the next browser session.
