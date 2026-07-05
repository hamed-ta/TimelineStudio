# Timeline Studio Product Notes

## Purpose

Timeline Studio lets a user create a personal horizontal timeline with events, periods, marker dates, annotation notes, text notes, and named lines. The timeline can be panned, zoomed, saved, loaded, and exported.

## Core Concepts

### Timeline

A horizontal date-based canvas. Time flows left to right.

### Line

A named horizontal lane used to group related items, such as School, Home, Work, Family, or Notes.
Lines can be renamed, recolored, added, removed, and reordered directly from the timeline label area. Items assigned to a line move with that line.
Removing a line removes the items assigned to that line and shifts lower lines upward after confirmation.

### Event

A point-in-time item with a title, date, optional description, and assigned line. Event markers should be visually distinct from flat text and grid lines.

### Marker

A point-in-time item that draws a vertical line through every timeline line, such as a birthdate or other global reference date. Marker text should appear in a movable callout with a leader arrow pointing back to the marker date.

### Birth

A point-in-time item for a person's birthdate. It draws a prominent vertical line through every timeline line and acts as the source date for age calculations.
Its label should prefer the left side of the vertical line to avoid overlapping later timeline items.

### Note

A point-in-time annotation with a straight leader arrow pointing to a date and a balloon that can sit above or below the central timeline. A note does not require a date range.

### Period

A date range with a start date and end date. Period bars should read as colored timeline sections with a soft background treatment.

### Item Color

Items store a hex color in timeline JSON. The editor should provide a shared color picker with a curated preset palette, hue and saturation controls, and direct hex entry.
New items should start with a random color from the preset palette so adjacent created items are easier to distinguish.
The preset palette should include a broad range of modern readable colors, including neutrals.

### Text Item

A freeform note attached to the timeline.

### Lock State

When items are locked, dragging the canvas should pan the timeline and should not accidentally move items.

### Item Commands

Selected timeline items can be copied, pasted, duplicated, and deleted from the timeline context menu or keyboard shortcuts.
Copy and paste use an in-app item clipboard. Pasted items should receive a new ID and should preserve the copied item's type, color, dates, notes, and display settings unless a timeline click location supplies a new start date or lane.

## Date Behavior

- Gregorian ISO dates are the internal source of truth.
- Timeline labels may show Gregorian dates, Persian / Solar Hijri dates in English letters and numbers, or both.
- Display-calendar settings affect only labels and summaries; saved item dates, timeline start/end dates, drag math, age math, and duration math remain based on Gregorian ISO dates.
- Timeline start, end, and item date inputs currently accept Gregorian ISO `YYYY-MM-DD` values.
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
- The app shell should use Ant Design components, icons, theme tokens, and light/dark styling where compatible with the current timeline controller.
- The visual theme should use accessible contrast for text, controls, timeline labels, and canvas grid details.
- The app should use a modern UI font stack that supports Persian text and keeps mixed English/Persian labels visually consistent.
- UI text sizes should follow a small rem-based type scale instead of scattered one-off values.
- Theme changes should not alter saved timeline data.

## Layout Behavior

