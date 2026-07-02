# Prototype Review

## Summary
The delivered web prototype meets all core Minesweeper gameplay requirements and runs entirely offline. First-click safety, win/lose evaluation, restart flow, difficulty presets, and a responsive grid are correctly implemented. The codebase is small, readable, and suitable for static hosting.

However, theming depth, flag logic, and accessibility have notable shortcomings. These do not fully block use of the prototype but must be addressed before release.

## Strengths
* Core mechanics (reveal, flag/unflag, flood-fill, win/loss, first-click safety) work as required.
* Difficulty selector (easy/medium/hard) adds missing feature without breaking scope.
* Responsive design with media queries; mobile long-press flagging implemented.
* Clean separation of logic and UI; no external dependencies, enabling easy maintenance.
* Static assets only—deploys on any CDN or file system without server.

## Gaps & Issues
1. **Flag over-placement** – unlimited flags allowed; negative flag counter is misleading and deviates from expected Minesweeper behaviour.
2. **Shallow PvZ theming** – uses generic emoji; lacks authentic PvZ art, styled numbers, or branded backgrounds.
3. **Accessibility** – no keyboard support, ARIA attributes, or alternative cues; heavy colour/emoji reliance.
4. **Onboarding / empty state** – no instructions or visible cue before first click; may confuse first-time players.
5. **Potential stack overflow** – recursive flood-fill may break on larger future boards.
6. **Modal / timer edge case** – closing modal via backdrop could leave timer/UI out of sync (minor UX inconsistency).

## Risks
* UX confusion due to unlimited flags and missing onboarding.
* Stakeholder dissatisfaction if PvZ branding is deemed insufficient.
* Legal risk if actual PvZ assets are later added without license.
* Accessibility non-compliance leading to broader audience exclusion.
* Technical debt if recursive flood-fill is not refactored before scaling.

## Recommendations
* Enforce flag limit equal to zombie count; disable right-click when no flags remain.
* Integrate approved PvZ-styled sprites, custom numerals, and backgrounds.
* Implement ARIA labels (`role="button"`, `aria-label='Tile 3,4 hidden'`), focus management, and keyboard controls (arrow keys + space/enter).
* Add instruction banner or tooltip on initial idle state.
* Replace recursion with iterative BFS/queue for reveal flood-fill.
* Lock modal dismissal to explicit buttons or ensure full game/timer reset on any close action.