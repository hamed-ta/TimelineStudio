# Issue Tracker: GitHub

Issues and specs live in GitHub Issues for `hamed-ta/TimelineStudio`. Use the `gh` CLI from this checkout; it infers the repository from `origin`.

## Conventions

- Create: `gh issue create --title "..." --body-file <file>`.
- Read: `gh issue view <number> --comments`; include labels when inspecting issue metadata.
- List: `gh issue list --state open --json number,title,body,labels,comments`, with appropriate label, state, and limit filters.
- Comment: `gh issue comment <number> --body-file <file>`.
- Apply or remove labels: `gh issue edit <number> --add-label "..."` or `--remove-label "..."`.
- Close: `gh issue close <number> --comment "..."`.

Write multiline issue bodies and comments to a temporary text file and pass it with `--body-file`.

When a skill says "publish to the issue tracker", create a GitHub issue. When it says "fetch the relevant ticket", read the issue body, comments, and labels.

## Pull Requests as a Triage Surface

**PRs as a request surface: no.**

GitHub shares issue and PR numbering. Resolve an ambiguous reference with `gh pr view <number>`, falling back to `gh issue view <number>`. An explicitly requested PR remains actionable.

## Wayfinding Operations

Used by `/wayfinder`:

- Map: one issue labelled `wayfinder:map`, containing Notes, Decisions-so-far, and Fog.
- Child ticket: link it to the map as a native GitHub sub-issue. For new tickets, use `gh issue create --parent <map-number>`. If sub-issues are unavailable, use a task list in the map and put `Part of #<map>` at the top of each child.
- Ticket labels: `wayfinder:research`, `wayfinder:prototype`, `wayfinder:grilling`, or `wayfinder:task`.
- Blocking: use native GitHub issue dependencies. For new tickets, use `--blocked-by <blocker-number>`. If dependencies are unavailable, put `Blocked by: #<number>` at the top of the child body.
- Frontier: inspect the map's open children in map order; skip assigned tickets and tickets with open blockers. The first remaining ticket is next.
- Claim: `gh issue edit <number> --add-assignee @me`.
- Resolve: comment with the answer, close the child, and append a concise finding and link to the map's Decisions-so-far.