- The timeline editor sidebar should be collapsible.
- The timeline action toolbar should stay compact enough that it does not need its own collapse control on desktop.
- The timeline editor sidebar should stay on the left side of the workspace on wider screens.
- The timeline action toolbar should stay near the top of the timeline stage.
- The current timeline title, date range, and file state should stay in a single compact metadata row in the main app header.
- The timeline action toolbar should not duplicate the timeline title or date range.
- The main header and action toolbar should stay compact so the timeline canvas gets most of the vertical space.
- View actions such as read-only, Fit, theme, zoom, and height controls should live in the action toolbar with create, file, and export actions.
- View actions should remain pinned on the right side of the toolbar, with the theme switcher as the right-most control.
- Timeline action buttons should use recognizable icons with short labels.
- Timeline action icons should use distinct accent color treatment while preserving text contrast.
- Create-item actions should be grouped separately from file and export actions.
- Item locking should be an icon toggle near toolbar controls instead of a checkbox mixed into create-item actions.
- Zoom controls should use a compact icon control with the current value visible, reveal the slider in an overlay when opened, and should not allow the timeline to zoom out below the readable minimum.
- Zoom buttons, shortcuts, context-menu commands, and wheel zoom should use small enough increments for controlled timeline inspection.
- Collapse and expand controls should use panel-specific recognizable icon buttons rather than text characters or generic arrows.
- Collapse and expand transitions should be animated.
- The timeline viewport height should fit the rendered axis, lines, and note area instead of stretching to fill unused workspace height.
- The user should be able to use `Ctrl`/`Command` + mouse wheel to zoom the timeline horizontally.
- The user should be able to use `Ctrl`/`Command` + `Shift` + mouse wheel to make line tracks taller or shorter within readable limits.
- The user should be able to drag a handle below the timeline, use `Ctrl`/`Command` + `Alt` + mouse wheel, or open a compact height control to make the timeline area taller or shorter so more vertical canvas is visible with less internal timeline scrolling.
- The timeline selection information panel should be collapsible so users can give more vertical space to the timeline canvas.
- Editing fields should preserve their current values when focused and should allow normal text entry, including spaces in timeline and item names.
- Empty timelines should show a clear centered empty state instead of a visually unbalanced blank canvas.
- Timeline axis date labels should stack, simplify, or skip month and day labels when spacing is tight so date text does not overlap.
- Timeline settings should let users choose Gregorian, Persian / Solar Hijri, or both display calendars while keeping at least one display calendar enabled.
- When only Persian / Solar Hijri is selected, central-axis year and month ticks should align to Persian / Solar Hijri calendar boundaries.
- Layout preferences should be remembered in the browser.
- Layout changes should not alter saved timeline data.
- The app should show a compact footer with the app name and current package version.
- The displayed app version should come from build metadata and should not be saved into timeline JSON.
- Shared links should expose a useful page title and social preview description for search engines, chats, and social media.

## Acceptance Scenarios

### Start Empty

Given the user opens the app for the first time
When no timeline file has been loaded
Then the timeline starts empty
And no personal sample data is displayed
And the timeline range starts on the same day last year and ends today.

### Show Empty Timeline State

Given the timeline has no items
When the timeline renders
Then the empty canvas shows a clear centered empty state
And the one-year empty range is fitted into view
And the timeline grid is not visually stretched or pushed to one side.

### Share App Link

Given someone shares the app URL in a chat, search result, or social media preview
When the page metadata is read
Then the preview title is `Timeline Studio`
And the preview description explains that the app creates, edits, and exports personal timelines.

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
And the marker title appears in a movable callout below the marker by default
And the vertical marker line is solid
And the callout balloon has a tip and a dashed leader pointing to the nearest top or bottom end of the vertical marker line, not the center of the line
And the user can drag the marker callout above or below the central timeline
And dragging the marker callout above the top line expands the scrollable canvas upward instead of clamping the callout to the top line
And the user can resize the selected marker callout balloon with a compact corner grip
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
Then the app shows a thin solid vertical cursor guide across the visible timeline canvas
And a narrow readout at the top of the timeline shows the hovered date using the selected display calendars, the age calculated from the birth item, and how long ago or far ahead the date is from today using years, months, and days when applicable
And updating the hover context does not move the timeline viewport
When the user selects a timeline item
Then the bottom information panel shows the item type, title, selected-calendar date details, duration when the item has an end date, and age context when a birth item exists
And lane details appear as a separate selection detail line instead of being appended to the selection title
And selection details are split across readable labeled lines instead of one dense sentence
And the information panel grows to fit readable content instead of showing an internal scrollbar
And the calculated age text is not saved into the timeline JSON.

### Choose Display Calendars

Given the timeline settings are visible
When the user selects only Gregorian as the display calendar
Then timeline axis labels, header date range, item date previews, cursor readout dates, and selection dates show Gregorian dates only
When the user selects only Persian / Solar Hijri
Then those same labels show Persian / Solar Hijri dates only
And central-axis year/month boundaries align to Persian / Solar Hijri year/month starts
When the user selects both calendars
Then those same labels show both calendars where space allows
And the selected display calendars are saved and restored in the timeline JSON
And the stored date values and date input format remain Gregorian ISO dates.

