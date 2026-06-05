# AGENTS.md — Lexio Project Context

> This file is the shared context document for all AI assistants working on this project: **Codebuff (Buffy)**, **Claude**, and **Antigravity**. Read this before making any changes. Keep it updated as the project evolves.

---

## WHAT IS LEXIO?

**Lexio** is a vocabulary learning web app for **French native speakers learning English**. It teaches vocabulary through a structured sequence of encounters and exercises grounded in language acquisition research (spaced repetition, retrieval practice, elaborative encoding).

- **Single HTML file** (`index.html`) — all CSS, HTML, and JS inline
- **No frameworks** — vanilla JS only
- **Mobile-first** — designed for eventual React Native / PWA wrapper
- **Word lists** loaded via `fetch()` from `word-lists/*.json`
- **Supabase** for auth (signup, login, OAuth, password reset) and persistence

---

## DESIGN SYSTEM

### Fonts (updated June 2026)
- **Display / headings:** `Playfair Display` (Google Fonts, weights 400, 600)
- **Body / UI:** `Inter` (Google Fonts, weights 300, 400, 500, 600) — **was DM Sans, replaced for better readability**

### Colour Palette (CSS variables — do not change)
```css
--bg: #F7F4EF;
--card: #FFFFFF;
--ink: #1A1A2E;
--ink-light: #6B6B80;
--accent: #3D5A80;
--accent-light: #E0E8F0;
--correct: #2D6A4F;
--correct-bg: #D8F3DC;
--wrong: #9B2226;
--wrong-bg: #FFE5E5;
--border: #E2DDD6;
```

### Feedback System
- ✅ Correct → subtle green glow on body for 2s (`body.glow-correct`)
- ❌ Incorrect → subtle red glow on body for 2s (`body.glow-wrong`)
- Transition: `background-color 0.4s ease` (was `background`, changed for performance)

### UI Components
| Component | Border Radius | Notes |
|---|---|---|
| Cards (`.card`, `.course-card`, `.mode-card`) | 16px | White bg, 1px solid `--border`, subtle shadow |
| Inner icons (`.mode-icon`, `.verb-practice-mode-icon`) | 8px | Concentric with card padding |
| Primary buttons (`.btn-primary`) | 10px | `--accent` bg, white text, full width |
| Option buttons (`.option-btn`) | 12px | White bg, 1.5px `--border`, highlight with `--accent-light` |
| Progress bar | 4px height | `--accent` fill, in header |

