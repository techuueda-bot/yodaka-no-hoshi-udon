**Comparison Target**
- source visual truth path: `/tmp/codex-remote-attachments/019f5b2e-175e-79d1-8550-f2d0f0103251/94FC4F9D-F3EF-42F2-80EE-C02AD4BEFDA2/1-写真1.jpg`
- implementation screenshot path: `/private/tmp/20260717_yodaka-nav-marker-after.png`
- full-view comparison path: `/private/tmp/20260717_yodaka-nav-marker-full-compare.png`
- focused comparison path: `/private/tmp/20260717_yodaka-nav-marker-focus-compare.png`
- viewport: implementation 375 x 812 px; source is a 588 x 1280 px device screenshot including browser chrome
- state: home page, mobile global navigation open, `トップ` current

**Full-view Comparison Evidence**
- The approved minimal composition remains unchanged: brandmark at top-left, close control at top-right, three centered navigation items, and a bottom colophon.
- The screen has no horizontal overflow at 375 px.
- The source includes Safari chrome while the implementation capture is an unframed browser viewport; the comparison therefore judges the page surface rather than browser chrome.

**Focused Region Comparison Evidence**
- Before: the crest sat far to the left of `トップ` and read as a detached decoration.
- After: the crest is positioned immediately before the current label with an approximately 28 px visible gap, preserving the centered label and underline.
- The crest filter is darker and more saturated, strengthening the current-location cue without introducing a new asset or surface.

**Findings**
- No actionable P0, P1, or P2 differences remain for the requested marker correction.

**Required Fidelity Surfaces**
- Fonts and typography: existing Zen Old Mincho and established sizes, line heights, and tracking are unchanged.
- Spacing and layout rhythm: marker-to-label distance is corrected; navigation spacing, tap-target height, and colophon position are unchanged.
- Colors and visual tokens: the existing gold accent remains the only state color; the crest is now visibly closer to that tone.
- Image quality and asset fidelity: the existing crest file is reused at 18 px; no replacement or generated asset was introduced.
- Copy and content: unchanged.

**Primary Interactions Tested**
- Opened the mobile navigation from the hamburger control.
- Confirmed the current-page marker and underline in the open state.
- Closed the navigation and confirmed the control returned to `メニューを開く`.
- Browser console warnings/errors checked: none.

**Comparison History**
- Iteration 1 finding: current crest was visually detached from `トップ` and too pale.
- Fix: moved the marker from the far edge of the 276 px tap target to a label-relative offset and strengthened its gold filter. Added tailored offsets for `お品書き` and `こだわり` so all current states keep a natural gap.
- Post-fix evidence: full-view and focused comparisons listed above; no overflow and open/close behavior verified.

**Implementation Checklist**
- [x] Move the current crest next to the active label.
- [x] Increase the crest's gold contrast.
- [x] Preserve the underline, navigation spacing, and 56 px tap target.
- [x] Verify 375 px rendering and no horizontal overflow.
- [x] Verify menu open/close behavior and console errors.

**Follow-up Polish**
- P3: actual iPhone font rasterization may differ slightly from the in-app browser capture; no layout change is warranted without another device screenshot.

final result: passed