### Fit Timeline Height To Lines

Given the timeline has named lines
When the timeline renders
Then the viewport height fits the axis, visible lines, footer spacing, and note area when notes exist
And the viewport does not stretch vertically just because the workspace has extra height.

### Show Central Timeline Axis

Given the timeline has multiple named lines
When the timeline renders
Then the date axis appears through the center of the canvas instead of above every line
And lines alternate around the axis as `Line +1`, `Line -1`, `Line +2`, and `Line -2` when no custom label is set
And users can add and drag items on lines above or below the central axis without changing the saved JSON lane format.

### Show Zoom-Responsive Central Axis Detail

Given the user zooms the timeline out
When the central date axis renders
Then only readable year labels are shown when there is not enough room for month or day detail
And as the user zooms in, month ticks and day ticks become visible without overlapping labels
And month background bands, month grid lines, day grid lines, day ticks, and day labels are hidden when their time unit is too narrow to read clearly
And the hovered cursor guide spans the full visible timeline canvas as a thin solid line.

### Keep Timeline Chrome Fixed

Given the timeline content is taller or wider than the visible stage
When the user scrolls the timeline
Then only the timeline canvas, lanes, and timeline items scroll
And the action toolbar and timeline info panel stay fixed outside the scrollable timeline viewport.

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
And the leader line is dotted and renders behind note balloons
And the leader line is highlighted when the note is selected
And the leader line terminates at the central timeline axis
And a shaped balloon with a movable tip above or below the central timeline displays the note text
And the balloon tip leans toward the leader line when the balloon is offset from the note date
And selected notes show selection around the balloon only, not around the leader line or anchor
And multi-line note text wraps inside the balloon
And the balloon text direction and alignment follow the typed language
And notes created near each other automatically stack vertically to avoid overlapping
And notes continue stacking vertically when the user zooms farther out
And the user can drag the balloon to reposition it above or below the timeline lines
And dragging the balloon farther above the axis expands the scrollable canvas above the top line instead of clamping the balloon to the top line
And the user can resize the selected note balloon with a compact corner grip that stays aligned to the balloon body when the note is above or below the axis
And the user can double-click the balloon text or body to edit balloon text directly on the timeline
And clicking outside the inline balloon text editor commits the edit
And the sidebar provides a larger multi-line editor for the balloon text
And the sidebar provides separate color controls for the note balloon and note text
And note items do not expose a separate title field when editing
And the app derives any internal note title from the first non-empty balloon text line
And selecting the note does not append the line number to the selection heading
And right-clicking a note keeps the selected note outline visible for context menu actions without adding a browser focus box
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
When the user chooses a preset swatch, adjusts the picker, or enters a valid hex color
Then the item updates to that color
And the selected swatch is visibly active
And the same picker pattern is used for line background colors
And the picker remains fully visible inside the viewport instead of being clipped by the sidebar or timeline panels.

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

### Show App Version Footer

Given the app has loaded
When the user looks at the bottom of the shell
Then a compact footer shows `Timeline Studio`
And the footer shows the current package version
And the footer does not change timeline JSON data.

### Use Normalized Typography

Given the app renders English and Persian timeline labels
When the user views controls, panels, context menus, and timeline text
Then the UI uses a Persian-capable modern sans-serif font stack
And text sizes follow a consistent rem-based scale
And timeline SVG labels use the same font family as the rest of the app.

### Use Ant Design Shell

Given the app shell renders the header, editor panels, action toolbar, form fields, and file/export controls
When the user views the app in light or dark theme
Then those controls use Ant Design components, icons, and theme tokens
And theme switching applies Ant Design light and dark styling without changing timeline JSON
And legacy timeline behavior still works through the required DOM IDs and data attributes.

### Use Timeline Context Menu