### Icons
- **Inline SVGs** with `<symbol>` definitions at top of `<body>` (no emoji icons — they're OS-dependent)
- Avatar icons: `#avatar-snake`, `#avatar-dragon`, `#avatar-horse`, `#avatar-rabbit`, `#avatar-lion`
- Status icons: `#icon-check`, `#icon-warning`, `#icon-mail`, `#icon-celebrate`, `#icon-star`
- Avatar selection uses `data-avatar` attributes, not `innerText`
- `getAvatarEmoji()` returns SVG markup (use with `innerHTML`, not `innerText`)

---

## CSS CONVENTIONS (enforced after Design Polish pass)

### Do:
- ✅ Use explicit transitions (`transition: transform 0.15s, border-color 0.15s`), never `transition: all`
- ✅ Wrap all animations in `@media (prefers-reduced-motion: no-preference)`
- ✅ Use `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale` on body
- ✅ Use `text-wrap: balance` on headings (`.section-title`, `.home-title`, `.complete-title`, etc.)
- ✅ Use `font-variant-numeric: tabular-nums` on dynamic numbers (`.game-timer`, `.word-counter`, `.verb-score-num`, `.test-out-stat-num`)
- ✅ Use `font-family: 'Inter', sans-serif` for body text (NOT DM Sans)

### Don't:
- ❌ No `transition: all` — always list specific properties
- ❌ No emojis as functional UI icons — use SVG `<use>` tags
- ❌ No `background` transitions — use `background-color` instead
- ❌ No DM Sans references — everything is Inter now

---

## FILE STRUCTURE

```
Lexio/
  index.html                  ← Main app (~5200 lines, single file)
  privacy.html                ← Privacy policy
  terms.html                  ← Terms of service
  AGENTS.md                   ← This file
  LEXIO-MASTER-PROMPT.md      ← Original project spec (somewhat outdated)
  GUIDE-SERVEUR-LOCAL.md      ← How to run a local dev server
  package.json                ← Only has lint/format scripts (eslint, prettier)
  .eslintrc.json
  .prettierrc
  word-lists/                 ← JSON word lists loaded via fetch()
    INDEX.json
    cambridge-yle-starters-animals.json
    ... (more lists)
```

---

## HOW TO RUN

```bash
# Must be served, not opened as file:// (fetch() won't work)
cd Lexio
npx serve .          # or: python -m http.server 8000
# Then open http://localhost:3000 (or :8000)
```

---

## CURRENT BUILD STATE

### ✅ Built:
- First Encounter (word intro, audio, 3 sentences)
- EX 1 (Multiple Choice) with immediate + end retest
- EX 2 (Cloze / Gap Fill) with reveal-then-type retest
- EX 3 (Partial Word Typing)
- Matching Pairs exercise
- Anagram Cloze exercise
- Green/red glow feedback
- Progress bar in header
- JSON file loading with loading/error screens
- Supabase auth (signup, login, OAuth, password reset)
- Profile management, leaderboard
- Course selection and progress tracking
- Verb practice section (conjugation, tense exercises)
- Revise mode (re-study across courses)
- Test-out (skip ahead)
- Whack-a-mole and Bubble game exercises
- Design polish pass (fonts, transitions, a11y, icons — June 2026)
- Interaction & Usability pass (password toggle, strength, loading states, active states, touch targets — June 2026)

### ⬜ Not yet built:
- Full Production exercise (Third Encounter)
- Save and continue later (mid-session persistence)
- Detailed end-of-session stats screen
- Real TTS audio files (currently Web Speech API placeholder)
- Spaced repetition scheduling

---

## DEVELOPMENT GUIDELINES

### When you make changes, update this file
- If you change a CSS variable, update the palette table
- If you add a new component, add it to the UI components table
- If you change a convention, update the CSS conventions section
- If you complete a feature, move it from ⬜ to ✅

### Important notes for all agents
- **The LEXIO-MASTER-PROMPT.md is outdated** — it still references DM Sans. This AGENTS.md is authoritative.
- **Testing:** There are no automated tests. Test manually by serving locally and clicking through all screens.
- **Supabase:** The Supabase URL and anon key are configured in the `<script>` block near the bottom of `index.html`. The anon key is exposed in client code (unavoidable for pure frontend). Ensure RLS policies exist in Supabase.
- **No TypeScript** — this is vanilla JS. Be careful with type assumptions.
- **Keep it single-file** for now — the user wants to keep everything in `index.html` until a later refactoring milestone.
- **Mobile-first:** 44px minimum tap targets, no hover-only interactions, responsive to 320px width.

### Git workflow
- The project lives in `C:\Users\sarah\codebuff-projects\Lexio`
- Branch: `main`
- Remote: `https://github.com/saz-saz-goose/Lexio`

---

## RECENT CHANGES

### Interaction & Usability Pass (June 2026)

| Change | Details |
|---|---|
| Password toggle | Eye icon toggle on all 5 password fields (signup ×2, login, reset ×2) via `.password-wrapper` + SVG button |
| Password strength | Strength bar (weak/fair/good/strong) below signup password, updates on input |
| Auth-link touch targets | `.auth-link` now has `padding: 8px 4px`, `min-height: 44px`, `display: inline-flex` |
| Active states | `.course-card:active`, `.mode-card:active`, `.back-home-btn:active` with scale-down effects |
| Loading states | `setButtonLoading()` utility disables form buttons + shows "Chargement..." during Supabase calls |
| Leaderboard empty state | Already existed ("Personne n'a encore étudié ce cours") — verified working |
| Profile courses empty state | Already existed ("Aucun cours commencé.") — verified working |
| Screen history tracking | `previousScreen` global variable for smart back navigation (screen-privacy now returns to caller) |

### Known remaining interaction items:
- `handleSignup`, `handleLogin`, `handleForgotPassword` need `setButtonLoading()` calls integrated into their function bodies
- `screen-privacy` back button still hard-coded to `screen-signup` — needs `previousScreen` integration
- `showScreen` function needs to track `previousScreen` on each call
- `handlePasswordReset` (reset form submission) needs loading state too

### Design Polish Pass (June 2026)

| Change | Details |
|---|---|
| Font pairing | DM Sans → Inter (22+ references + Google Fonts preconnect) |
| Transition audit | 6 `transition: all` → explicit properties |
| Reduced motion | `@media (prefers-reduced-motion)` wrapping all animations |
| Font smoothing | Added `-webkit-font-smoothing` + `-moz-osx-font-smoothing` to body |
| Concentric radius | Inner elements (8-10px) now proportional to card (16px) |
| Text wrap | `text-wrap: balance` on 7 heading selectors |
| Tabular nums | `font-variant-numeric: tabular-nums` on scores/timers/counters |
| Emoji→SVG | 10 SVG symbols, all avatar + status icons replaced |
| Body transition | `background` → `background-color` for performance |
| JS updates | `selectAvatar` uses `data-avatar`, `getAvatarEmoji` returns SVG |

### Known remaining polish items:
- `.section-sub` and `.q-word` still need `text-wrap: balance`
- `.verb-score-badge` and progress counters need `tabular-nums`
- `🔥`, `💪`, `📚` emojis still remain as-is (non-avatar, lower priority)
- `getAvatarIconHTML` is redundant with `getAvatarEmoji` — consolidate
- `.avatar-btn` `font-size: 1.5rem` is now dead CSS — clean up

---

*Last updated: June 5, 2026 — after Interaction & Usability pass. Maintained by Buffy (Codebuff), Claude, and Antigravity.*
