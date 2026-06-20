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

A point-in-time item with a title, date, optional description, and assigned line.

### Marker

A point-in-time item that draws a vertical line through every timeline line, such as a birthdate or other global reference date.

### Note

A point-in-time annotation with a straight leader arrow pointing to a date and a balloon below all timeline lines. A note does not require a date range.

### Period

A date range with a start date and end date.

### Text Item

A freeform note attached to the timeline.

### Lock State

When items are locked, dragging the canvas should pan the timeline and should not accidentally move items.

## Date Behavior

- Gregorian ISO dates are the internal source of truth.
- Timeline labels may show Iranian dates in English letters and numbers.
- Saved data should preserve exact dates.
- The timeline should support year, month, and day precision.
- The app should not show `AD` after Gregorian date labels.

## Data Behavior

- The app starts with empty data.
- Personal timeline data should be created by the user or loaded from a file.
- The project should not include personal sample data as default app state.
- JSON is the primary save/load format.
- During the modern web app migration, local JSON load/edit/save behavior should remain available.
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
- Collapse and expand controls should use recognizable icon buttons rather than text characters.
- Collapse and expand transitions should be animated.
- Layout preferences should be remembered in the browser.
- Layout changes should not alter saved timeline data.

## Acceptance Scenarios

### Start Empty

Given the user opens the app for the first time
When no timeline file has been loaded
Then the timeline starts empty
And no personal sample data is displayed.

### Create An Event

Given an empty timeline
When the user creates an event on `2001-03-04`
Then the event appears at the correct date position
And it is still present after save/load.

### Create A Marker

Given a timeline has multiple lines
When the user creates a marker on `2001-03-04`
Then a vertical line appears at the correct date position across all visible lines
And the marker is still present after save/load.

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

### Fit Timeline

Given the timeline contains items across a date range
When the user clicks Fit
Then the visible viewport adjusts to show the full timeline range.

### Save And Load Timeline

Given the user has created timeline data
When the user saves the timeline as JSON
And later loads the JSON file
Then the title, date range, lines, events, periods, and text items are restored.

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