Given a timeline item exists
When the user opens the context menu on the item
Then the app selects that item
And the menu offers Add, Copy, Paste, Duplicate, Lock item or Unlock item, and Delete
And read-only mode is controlled from the top toolbar icon instead of the context menu
And unavailable commands are disabled.

### Add Item From Context Menu

Given the user opens the context menu on the timeline
Then the Add submenu is closed by default
When the user chooses Add and then an item type
Then that item type is created at the clicked date
And lane-bound item types use the clicked line.

### Lock Individual Item

Given a timeline item exists
When the user locks that item from the context menu
Then that item stays selectable and copyable
But it cannot be edited, dragged, resized, duplicated, or deleted
When the user unlocks that item from the context menu
Then normal item editing and movement are available again.

### Use Read-Only Mode

Given timeline items exist
When the user turns on read-only mode from the top toolbar icon
Then the timeline is read-only for item content
And item creation, editing, movement, duplication, paste, and deletion are unavailable
But selection, copy, pan, zoom, and turning read-only off remain available.

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
But when the user is editing text in an editor field
Then `Delete` and `Backspace` edit that text and do not delete the selected item
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
When the user opens line editing from the timeline label and renames the line
Then the new name is shown on the timeline
And the name is preserved after save/load.

### Recolor A Line

Given a timeline line exists
When the user opens line editing from the timeline label and changes the line background color with the shared color picker
Then the line row uses that background color
And the color is preserved after save/load.

### Add A Line In Place

Given the timeline has visible line labels
When the user clicks the single add-line control below the last line
Then a new line is appended below the existing lines
And existing item line assignments are preserved.

### Reorder Lines

Given a timeline has multiple named lines with items on them
When the user drags a line above or below another line from the timeline label
Then the visible line order changes
And the items assigned to that line move with it
And the new line order is preserved after save/load.

### Reorder Central-Axis Lines Visually

Given the timeline uses a central date axis with lines above and below it
When the user drags `Line -2` above `Line -1` while staying below the axis
Then only the below-axis line order changes
And lines above the axis keep their assigned items and visible order.

### Resize Timeline Line Spacing

Given the timeline has multiple lines
When the user holds `Ctrl+Shift` or `Command+Shift` and scrolls the mouse wheel over the timeline
Then the visible line tracks become taller or shorter within readable limits
And the line spacing is preserved after save/load.

### Resize Timeline Area Height

Given the timeline content is vertically crowded
When the user holds `Ctrl+Alt` or `Command+Alt` and scrolls the mouse wheel over the timeline
Or opens the compact timeline height control and changes its slider
Or drags the resize handle below the timeline viewport
Then the timeline area becomes taller or shorter within reasonable limits
And the page can grow vertically so more of the timeline canvas is visible
And the toolbar and info panel remain outside the scrollable timeline canvas
And timeline area height is remembered in the browser without changing timeline JSON.

### Open Toolbar View Controls

Given the compact toolbar is visible
When the user opens the zoom or height control
Then its slider appears as an overlay near the triggering button
And the toolbar layout does not resize or push other toolbar controls out of place.

### Collapse Timeline Information

Given the timeline information panel is visible below the canvas
When the user collapses the information panel
Then the selection details are hidden in a compact row
And the timeline canvas has more vertical room
And the user can expand the information panel again.

### Edit Text Fields Without Losing Values

Given the timeline sidebar has existing text and date values
When the user focuses a legacy-bound field
Then the existing value remains visible
And typing spaces in the timeline title preserves normal text entry.

### Remove A Line

Given a timeline has more than one line
When the user removes a line from timeline line editing and confirms the destructive action
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

### Zoom Timeline With Mouse Wheel

Given the user is hovering over the timeline canvas
When the user holds `Ctrl` or `Command` and scrolls the mouse wheel
Then the timeline zooms horizontally
And line track height does not change.

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
Then the title, date range, display calendar settings, lines, events, periods, and text items are restored.

### Report Timeline Load Failures Clearly

Given the user selects a timeline file
When the file cannot be parsed as timeline JSON
Then the app tells the user the selected file is not valid timeline JSON
And runtime rendering errors after a valid parse are not reported as invalid JSON.

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
