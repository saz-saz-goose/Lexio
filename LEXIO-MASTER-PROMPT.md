# LEXIO — Master Project Prompt

Use this prompt to start a new conversation with Claude about this project. Paste it in full at the start of any new session.

---

## PROJECT OVERVIEW

I am building a vocabulary learning web application called **Lexio**. It is designed for **French native speakers learning English**. The app teaches vocabulary through a structured sequence of encounters and exercises grounded in language acquisition research (spaced repetition, retrieval practice, elaborative encoding).

I have no coding background. All code should be written for me, explained clearly, and built incrementally. The app should be built as a **single HTML file** for now, loading word lists from **external JSON files**. All code must be **mobile-compatible and app-ready** (touch-friendly targets, responsive layout, no hover-only interactions) as the eventual goal is to publish this as a native mobile app.

---

## DESIGN SYSTEM — DO NOT CHANGE WITHOUT ASKING

The app uses a fixed visual identity. Always maintain these exactly:

**Fonts:**
- Display / headings: `Playfair Display` (Google Fonts, weights 400 and 600)
- Body / UI: `DM Sans` (Google Fonts, weights 300, 400, 500)

**Colour palette (CSS variables):**
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
--glow-correct: rgba(45, 106, 79, 0.15);
--glow-wrong: rgba(155, 34, 38, 0.15);
```

**Feedback behaviour:**
- A correct answer triggers a subtle **light green glow** on the background for 2 seconds
- An incorrect answer triggers a subtle **light red glow** on the background for 2 seconds
- Implemented via CSS class swap: `body.glow-correct` and `body.glow-wrong`

**UI components:**
- Cards: white, 16px border radius, 1px solid `--border`, subtle box shadow
- Primary buttons: `--accent` background, white text, 12px border radius, full width
- Option buttons: white background, 1.5px `--border` border, 12px border radius, highlight on hover with `--accent-light`
- Phase tags: small pill labels in `--accent-light` / `--accent` colour
- Progress bar: thin (4px), `--accent` fill, sits in the header

**App header:** always present at the top — logo "Lexio" (Playfair Display, accent colour) on the left, progress bar in the centre, current step label on the right.

---

## WORD LIST ARCHITECTURE

Word lists are stored as **external JSON files** in a `word-lists/` subfolder. The app loads them dynamically at startup using `fetch()`. This means the app must always be served via a local server during development (not opened directly as a file).

**The active word list is set by changing one line at the top of the app's script:**
```javascript
const WORD_LIST_FILE = 'word-lists/FILENAME.json';
```

**JSON format for every word list:**
```json
{
  "meta": {
    "id": "unique-list-id",
    "title": "Display title of the list",
    "source": "Where the list comes from",
    "level": "A1 / A2 / B1 / B2 / C1 / C2",
    "category": "curriculum / word-group / theme / specialist",
    "subcategory": "e.g. Cambridge YLE Starters",
    "theme": "e.g. animals",
    "native_language": "fr",
    "target_language": "en",
    "word_count": 10
  },
  "words": [
    {
      "id": "unique-word-id",
      "french": "le mot en français",
      "english": "the english word",
      "sentences": [
        { "fr": "Phrase en français avec <b class='highlight'>english word</b> dedans.", "en": "English translation of the sentence." },
        { "fr": "Deuxième phrase avec <b class='highlight'>english word</b>.", "en": "Second sentence translation." },
        { "fr": "Troisième phrase avec <b class='highlight'>english word</b>.", "en": "Third sentence translation." }
      ]
    }
  ]
}
```

**Important sentence rules:**
- Each word has exactly **3 example sentences**
- The target English word is embedded in the French sentence wrapped in `<b class='highlight'>word</b>` — this is how the app knows what to remove for cloze exercises
- Sentences should be natural, level-appropriate, and contextually clear
- The two distractor options in EX2 must not be grammatically or contextually correct in the sentence

---

## PLANNED WORD LIST CATEGORIES

### 1. Curriculum Learning
- French Brevet (aligned to B1 CEFR — note: no official word list exists, so lists are curriculum-aligned rather than officially prescribed)
- French Bac (aligned to B2 CEFR — same note)
- Cambridge YLE: Starters (A1), Movers (A1-A2), Flyers (A2) — official Cambridge vocabulary lists exist for these ✅
- Cambridge Adults: A2 Key / KET, B1 Preliminary / PET — official lists exist ✅; B2 First / FCE and above have no fixed word list ⚠️
- DELF/DALF (A1–C2, French government English proficiency tests)
- TOEIC (very popular in France for professional/university contexts)

### 2. Word Group Learning (AI-generated, CEFR levels A1-A2 / B1-B2 / C1-C2)
Word types: nouns, verbs, adjectives, adverbs, prepositions of time and place, connectives, figures of speech / idioms

### 3. Theme Learning (AI-generated, CEFR levels A1-A2 / B1-B2 / C1-C2)
Themes: everyday objects and items / the house and the local area / family and relationships / travel and holidays / the environment and the world around us / food and lifestyle / hobbies and interests

### 4. Specialist (no fixed level)
- Business and finance terms
- Medical and psychological terms
- Practical English (important phrases for getting things done abroad: shops, restaurants, hotels, hospitals)

---

## LEARNING STRUCTURE

### Sessions
Each session introduces **10 new words**. Sessions are structured into **Encounters**. Each Encounter contains a fixed sequence of exercises. Sessions end after each full Encounter (unless saved mid-session by the user).

---

### FIRST ENCOUNTER

**First Encounter — Introduction**
- Show the English word, its French translation, and an audio pronunciation button
- Show 3 example sentences one at a time; user clicks a tick/confirm button to advance through each sentence
- Sentences should show the target English word highlighted within the French sentence

**EX 1 — Multiple Choice (Recognition: French → English)**
- Show the French word
- User chooses the correct English translation from 4 options
- ✅ Correct: green glow, move to next word
- ❌ Incorrect: red glow, show correction, re-test the same word immediately in the same format until correct
- Repeat for all 10 words
- **Re-test at end:** any word initially answered incorrectly is re-tested — this time showing the English word, user chooses the correct French translation from 4 options (reversed direction)

**EX 2 — Cloze / Fill the Gap**
- Show the French word at the top (NOT the English — showing English gives the answer away)
- Show all 3 example sentences from the First Encounter with the English target word removed (replaced by a gap)
- User chooses the correct English word from 3 options:
  - 1 correct answer
  - At least 1 distractor from other words in the current session
  - 1 random distractor
  - The incorrect options must NOT be grammatically or contextually valid in the sentence
- ✅ Correct: move to next word
- ❌ Incorrect: show correction, move to next word
- **Re-test at end:** words answered incorrectly are re-tested — user sees the French word and the English word, clicks to hide the English, then must type the English word in full
- **INCLUDE SAVE AND CONTINUE LATER OPTION HERE**

**EX 3 — Partial Word Typing**
- Show the French word
- Show the English word with approximately 50% of letters replaced by blanks
- User types the complete English word (not just the missing letters — the full word)
- ✅ Correct: move to next word
- ❌ Incorrect: show correction, move to next word

---

### SECOND ENCOUNTER

**EX 1 — Matching Pairs**
- Show all 10 English words and all 10 French translations on screen simultaneously as tappable chips
- User taps one English word and its French equivalent
- ✅ Correct pair: both chips light up and disappear
- ❌ Incorrect: chips stay on screen
- **Re-test at end:** incorrectly matched words are re-tested — user sees the word and its meaning, then chooses the correct TL word from 3 options
- **INCLUDE SAVE AND CONTINUE LATER OPTION HERE**

**EX 2 — Anagram Cloze**
- Show all 3 example sentences with the English target word removed
- Show the letters of the correct answer in scrambled order (anagram)
- User types the correctly spelled English word
- ✅ Correct: move to next word
- ❌ Incorrect: show correction, move to next word
- **Re-test at end:** incorrectly answered words re-tested — user sees French word, then must type English word from memory

---

### THIRD ENCOUNTER

**EX 1 — Full Production (Native → Target)**
- User is given the French word and must type the English translation in full, unaided
- ✅ Correct: word moves into the **Recall practice** section
- ❌ Incorrect: two-stage review:
  - Re-test 1: show English word, choose correct French from 4 options
  - Re-test 2: show French, then reveal English (until user clicks forward), then show anagram — user must type the English correctly

---

## WORD RELATIONSHIP / PROGRESS TRACKING

At any point, the user should be able to see how many words they have in each category:

| Status | Condition |
|---|---|
| **Started** | User has seen the word at least 4 times |
| **Learning** | User has seen the word at least 4 times AND answered at least 2 questions correctly about it |
| **Learnt** | User has completed the Learning criteria AND recalled the word correctly 10–15+ times spread across at least 3 weeks |

---

## FEEDBACK & STATS

**Per-question feedback:**
- Correct: subtle light green background glow for 2 seconds
- Incorrect: subtle light red background glow for 2 seconds
- Show a feedback banner with ✓ or ✗ and the correct answer when wrong

**End of session stats (to be built later):**
- Number of words answered correctly first time
- Words the user spent the most / least time on
- Overall accuracy percentage

---

## AUDIO

Currently using browser Web Speech API (`SpeechSynthesisUtterance`, lang `en-GB`) as a placeholder. Eventually to be replaced with pre-generated TTS audio files (e.g. from ElevenLabs or Google TTS) stored as `.mp3` files alongside the word list JSON.

---

## TECHNICAL REQUIREMENTS

- Single `index.html` file with all CSS and JS inline (no external frameworks)
- Word lists loaded via `fetch()` from `word-lists/FILENAME.json`
- Must be served via a local server during development (VS Code Live Server recommended)
- All interactions must be **touch-friendly** (minimum 44px tap targets, no hover-only states)
- Fully **responsive** — designed mobile-first, max content width 640px centred on desktop
- No external JS frameworks (no React, Vue, etc.) — vanilla JS only for now
- CSS variables used throughout for all colours and theming
- Smooth screen transitions using CSS animation (`fadeUp` keyframe)
- App-ready: structure and interactions should translate cleanly to a future React Native or PWA wrapper

---

## CURRENT BUILD STATE

The following has been built and is working:

- ✅ First Encounter (word intro, audio button, 3 sentences one at a time)
- ✅ EX 1 with immediate re-test and end-of-exercise retest (reversed direction)
- ✅ EX 2 with cloze sentences, 3 options, end-of-exercise retest with reveal-then-type
- ✅ EX 3 with partial word display and typing
- ✅ Green/red glow feedback throughout
- ✅ Progress bar in header
- ✅ JSON file loading with loading screen and error screen
- ✅ Error screen points user to local server guide

**Not yet built:**
- ⬜ Second Encounter (matching pairs + anagram cloze)
- ⬜ Third Encounter (full production + two-stage review)
- ⬜ Save and continue later
- ⬜ Progress tracking (Started / Learning / Learnt)
- ⬜ End of session stats screen
- ⬜ Word list selection screen (choose which list to study)
- ⬜ Real TTS audio files

---

## FILES IN THIS PROJECT

```
lexio/
  index.html                              ← main app
  GUIDE-SERVEUR-LOCAL.md                  ← how to run a local server
  LEXIO-MASTER-PROMPT.md                  ← this file
  word-lists/
    cambridge-yle-starters-animals.json   ← first real word list (10 words, A1)
```

---

*Last updated: First Encounter + EX1 + EX2 + EX3 complete. JSON loading implemented.*
