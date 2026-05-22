<!DOCTYPE html>

<html lang="fr">



<head>

&#x20;   <meta charset="UTF-8">

&#x20;   <meta name="viewport" content="width=device-width, initial-scale=1.0">

&#x20;   <title>Lexio — Apprends l'anglais</title>

&#x20;   <link

&#x20;       href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600\&family=DM+Sans:wght@300;400;500\&display=swap"

&#x20;       rel="stylesheet">

&#x20;   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

&#x20;   <style>

&#x20;       :root {

&#x20;           --bg: #F7F4EF;

&#x20;           --card: #FFFFFF;

&#x20;           --ink: #1A1A2E;

&#x20;           --ink-light: #6B6B80;

&#x20;           --accent: #3D5A80;

&#x20;           --accent-light: #E0E8F0;

&#x20;           --correct: #2D6A4F;

&#x20;           --correct-bg: #D8F3DC;

&#x20;           --wrong: #9B2226;

&#x20;           --wrong-bg: #FFE5E5;

&#x20;           --border: #E2DDD6;

&#x20;           --glow-correct: rgba(45, 106, 79, 0.15);

&#x20;           --glow-wrong: rgba(155, 34, 38, 0.15);

&#x20;       }



&#x20;       \* {

&#x20;           box-sizing: border-box;

&#x20;           margin: 0;

&#x20;           padding: 0;

&#x20;       }



&#x20;       body {

&#x20;           font-family: 'DM Sans', sans-serif;

&#x20;           background: var(--bg);

&#x20;           color: var(--ink);

&#x20;           min-height: 100vh;

&#x20;           display: flex;

&#x20;           flex-direction: column;

&#x20;           align-items: center;

&#x20;           justify-content: flex-start;

&#x20;           padding: 0;

&#x20;           transition: background 0.4s ease;

&#x20;       }



&#x20;       body.glow-correct {

&#x20;           background: linear-gradient(135deg, #D8F3DC 0%, #F7F4EF 40%);

&#x20;       }



&#x20;       body.glow-wrong {

&#x20;           background: linear-gradient(135deg, #FFE5E5 0%, #F7F4EF 40%);

&#x20;       }



&#x20;       /\* ── HEADER ── \*/

&#x20;       .app-header {

&#x20;           width: 100%;

&#x20;           max-width: 640px;

&#x20;           display: flex;

&#x20;           align-items: center;

&#x20;           justify-content: space-between;

&#x20;           padding: 28px 24px 0;

&#x20;           min-height: 60px;

&#x20;       }



&#x20;       .logo-area {

&#x20;           display: flex;

&#x20;           align-items: center;

&#x20;           gap: 12px;

&#x20;       }



&#x20;       .logo {

&#x20;           font-family: 'Playfair Display', serif;

&#x20;           font-size: 1.5rem;

&#x20;           font-weight: 600;

&#x20;           color: var(--accent);

&#x20;           letter-spacing: -0.5px;

&#x20;       }



&#x20;       .back-home-btn {

&#x20;           background: transparent;

&#x20;           border: none;

&#x20;           font-family: 'DM Sans', sans-serif;

&#x20;           font-size: 0.85rem;

&#x20;           color: var(--accent);

&#x20;           cursor: pointer;

&#x20;           display: flex;

&#x20;           align-items: center;

&#x20;           gap: 4px;

&#x20;           font-weight: 500;

&#x20;           padding: 6px 12px;

&#x20;           border-radius: 8px;

&#x20;           border: 1px solid var(--accent);

&#x20;           transition: background 0.2s, color 0.2s;

&#x20;       }



&#x20;       .back-home-btn:hover {

&#x20;           background: var(--accent-light);

&#x20;       }



&#x20;       .progress-bar-wrap {

&#x20;           flex: 1;

&#x20;           margin: 0 20px;

&#x20;           height: 4px;

&#x20;           background: var(--border);

&#x20;           border-radius: 2px;

&#x20;           overflow: hidden;

&#x20;       }



&#x20;       .progress-bar-fill {

&#x20;           height: 100%;

&#x20;           background: var(--accent);

&#x20;           border-radius: 2px;

&#x20;           transition: width 0.5s ease;

&#x20;       }



&#x20;       .step-label {

&#x20;           font-size: 0.75rem;

&#x20;           color: var(--ink-light);

&#x20;           font-weight: 500;

&#x20;           white-space: nowrap;

&#x20;       }



&#x20;       /\* ── MAIN SCREEN ── \*/

&#x20;       .screen {

&#x20;           display: none;

&#x20;           width: 100%;

&#x20;           max-width: 640px;

&#x20;           padding: 32px 24px 40px;

&#x20;           flex-direction: column;

&#x20;           align-items: center;

&#x20;           gap: 20px;

&#x20;           animation: fadeUp 0.4s ease both;

&#x20;       }



&#x20;       .screen.active {

&#x20;           display: flex;

&#x20;       }



&#x20;       @keyframes fadeUp {

&#x20;           from {

&#x20;               opacity: 0;

&#x20;               transform: translateY(12px);

&#x20;           }



&#x20;           to {

&#x20;               opacity: 1;

&#x20;               transform: translateY(0);

&#x20;           }

&#x20;       }



&#x20;       /\* ── HOME SCREEN ── \*/

&#x20;       .home-hero {

&#x20;           width: 100%;

&#x20;           text-align: center;

&#x20;           margin-bottom: 12px;

&#x20;       }



&#x20;       .home-title {

&#x20;           font-family: 'Playfair Display', serif;

&#x20;           font-size: 2.2rem;

&#x20;           font-weight: 600;

&#x20;           color: var(--accent);

&#x20;           margin-bottom: 6px;

&#x20;       }



&#x20;       .home-subtitle {

&#x20;           font-size: 0.95rem;

&#x20;           color: var(--ink-light);

&#x20;           line-height: 1.5;

&#x20;       }



&#x20;       .category-section {

&#x20;           width: 100%;

&#x20;           margin-top: 24px;

&#x20;       }



&#x20;       .category-title {

&#x20;           font-family: 'Playfair Display', serif;

&#x20;           font-size: 1.25rem;

&#x20;           font-weight: 600;

&#x20;           color: var(--ink);

&#x20;           margin-bottom: 12px;

&#x20;           border-left: 3px solid var(--accent);

&#x20;           padding-left: 8px;

&#x20;       }



&#x20;       .courses-grid {

&#x20;           display: grid;

&#x20;           grid-template-columns: 1fr;

&#x20;           gap: 14px;

&#x20;           width: 100%;

&#x20;       }



&#x20;       @media(min-width: 480px) {

&#x20;           .courses-grid {

&#x20;               grid-template-columns: 1fr 1fr;

&#x20;           }

&#x20;       }



&#x20;       .course-card {

&#x20;           background: var(--card);

&#x20;           border: 1px solid var(--border);

&#x20;           border-radius: 12px;

&#x20;           padding: 16px;

&#x20;           cursor: pointer;

&#x20;           transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;

&#x20;           display: flex;

&#x20;           flex-direction: column;

&#x20;           justify-content: space-between;

&#x20;           gap: 10px;

&#x20;           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

&#x20;       }



&#x20;       .course-card:hover {

&#x20;           transform: translateY(-2px);

&#x20;           box-shadow: 0 6px 14px rgba(0, 0, 0, 0.05);

&#x20;           border-color: var(--accent);

&#x20;       }



&#x20;       .course-card-top {

&#x20;           display: flex;

&#x20;           flex-direction: column;

&#x20;           gap: 6px;

&#x20;       }



&#x20;       .level-badge {

&#x20;           align-self: flex-start;

&#x20;           font-size: 0.62rem;

&#x20;           font-weight: 600;

&#x20;           text-transform: uppercase;

&#x20;           padding: 2px 8px;

&#x20;           border-radius: 8px;

&#x20;           letter-spacing: 0.5px;

&#x20;       }



&#x20;       /\* level tag colors \*/

&#x20;       .level-pre-a1 {

&#x20;           background: #E2ECF5;

&#x20;           color: #1E4E79;

&#x20;       }



&#x20;       .level-a1 {

&#x20;           background: #D5ECE4;

&#x20;           color: #1B5E45;

&#x20;       }



&#x20;       .level-a2 {

&#x20;           background: #EAE6F8;

&#x20;           color: #493393;

&#x20;       }



&#x20;       .level-b1 {

&#x20;           background: #FDE8D4;

&#x20;           color: #9A5013;

&#x20;       }



&#x20;       .level-b2 {

&#x20;           background: #FDE1E3;

&#x20;           color: #9E1F28;

&#x20;       }



&#x20;       .level-c1-c2 {

&#x20;           background: #E1E2E4;

&#x20;           color: #333639;

&#x20;       }



&#x20;       .course-name {

&#x20;           font-family: 'DM Sans', sans-serif;

&#x20;           font-size: 1rem;

&#x20;           font-weight: 500;

&#x20;           color: var(--ink);

&#x20;           line-height: 1.3;

&#x20;       }



&#x20;       .course-desc {

&#x20;           font-size: 0.78rem;

&#x20;           color: var(--ink-light);

&#x20;           line-height: 1.4;

&#x20;       }



&#x20;       .course-footer {

&#x20;           display: flex;

&#x20;           justify-content: space-between;

&#x20;           align-items: center;

&#x20;           font-size: 0.72rem;

&#x20;           color: var(--ink-light);

&#x20;           border-top: 1px solid var(--border);

&#x20;           padding-top: 8px;

&#x20;           margin-top: 2px;

&#x20;       }



&#x20;       .course-count {

&#x20;           font-weight: 500;

&#x20;           color: var(--accent);

&#x20;       }



&#x20;       /\* ── MODE SELECTION CARDS ── \*/

&#x20;       .mode-card {

&#x20;           background: var(--card);

&#x20;           border: 2px solid var(--border);

&#x20;           border-radius: 16px;

&#x20;           padding: 24px;

&#x20;           cursor: pointer;

&#x20;           display: flex;

&#x20;           align-items: center;

&#x20;           gap: 20px;

&#x20;           transition: all 0.2s ease;

&#x20;           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);

&#x20;       }



&#x20;       .mode-card:hover {

&#x20;           transform: translateY(-3px);

&#x20;           border-color: var(--accent);

&#x20;           box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);

&#x20;           background: var(--accent-light);

&#x20;       }



&#x20;       .mode-icon {

&#x20;           font-size: 2.5rem;

&#x20;           display: flex;

&#x20;           align-items: center;

&#x20;           justify-content: center;

&#x20;           width: 60px;

&#x20;           height: 60px;

&#x20;           background: white;

&#x20;           border-radius: 12px;

&#x20;           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

&#x20;       }



&#x20;       .mode-info {

&#x20;           flex: 1;

&#x20;           display: flex;

&#x20;           flex-direction: column;

&#x20;           gap: 6px;

&#x20;       }



&#x20;       .mode-title {

&#x20;           font-family: 'Playfair Display', serif;

&#x20;           font-size: 1.4rem;

&#x20;           font-weight: 600;

&#x20;           color: var(--ink);

&#x20;       }



&#x20;       .mode-desc {

&#x20;           font-size: 0.9rem;

&#x20;           color: var(--ink-light);

&#x20;           line-height: 1.4;

&#x20;       }



&#x20;       /\* ── CARDS ── \*/

&#x20;       .card {

&#x20;           width: 100%;

&#x20;           background: var(--card);

&#x20;           border: 1px solid var(--border);

&#x20;           border-radius: 16px;

&#x20;           padding: 28px 28px;

&#x20;           box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

&#x20;       }



&#x20;       .phase-tag {

&#x20;           display: inline-block;

&#x20;           font-size: 0.65rem;

&#x20;           font-weight: 500;

&#x20;           letter-spacing: 1.5px;

&#x20;           text-transform: uppercase;

&#x20;           color: var(--accent);

&#x20;           background: var(--accent-light);

&#x20;           padding: 4px 10px;

&#x20;           border-radius: 20px;

&#x20;           margin-bottom: 16px;

&#x20;       }



&#x20;       .word-display {

&#x20;           font-family: 'Playfair Display', serif;

&#x20;           font-size: 2.8rem;

&#x20;           font-weight: 600;

&#x20;           color: var(--ink);

&#x20;           line-height: 1.1;

&#x20;           margin-bottom: 8px;

&#x20;       }



&#x20;       .translation-display {

&#x20;           font-size: 1.1rem;

&#x20;           color: var(--ink-light);

&#x20;           margin-bottom: 20px;

&#x20;       }



&#x20;       .audio-btn {

&#x20;           display: inline-flex;

&#x20;           align-items: center;

&#x20;           gap: 8px;

&#x20;           background: var(--accent-light);

&#x20;           color: var(--accent);

&#x20;           border: none;

&#x20;           border-radius: 8px;

&#x20;           padding: 8px 16px;

&#x20;           font-family: 'DM Sans', sans-serif;

&#x20;           font-size: 0.85rem;

&#x20;           font-weight: 500;

&#x20;           cursor: pointer;

&#x20;           transition: background 0.2s;

&#x20;           margin-bottom: 8px;

&#x20;       }



&#x20;       .audio-btn:hover {

&#x20;           background: #c8d8ea;

&#x20;       }



&#x20;       /\* ── SENTENCE CARD ── \*/

&#x20;       .sentence-area {

&#x20;           width: 100%;

&#x20;           background: var(--card);

&#x20;           border: 1px solid var(--border);

&#x20;           border-radius: 16px;

&#x20;           padding: 24px 28px;

&#x20;           box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

&#x20;       }



&#x20;       .sentence-counter {

&#x20;           font-size: 0.75rem;

&#x20;           color: var(--ink-light);

&#x20;           letter-spacing: 1px;

&#x20;           text-transform: uppercase;

&#x20;           margin-bottom: 12px;

&#x20;       }



&#x20;       .sentence-text {

&#x20;           font-size: 1.1rem;

&#x20;           line-height: 1.7;

&#x20;           color: var(--ink);

&#x20;       }



&#x20;       .sentence-text .highlight {

&#x20;           color: var(--accent);

&#x20;           font-weight: 500;

&#x20;           border-bottom: 2px solid var(--accent-light);

&#x20;       }



&#x20;       /\* ── BUTTONS ── \*/

&#x20;       .btn-primary {

&#x20;           width: 100%;

&#x20;           background: var(--accent);

&#x20;           color: white;

&#x20;           border: none;

&#x20;           border-radius: 12px;

&#x20;           padding: 16px;

&#x20;           font-family: 'DM Sans', sans-serif;

&#x20;           font-size: 1rem;

&#x20;           font-weight: 500;

&#x20;           cursor: pointer;

&#x20;           transition: background 0.2s, transform 0.1s;

&#x20;           letter-spacing: 0.2px;

&#x20;       }



&#x20;       .btn-primary:hover {

&#x20;           background: #2e4a6e;

&#x20;       }



&#x20;       .btn-primary:active {

&#x20;           transform: scale(0.98);

&#x20;       }



&#x20;       /\* ── MCQ OPTIONS ── \*/

&#x20;       .options-grid {

&#x20;           width: 100%;

&#x20;           display: grid;

&#x20;           grid-template-columns: 1fr 1fr;

&#x20;           gap: 12px;

&#x20;       }



&#x20;       .option-btn {

&#x20;           background: var(--card);

&#x20;           border: 1.5px solid var(--border);

&#x20;           border-radius: 12px;

&#x20;           padding: 16px 12px;

&#x20;           font-family: 'DM Sans', sans-serif;

&#x20;           font-size: 0.95rem;

&#x20;           font-weight: 400;

&#x20;           color: var(--ink);

&#x20;           cursor: pointer;

&#x20;           transition: border-color 0.2s, background 0.2s, transform 0.1s;

&#x20;           text-align: center;

&#x20;           line-height: 1.3;

&#x20;       }



&#x20;       .option-btn:hover {

&#x20;           border-color: var(--accent);

&#x20;           background: var(--accent-light);

&#x20;       }



&#x20;       .option-btn:active {

&#x20;           transform: scale(0.97);

&#x20;       }



&#x20;       .option-btn.correct {

&#x20;           border-color: var(--correct);

&#x20;           background: var(--correct-bg);

&#x20;           color: var(--correct);

&#x20;       }



&#x20;       .option-btn.wrong {

&#x20;           border-color: var(--wrong);

&#x20;           background: var(--wrong-bg);

&#x20;           color: var(--wrong);

&#x20;       }



&#x20;       .option-btn:disabled {

&#x20;           cursor: default;

&#x20;       }



&#x20;       /\* ── FEEDBACK BANNER ── \*/

&#x20;       .feedback-banner {

&#x20;           width: 100%;

&#x20;           border-radius: 12px;

&#x20;           padding: 14px 18px;

&#x20;           font-size: 0.9rem;

&#x20;           font-weight: 500;

&#x20;           display: none;

&#x20;           align-items: center;

&#x20;           gap: 10px;

&#x20;       }



&#x20;       .feedback-banner.show {

&#x20;           display: flex;

&#x20;       }



&#x20;       .feedback-banner.correct {

&#x20;           background: var(--correct-bg);

&#x20;           color: var(--correct);

&#x20;       }



&#x20;       .feedback-banner.wrong {

&#x20;           background: var(--wrong-bg);

&#x20;           color: var(--wrong);

&#x20;       }



&#x20;       /\* ── QUESTION PROMPT ── \*/

&#x20;       .question-prompt {

&#x20;           width: 100%;

&#x20;           text-align: center;

&#x20;       }



&#x20;       .question-prompt .q-label {

&#x20;           font-size: 0.72rem;

&#x20;           letter-spacing: 1.5px;

&#x20;           text-transform: uppercase;

&#x20;           color: var(--ink-light);

&#x20;           margin-bottom: 8px;

&#x20;       }



&#x20;       .question-prompt .q-word {

&#x20;           font-family: 'Playfair Display', serif;

&#x20;           font-size: 2.2rem;

&#x20;           font-weight: 600;

&#x20;           color: var(--ink);

&#x20;       }



&#x20;       .question-prompt .q-sub {

&#x20;           font-size: 0.9rem;

&#x20;           color: var(--ink-light);

&#x20;           margin-top: 6px;

&#x20;       }



&#x20;       /\* ── CLOZE ── \*/

&#x20;       .cloze-sentence {

&#x20;           font-size: 1.1rem;

&#x20;           line-height: 1.8;

&#x20;           color: var(--ink);

&#x20;           margin-bottom: 6px;

&#x20;       }



&#x20;       .gap {

&#x20;           display: inline-block;

&#x20;           min-width: 80px;

&#x20;           border-bottom: 2px solid var(--accent);

&#x20;           color: var(--accent);

&#x20;           font-weight: 500;

&#x20;           text-align: center;

&#x20;           padding: 0 4px;

&#x20;       }



&#x20;       .cloze-options {

&#x20;           display: flex;

&#x20;           flex-direction: column;

&#x20;           gap: 10px;

&#x20;           width: 100%;

&#x20;           margin-top: 4px;

&#x20;       }



&#x20;       .cloze-option {

&#x20;           background: var(--card);

&#x20;           border: 1.5px solid var(--border);

&#x20;           border-radius: 10px;

&#x20;           padding: 13px 18px;

&#x20;           font-family: 'DM Sans', sans-serif;

&#x20;           font-size: 0.95rem;

&#x20;           color: var(--ink);

&#x20;           cursor: pointer;

&#x20;           transition: border-color 0.2s, background 0.2s;

&#x20;           text-align: left;

&#x20;       }



&#x20;       .cloze-option:hover {

&#x20;           border-color: var(--accent);

&#x20;           background: var(--accent-light);

&#x20;       }



&#x20;       .cloze-option.correct {

&#x20;           border-color: var(--correct);

&#x20;           background: var(--correct-bg);

&#x20;           color: var(--correct);

&#x20;       }



&#x20;       .cloze-option.wrong {

&#x20;           border-color: var(--wrong);

&#x20;           background: var(--wrong-bg);

&#x20;           color: var(--wrong);

&#x20;       }



&#x20;       .cloze-option:disabled {

&#x20;           cursor: default;

&#x20;       }



&#x20;       /\* ── TYPE INPUT ── \*/

&#x20;       .type-input {

&#x20;           width: 100%;

&#x20;           border: 1.5px solid var(--border);

&#x20;           border-radius: 10px;

&#x20;           padding: 14px 16px;

&#x20;           font-family: 'DM Sans', sans-serif;

&#x20;           font-size: 1.1rem;

&#x20;           color: var(--ink);

&#x20;           background: var(--card);

&#x20;           outline: none;

&#x20;           transition: border-color 0.2s;

&#x20;           text-align: center;

&#x20;           letter-spacing: 1px;

&#x20;       }



&#x20;       .type-input:focus {

&#x20;           border-color: var(--accent);

&#x20;       }



&#x20;       .type-input.correct {

&#x20;           border-color: var(--correct);

&#x20;           background: var(--correct-bg);

&#x20;       }



&#x20;       .type-input.wrong {

&#x20;           border-color: var(--wrong);

&#x20;           background: var(--wrong-bg);

&#x20;       }



&#x20;       /\* ── EX3 PARTIAL WORD ── \*/

&#x20;       .partial-word-display {

&#x20;           font-family: 'Playfair Display', serif;

&#x20;           font-size: 2rem;

&#x20;           letter-spacing: 6px;

&#x20;           color: var(--ink);

&#x20;           text-align: center;

&#x20;           margin: 8px 0 4px;

&#x20;       }



&#x20;       .partial-word-display .blank {

&#x20;           color: var(--accent);

&#x20;           border-bottom: 2px solid var(--accent);

&#x20;           min-width: 18px;

&#x20;           display: inline-block;

&#x20;       }



&#x20;       /\* ── SECTION TITLE ── \*/

&#x20;       .section-title {

&#x20;           font-family: 'Playfair Display', serif;

&#x20;           font-size: 1.5rem;

&#x20;           font-weight: 600;

&#x20;           color: var(--ink);

&#x20;           text-align: center;

&#x20;       }



&#x20;       .section-sub {

&#x20;           font-size: 0.9rem;

&#x20;           color: var(--ink-light);

&#x20;           text-align: center;

&#x20;           line-height: 1.6;

&#x20;       }



&#x20;       /\* ── COMPLETE SCREEN ── \*/

&#x20;       .complete-icon {

&#x20;           font-size: 3rem;

&#x20;           text-align: center;

&#x20;       }



&#x20;       .complete-title {

&#x20;           font-family: 'Playfair Display', serif;

&#x20;           font-size: 2rem;

&#x20;           font-weight: 600;

&#x20;           text-align: center;

&#x20;           color: var(--ink);

&#x20;       }



&#x20;       .complete-sub {

&#x20;           font-size: 1rem;

&#x20;           color: var(--ink-light);

&#x20;           text-align: center;

&#x20;           line-height: 1.6;

&#x20;       }



&#x20;       /\* ── DIVIDER ── \*/

&#x20;       .divider {

&#x20;           width: 100%;

&#x20;           height: 1px;

&#x20;           background: var(--border);

&#x20;       }



&#x20;       /\* ── WORD COUNTER ── \*/

&#x20;       .word-counter {

&#x20;           font-size: 0.8rem;

&#x20;           color: var(--ink-light);

&#x20;           text-align: center;

&#x20;       }



&#x20;       /\* Screen-specific helpers \*/

&#x20;       .hidden {

&#x20;           display: none !important;

&#x20;       }



&#x20;       .mt-4 {

&#x20;           margin-top: 4px;

&#x20;       }



&#x20;       .mt-8 {

&#x20;           margin-top: 8px;

&#x20;       }



&#x20;       .center {

&#x20;           text-align: center;

&#x20;       }



&#x20;       /\* ── LOADING SPINNER ── \*/

&#x20;       .spinner {

&#x20;           border: 4px solid var(--accent-light);

&#x20;           border-top: 4px solid var(--accent);

&#x20;           border-radius: 50%;

&#x20;           width: 40px;

&#x20;           height: 40px;

&#x20;           animation: spin 1s linear infinite;

&#x20;           margin: 0 auto 20px;

&#x20;       }



&#x20;       @keyframes spin {

&#x20;           0% {

&#x20;               transform: rotate(0deg);

&#x20;           }



&#x20;           100% {

&#x20;               transform: rotate(360deg);

&#x20;           }

&#x20;       }



&#x20;       .instructions-list {

&#x20;           text-align: left;

&#x20;           padding-left: 20px;

&#x20;           margin-bottom: 20px;

&#x20;           font-size: 0.85rem;

&#x20;           line-height: 1.6;

&#x20;           color: var(--ink-light);

&#x20;       }



&#x20;       .instructions-list li {

&#x20;           margin-bottom: 8px;

&#x20;       }



&#x20;       /\* ── TRANSITION SCREEN ── \*/

&#x20;       .transition-icon {

&#x20;           width: 80px;

&#x20;           height: 80px;

&#x20;           margin-bottom: 20px;

&#x20;           animation: bounce 1s infinite alternate;

&#x20;       }



&#x20;       @keyframes bounce {

&#x20;           from {

&#x20;               transform: translateY(0);

&#x20;           }



&#x20;           to {

&#x20;               transform: translateY(-15px);

&#x20;           }

&#x20;       }



&#x20;       .transition-msg {

&#x20;           font-family: 'Playfair Display', serif;

&#x20;           font-size: 2rem;

&#x20;           font-weight: 600;

&#x20;           color: var(--ink);

&#x20;           text-align: center;

&#x20;       }



&#x20;       /\* ── AUTH \& PROFILE CSS ── \*/

&#x20;       .form-group {

&#x20;           width: 100%;

&#x20;           margin-bottom: 16px;

&#x20;           display: flex;

&#x20;           flex-direction: column;

&#x20;           gap: 6px;

&#x20;           text-align: left;

&#x20;       }



&#x20;       .form-label {

&#x20;           font-size: 0.85rem;

&#x20;           font-weight: 600;

&#x20;           color: var(--ink);

&#x20;       }



&#x20;       .form-input {

&#x20;           width: 100%;

&#x20;           border: 1.5px solid var(--border);

&#x20;           border-radius: 10px;

&#x20;           padding: 12px 16px;

&#x20;           font-family: 'DM Sans', sans-serif;

&#x20;           font-size: 1rem;

&#x20;           color: var(--ink);

&#x20;           background: var(--card);

&#x20;           outline: none;

&#x20;           transition: border-color 0.2s;

&#x20;       }



&#x20;       .form-input:focus {

&#x20;           border-color: var(--accent);

&#x20;       }



&#x20;       .form-error {

&#x20;           font-size: 0.75rem;

&#x20;           color: var(--wrong);

&#x20;           min-height: 14px;

&#x20;       }



&#x20;       .avatar-grid {

&#x20;           display: flex;

&#x20;           justify-content: center;

&#x20;           gap: 12px;

&#x20;           margin-bottom: 16px;

&#x20;       }



&#x20;       .avatar-btn {

&#x20;           width: 50px;

&#x20;           height: 50px;

&#x20;           border-radius: 50%;

&#x20;           background: var(--card);

&#x20;           border: 2px solid var(--border);

&#x20;           font-size: 1.5rem;

&#x20;           cursor: pointer;

&#x20;           display: flex;

&#x20;           align-items: center;

&#x20;           justify-content: center;

&#x20;           transition: transform 0.2s, border-color 0.2s;

&#x20;       }



&#x20;       .avatar-btn.selected {

&#x20;           border-color: var(--accent);

&#x20;           background: var(--accent-light);

&#x20;           transform: scale(1.1);

&#x20;       }



&#x20;       .auth-link {

&#x20;           color: var(--accent);

&#x20;           font-size: 0.85rem;

&#x20;           text-decoration: underline;

&#x20;           cursor: pointer;

&#x20;           background: none;

&#x20;           border: none;

&#x20;           font-family: 'DM Sans', sans-serif;

&#x20;       }



&#x20;       .oauth-btn {

&#x20;           width: 100%;

&#x20;           background: var(--card);

&#x20;           color: var(--ink);

&#x20;           border: 1px solid var(--border);

&#x20;           border-radius: 12px;

&#x20;           padding: 12px;

&#x20;           font-family: 'DM Sans', sans-serif;

&#x20;           font-size: 0.95rem;

&#x20;           font-weight: 500;

&#x20;           cursor: pointer;

&#x20;           display: flex;

&#x20;           align-items: center;

&#x20;           justify-content: center;

&#x20;           gap: 8px;

&#x20;           margin-bottom: 8px;

&#x20;           transition: background 0.2s;

&#x20;       }



&#x20;       .oauth-btn:hover {

&#x20;           background: var(--accent-light);

&#x20;       }



&#x20;       .divider-text {

&#x20;           font-size: 0.8rem;

&#x20;           color: var(--ink-light);

&#x20;           text-transform: uppercase;

&#x20;           letter-spacing: 1px;

&#x20;           margin: 16px 0;

&#x20;           display: flex;

&#x20;           align-items: center;

&#x20;           width: 100%;

&#x20;       }



&#x20;       .divider-text::before,

&#x20;       .divider-text::after {

&#x20;           content: "";

&#x20;           flex: 1;

&#x20;           border-bottom: 1px solid var(--border);

&#x20;       }



&#x20;       .divider-text::before {

&#x20;           margin-right: 12px;

&#x20;       }



&#x20;       .divider-text::after {

&#x20;           margin-left: 12px;

&#x20;       }



&#x20;       .username-status {

&#x20;           font-size: 0.8rem;

&#x20;           margin-top: -4px;

&#x20;       }



&#x20;       .username-status.ok {

&#x20;           color: var(--correct);

&#x20;       }



&#x20;       .username-status.taken {

&#x20;           color: var(--wrong);

&#x20;       }



&#x20;       .leaderboard-table {

&#x20;           width: 100%;

&#x20;           border-collapse: collapse;

&#x20;           font-size: 0.9rem;

&#x20;           background: var(--card);

&#x20;           border-radius: 12px;

&#x20;           overflow: hidden;

&#x20;           border: 1px solid var(--border);

&#x20;       }



&#x20;       .leaderboard-table th,

&#x20;       .leaderboard-table td {

&#x20;           padding: 12px;

&#x20;           text-align: left;

&#x20;           border-bottom: 1px solid var(--border);

&#x20;       }



&#x20;       .leaderboard-table th {

&#x20;           background: var(--accent-light);

&#x20;           font-weight: 600;

&#x20;           color: var(--accent);

&#x20;       }



&#x20;       .leaderboard-table tr:last-child td {

&#x20;           border-bottom: none;

&#x20;       }



&#x20;       .leaderboard-table tr.highlight {

&#x20;           background: rgba(61, 90, 128, 0.05);

&#x20;           font-weight: 600;

&#x20;       }



&#x20;       .profile-stats-card {

&#x20;           background: var(--card);

&#x20;           border: 1px solid var(--border);

&#x20;           border-radius: 16px;

&#x20;           padding: 24px;

&#x20;           width: 100%;

&#x20;           display: flex;

&#x20;           flex-direction: column;

&#x20;           align-items: center;

&#x20;           gap: 12px;

&#x20;           box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);

&#x20;       }



&#x20;       .profile-avatar-large {

&#x20;           font-size: 3rem;

&#x20;           width: 80px;

&#x20;           height: 80px;

&#x20;           background: var(--accent-light);

&#x20;           border-radius: 50%;

&#x20;           display: flex;

&#x20;           align-items: center;

&#x20;           justify-content: center;

&#x20;       }



&#x20;       .profile-course-card {

&#x20;           background: var(--card);

&#x20;           border: 1px solid var(--border);

&#x20;           border-radius: 12px;

&#x20;           padding: 16px;

&#x20;           width: 100%;

&#x20;           margin-top: 12px;

&#x20;       }



&#x20;       .progress-pills {

&#x20;           display: flex;

&#x20;           gap: 8px;

&#x20;           margin-top: 12px;

&#x20;           font-size: 0.75rem;

&#x20;           font-weight: 600;

&#x20;       }



&#x20;       .pill {

&#x20;           padding: 4px 10px;

&#x20;           border-radius: 12px;

&#x20;       }



&#x20;       .pill.seen {

&#x20;           background: var(--accent-light);

&#x20;           color: var(--accent);

&#x20;       }



&#x20;       .pill.learning {

&#x20;           background: #FFF3CD;

&#x20;           color: #856404;

&#x20;       }



&#x20;       .pill.learnt {

&#x20;           background: var(--correct-bg);

&#x20;           color: var(--correct);

&#x20;       }



&#x20;       /\* ── EX2 GAME ── \*/

&#x20;       .game-area {

&#x20;           position: relative;

&#x20;           width: 100%;

&#x20;           height: 350px;

&#x20;           background: var(--card);

&#x20;           border: 1.5px solid var(--border);

&#x20;           border-radius: 16px;

&#x20;           overflow: hidden;

&#x20;           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

&#x20;       }



&#x20;       .game-target-center {

&#x20;           position: absolute;

&#x20;           top: 50%;

&#x20;           left: 50%;

&#x20;           transform: translate(-50%, -50%);

&#x20;           font-family: 'Playfair Display', serif;

&#x20;           font-size: 2.2rem;

&#x20;           font-weight: 700;

&#x20;           color: var(--accent);

&#x20;           background: rgba(255, 255, 255, 0.9);

&#x20;           padding: 10px 24px;

&#x20;           border-radius: 16px;

&#x20;           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

&#x20;           pointer-events: none;

&#x20;           text-align: center;

&#x20;           z-index: 5;

&#x20;           white-space: nowrap;

&#x20;       }



&#x20;       .game-bubble {

&#x20;           position: absolute;

&#x20;           padding: 10px 16px;

&#x20;           background: var(--accent);

&#x20;           color: white;

&#x20;           border-radius: 20px;

&#x20;           font-weight: 500;

&#x20;           font-size: 1rem;

&#x20;           cursor: pointer;

&#x20;           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

&#x20;           transform: translate(-50%, -50%) scale(0);

&#x20;           transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s;

&#x20;           z-index: 10;

&#x20;       }



&#x20;       .game-bubble.show {

&#x20;           transform: translate(-50%, -50%) scale(1);

&#x20;       }



&#x20;       .game-bubble.distractor {

&#x20;           background: white;

&#x20;           color: var(--ink);

&#x20;           border: 1.5px solid var(--border);

&#x20;       }



&#x20;       .game-timer {

&#x20;           font-family: 'DM Sans', sans-serif;

&#x20;           font-size: 1.2rem;

&#x20;           font-weight: 600;

&#x20;           color: var(--accent);

&#x20;           text-align: center;

&#x20;           margin-bottom: 12px;

&#x20;       }



&#x20;       .game-score-fly {

&#x20;           position: absolute;

&#x20;           color: var(--correct);

&#x20;           font-weight: bold;

&#x20;           font-size: 1.5rem;

&#x20;           pointer-events: none;

&#x20;           animation: flyUp 1s forwards;

&#x20;           z-index: 20;

&#x20;       }



&#x20;       @keyframes flyUp {

&#x20;           0% {

&#x20;               transform: translate(-50%, 0);

&#x20;               opacity: 1;

&#x20;           }



&#x20;           100% {

&#x20;               transform: translate(-50%, -40px);

&#x20;               opacity: 0;

&#x20;           }

&#x20;       }



&#x20;       /\* ── LIVES ── \*/

&#x20;       .lives-container {

&#x20;           display: flex;

&#x20;           gap: 4px;

&#x20;           align-items: center;

&#x20;       }



&#x20;       .heart {

&#x20;           font-size: 1.2rem;

&#x20;           color: var(--wrong);

&#x20;           transition: opacity 0.3s, filter 0.3s;

&#x20;       }



&#x20;       .heart.lost {

&#x20;           opacity: 0.3;

&#x20;           filter: grayscale(100%);

&#x20;       }



&#x20;       /\* ── WORD PREVIEW SCREEN ── \*/

&#x20;       .word-preview-grid {

&#x20;           width: 100%;

&#x20;           display: grid;

&#x20;           grid-template-columns: 1fr 1fr;

&#x20;           gap: 8px;

&#x20;           max-height: 55vh;

&#x20;           overflow-y: auto;

&#x20;           padding-right: 4px;

&#x20;       }



&#x20;       .word-preview-grid::-webkit-scrollbar {

&#x20;           width: 4px;

&#x20;       }



&#x20;       .word-preview-grid::-webkit-scrollbar-track {

&#x20;           background: var(--bg);

&#x20;       }



&#x20;       .word-preview-grid::-webkit-scrollbar-thumb {

&#x20;           background: var(--border);

&#x20;           border-radius: 2px;

&#x20;       }



&#x20;       .word-chip {

&#x20;           background: var(--card);

&#x20;           border: 1px solid var(--border);

&#x20;           border-radius: 10px;

&#x20;           padding: 10px 12px;

&#x20;           display: flex;

&#x20;           flex-direction: column;

&#x20;           gap: 2px;

&#x20;           transition: border-color 0.2s;

&#x20;       }



&#x20;       .word-chip:hover {

&#x20;           border-color: var(--accent);

&#x20;       }



&#x20;       .word-chip-en {

&#x20;           font-weight: 600;

&#x20;           font-size: 0.95rem;

&#x20;           color: var(--ink);

&#x20;       }



&#x20;       .word-chip-fr {

&#x20;           font-size: 0.78rem;

&#x20;           color: var(--ink-light);

&#x20;       }



/\* ── MATCH TABLE ── \*/

.match-table-wrap {

&#x20;   width: 100%;

&#x20;   background: var(--card);

&#x20;   border: 1px solid var(--border);

&#x20;   border-radius: 16px;

&#x20;   overflow: hidden;

&#x20;   box-shadow: 0 2px 12px rgba(0,0,0,0.04);

}

.match-table { width: 100%; border-collapse: collapse; }

.match-table th {

&#x20;   font-size: 0.72rem; font-weight: 600; letter-spacing: 1.2px;

&#x20;   text-transform: uppercase; color: var(--ink-light);

&#x20;   padding: 12px 16px; background: var(--bg);

&#x20;   border-bottom: 1px solid var(--border); text-align: left;

}

.match-table td { padding: 0; border-bottom: 1px solid var(--border); width: 50%; }

.match-table tr:last-child td { border-bottom: none; }

.match-cell {

&#x20;   display: block; width: 100%; padding: 16px; cursor: pointer;

&#x20;   font-size: 0.95rem; color: var(--ink);

&#x20;   transition: background 0.15s, color 0.15s;

&#x20;   user-select: none; -webkit-user-select: none;

}

.match-cell.selected { background: var(--accent-light); color: var(--accent); font-weight: 500; }

.match-cell.wrong { background: var(--wrong-bg); color: var(--wrong); }

.match-cell.matched { opacity: 0; transition: opacity 0.4s ease; pointer-events: none; 

}

&#x20;   </style>

</head>



<body>



&#x20;   <div class="app-header">

&#x20;       <div class="logo-area">

&#x20;           <button class="back-home-btn hidden" id="header-home-btn" onclick="goToHome()">

&#x20;               ← Accueil

&#x20;           </button>

&#x20;           <div class="logo" id="header-logo">Lexio</div>

&#x20;       </div>

&#x20;       <div class="progress-bar-wrap" id="header-progress-wrap" style="display:none; flex: 1; margin: 0 15px;">

&#x20;           <div class="progress-bar-fill" id="progressBar" style="width:0%"></div>

&#x20;       </div>

&#x20;       <div class="lives-container" id="lives-container" style="display:none;"></div>

&#x20;       <div id="header-profile-btn-container" style="display:none; margin-left: auto;">

&#x20;           <button class="avatar-btn" id="header-avatar-btn" style="width: 40px; height: 40px; font-size: 1.2rem;"

&#x20;               onclick="showScreen('screen-profile-own')">🐍</button>

&#x20;       </div>

&#x20;   </div>



&#x20;   <!-- ══════════════════════════════════════════

&#x20;    SCREEN: LOADING SCREEN

══════════════════════════════════════════ -->

&#x20;   <div class="screen" id="screen-loading">

&#x20;       <div class="card" style="text-align: center; padding: 40px 20px;">

&#x20;           <div class="logo" style="font-size: 2.5rem; margin-bottom: 20px;">Lexio</div>

&#x20;           <div class="spinner"></div>

&#x20;           <div class="section-sub" id="loading-status">Chargement en cours...</div>

&#x20;       </div>

&#x20;   </div>



&#x20;   <!-- ══════════════════════════════════════════

&#x20;    SCREEN: ERROR SCREEN (CORS / HTTP)

══════════════════════════════════════════ -->

&#x20;   <div class="screen" id="screen-error">

&#x20;       <div class="card" style="border-color: var(--wrong); background: var(--card); padding: 32px 24px;">

&#x20;           <div class="phase-tag" style="background: var(--wrong-bg); color: var(--wrong); margin-bottom: 20px;">Erreur

&#x20;               de

&#x20;               chargement</div>

&#x20;           <div class="word-display"

&#x20;               style="font-size: 2rem; color: var(--wrong); margin-bottom: 12px; font-family: 'Playfair Display', serif;">

&#x20;               Impossible de charger les données</div>

&#x20;           <p class="section-sub" style="text-align: left; margin-bottom: 16px; font-size: 0.95rem; line-height: 1.6;">

&#x20;               Pour des raisons de sécurité, les navigateurs bloquent la lecture de fichiers externes (politique CORS)

&#x20;               lorsque

&#x20;               l'application est ouverte directement comme un fichier local (adresse commençant par

&#x20;               <code>file://</code>).

&#x20;           </p>

&#x20;           <div class="divider" style="margin-bottom: 16px;"></div>

&#x20;           <p class="section-sub" style="text-align: left; font-weight: 500; color: var(--ink); margin-bottom: 8px;">

&#x20;               Comment

&#x20;               lancer un serveur local :</p>

&#x20;           <ul class="instructions-list">

&#x20;               <li><strong>Avec VS Code :</strong> Ouvrez le dossier du projet dans VS Code, installez l'extension

&#x20;                   <strong>Live

&#x20;                       Server</strong>, puis cliquez sur <strong>Go Live</strong> en bas à droite.</li>

&#x20;               <li><strong>Avec Python :</strong> Ouvrez votre console dans ce dossier et tapez

&#x20;                   <code>python -m http.server</code>. Ouvrez ensuite <code>http://localhost:8000</code> dans votre

&#x20;                   navigateur.

&#x20;               </li>

&#x20;               <li><strong>Consultez le fichier :</strong> <code>GUIDE-SERVEUR-LOCAL.md</code> dans le dossier du

&#x20;                   projet pour

&#x20;                   plus de détails.</li>

&#x20;           </ul>

&#x20;           <button class="btn-primary" onclick="handleRetry()">Réessayer</button>

&#x20;       </div>

&#x20;   </div>



&#x20;   <!-- ══════════════════════════════════════════

&#x20;    SCREEN: AUTH \& PROFILE

══════════════════════════════════════════ -->

&#x20;   <div class="screen" id="screen-signup">

&#x20;       <div class="card">

&#x20;           <div class="logo" style="text-align: center; font-size: 2rem; margin-bottom: 24px;">Lexio</div>

&#x20;           <div class="section-title">Créer un compte</div>

&#x20;           <div class="section-sub" style="margin-bottom: 24px;">Inscris-toi pour sauvegarder ta progression</div>







&#x20;           <form id="form-signup" onsubmit="handleSignup(event)">

&#x20;               <div class="form-group">

&#x20;                   <label class="form-label">Email</label>

&#x20;                   <input type="email" class="form-input" id="signup-email" required>

&#x20;               </div>



&#x20;               <div class="form-group">

&#x20;                   <label class="form-label">Nom d'utilisateur</label>

&#x20;                   <input type="text" class="form-input" id="signup-username" required>

&#x20;                   <div class="username-status" id="status-signup-username" aria-live="polite"></div>

&#x20;                   <div class="form-error" id="err-signup-username" aria-live="polite"></div>

&#x20;               </div>



&#x20;               <div class="form-group">

&#x20;                   <label class="form-label">Mot de passe</label>

&#x20;                   <input type="password" class="form-input" id="signup-password" required>

&#x20;                   <div class="form-error" id="err-signup-password" aria-live="polite"></div>

&#x20;               </div>



&#x20;               <div class="form-group">

&#x20;                   <label class="form-label">Confirmer le mot de passe</label>

&#x20;                   <input type="password" class="form-input" id="signup-confirm-password" required>

&#x20;                   <div class="form-error" id="err-signup-confirm-password" aria-live="polite"></div>

&#x20;               </div>



&#x20;               <div class="form-group">

&#x20;                   <label class="form-label" style="text-align: center; margin-bottom: 8px;">Choisis ton avatar</label>

&#x20;                   <div class="avatar-grid" id="signup-avatar-grid">

&#x20;                       <button type="button" class="avatar-btn" onclick="selectAvatar('signup', 'snake')"

&#x20;                           aria-label="Snake avatar">🐍</button>

&#x20;                       <button type="button" class="avatar-btn" onclick="selectAvatar('signup', 'dragon')"

&#x20;                           aria-label="Dragon avatar">🐉</button>

&#x20;                       <button type="button" class="avatar-btn" onclick="selectAvatar('signup', 'horse')"

&#x20;                           aria-label="Horse avatar">🐴</button>

&#x20;                       <button type="button" class="avatar-btn" onclick="selectAvatar('signup', 'rabbit')"

&#x20;                           aria-label="Rabbit avatar">🐰</button>

&#x20;                       <button type="button" class="avatar-btn" onclick="selectAvatar('signup', 'lion')"

&#x20;                           aria-label="Lion avatar">🦁</button>

&#x20;                   </div>

&#x20;                   <div class="form-error" id="err-signup-avatar" aria-live="polite" style="text-align: center;"></div>

&#x20;               </div>



&#x20;               <button type="submit" class="btn-primary" id="btn-signup-submit" style="margin-top: 16px;">Créer mon

&#x20;                   compte</button>

&#x20;               <div class="form-error" id="err-signup-general" style="text-align: center; margin-top: 12px;"

&#x20;                   aria-live="polite"></div>

&#x20;           </form>



&#x20;           <div style="text-align: center; margin-top: 24px;">

&#x20;               <span style="font-size: 0.85rem; color: var(--ink-light);">Déjà un compte ?</span>

&#x20;               <button class="auth-link" onclick="showScreen('screen-login')">Se connecter</button>

&#x20;           </div>

&#x20;           <div style="text-align: center; margin-top: 12px;">

&#x20;               <button class="auth-link" style="font-size: 0.75rem; color: var(--ink-light);"

&#x20;                   onclick="showScreen('screen-privacy')">Politique de confidentialité</button>

&#x20;           </div>

&#x20;       </div>

&#x20;   </div>



&#x20;   <div class="screen" id="screen-login">

&#x20;       <div class="card">

&#x20;           <div class="logo" style="text-align: center; font-size: 2rem; margin-bottom: 24px;">Lexio</div>

&#x20;           <div class="section-title">Connexion</div>

&#x20;           <div class="section-sub" style="margin-bottom: 24px;">Content de te revoir !</div>







&#x20;           <form id="form-login" onsubmit="handleLogin(event)">

&#x20;               <div class="form-group">

&#x20;                   <label class="form-label">Email</label>

&#x20;                   <input type="email" class="form-input" id="login-email" required>

&#x20;               </div>



&#x20;               <div class="form-group">

&#x20;                   <label class="form-label">Mot de passe</label>

&#x20;                   <input type="password" class="form-input" id="login-password" required>

&#x20;               </div>



&#x20;               <div style="text-align: right; margin-bottom: 16px;">

&#x20;                   <button type="button" class="auth-link" onclick="showScreen('screen-forgot-password')">Mot de passe

&#x20;                       oublié ?</button>

&#x20;               </div>



&#x20;               <button type="submit" class="btn-primary" id="btn-login-submit">Se connecter</button>

&#x20;               <div class="form-error" id="err-login-general" style="text-align: center; margin-top: 12px;"

&#x20;                   aria-live="polite"></div>



&#x20;               <div id="login-resend-container" style="display: none; text-align: center; margin-top: 12px;">

&#x20;                   <button type="button" class="auth-link" onclick="resendVerificationEmail()">Renvoyer l'email de

&#x20;                       confirmation</button>

&#x20;               </div>

&#x20;           </form>



&#x20;           <div style="text-align: center; margin-top: 24px;">

&#x20;               <span style="font-size: 0.85rem; color: var(--ink-light);">Pas encore de compte ?</span>

&#x20;               <button class="auth-link" onclick="showScreen('screen-signup')">S'inscrire</button>

&#x20;           </div>

&#x20;       </div>

&#x20;   </div>



&#x20;   <div class="screen" id="screen-oauth-setup">

&#x20;       <div class="card">

&#x20;           <div class="section-title">Dernière étape</div>

&#x20;           <div class="section-sub" style="margin-bottom: 24px;">Choisis ton profil pour terminer l'inscription.</div>

&#x20;           <form id="form-oauth-setup" onsubmit="handleOAuthSetup(event)">

&#x20;               <div class="form-group">

&#x20;                   <label class="form-label">Nom d'utilisateur</label>

&#x20;                   <input type="text" class="form-input" id="oauth-username" required>

&#x20;                   <div class="username-status" id="status-oauth-username" aria-live="polite"></div>

&#x20;                   <div class="form-error" id="err-oauth-username" aria-live="polite"></div>

&#x20;               </div>

&#x20;               <div class="form-group">

&#x20;                   <label class="form-label" style="text-align: center; margin-bottom: 8px;">Choisis ton avatar</label>

&#x20;                   <div class="avatar-grid" id="oauth-avatar-grid">

&#x20;                       <button type="button" class="avatar-btn" onclick="selectAvatar('oauth', 'snake')">🐍</button>

&#x20;                       <button type="button" class="avatar-btn" onclick="selectAvatar('oauth', 'dragon')">🐉</button>

&#x20;                       <button type="button" class="avatar-btn" onclick="selectAvatar('oauth', 'horse')">🐴</button>

&#x20;                       <button type="button" class="avatar-btn" onclick="selectAvatar('oauth', 'rabbit')">🐰</button>

&#x20;                       <button type="button" class="avatar-btn" onclick="selectAvatar('oauth', 'lion')">🦁</button>

&#x20;                   </div>

&#x20;                   <div class="form-error" id="err-oauth-avatar" aria-live="polite" style="text-align: center;"></div>

&#x20;               </div>

&#x20;               <button type="submit" class="btn-primary" id="btn-oauth-submit"

&#x20;                   style="margin-top: 16px;">Terminer</button>

&#x20;               <div class="form-error" id="err-oauth-general" style="text-align: center; margin-top: 12px;"></div>

&#x20;           </form>

&#x20;       </div>

&#x20;   </div>



&#x20;   <div class="screen" id="screen-verify-email">

&#x20;       <div class="card" style="text-align: center;">

&#x20;           <div class="complete-icon" style="margin-bottom: 16px;">✉️</div>

&#x20;           <div class="section-title">Vérifie tes emails</div>

&#x20;           <div class="section-sub" id="verify-email-msg" style="margin-top: 12px; margin-bottom: 24px;">

&#x20;               Nous t'avons envoyé un lien de confirmation. Clique dessus pour activer ton compte.

&#x20;           </div>

&#x20;           <button class="btn-primary" onclick="showScreen('screen-login')">Retour à la connexion</button>

&#x20;       </div>

&#x20;   </div>



&#x20;   <div class="screen" id="screen-link-expired">

&#x20;       <div class="card" style="text-align: center;">

&#x20;           <div class="complete-icon" style="margin-bottom: 16px;">⚠️</div>

&#x20;           <div class="section-title">Lien invalide</div>

&#x20;           <div class="section-sub" style="margin-top: 12px; margin-bottom: 24px;">

&#x20;               Ce lien de confirmation est expiré ou invalide.

&#x20;           </div>

&#x20;           <button class="btn-primary" id="btn-resend-link" onclick="resendVerificationEmail()">Renvoyer l'email de

&#x20;               confirmation</button>

&#x20;           <div class="section-sub" id="msg-resend-success"

&#x20;               style="margin-top: 12px; color: var(--correct); display: none;"></div>

&#x20;           <button class="auth-link" style="margin-top: 16px;" onclick="showScreen('screen-login')">Retour à la

&#x20;               connexion</button>

&#x20;       </div>

&#x20;   </div>



&#x20;   <div class="screen" id="screen-forgot-password">

&#x20;       <div class="card">

&#x20;           <div class="section-title">Mot de passe oublié</div>

&#x20;           <div class="section-sub" style="margin-bottom: 24px;">Saisis ton email pour recevoir un lien de

&#x20;               réinitialisation.</div>

&#x20;           <form id="form-forgot-password" onsubmit="handleForgotPassword(event)">

&#x20;               <div class="form-group">

&#x20;                   <label class="form-label">Email</label>

&#x20;                   <input type="email" class="form-input" id="forgot-email" required>

&#x20;               </div>

&#x20;               <button type="submit" class="btn-primary" id="btn-forgot-submit">Envoyer le lien</button>

&#x20;               <div class="section-sub" id="msg-forgot-success"

&#x20;                   style="margin-top: 12px; color: var(--correct); display: none;"></div>

&#x20;               <div class="form-error" id="err-forgot-general" style="text-align: center; margin-top: 12px;"></div>

&#x20;           </form>

&#x20;           <div style="text-align: center; margin-top: 24px;">

&#x20;               <button class="auth-link" onclick="showScreen('screen-login')">Retour à la connexion</button>

&#x20;           </div>

&#x20;       </div>

&#x20;   </div>



&#x20;   <div class="screen" id="screen-reset-password">

&#x20;       <div class="card">

&#x20;           <div class="section-title">Nouveau mot de passe</div>

&#x20;           <div class="section-sub" style="margin-bottom: 24px;">Choisis un nouveau mot de passe pour ton compte.</div>

&#x20;           <form id="form-reset-password" onsubmit="handleResetPassword(event)">

&#x20;               <div class="form-group">

&#x20;                   <label class="form-label">Nouveau mot de passe</label>

&#x20;                   <input type="password" class="form-input" id="reset-password" required>

&#x20;                   <div class="form-error" id="err-reset-password" aria-live="polite"></div>

&#x20;               </div>

&#x20;               <div class="form-group">

&#x20;                   <label class="form-label">Confirmer le mot de passe</label>

&#x20;                   <input type="password" class="form-input" id="reset-confirm-password" required>

&#x20;                   <div class="form-error" id="err-reset-confirm-password" aria-live="polite"></div>

&#x20;               </div>

&#x20;               <button type="submit" class="btn-primary" id="btn-reset-submit">Mettre à jour le mot de passe</button>

&#x20;               <div class="section-sub" id="msg-reset-success"

&#x20;                   style="margin-top: 12px; color: var(--correct); display: none;"></div>

&#x20;               <div class="form-error" id="err-reset-general" style="text-align: center; margin-top: 12px;"></div>

&#x20;           </form>

&#x20;       </div>

&#x20;   </div>



&#x20;   <!-- Profile \& Settings Screens -->

&#x20;   <div class="screen" id="screen-profile-own">

&#x20;       <div class="card" style="padding: 24px;">

&#x20;           <button class="back-home-btn" onclick="showScreen('screen-home')" style="margin-bottom: 16px;">←

&#x20;               Retour</button>

&#x20;           <div class="profile-stats-card" id="profile-own-header">

&#x20;               <!-- Rendered by JS -->

&#x20;           </div>

&#x20;           <div style="text-align: center; margin-top: 16px;">

&#x20;               <button class="btn-primary" style="padding: 10px; width: auto; font-size: 0.9rem;"

&#x20;                   onclick="showScreen('screen-profile-edit')">Modifier le profil</button>

&#x20;               <button class="btn-primary"

&#x20;                   style="padding: 10px; width: auto; font-size: 0.9rem; background: var(--ink-light); margin-left: 8px;"

&#x20;                   onclick="showScreen('screen-account-settings')">Paramètres</button>

&#x20;               <button class="auth-link" style="margin-left: 12px;" onclick="handleSignOut()">Se déconnecter</button>

&#x20;           </div>

&#x20;           <div class="section-sub" style="margin-top: 24px; font-weight: 600; text-align: left; color: var(--ink);">Ma

&#x20;               progression</div>

&#x20;           <div id="profile-own-courses">

&#x20;               <!-- Rendered by JS -->

&#x20;           </div>

&#x20;           <div class="section-sub" style="margin-top: 24px; font-size: 0.75rem;">Remarque : ton profil est public. Les

&#x20;               autres peuvent voir tes statistiques.</div>

&#x20;       </div>

&#x20;   </div>



&#x20;   <div class="screen" id="screen-profile-view">

&#x20;       <div class="card" style="padding: 24px;">

&#x20;           <button class="back-home-btn" onclick="showScreen('screen-home')" style="margin-bottom: 16px;">←

&#x20;               Retour</button>

&#x20;           <div id="profile-view-content">

&#x20;               <!-- Rendered by JS -->

&#x20;           </div>

&#x20;       </div>

&#x20;   </div>



&#x20;   <div class="screen" id="screen-profile-edit">

&#x20;       <div class="card">

&#x20;           <button class="back-home-btn" onclick="checkUnsavedChangesAndGoBack('screen-profile-own')"

&#x20;               style="margin-bottom: 16px;">← Retour</button>

&#x20;           <div class="section-title">Modifier le profil</div>

&#x20;           <form id="form-profile-edit" onsubmit="handleProfileEdit(event)" style="margin-top: 24px;">

&#x20;               <div class="form-group">

&#x20;                   <label class="form-label">Email <span

&#x20;                           style="font-size: 0.7rem; color: var(--ink-light); font-weight: 400;">(Non

&#x20;                           modifiable)</span></label>

&#x20;                   <input type="email" class="form-input" id="edit-email" disabled

&#x20;                       style="background: var(--bg); color: var(--ink-light);">

&#x20;                   <div style="font-size: 0.75rem; color: var(--ink-light); margin-top: 4px;">Pour modifier ton email,

&#x20;                       contacte le support.</div>

&#x20;               </div>

&#x20;               <div class="form-group">

&#x20;                   <label class="form-label">Nom d'utilisateur</label>

&#x20;                   <input type="text" class="form-input" id="edit-username" required oninput="markUnsavedChanges()">

&#x20;                   <div class="username-status" id="status-edit-username" aria-live="polite"></div>

&#x20;                   <div class="form-error" id="err-edit-username" aria-live="polite"></div>

&#x20;               </div>

&#x20;               <div class="form-group">

&#x20;                   <label class="form-label" style="text-align: center; margin-bottom: 8px;">Choisis ton avatar</label>

&#x20;                   <div class="avatar-grid" id="edit-avatar-grid">

&#x20;                       <button type="button" class="avatar-btn"

&#x20;                           onclick="selectAvatar('edit', 'snake'); markUnsavedChanges();">🐍</button>

&#x20;                       <button type="button" class="avatar-btn"

&#x20;                           onclick="selectAvatar('edit', 'dragon'); markUnsavedChanges();">🐉</button>

&#x20;                       <button type="button" class="avatar-btn"

&#x20;                           onclick="selectAvatar('edit', 'horse'); markUnsavedChanges();">🐴</button>

&#x20;                       <button type="button" class="avatar-btn"

&#x20;                           onclick="selectAvatar('edit', 'rabbit'); markUnsavedChanges();">🐰</button>

&#x20;                       <button type="button" class="avatar-btn"

&#x20;                           onclick="selectAvatar('edit', 'lion'); markUnsavedChanges();">🦁</button>

&#x20;                   </div>

&#x20;               </div>

&#x20;               <button type="submit" class="btn-primary" id="btn-edit-submit">Sauvegarder</button>

&#x20;               <div class="section-sub" id="msg-edit-success"

&#x20;                   style="margin-top: 12px; color: var(--correct); display: none;">Ton profil a été mis à jour.</div>

&#x20;               <div class="form-error" id="err-edit-general" style="text-align: center; margin-top: 12px;"></div>

&#x20;           </form>

&#x20;       </div>

&#x20;   </div>



&#x20;   <div class="screen" id="screen-account-settings">

&#x20;       <div class="card">

&#x20;           <button class="back-home-btn" onclick="showScreen('screen-profile-own')" style="margin-bottom: 16px;">←

&#x20;               Retour</button>

&#x20;           <div class="section-title">Paramètres du compte</div>

&#x20;           <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 16px;">

&#x20;               <div class="card" style="padding: 16px; box-shadow: none; border-color: var(--border);">

&#x20;                   <div class="section-sub"

&#x20;                       style="font-weight: 600; color: var(--ink); text-align: left; margin-bottom: 8px;">Exporter mes

&#x20;                       données</div>

&#x20;                   <div style="font-size: 0.85rem; color: var(--ink-light); margin-bottom: 12px;">Télécharge une copie

&#x20;                       de tes données personnelles (RGPD).</div>

&#x20;                   <button class="btn-primary" id="btn-export-data" style="padding: 10px; font-size: 0.9rem;"

&#x20;                       onclick="handleDataExport()">Télécharger mes données</button>

&#x20;                   <div id="export-msg" style="font-size: 0.8rem; margin-top: 8px;"></div>

&#x20;               </div>



&#x20;               <div class="card" style="padding: 16px; box-shadow: none; border-color: var(--wrong);">

&#x20;                   <div class="section-sub"

&#x20;                       style="font-weight: 600; color: var(--wrong); text-align: left; margin-bottom: 8px;">Supprimer

&#x20;                       le compte</div>

&#x20;                   <div style="font-size: 0.85rem; color: var(--ink-light); margin-bottom: 12px;">Cette action est

&#x20;                       définitive et entraînera la perte de toute ta progression.</div>

&#x20;                   <button class="btn-primary" style="padding: 10px; font-size: 0.9rem; background: var(--wrong);"

&#x20;                       onclick="openDeleteModal()">Supprimer mon compte</button>

&#x20;               </div>

&#x20;           </div>

&#x20;       </div>

&#x20;   </div>



&#x20;   <!-- Delete Modal Overlay -->

&#x20;   <div id="delete-modal"

&#x20;       style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">

&#x20;       <div class="card" style="max-width: 400px; margin: 20px;">

&#x20;           <div class="section-title" style="color: var(--wrong);">Supprimer le compte</div>

&#x20;           <p style="font-size: 0.9rem; color: var(--ink); margin: 16px 0; line-height: 1.5;">

&#x20;               Es-tu sûr(e) de vouloir supprimer ton compte ? Cette action est irréversible. Ta progression sera

&#x20;               perdue.

&#x20;               <br><br>Pour confirmer, tape le mot <strong>DELETE</strong> ci-dessous.

&#x20;           </p>

&#x20;           <input type="text" class="form-input" id="delete-confirm-input" placeholder="DELETE"

&#x20;               style="text-align: center; margin-bottom: 16px;">

&#x20;           <button class="btn-primary" id="btn-confirm-delete" style="background: var(--wrong); margin-bottom: 8px;"

&#x20;               onclick="handleAccountDeletion()">Confirmer la suppression</button>

&#x20;           <button class="btn-primary" style="background: var(--ink-light);"

&#x20;               onclick="closeDeleteModal()">Annuler</button>

&#x20;           <div class="form-error" id="err-delete-general" style="text-align: center; margin-top: 8px;"></div>

&#x20;       </div>

&#x20;   </div>



&#x20;   <div class="screen" id="screen-privacy">

&#x20;       <div class="card" style="padding: 24px; max-height: 80vh; overflow-y: auto;">

&#x20;           <button class="back-home-btn" onclick="showScreen('screen-signup')" style="margin-bottom: 16px;">←

&#x20;               Retour</button>

&#x20;           <div class="section-title">Politique de Confidentialité</div>

&#x20;           <div class="section-sub" style="margin-bottom: 24px;">Dernière mise à jour : 20 Mai 2026</div>



&#x20;           <div style="font-size: 0.9rem; color: var(--ink); line-height: 1.6; text-align: left;">

&#x20;               <strong>1. Qui sommes-nous ?</strong><br>

&#x20;               Lexio, une application d'apprentissage de l'anglais. Contact : contact@lexio.app (France).<br><br>



&#x20;               <strong>2. Données collectées</strong><br>

&#x20;               Données de compte (email, pseudo, avatar), données d'utilisation (progression, sessions, streak) et

&#x20;               données techniques (adresse IP via Supabase). Si vous utilisez Google/GitHub, nous recevons vos

&#x20;               informations publiques.<br><br>



&#x20;               <strong>3. Pourquoi les collectons-nous ?</strong><br>

&#x20;               Pour la création de compte, le suivi de progression (intérêt légitime/contrat) et l'affichage des

&#x20;               classements.<br><br>



&#x20;               <strong>4. Durée de conservation</strong><br>

&#x20;               Données conservées tant que le compte est actif. En cas de suppression, les données sont effacées dans

&#x20;               les 30 jours.<br><br>



&#x20;               <strong>5. Partage des données</strong><br>

&#x20;               Hébergées chez Supabase (sous-traitant). Aucune donnée n'est vendue à des tiers.<br><br>



&#x20;               <strong>6. Vos droits (RGPD)</strong><br>

&#x20;               Accès, rectification, suppression, portabilité. Exercez ces droits via les paramètres de votre

&#x20;               compte.<br><br>



&#x20;               <strong>7. Cookies</strong><br>

&#x20;               Nous n'utilisons que des cookies techniques essentiels pour maintenir votre session de

&#x20;               connexion.<br><br>



&#x20;               <strong>8. Enfants</strong><br>

&#x20;               Application utilisable par les enfants. Nous ne collectons pas sciemment de données d'enfants de moins

&#x20;               de 13 ans sans consentement parental.<br><br>



&#x20;               Pour toute question : contact@lexio.app

&#x20;           </div>

&#x20;       </div>

&#x20;   </div>



&#x20;   <!-- ══════════════════════════════════════════

&#x20;    SCREEN: HOME SCREEN (Course Dashboard)

══════════════════════════════════════════ -->

&#x20;   <div class="screen" id="screen-home">

&#x20;       <div class="home-hero">

&#x20;           <div class="home-title">Lexio</div>

&#x20;           <div class="home-subtitle" id="home-subtitle-text">Comment voulez-vous apprendre aujourd'hui ?</div>

&#x20;       </div>



&#x20;       <!-- Mode Selection (The 3 main options) -->

&#x20;       <div id="home-mode-select" style="width: 100%; display: flex; flex-direction: column; gap: 16px;">

&#x20;           <!-- Rendered by JS -->

&#x20;       </div>



&#x20;       <!-- Leaderboard -->

&#x20;       <div id="home-leaderboard" style="width: 100%; margin-top: 32px; display: none;">

&#x20;           <div id="leaderboard-title" class="section-title" style="font-size: 1.2rem; text-align: left; margin-bottom: 12px;">Classement

&#x20;           </div>

&#x20;           <table class="leaderboard-table" id="leaderboard-table">

&#x20;               <thead>

&#x20;                   <tr>

&#x20;                       <th>Rang</th>

&#x20;                       <th>Joueur</th>

&#x20;                       <th>Score</th>

&#x20;                   </tr>

&#x20;               </thead>

&#x20;               <tbody id="leaderboard-body">

&#x20;                   <!-- Rendered by JS -->

&#x20;               </tbody>

&#x20;           </table>

&#x20;       </div>



&#x20;       <!-- Category View (Lists within a mode) -->

&#x20;       <div id="home-category-view" style="width: 100%; display: none; flex-direction: column; gap: 16px;">

&#x20;           <button class="back-home-btn" onclick="backToModeSelect()"

&#x20;               style="align-self: flex-start; margin-bottom: 8px;">

&#x20;               ← Retour aux options

&#x20;           </button>

&#x20;           <div id="home-categories-container" style="width: 100%;">

&#x20;               <!-- Dynamically populated course cards -->

&#x20;           </div>

&#x20;       </div>

&#x20;   </div>



&#x20;   <!-- ══════════════════════════════════════════

&#x20;    SCREEN: COURSE WORD PREVIEW

══════════════════════════════════════════ -->

&#x20;   <div class="screen" id="screen-word-preview">

&#x20;       <div class="card" style="padding: 24px; width: 100%;">

&#x20;           <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">

&#x20;               <div class="phase-tag" style="margin-bottom: 0;">Liste de vocabulaire</div>

&#x20;               <span class="word-counter" id="preview-word-count"></span>

&#x20;           </div>

&#x20;           <div class="section-title" id="preview-course-title" style="margin-bottom: 4px; font-size: 1.3rem;"></div>

&#x20;           <div class="section-sub" id="preview-level-badge" style="margin-bottom: 16px; font-size: 0.8rem;"></div>

&#x20;           <div class="word-preview-grid" id="preview-word-grid">

&#x20;               <div style="grid-column: span 2; text-align: center; padding: 20px; color: var(--ink-light);">

&#x20;                   <div class="spinner" style="width: 28px; height: 28px; border-width: 3px;"></div>

&#x20;               </div>

&#x20;           </div>

&#x20;       </div>



&#x20;       <!-- Per-course leaderboard -->

&#x20;       <div id="preview-leaderboard" style="width: 100%; display: none;">

&#x20;           <div class="section-title" id="preview-leaderboard-title" style="font-size: 1.1rem; text-align: left; margin-bottom: 12px;">Classement pour ce cours</div>

&#x20;           <table class="leaderboard-table" id="preview-leaderboard-table">

&#x20;               <thead>

&#x20;                   <tr>

&#x20;                       <th>Rang</th>

&#x20;                       <th>Joueur</th>

&#x20;                       <th>Score</th>

&#x20;                   </tr>

&#x20;               </thead>

&#x20;               <tbody id="preview-leaderboard-body">

&#x20;                   <tr><td colspan="3" style="text-align: center;">Chargement...</td></tr>

&#x20;               </tbody>

&#x20;           </table>

&#x20;       </div>



&#x20;       <button class="btn-primary" id="preview-start-btn" onclick="startCourseFromPreview()">Commencer l'apprentissage →</button>

&#x20;       <button class="btn-primary" onclick="showScreen('screen-home')" style="background:#FFF; border: 1.5px solid var(--border); color: var(--accent);">← Retour</button>

&#x20;   </div>



&#x20;   <!-- ══════════════════════════════════════════

&#x20;    SCREEN: FIRST ENCOUNTER — word intro

══════════════════════════════════════════ -->

&#x20;   <div class="screen" id="screen-encounter">

&#x20;       <div class="card">

&#x20;           <div class="word-display" id="enc-word"></div>

&#x20;           <div class="translation-display" id="enc-translation"></div>

&#x20;           <div style="display: flex; gap: 10px; width: 100%; margin-bottom: 8px;">

&#x20;               <button class="audio-btn" id="enc-audio-btn" onclick="playAudio(false)"

&#x20;                   style="flex: 1; justify-content: center;">

&#x20;                   🔊 <span>Listen</span>

&#x20;               </button>

&#x20;               <button class="audio-btn" id="enc-slow-audio-btn" onclick="playAudio(true)"

&#x20;                   style="flex: 1; justify-content: center; background: #FFF; border: 1.5px solid var(--border); color: var(--ink-light);">

&#x20;                   🐌 <span>Slow version</span>

&#x20;               </button>

&#x20;           </div>

&#x20;       </div>







&#x20;       <button class="btn-primary" id="enc-next-btn" onclick="encounterNext()">Continuer →</button>

&#x20;   </div>



&#x20;   <!-- ══════════════════════════════════════════

&#x20;    SCREEN: EX1 — MCQ (FR word → EN options)

══════════════════════════════════════════ -->

&#x20;   <div class="screen" id="screen-ex1">

&#x20;       <div class="question-prompt">

&#x20;           <div class="q-word" id="ex1-word"></div>

&#x20;           <div class="q-sub">Quel est le sens de ce mot en anglais ?</div>

&#x20;       </div>



&#x20;       <div class="options-grid" id="ex1-options"></div>



&#x20;       <div class="feedback-banner" id="ex1-feedback"></div>



&#x20;       <button class="btn-primary hidden" id="ex1-next-btn" onclick="ex1Next()">Continuer →</button>

&#x20;       <div class="word-counter" id="ex1-counter"></div>

&#x20;   </div>



&#x20;   <!-- EX1 RETEST (native → TL) -->

&#x20;   <div class="screen" id="screen-ex1-retest">

&#x20;       <div class="card">

&#x20;           <div class="section-title mt-4">Révision des mots manqués</div>

&#x20;           <div class="section-sub mt-8">Cette fois, vous voyez le mot en anglais et choisissez la bonne traduction

&#x20;               française.</div>

&#x20;       </div>



&#x20;       <div class="question-prompt">

&#x20;           <div class="q-label">Traduisez en français</div>

&#x20;           <div class="q-word" id="ex1rt-word"></div>

&#x20;       </div>



&#x20;       <div class="options-grid" id="ex1rt-options"></div>

&#x20;       <div class="feedback-banner" id="ex1rt-feedback"></div>

&#x20;       <button class="btn-primary hidden" id="ex1rt-next-btn" onclick="ex1RetestNext()">Continuer →</button>

&#x20;       <div class="word-counter" id="ex1rt-counter"></div>

&#x20;   </div>





&#x20;   <!-- ══════════════════════════════════════════

&#x20;    SCREEN: TRANSITION

══════════════════════════════════════════ -->

&#x20;   <div class="screen" id="screen-transition">

&#x20;       <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center;">

&#x20;           <svg class="transition-icon" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5"

&#x20;               stroke-linecap="round" stroke-linejoin="round">

&#x20;               <path d="M12 10a2 2 0 0 0-2-2c-1.1 0-2-.9-2-2 0-1.1.9-2 2-2 1.1 0 2 .9 2 2 0 1.1-.9 2-2 2Z" />

&#x20;               <path d="M12 10v11a1 1 0 0 0 2 0V10" />

&#x20;               <path d="M12 12c-2 0-8-1-8-3s2-3 8-1" />

&#x20;               <path d="M12 12c2 0 8-1 8-3s-2-3-8-1" />

&#x20;               <path d="M12 15c-1.5 0-6-.5-6-2s1.5-2 6-.5" />

&#x20;               <path d="M12 15c1.5 0 6-.5 6-2s-1.5-2-6-.5" />

&#x20;           </svg>

&#x20;           <div class="transition-msg" id="transition-msg-text">Great job so far!</div>

&#x20;       </div>

&#x20;   </div>



&#x20;   <!-- ══════════════════════════════════════════

&#x20;    SCREEN: EX2 INTRO

══════════════════════════════════════════ -->

&#x20;   <div class="screen" id="screen-ex2-intro">

&#x20;       <div class="card" style="text-align:center;">

&#x20;           <div class="section-title mt-4">Tap the Translation</div>

&#x20;           <div class="section-sub mt-8">

&#x20;               Trouvez et tapez sur la bonne traduction en anglais le plus de fois possible en 15 secondes !<br><br>

&#x20;               Attention aux autres mots (distracteurs) qui apparaissent pour vous tromper.

&#x20;           </div>

&#x20;           <div class="divider" style="margin: 20px 0;"></div>

&#x20;           <button class="btn-primary" onclick="startEx2Game()">C'est parti !</button>

&#x20;       </div>

&#x20;   </div>



&#x20;   <!-- ══════════════════════════════════════════

&#x20;    SCREEN: EX2 GAME

══════════════════════════════════════════ -->

&#x20;   <div class="screen" id="screen-ex2-game">

&#x20;       <div class="question-prompt">

&#x20;           <div class="game-timer" id="ex2-game-timer">15s</div>

&#x20;       </div>



&#x20;       <div class="game-area" id="ex2-game-area">

&#x20;           <div class="game-target-center" id="ex2-game-french"></div>

&#x20;       </div>



&#x20;       <div class="word-counter" id="ex2-game-counter" style="margin-top:16px;"></div>

&#x20;   </div>

<!-- ══════════════════════════════════════════

&#x20;SCREEN: EX2 MATCH — Matching table

══════════════════════════════════════════ -->

<div class="screen" id="screen-match">

&#x20;   <div class="question-prompt">



&#x20;       <div class="q-sub" style="margin-top:8px;">Associez chaque mot à sa traduction</div>

&#x20;   </div>

&#x20;   <div class="match-table-wrap">

&#x20;       <table class="match-table">

&#x20;           <thead><tr><th>English</th><th>Français</th></tr></thead>

&#x20;           <tbody id="match-tbody"></tbody>

&#x20;       </table>

&#x20;   </div>

&#x20;   <div class="feedback-banner" id="match-feedback"></div>

&#x20;   <div class="word-counter" id="match-counter"></div>

</div>



&#x20;   <!-- ══════════════════════════════════════════

&#x20;    SCREEN: EX3 — Partial word typing

══════════════════════════════════════════ -->

&#x20;   <div class="screen" id="screen-ex3">

&#x20;       <div class="question-prompt">

&#x20;           <div class="q-word" id="ex3-french"></div>

&#x20;           <div class="q-sub">Remettez les lettres dans le bon ordre pour trouver le mot anglais</div>

&#x20;       </div>



&#x20;       <div class="card" style="text-align:center;">

&#x20;           <div class="section-sub" style="margin-bottom:12px;">Lettres en désordre :</div>

&#x20;           <div class="partial-word-display" id="ex3-partial"></div>

&#x20;       </div>



&#x20;       <input class="type-input" id="ex3-input" type="text" placeholder="Tapez le mot anglais..." autocomplete="off"

&#x20;           autocorrect="off" spellcheck="false" />

&#x20;       <button class="btn-primary" onclick="ex3Check()">Vérifier</button>



&#x20;       <div class="feedback-banner" id="ex3-feedback"></div>

&#x20;       <button class="btn-primary hidden" id="ex3-next-btn" onclick="ex3Next()">Continuer →</button>

&#x20;       <div class="word-counter" id="ex3-counter"></div>

&#x20;   </div>



&#x20;   <!-- ══════════════════════════════════════════

&#x20;    SCREEN: EX3 RETEST

══════════════════════════════════════════ -->

&#x20;   <div class="screen" id="screen-ex3-retest">

&#x20;       <div class="card">

&#x20;           <div class="section-title mt-4">Révision des mots manqués (Ex3)</div>

&#x20;           <div class="section-sub mt-8">Mémorisez le mot puis tapez-le de mémoire !</div>

&#x20;       </div>



&#x20;       <div class="question-prompt">

&#x20;           <div class="q-label">Traduisez en anglais</div>

&#x20;           <div class="q-word" id="ex3rt-french"></div>

&#x20;           <div class="q-word" id="ex3rt-english-display" style="color: var(--accent); margin-top: 8px;"></div>

&#x20;       </div>



&#x20;       <input class="type-input hidden" id="ex3rt-input" type="text" placeholder="Tapez le mot anglais..."

&#x20;           autocomplete="off" autocorrect="off" spellcheck="false" />



&#x20;       <button class="btn-primary" id="ex3rt-memorized-btn" onclick="ex3RetestMemorized()">J'ai mémorisé</button>

&#x20;       <button class="btn-primary hidden" id="ex3rt-verify-btn" onclick="ex3RetestCheck()">Vérifier</button>



&#x20;       <div class="feedback-banner" id="ex3rt-feedback"></div>

&#x20;       <button class="btn-primary hidden" id="ex3rt-next-btn" onclick="ex3RetestNext()">Continuer →</button>

&#x20;       <div class="word-counter" id="ex3rt-counter"></div>

&#x20;   </div>



&#x20;   <!-- ══════════════════════════════════════════

&#x20;    SCREEN: SESSION COMPLETE

══════════════════════════════════════════ -->

&#x20;   <div class="screen" id="screen-complete">

&#x20;       <div class="complete-icon">🎉</div>

&#x20;       <div class="complete-title" id="complete-title">Session terminée !</div>



&#x20;       <div class="card" style="margin-top:10px; margin-bottom:10px; width:100%; text-align:center; padding:20px;">

&#x20;           <div style="display:flex; justify-content:space-between; margin-bottom:12px;">

&#x20;               <span style="color:var(--ink-light)">Temps passé :</span>

&#x20;               <strong id="stat-time">0m 0s</strong>

&#x20;           </div>

&#x20;           <div style="display:flex; justify-content:space-between; margin-bottom:12px;">

&#x20;               <span style="color:var(--ink-light)">Mots rencontrés :</span>

&#x20;               <strong id="stat-words">0</strong>

&#x20;           </div>

&#x20;           <div style="display:flex; justify-content:space-between; margin-bottom:12px;">

&#x20;               <span style="color:var(--ink-light)">Score gagné :</span>

&#x20;               <strong id="stat-score" style="color:var(--accent);">0 pts</strong>

&#x20;           </div>



&#x20;           <div id="stat-bonuses" style="display:none; border-top: 1px solid var(--border); margin-top: 8px; padding-top: 12px; text-align:left;">

&#x20;               <div style="font-size:0.8rem; color:var(--ink-light); margin-bottom:6px;">Bonus :</div>

&#x20;               <div id="stat-bonus-list" style="display:flex; flex-direction:column; gap:4px; font-size:0.85rem;"></div>

&#x20;           </div>



&#x20;           <div class="divider" style="margin: 16px 0;"></div>

&#x20;           <div style="text-align:left;">

&#x20;               <span style="color:var(--ink-light); font-size:0.9rem;">Mots à réviser en priorité :</span>

&#x20;               <ul id="stat-revise-list"

&#x20;                   style="margin-top:8px; padding-left:20px; font-weight:500; color:var(--wrong);">

&#x20;               </ul>

&#x20;           </div>

&#x20;       </div>



&#x20;       <div id="complete-buttons" style="display: flex; flex-direction: column; gap: 8px; width: 100%;">

&#x20;           <button class="btn-primary" id="btn-next-group" onclick="nextGroup()" style="display: none;">Groupe suivant

&#x20;               →</button>

&#x20;           <button class="btn-primary" onclick="restartApp()"

&#x20;               style="background:#FFF; border: 1.5px solid var(--border); color: var(--accent);">Recommencer ce

&#x20;               groupe</button>

&#x20;           <button class="btn-primary" onclick="goToHome()"

&#x20;               style="background:#FFF; border: 1.5px solid var(--border); color: var(--accent);">Retour à

&#x20;               l'accueil</button>

&#x20;       </div>

&#x20;   </div>



&#x20;   <!-- ══════════════════════════════════════════

&#x20;    SCREEN: GAME OVER

══════════════════════════════════════════ -->

&#x20;   <div class="screen" id="screen-game-over">

&#x20;       <div class="complete-icon">💔</div>

&#x20;       <div class="complete-title">Try Again!</div>

&#x20;       <div class="complete-sub">Vous avez fait 4 erreurs. Ne vous découragez pas, la pratique fait la perfection !

&#x20;       </div>

&#x20;       <div class="divider" style="margin: 24px 0;"></div>

&#x20;       <button class="btn-primary" onclick="restartApp()">Recommencer ce groupe</button>

&#x20;       <button class="btn-primary" onclick="goToHome()"

&#x20;           style="background:#FFF; border: 1.5px solid var(--border); color: var(--accent); margin-top:8px;">Retour à

&#x20;           l'accueil</button>

&#x20;   </div>



&#x20;   <script>

&#x20;       console.log('Script tag started parsing');

&#x20;       // ══════════════════════════════════════════

&#x20;       // SUPABASE INIT \& AUTH LOGIC

&#x20;       // ══════════════════════════════════════════

&#x20;       const SUPABASE\_URL = 'https://abouaxqxnsmigvicpxoo.supabase.co';

&#x20;       const SUPABASE\_ANON\_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFib3VheHF4bnNtaWd2aWNweG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNzA1ODksImV4cCI6MjA5NDg0NjU4OX0.oP2f\_IyKkM-cBmMhVrKU7fmgsnuggGBnAargfi6si4I';

&#x20;       let sbClient;

&#x20;       try {

&#x20;           sbClient = window.supabase.createClient(SUPABASE\_URL, SUPABASE\_ANON\_KEY);

&#x20;       } catch (e) {

&#x20;           console.error('Supabase client failed to initialize:', e);

&#x20;       }



&#x20;       let currentUser = null;

&#x20;       let currentProfile = null;

&#x20;       let selectedAvatar = 'snake';

&#x20;       let hasUnsavedChanges = false;



&#x20;       async function initAuth() {

&#x20;           console.log('initAuth started');

&#x20;           try {

&#x20;               if (!sbClient) {

&#x20;                   console.error('Supabase not initialized');

&#x20;                   showScreen('screen-login');

&#x20;                   return;

&#x20;               }

&#x20;               const { data: { session }, error } = await sbClient.auth.getSession();

&#x20;               console.log('getSession finished', { session, error });

&#x20;               if (session) {

&#x20;                   currentUser = session.user;

&#x20;                   await fetchProfile();

&#x20;                   // Check if OAuth but no profile (needs setup)

&#x20;                   if (!currentProfile) {

&#x20;                       showScreen('screen-oauth-setup');

&#x20;                   } else {

&#x20;                       // Normal flow

&#x20;                       initializeDashboard();

&#x20;                   }

&#x20;               } else {

&#x20;                   // No session, check url for hash (password reset or email verification)

&#x20;                   const hash = window.location.hash;

&#x20;                   if (hash \&\& hash.includes('type=recovery')) {

&#x20;                       showScreen('screen-reset-password');

&#x20;                   } else if (hash \&\& hash.includes('error=')) {

&#x20;                       showScreen('screen-link-expired');

&#x20;                   } else {

&#x20;                       // Go to Login by default

&#x20;                       showScreen('screen-login');

&#x20;                   }

&#x20;               }



&#x20;               // Listen for auth state changes

&#x20;               sbClient.auth.onAuthStateChange(async (event, session) => {

&#x20;                   if (event === 'SIGNED\_IN') {

&#x20;                       // Don't interrupt an active game session (e.g. on token refresh)

&#x20;                       const activeGameScreens = \['screen-encounter','screen-ex1','screen-ex2-game','screen-match','screen-ex3','screen-ex1-retest','screen-ex3-retest','screen-transition'];

&#x20;                       const inGame = activeGameScreens.some(id => document.getElementById(id)?.classList.contains('active'));

&#x20;                       if (inGame) return;

&#x20;                       currentUser = session.user;

&#x20;                       await fetchProfile();

&#x20;                       if (!currentProfile) {

&#x20;                           showScreen('screen-oauth-setup');

&#x20;                       } else {

&#x20;                           initializeDashboard();

&#x20;                       }

&#x20;                   } else if (event === 'SIGNED\_OUT') {

&#x20;                       currentUser = null;

&#x20;                       currentProfile = null;

&#x20;                       showScreen('screen-login');

&#x20;                   } else if (event === 'PASSWORD\_RECOVERY') {

&#x20;                       showScreen('screen-reset-password');

&#x20;                   }

&#x20;               });

&#x20;           } catch (err) {

&#x20;               console.error('initAuth error:', err);

&#x20;               showScreen('screen-login');

&#x20;           }

&#x20;       }



&#x20;       async function fetchProfile() {

&#x20;           if (!currentUser) return;

&#x20;           const { data, error } = await sbClient.from('profiles').select('\*').eq('id', currentUser.id).single();

&#x20;           if (!error \&\& data) {

&#x20;               currentProfile = data;

&#x20;               // Update last\_seen and check streak

&#x20;               updateLastSeen(data);

&#x20;           } else {

&#x20;               currentProfile = null;

&#x20;           }

&#x20;       }



&#x20;       async function updateLastSeen(profile) {

&#x20;           const now = new Date();

&#x20;           const lastSeen = profile.last\_seen ? new Date(profile.last\_seen) : null;

&#x20;           let newStreak = profile.streak\_days || 0;



&#x20;           if (lastSeen) {

&#x20;               const diffTime = Math.abs(now - lastSeen);

&#x20;               const diffDays = Math.floor(diffTime / (1000 \* 60 \* 60 \* 24));

&#x20;               if (diffDays === 1) {

&#x20;                   newStreak++;

&#x20;               } else if (diffDays > 1) {

&#x20;                   newStreak = 0; // Lost streak

&#x20;               }

&#x20;           } else {

&#x20;               newStreak = 1;

&#x20;           }



&#x20;           await sbClient.from('profiles').update({ last\_seen: now.toISOString(), streak\_days: newStreak }).eq('id', currentUser.id);

&#x20;           currentProfile.streak\_days = newStreak;

&#x20;           currentProfile.last\_seen = now.toISOString();

&#x20;       }



&#x20;       function selectAvatar(context, avatar) {

&#x20;           document.querySelectorAll(`#${context}-avatar-grid .avatar-btn`).forEach(btn => btn.classList.remove('selected'));

&#x20;           const buttons = document.querySelectorAll(`#${context}-avatar-grid .avatar-btn`);

&#x20;           for (const btn of buttons) {

&#x20;               if (btn.innerText.includes(getAvatarEmoji(avatar))) {

&#x20;                   btn.classList.add('selected');

&#x20;               }

&#x20;           }

&#x20;           selectedAvatar = avatar;

&#x20;       }



&#x20;       function getAvatarEmoji(name) {

&#x20;           const map = { snake: '🐍', dragon: '🐉', horse: '🐴', rabbit: '🐰', lion: '🦁' };

&#x20;           return map\[name] || '🐍';

&#x20;       }



&#x20;       // ══════════════════════════════════════════

&#x20;       // AUTHENTICATION FUNCTIONS

&#x20;       // ══════════════════════════════════════════

&#x20;       async function handleSignup(e) {

&#x20;           e.preventDefault();

&#x20;           const email = document.getElementById('signup-email').value;

&#x20;           const username = document.getElementById('signup-username').value;

&#x20;           const password = document.getElementById('signup-password').value;

&#x20;           const confirmPassword = document.getElementById('signup-confirm-password').value;

&#x20;           const errGeneral = document.getElementById('err-signup-general');

&#x20;           errGeneral.textContent = '';



&#x20;           if (password !== confirmPassword) {

&#x20;               document.getElementById('err-signup-confirm-password').textContent = "Les mots de passe ne correspondent pas.";

&#x20;               return;

&#x20;           }



&#x20;           // Check username

&#x20;           const { data: existingUser } = await sbClient.from('profiles').select('id').eq('username', username).single();

&#x20;           if (existingUser) {

&#x20;               document.getElementById('err-signup-username').textContent = "Ce nom d'utilisateur est déjà pris.";

&#x20;               return;

&#x20;           }



&#x20;           const { data, error } = await sbClient.auth.signUp({

&#x20;               email,

&#x20;               password,

&#x20;               options: {

&#x20;                   data: {

&#x20;                       username: username,

&#x20;                       avatar\_id: selectedAvatar

&#x20;                   }

&#x20;               }

&#x20;           });



&#x20;           if (error) {

&#x20;               errGeneral.textContent = error.message;

&#x20;           } else {

&#x20;               // Assume email verification is required

&#x20;               showScreen('screen-verify-email');

&#x20;           }

&#x20;       }



&#x20;       async function handleLogin(e) {

&#x20;           e.preventDefault();

&#x20;           const email = document.getElementById('login-email').value;

&#x20;           const password = document.getElementById('login-password').value;

&#x20;           const errGeneral = document.getElementById('err-login-general');

&#x20;           errGeneral.textContent = '';



&#x20;           const { data, error } = await sbClient.auth.signInWithPassword({ email, password });



&#x20;           if (error) {

&#x20;               errGeneral.textContent = "Email ou mot de passe incorrect.";

&#x20;               if (error.message.includes('Email not confirmed')) {

&#x20;                   document.getElementById('login-resend-container').style.display = 'block';

&#x20;               }

&#x20;           }

&#x20;       }



&#x20;       async function signInWithGoogle() {

&#x20;           await sbClient.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });

&#x20;       }



&#x20;       async function signInWithGitHub() {

&#x20;           await sbClient.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: window.location.origin } });

&#x20;       }



&#x20;       async function handleSignOut() {

&#x20;           await sbClient.auth.signOut();

&#x20;       }



&#x20;       async function resendVerificationEmail() {

&#x20;           const email = document.getElementById('login-email').value || '';

&#x20;           if (!email) {

&#x20;               alert("Veuillez saisir votre email dans le formulaire de connexion.");

&#x20;               return;

&#x20;           }

&#x20;           const { error } = await sbClient.auth.resend({ type: 'signup', email });

&#x20;           if (!error) {

&#x20;               alert("Email de confirmation renvoyé !");

&#x20;           } else {

&#x20;               alert("Erreur: " + error.message);

&#x20;           }

&#x20;       }



&#x20;       async function handleForgotPassword(e) {

&#x20;           e.preventDefault();

&#x20;           const email = document.getElementById('forgot-email').value;

&#x20;           const { error } = await sbClient.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '#type=recovery' });

&#x20;           if (!error) {

&#x20;               document.getElementById('msg-forgot-success').textContent = "Lien envoyé ! Vérifiez vos emails.";

&#x20;               document.getElementById('msg-forgot-success').style.display = 'block';

&#x20;           } else {

&#x20;               document.getElementById('err-forgot-general').textContent = error.message;

&#x20;           }

&#x20;       }



&#x20;       async function handleResetPassword(e) {

&#x20;           e.preventDefault();

&#x20;           const pwd = document.getElementById('reset-password').value;

&#x20;           const confirm = document.getElementById('reset-confirm-password').value;

&#x20;           if (pwd !== confirm) {

&#x20;               document.getElementById('err-reset-confirm-password').textContent = "Les mots de passe ne correspondent pas.";

&#x20;               return;

&#x20;           }

&#x20;           const { error } = await sbClient.auth.updateUser({ password: pwd });

&#x20;           if (!error) {

&#x20;               document.getElementById('msg-reset-success').textContent = "Mot de passe mis à jour !";

&#x20;               document.getElementById('msg-reset-success').style.display = 'block';

&#x20;               setTimeout(() => showScreen('screen-login'), 2000);

&#x20;           } else {

&#x20;               document.getElementById('err-reset-general').textContent = error.message;

&#x20;           }

&#x20;       }



&#x20;       async function handleOAuthSetup(e) {

&#x20;           e.preventDefault();

&#x20;           const username = document.getElementById('oauth-username').value;

&#x20;           const { data: existingUser } = await sbClient.from('profiles').select('id').eq('username', username).single();

&#x20;           if (existingUser) {

&#x20;               document.getElementById('err-oauth-username').textContent = "Ce nom d'utilisateur est déjà pris.";

&#x20;               return;

&#x20;           }



&#x20;           // Create profile since OAuth doesn't trigger the trigger if we don't have username? 

&#x20;           // Actually Supabase trigger creates empty profile. We just update it.

&#x20;           const { error } = await sbClient.from('profiles').upsert({

&#x20;               id: currentUser.id,

&#x20;               username: username,

&#x20;               avatar\_id: selectedAvatar,

&#x20;               total\_score: 0,

&#x20;               streak\_days: 1,

&#x20;               last\_seen: new Date().toISOString()

&#x20;           });



&#x20;           if (!error) {

&#x20;               await fetchProfile();

&#x20;               initializeDashboard();

&#x20;           } else {

&#x20;               document.getElementById('err-oauth-general').textContent = error.message;

&#x20;           }

&#x20;       }



&#x20;       // ══════════════════════════════════════════

&#x20;       // PROFILE \& SETTINGS FUNCTIONS

&#x20;       // ══════════════════════════════════════════





&#x20;       function renderProfileOwn() {

&#x20;           if (!currentProfile) return;



&#x20;           const header = document.getElementById('profile-own-header');

&#x20;           header.innerHTML = `

&#x20;       <div class="profile-avatar-large">${getAvatarEmoji(currentProfile.avatar\_id)}</div>

&#x20;       <div class="section-title" style="margin: 0;">${currentProfile.username || 'Utilisateur'}</div>

&#x20;       <div style="font-size: 0.85rem; color: var(--ink-light);">

&#x20;         Score: <strong style="color: var(--accent);">${currentProfile.total\_score || 0}</strong> • 

&#x20;         Streak: <strong style="color: var(--accent);">${currentProfile.streak\_days || 0}🔥</strong>

&#x20;       </div>

&#x20;     `;



&#x20;           // Render courses

&#x20;           const coursesDiv = document.getElementById('profile-own-courses');

&#x20;           if (currentProfile.courses\_progress \&\& Object.keys(currentProfile.courses\_progress).length > 0) {

&#x20;               let html = '';

&#x20;               for (const \[courseId, progress] of Object.entries(currentProfile.courses\_progress)) {

&#x20;                   html += `

&#x20;           <div class="profile-course-card">

&#x20;             <div style="font-weight: 600; color: var(--accent);">${courseId}</div>

&#x20;             <div class="progress-pills">

&#x20;               <span class="pill seen">${progress.seen || 0} vus</span>

&#x20;               <span class="pill learning">${progress.learning || 0} en cours</span>

&#x20;               <span class="pill learnt">${progress.learnt || 0} acquis</span>

&#x20;             </div>

&#x20;           </div>

&#x20;         `;

&#x20;               }

&#x20;               coursesDiv.innerHTML = html;

&#x20;           } else {

&#x20;               coursesDiv.innerHTML = `<div style="font-size: 0.85rem; color: var(--ink-light); margin-top: 8px;">Aucun cours commencé.</div>`;

&#x20;           }

&#x20;       }



&#x20;       function prepareProfileEdit() {

&#x20;           hasUnsavedChanges = false;

&#x20;           document.getElementById('edit-email').value = currentUser?.email || '';

&#x20;           document.getElementById('edit-username').value = currentProfile?.username || '';

&#x20;           selectAvatar('edit', currentProfile?.avatar\_id || 'snake');

&#x20;           document.getElementById('msg-edit-success').style.display = 'none';

&#x20;           document.getElementById('err-edit-general').textContent = '';

&#x20;           document.getElementById('err-edit-username').textContent = '';

&#x20;       }



&#x20;       function markUnsavedChanges() {

&#x20;           hasUnsavedChanges = true;

&#x20;       }



&#x20;       function checkUnsavedChangesAndGoBack(targetScreen) {

&#x20;           if (hasUnsavedChanges) {

&#x20;               if (confirm("Tu as des modifications non sauvegardées. Es-tu sûr de vouloir quitter ?")) {

&#x20;                   showScreen(targetScreen);

&#x20;               }

&#x20;           } else {

&#x20;               showScreen(targetScreen);

&#x20;           }

&#x20;       }



&#x20;       async function handleProfileEdit(e) {

&#x20;           e.preventDefault();

&#x20;           const username = document.getElementById('edit-username').value;

&#x20;           const errGeneral = document.getElementById('err-edit-general');

&#x20;           errGeneral.textContent = '';

&#x20;           document.getElementById('err-edit-username').textContent = '';



&#x20;           if (username !== currentProfile.username) {

&#x20;               const { data: existing } = await sbClient.from('profiles').select('id').eq('username', username).single();

&#x20;               if (existing \&\& existing.id !== currentProfile.id) {

&#x20;                   document.getElementById('err-edit-username').textContent = "Ce nom d'utilisateur est déjà pris.";

&#x20;                   return;

&#x20;               }

&#x20;           }



&#x20;           const { error } = await sbClient.from('profiles').update({

&#x20;               username: username,

&#x20;               avatar\_id: selectedAvatar

&#x20;           }).eq('id', currentProfile.id);



&#x20;           if (!error) {

&#x20;               currentProfile.username = username;

&#x20;               currentProfile.avatar\_id = selectedAvatar;

&#x20;               hasUnsavedChanges = false;

&#x20;               document.getElementById('msg-edit-success').style.display = 'block';

&#x20;               setTimeout(() => showScreen('screen-profile-own'), 1500);

&#x20;           } else {

&#x20;               errGeneral.textContent = error.message;

&#x20;           }

&#x20;       }



&#x20;       async function handleDataExport() {

&#x20;           if (!currentProfile || !currentUser) return;

&#x20;           const data = {

&#x20;               user: currentUser,

&#x20;               profile: currentProfile

&#x20;           };

&#x20;           const blob = new Blob(\[JSON.stringify(data, null, 2)], { type: 'application/json' });

&#x20;           const url = URL.createObjectURL(blob);

&#x20;           const a = document.createElement('a');

&#x20;           a.href = url;

&#x20;           a.download = `lexio\_data\_${currentProfile.username}.json`;

&#x20;           a.click();

&#x20;           URL.revokeObjectURL(url);

&#x20;           document.getElementById('export-msg').textContent = "Données exportées avec succès.";

&#x20;           document.getElementById('export-msg').style.color = "var(--correct)";

&#x20;       }



&#x20;       function openDeleteModal() {

&#x20;           document.getElementById('delete-confirm-input').value = '';

&#x20;           document.getElementById('err-delete-general').textContent = '';

&#x20;           document.getElementById('delete-modal').style.display = 'flex';

&#x20;       }



&#x20;       function closeDeleteModal() {

&#x20;           document.getElementById('delete-modal').style.display = 'none';

&#x20;       }



&#x20;       async function handleAccountDeletion() {

&#x20;           const confirmInput = document.getElementById('delete-confirm-input').value;

&#x20;           if (confirmInput !== 'DELETE') {

&#x20;               document.getElementById('err-delete-general').textContent = "Veuillez taper DELETE pour confirmer.";

&#x20;               return;

&#x20;           }



&#x20;           // Supabase Edge Functions or Postgres Trigger would be ideal for full deletion.

&#x20;           // Since we only have client access, we delete the profile and then delete the user via a potential RPC or just sign out.

&#x20;           // Wait, client can't easily delete user without an admin token or edge function.

&#x20;           // We will delete the profile data and sign out.



&#x20;           const { error } = await sbClient.from('profiles').delete().eq('id', currentUser.id);

&#x20;           if (error) {

&#x20;               document.getElementById('err-delete-general').textContent = "Erreur lors de la suppression du profil: " + error.message;

&#x20;               return;

&#x20;           }



&#x20;           // Also try to call an RPC if the user set it up, but if not, just sign out

&#x20;           // Actually, Supabase has auth.admin.deleteUser but we can't use it here. 

&#x20;           // We will just sign out after wiping the profile.

&#x20;           closeDeleteModal();

&#x20;           alert("Ton profil a été supprimé. Ton compte sera définitivement effacé par l'administrateur.");

&#x20;           await handleSignOut();

&#x20;       }



&#x20;       // ══════════════════════════════════════════

&#x20;       // WORD DATA \& ARCHITECTURE

&#x20;       // ══════════════════════════════════════════

&#x20;       const INDEX\_FILE = 'word-lists/INDEX.json';

&#x20;       let WORD\_LIST\_FILE = '';

&#x09;let currentCourseName = '';

&#x20;       let words = \[];

&#x20;       let allEnglish = \[];

&#x20;       let allFrench = \[];

&#x20;       let indexDataCached = null;



&#x20;       let fullWordList = \[];

&#x20;       let currentChunkIndex = 0;



&#x20;       // ══════════════════════════════════════════

&#x20;       // STATE

&#x20;       // ══════════════════════════════════════════

&#x20;       let encounterIndex = 0;

&#x20;       let encounterSentenceIndex = 0;



&#x20;       let ex1Queue = \[];  // words to test

&#x20;       let ex1Index = 0;

&#x20;       let ex1Incorrect = \[];  // words to retest

&#x20;       let ex1RetestQueue = \[];

&#x20;       let ex1RetestIndex = 0;



&#x20;       let ex2GameQueue = \[];

&#x20;       let ex2GameIndex = 0;

&#x20;       let ex2CurrentPart = 1;

&#x20;       let ex2GameTimerInterval = null;

&#x20;       let ex2GameLoopInterval = null;

&#x20;       let ex2GameTimeLeft = 15;

&#x20;       let ex2GameCorrectHits = 0;

&#x20;       let ex2GameActive = false;



&#x20;       let sessionStartTime = 0;

&#x20;       let firstTryCorrect = 0;

&#x20;       let secondTryCorrect = 0;

&#x20;       let retestAllCorrect = true;

&#x20;       let wordErrors = {};



&#x20;       let playerLives = 4;

&#x20;       const MAX\_LIVES = 4;



&#x20;       let ex3Queue = \[];

&#x20;       let ex3Index = 0;

&#x20;       let ex3Incorrect = \[];

&#x20;       let ex3RetestIndex = 0;

&#x20;       let ex3RetestAttempts = 0;



&#x20;       let totalSteps = 0;

&#x20;       let stepsCompleted = 0;



&#x20;       // ══════════════════════════════════════════

&#x20;       // UTILS

&#x20;       // ══════════════════════════════════════════

&#x20;       function showScreen(id) {

&#x20;           console.log('showScreen called with id:', id);

&#x20;           document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

&#x20;           const el = document.getElementById(id);

&#x20;           if (el) {

&#x20;               el.classList.add('active');

&#x20;               el.style.animation = 'none';

&#x20;               el.offsetHeight; // reflow

&#x20;               el.style.animation = '';



&#x20;               if (id === 'screen-profile-own' \&\& typeof renderProfileOwn === 'function') {

&#x20;                   renderProfileOwn();

&#x20;               } else if (id === 'screen-profile-edit' \&\& typeof prepareProfileEdit === 'function') {

&#x20;                   prepareProfileEdit();

&#x20;               }

&#x20;           }

&#x20;       }



&#x20;       function triggerGlow(type) {

&#x20;           document.body.classList.remove('glow-correct', 'glow-wrong');

&#x20;           document.body.classList.add(type === 'correct' ? 'glow-correct' : 'glow-wrong');

&#x20;           setTimeout(() => document.body.classList.remove('glow-correct', 'glow-wrong'), 2000);

&#x20;       }



&#x20;       function initLives() {

&#x20;           playerLives = MAX\_LIVES;

&#x20;           const container = document.getElementById('lives-container');

&#x20;           container.innerHTML = '';

&#x20;           for (let i = 0; i < MAX\_LIVES; i++) {

&#x20;               const heart = document.createElement('div');

&#x20;               heart.className = 'heart';

&#x20;               heart.textContent = '❤️';

&#x20;               container.appendChild(heart);

&#x20;           }

&#x20;           container.style.display = 'flex';

&#x20;       }



&#x20;       function loseLife() {

&#x20;           if (playerLives <= 0) return;

&#x20;           playerLives--;

&#x20;           const container = document.getElementById('lives-container');

&#x20;           const hearts = container.querySelectorAll('.heart');

&#x20;           if (hearts\[playerLives]) {

&#x20;               hearts\[playerLives].classList.add('lost');

&#x20;           }

&#x20;           if (playerLives <= 0) {

&#x20;               ex2GameActive = false;

&#x20;               showScreen('screen-game-over');

&#x20;               if (ex2GameTimerInterval !== null) clearInterval(ex2GameTimerInterval);

&#x20;               if (ex2GameLoopInterval !== null) clearInterval(ex2GameLoopInterval);

&#x20;           }

&#x20;       }



&#x20;       function showTransition(message, nextFunc) {

&#x20;           document.getElementById('transition-msg-text').textContent = message;

&#x20;           showScreen('screen-transition');

&#x20;           setTimeout(() => {

&#x20;               nextFunc();

&#x20;           }, 2500);

&#x20;       }



&#x20;       function shuffle(arr) {

&#x20;           const a = \[...arr];

&#x20;           for (let i = a.length - 1; i > 0; i--) {

&#x20;               const j = Math.floor(Math.random() \* (i + 1));

&#x20;               \[a\[i], a\[j]] = \[a\[j], a\[i]];

&#x20;           }

&#x20;           return a;

&#x20;       }



&#x20;       function getMCQOptions(correctEnglish, count = 4) {

&#x20;           const distractors = allEnglish.filter(e => e !== correctEnglish);

&#x20;           const chosen = shuffle(distractors).slice(0, count - 1);

&#x20;           return shuffle(\[correctEnglish, ...chosen]);

&#x20;       }



&#x20;       function getFrenchMCQOptions(correctFrench, count = 4) {

&#x20;           const distractors = allFrench.filter(f => f !== correctFrench);

&#x20;           const chosen = shuffle(distractors).slice(0, count - 1);

&#x20;           return shuffle(\[correctFrench, ...chosen]);

&#x20;       }



&#x20;       function updateProgress() {

&#x20;           const pct = totalSteps > 0 ? Math.round((stepsCompleted / totalSteps) \* 100) : 0;

&#x20;           document.getElementById('progressBar').style.width = pct + '%';

&#x20;       }



&#x20;       function playAudio(slow = false, specificWord = null) {

&#x20;           if (words.length === 0) return;

&#x20;           const word = specificWord || (encounterIndex < words.length ? words\[encounterIndex].english : "");

&#x20;           if (!word) return;

&#x20;           if ('speechSynthesis' in window) {

&#x20;               speechSynthesis.cancel(); // Cancel any playing speech

&#x20;               const utt = new SpeechSynthesisUtterance(word);

&#x20;               utt.lang = 'en-GB';

&#x20;               utt.rate = slow ? 0.5 : 1.0;

&#x20;               speechSynthesis.speak(utt);

&#x20;           }

&#x20;       }



&#x20;       // ══════════════════════════════════════════

&#x20;       // GOOGLE TRANSLATE API DYNAMIC FETCH

&#x20;       // ══════════════════════════════════════════

&#x20;       async function translateText(text, sl = 'en', tl = 'fr') {

&#x20;           const url = `https://translate.googleapis.com/translate\_a/single?client=gtx\&sl=${sl}\&tl=${tl}\&dt=t\&q=${encodeURIComponent(text)}`;

&#x20;           const response = await fetch(url);

&#x20;           if (!response.ok) throw new Error("Translation failed");

&#x20;           const data = await response.json();

&#x20;           try {

&#x20;               return data\[0].map(item => item\[0]).join('');

&#x20;           } catch (e) {

&#x20;               return text;

&#x20;           }

&#x20;       }



&#x20;       function normalizeString(str) {

&#x20;           return str.normalize("NFD").replace(/\[\\u0300-\\u036f]/g, "").toLowerCase();

&#x20;       }



&#x20;       async function translateAndGenerateSentencesForSession(selectedWords) {

&#x20;           const promises = selectedWords.map(async (w) => {

&#x20;               let english = w.english;

&#x20;               let french = w.french;

&#x20;               const hasFrench = w.french \&\& !w.french.includes('\[Traduire') \&\& w.french.trim() !== "";

&#x20;               if (!hasFrench) {

&#x20;                   try {

&#x20;                       french = await translateText(english, 'en', 'fr');

&#x20;                   } catch (e) {

&#x20;                       french = french || `\[Traduire : ${english}]`;

&#x20;                   }

&#x20;               }

&#x20;               return {

&#x20;                   id: w.id,

&#x20;                   english: english,

&#x20;                   french: french,

&#x20;                   sentences: \[]

&#x20;               };

&#x20;           });

&#x20;           return Promise.all(promises);

&#x20;       }



&#x20;       // ══════════════════════════════════════════

&#x20;       // HOME DASHBOARD \& NAVIGATION

&#x20;       // ══════════════════════════════════════════

&#x20;       const homeCategoriesData = \[

&#x20;           {

&#x20;               id: "curriculum",

&#x20;               title: "Learn by curriculum",

&#x20;               icon: "📚",

&#x20;               description: "Listes de vocabulaire alignées sur les examens de Cambridge et le programme national.",

&#x20;               files: \[

&#x20;                   { filename: "CAMBRIDGE STARTERS ANIMALS.json", title: "Les Animaux (Starters)", level: "A1", approximate\_word\_count: 30 },

&#x20;                   { filename: "CAMBRIDGE STARTERS.json", title: "Cambridge YLE Starters", level: "Pre-A1", approximate\_word\_count: 200 },

&#x20;                   { filename: "CAMBRIDGE MOVERS.json", title: "Cambridge YLE Movers", level: "A1", approximate\_word\_count: 220 },

&#x20;                   { filename: "CAMBRIDGE FLYERS.json", title: "Cambridge YLE Flyers", level: "A2", approximate\_word\_count: 200 },

&#x20;                   { filename: "BREVET.json", title: "Brevet - Vocabulaire", level: "B1", approximate\_word\_count: 160 },

&#x20;                   { filename: "BAC - axes thematiques.json", title: "Bac - Axes Thématiques", level: "B2", approximate\_word\_count: 125 }

&#x20;               ]

&#x20;           },

&#x20;           {

&#x20;               id: "theme",

&#x20;               title: "Learn by theme",

&#x20;               icon: "🌍",

&#x20;               description: "Listes thématiques couvrant la vie quotidienne et les sujets d'intérêt.",

&#x20;               files: \[

&#x20;                   { filename: "THEMES A1-A2.json", title: "Thèmes A1-A2", level: "A1-A2", approximate\_word\_count: 200 },

&#x20;                   { filename: "THEMES B1-B2.json", title: "Thèmes B1-B2", level: "B1-B2", approximate\_word\_count: 210 },

&#x20;                   { filename: "THEMES C1-C2.json", title: "Thèmes C1-C2", level: "C1-C2", approximate\_word\_count: 210 },

&#x20;                   { filename: "BUSINESS AND FINANCE.json", title: "Business and Finance", level: "C1-C2", approximate\_word\_count: 140 },

&#x20;                   { filename: "MEDICAL AND PSYCHOLOGICAL.json", title: "Medical and Psychological", level: "C1-C2", approximate\_word\_count: 165 },

&#x20;                   { filename: "PRACTICAL ENGLISH.json", title: "Practical English", level: "B1-B2", approximate\_word\_count: 140 }

&#x20;               ]

&#x20;           },

&#x20;           {

&#x20;               id: "level",

&#x20;               title: "Learn by level",

&#x20;               icon: "📈",

&#x20;               description: "Vocabulaire classé par nature grammaticale et par niveau CEFR.",

&#x20;               files: \[

&#x20;                   { filename: "WORD GROUPS A1-A2.json", title: "Groupes de Mots A1-A2", level: "A1-A2", approximate\_word\_count: 230 },

&#x20;                   { filename: "WORD GROUPS B1-B2.json", title: "Groupes de Mots B1-B2", level: "B1-B2", approximate\_word\_count: 330 },

&#x20;                   { filename: "WORD GROUPS C1-C2.json", title: "Groupes de Mots C1-C2", level: "C1-C2", approximate\_word\_count: 330 }

&#x20;               ]

&#x20;           }

&#x20;       ];



&#x20;       function goToHome() {

&#x20;           document.getElementById('header-home-btn').classList.add('hidden');

&#x20;           document.getElementById('header-logo').style.display = 'block';

&#x20;           document.getElementById('header-progress-wrap').style.display = 'none';

&#x20;           document.getElementById('lives-container').style.display = 'none';

&#x20;           backToModeSelect();

&#x20;           showScreen('screen-home');

&#x20;       }



&#x20;       function renderHomeDashboard(indexData) {

&#x20;           const modeContainer = document.getElementById('home-mode-select');

&#x20;           modeContainer.innerHTML = '';



&#x20;           homeCategoriesData.forEach((cat, index) => {

&#x20;               const card = document.createElement('div');

&#x20;               card.className = 'mode-card';

&#x20;               card.onclick = () => showCategory(index);



&#x20;               card.innerHTML = `

&#x20;     <div class="mode-icon">${cat.icon}</div>

&#x20;     <div class="mode-info">

&#x20;       <div class="mode-title">${cat.title}</div>

&#x20;       <div class="mode-desc">${cat.description}</div>

&#x20;     </div>

&#x20;   `;

&#x20;               modeContainer.appendChild(card);

&#x20;           });

&#x20;       }



&#x20;       function showCategory(index) {

&#x20;           document.getElementById('home-mode-select').style.display = 'none';

&#x20;           document.getElementById('home-leaderboard').style.display = 'none';

&#x20;           const catView = document.getElementById('home-category-view');

&#x20;           catView.style.display = 'flex';



&#x20;           const cat = homeCategoriesData\[index];

&#x20;           document.getElementById('home-subtitle-text').textContent = cat.title;



&#x20;           const container = document.getElementById('home-categories-container');

&#x20;           container.innerHTML = '';



&#x20;           const sec = document.createElement('div');

&#x20;           sec.className = 'category-section';

&#x20;           sec.style.marginTop = '0';



&#x20;           const h3 = document.createElement('h3');

&#x20;           h3.className = 'category-title';

&#x20;           h3.textContent = cat.title;

&#x20;           sec.appendChild(h3);



&#x20;           const grid = document.createElement('div');

&#x20;           grid.className = 'courses-grid';



&#x20;           cat.files.forEach(file => {

&#x20;               const card = document.createElement('div');

&#x20;               card.className = 'course-card';

&#x20;               card.onclick = () => selectCourse(file.filename);



&#x20;               const top = document.createElement('div');

&#x20;               top.className = 'course-card-top';



&#x20;               let lvlClass = 'level-c1-c2';

&#x20;               const lvl = (file.level || 'A1').toLowerCase();

&#x20;               if (lvl.includes('pre-a1')) lvlClass = 'level-pre-a1';

&#x20;               else if (lvl.includes('a1')) lvlClass = 'level-a1';

&#x20;               else if (lvl.includes('a2')) lvlClass = 'level-a2';

&#x20;               else if (lvl.includes('b1')) lvlClass = 'level-b1';

&#x20;               else if (lvl.includes('b2')) lvlClass = 'level-b2';



&#x20;               const badge = document.createElement('span');

&#x20;               badge.className = `level-badge ${lvlClass}`;

&#x20;               badge.textContent = file.level || 'A1';

&#x20;               top.appendChild(badge);



&#x20;               const name = document.createElement('div');

&#x20;               name.className = 'course-name';

&#x20;               name.textContent = file.title;

&#x20;               top.appendChild(name);



&#x20;               const desc = document.createElement('div');

&#x20;               desc.className = 'course-desc';

&#x20;               desc.textContent = file.notes || file.description || 'Vocabulaire thématique pour l\\'apprentissage.';

&#x20;               top.appendChild(desc);



&#x20;               card.appendChild(top);



&#x20;               const footer = document.createElement('div');

&#x20;               footer.className = 'course-footer';



&#x20;               const count = document.createElement('span');

&#x20;               count.className = 'course-count';

&#x20;               count.textContent = file.approximate\_word\_count ? `\~${file.approximate\_word\_count} mots` : '10 mots';

&#x20;               footer.appendChild(count);



&#x20;               const act = document.createElement('span');

&#x20;               act.textContent = 'Étudier →';

&#x20;               footer.appendChild(act);



&#x20;               card.appendChild(footer);

&#x20;               grid.appendChild(card);

&#x20;           });



&#x20;           sec.appendChild(grid);

&#x20;           container.appendChild(sec);

&#x20;       }



&#x20;       function backToModeSelect() {

&#x20;           document.getElementById('home-category-view').style.display = 'none';

&#x20;           document.getElementById('home-mode-select').style.display = 'flex';

&#x20;           document.getElementById('home-subtitle-text').textContent = "Comment voulez-vous apprendre aujourd'hui ?";

&#x20;           if (document.getElementById('home-leaderboard').innerHTML.includes('leaderboard-body')) {

&#x20;               document.getElementById('home-leaderboard').style.display = 'block';

&#x20;           }

&#x20;       }



&#x20;   function selectCourse(filename, title) {

&#x20;   WORD\_LIST\_FILE = 'word-lists/' + filename;

&#x20;   currentCourseName = title || filename;

&#x20;   showCoursePreview(filename, title);

}



&#x20;   async function showCoursePreview(filename, title) {

&#x20;   // Show the preview screen immediately with a loading state

&#x20;   showScreen('screen-word-preview');

&#x20;   document.getElementById('preview-course-title').textContent = title || filename;

&#x20;   document.getElementById('preview-word-count').textContent = '';

&#x20;   document.getElementById('preview-level-badge').textContent = '';

&#x20;   document.getElementById('preview-leaderboard').style.display = 'none';

&#x20;   document.getElementById('preview-word-grid').innerHTML = `

&#x20;       <div style="grid-column: span 2; text-align: center; padding: 20px; color: var(--ink-light);">

&#x20;           <div class="spinner" style="width: 28px; height: 28px; border-width: 3px; margin-bottom: 12px;"></div>

&#x20;           Chargement des mots...

&#x20;       </div>`;



&#x20;   // Find level info from homeCategoriesData

&#x20;   let levelText = '';

&#x20;   for (const cat of homeCategoriesData) {

&#x20;       const found = cat.files.find(f => f.filename === filename);

&#x20;       if (found) { levelText = found.level || ''; break; }

&#x20;   }

&#x20;   if (levelText) document.getElementById('preview-level-badge').textContent = `Niveau ${levelText}`;



&#x20;   // Load word list and course leaderboard in parallel

&#x20;   const courseKey = 'word-lists/' + filename;



&#x20;   const \[wordResult] = await Promise.allSettled(\[

&#x20;       fetch('word-lists/' + filename).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }),

&#x20;   ]);



&#x20;   if (wordResult.status === 'fulfilled') {

&#x20;       const parsed = parseWordList(wordResult.value);

&#x20;       document.getElementById('preview-word-count').textContent = `${parsed.length} mots`;

&#x20;       const grid = document.getElementById('preview-word-grid');

&#x20;       if (parsed.length === 0) {

&#x20;           grid.innerHTML = `<div style="grid-column: span 2; text-align: center; color: var(--ink-light);">Aucun mot trouvé.</div>`;

&#x20;       } else {

&#x20;           grid.innerHTML = parsed.map(w => `

&#x20;               <div class="word-chip">

&#x20;                   <span class="word-chip-en">${w.english}</span>

&#x20;                   <span class="word-chip-fr">${w.french || '—'}</span>

&#x20;               </div>

&#x20;           `).join('');

&#x20;       }

&#x20;   } else {

&#x20;       document.getElementById('preview-word-grid').innerHTML =

&#x20;           `<div style="grid-column: span 2; text-align: center; color: var(--wrong);">Impossible de charger la liste.</div>`;

&#x20;   }



&#x20;   // Load the per-course leaderboard (only if logged in)

&#x20;   if (currentProfile \&\& sbClient) {

&#x20;       await fetchCourseLeaderboard(courseKey, title || filename);

&#x20;   }

}



&#x20;   async function fetchCourseLeaderboard(courseKey, courseName) {

&#x20;   const leaderboardDiv = document.getElementById('preview-leaderboard');

&#x20;   const tbody = document.getElementById('preview-leaderboard-body');

&#x20;   document.getElementById('preview-leaderboard-title').textContent = `Classement — ${courseName}`;

&#x20;   leaderboardDiv.style.display = 'block';

&#x20;   tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Chargement...</td></tr>';



&#x20;   const { data, error } = await sbClient

&#x20;       .from('profiles')

&#x20;       .select('username, avatar\_id, courses\_progress, id');



&#x20;   if (error || !data) {

&#x20;       tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--wrong);">Erreur de chargement.</td></tr>';

&#x20;       return;

&#x20;   }



&#x20;   // Only include players who have earned points for this specific course

&#x20;   const ranked = data

&#x20;       .filter(p => (p.courses\_progress?.\[courseKey]?.score || 0) > 0)

&#x20;       .map(p => ({ ...p, displayScore: p.courses\_progress\[courseKey].score }))

&#x20;       .sort((a, b) => b.displayScore - a.displayScore)

&#x20;       .slice(0, 10);



&#x20;   if (ranked.length === 0) {

&#x20;       tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--ink-light);">Personne n\\'a encore étudié ce cours. Sois le premier !</td></tr>';

&#x20;       return;

&#x20;   }



&#x20;   let html = '';

&#x20;   ranked.forEach((p, index) => {

&#x20;       const isMe = p.id === currentUser?.id;

&#x20;       const rank = index + 1;

&#x20;       let rankDisplay = rank;

&#x20;       if (rank === 1) rankDisplay = '🥇 1';

&#x20;       if (rank === 2) rankDisplay = '🥈 2';

&#x20;       if (rank === 3) rankDisplay = '🥉 3';

&#x20;       html += `

&#x20;           <tr class="${isMe ? 'highlight' : ''}">

&#x20;               <td>${rankDisplay}</td>

&#x20;               <td>

&#x20;                   <div style="display: flex; align-items: center; gap: 8px;">

&#x20;                       <span style="font-size: 1.2rem;">${getAvatarEmoji(p.avatar\_id)}</span>

&#x20;                       <span>${p.username || 'Joueur anonyme'} ${isMe ? '(Toi)' : ''}</span>

&#x20;                   </div>

&#x20;               </td>

&#x20;               <td style="font-weight: 600; color: var(--accent);">${p.displayScore}</td>

&#x20;           </tr>

&#x20;       `;

&#x20;   });

&#x20;   tbody.innerHTML = html;

}



&#x20;   function startCourseFromPreview() {

&#x20;   loadWordList();

}



&#x20;       // ══════════════════════════════════════════

&#x20;       // SCHEMA PARSER

&#x20;       // ══════════════════════════════════════════

&#x20;       function parseWordList(data) {

&#x20;           let parsedWords = \[];



&#x20;           if (data.words \&\& Array.isArray(data.words)) {

&#x20;               parsedWords = data.words;

&#x20;           }

&#x20;           else if (data.topics \&\& typeof data.topics === 'object') {

&#x20;               Object.keys(data.topics).forEach(topicKey => {

&#x20;                   const topic = data.topics\[topicKey];

&#x20;                   if (topic.words \&\& Array.isArray(topic.words)) {

&#x20;                       parsedWords.push(...topic.words);

&#x20;                   }

&#x20;               });

&#x20;           }

&#x20;           else if (data.word\_groups \&\& typeof data.word\_groups === 'object') {

&#x20;               Object.keys(data.word\_groups).forEach(groupKey => {

&#x20;                   const group = data.word\_groups\[groupKey];

&#x20;                   if (group.words \&\& Array.isArray(group.words)) {

&#x20;                       parsedWords.push(...group.words);

&#x20;                   }

&#x20;               });

&#x20;           }

&#x20;           else if (data.themes \&\& typeof data.themes === 'object') {

&#x20;               Object.keys(data.themes).forEach(themeKey => {

&#x20;                   const theme = data.themes\[themeKey];

&#x20;                   if (theme.words \&\& Array.isArray(theme.words)) {

&#x20;                       parsedWords.push(...theme.words);

&#x20;                   }

&#x20;               });

&#x20;           }

&#x20;           else if (data.categories \&\& typeof data.categories === 'object') {

&#x20;               Object.keys(data.categories).forEach(catKey => {

&#x20;                   const cat = data.categories\[catKey];

&#x20;                   if (cat.words \&\& Array.isArray(cat.words)) {

&#x20;                       parsedWords.push(...cat.words);

&#x20;                   }

&#x20;               });

&#x20;           }

&#x20;           else if (data.situations \&\& typeof data.situations === 'object') {

&#x20;               Object.keys(data.situations).forEach(sitKey => {

&#x20;                   const sit = data.situations\[sitKey];

&#x20;                   if (sit.phrases \&\& Array.isArray(sit.phrases)) {

&#x20;                       sit.phrases.forEach(p => {

&#x20;                           parsedWords.push({

&#x20;                               word: p.phrase,

&#x20;                               type: "expression",

&#x20;                               notes: p.use

&#x20;                           });

&#x20;                       });

&#x20;                   }

&#x20;               });

&#x20;           }



&#x20;           return parsedWords.map(w => {

&#x20;               const english = w.word || w.english || "Unknown";

&#x20;               let french = w.french || w.translation\_hint || w.meaning || w.notes || "";



&#x20;               return {

&#x20;                   id: w.id || english.toLowerCase().replace(/\[^a-z0-9]/g, "-"),

&#x20;                   french: french,

&#x20;                   english: english,

&#x20;                   sentences: w.sentences || \[],

&#x20;                   type: w.type || ""

&#x20;               };

&#x20;           });

&#x20;       }



&#x20;       // ══════════════════════════════════════════

&#x20;       // FIRST ENCOUNTER

&#x20;       // ══════════════════════════════════════════

&#x20;       function startEncounter() {

&#x20;           encounterIndex = 0;

&#x20;           encounterSentenceIndex = 0;

&#x20;           loadEncounterWord();

&#x20;       }



&#x20;       function loadEncounterWord() {

&#x20;           if (encounterIndex >= words.length) {

&#x20;               startEx2Part1();

&#x20;               return;

&#x20;           }

&#x20;           const w = words\[encounterIndex];

&#x20;           document.getElementById('enc-word').textContent = w.english;

&#x20;           document.getElementById('enc-translation').textContent = w.french;



&#x20;           setTimeout(() => {

&#x20;               playAudio(false);

&#x20;           }, 300);

&#x20;       }



&#x20;       function encounterNext() {

&#x20;           stepsCompleted++;

&#x20;           updateProgress();

&#x20;           encounterIndex++;

&#x20;           loadEncounterWord();

&#x20;       }



&#x20;       // ══════════════════════════════════════════

&#x20;       // EX 1 — MCQ French word → choose English

&#x20;       // ══════════════════════════════════════════

&#x20;       function startEx1() {

&#x20;           ex1Queue = \[...words];

&#x20;           ex1Index = 0;

&#x20;           ex1Incorrect = \[];

&#x20;           showScreen('screen-ex1');

&#x20;           loadEx1();

&#x20;       }



&#x20;       function loadEx1() {

&#x20;           if (ex1Index >= ex1Queue.length) {

&#x20;               if (ex1Incorrect.length > 0) {

&#x20;                   startEx1Retest();

&#x20;               } else {

&#x20;                   const msgs = \["Almost there!", "Keep it up!", "Great work!"];

&#x20;                   showTransition(msgs\[Math.floor(Math.random() \* msgs.length)], startEx2Part2);

&#x20;               }

&#x20;               return;

&#x20;           }

&#x20;           const w = ex1Queue\[ex1Index];

&#x20;           document.getElementById('ex1-word').textContent = w.french;

&#x20;           document.getElementById('ex1-counter').textContent = `${ex1Index + 1} / ${ex1Queue.length}`;

&#x20;           document.getElementById('ex1-feedback').className = 'feedback-banner';

&#x20;           document.getElementById('ex1-next-btn').classList.add('hidden');



&#x20;           const options = getMCQOptions(w.english);

&#x20;           const grid = document.getElementById('ex1-options');

&#x20;           grid.innerHTML = '';

&#x20;           options.forEach(opt => {

&#x20;               const btn = document.createElement('button');

&#x20;               btn.className = 'option-btn';

&#x20;               btn.textContent = opt;

&#x20;               btn.onclick = () => checkEx1(btn, opt, w.english, w);

&#x20;               grid.appendChild(btn);

&#x20;           });

&#x20;       }



&#x20;       function checkEx1(btn, chosen, correct, wordObj) {

&#x20;           const allBtns = document.querySelectorAll('#ex1-options .option-btn');

&#x20;           allBtns.forEach(b => b.disabled = true);



&#x20;           if (chosen === correct) {

&#x20;               btn.classList.add('correct');

&#x20;               triggerGlow('correct');

&#x20;               showFeedback('ex1-feedback', 'correct', '✓ Correct !');

&#x20;               playAudio(false, correct);

&#x20;               stepsCompleted++;

&#x20;               updateProgress();

&#x20;               if (!ex1Incorrect.find(w => w.english === wordObj.english)) {

&#x20;                   firstTryCorrect++;

&#x20;               } else {

&#x20;                   // Word was wrong before — this is a second-attempt correct

&#x20;                   secondTryCorrect++;

&#x20;               }

&#x20;               document.getElementById('ex1-next-btn').classList.remove('hidden');

&#x20;           } else {

&#x20;               btn.classList.add('wrong');

&#x20;               allBtns.forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });

&#x20;               triggerGlow('wrong');

&#x20;               showFeedback('ex1-feedback', 'wrong', `✗ La bonne réponse est : "${correct}"`);

&#x20;               if (!ex1Incorrect.find(w => w.english === wordObj.english)) ex1Incorrect.push(wordObj);



&#x20;               // Track errors

&#x20;               if (!wordErrors\[correct]) wordErrors\[correct] = 0;

&#x20;               wordErrors\[correct]++;

&#x20;               loseLife();



&#x20;               ex1Queue.splice(ex1Index + 1, 0, wordObj);

&#x20;               document.getElementById('ex1-next-btn').classList.remove('hidden');

&#x20;           }

&#x20;       }



&#x20;       function ex1Next() {

&#x20;           ex1Index++;

&#x20;           showScreen('screen-ex1');

&#x20;           loadEx1();

&#x20;       }



&#x20;       // EX1 RETEST

&#x20;       function startEx1Retest() {

&#x20;           ex1RetestQueue = \[...ex1Incorrect];

&#x20;           ex1RetestIndex = 0;

&#x20;           showScreen('screen-ex1-retest');

&#x20;           loadEx1Retest();

&#x20;       }



&#x20;       function loadEx1Retest() {

&#x20;           if (ex1RetestIndex >= ex1RetestQueue.length) {

&#x20;               const msgs = \["Almost there!", "Keep it up!", "Great work!"];

&#x20;               showTransition(msgs\[Math.floor(Math.random() \* msgs.length)], startEx2Part2);

&#x20;               return;

&#x20;           }

&#x20;           const w = ex1RetestQueue\[ex1RetestIndex];

&#x20;           document.getElementById('ex1rt-word').textContent = w.english;

&#x20;           document.getElementById('ex1rt-counter').textContent = `${ex1RetestIndex + 1} / ${ex1RetestQueue.length}`;

&#x20;           document.getElementById('ex1rt-feedback').className = 'feedback-banner';

&#x20;           document.getElementById('ex1rt-next-btn').classList.add('hidden');



&#x20;           const options = getFrenchMCQOptions(w.french);

&#x20;           const grid = document.getElementById('ex1rt-options');

&#x20;           grid.innerHTML = '';

&#x20;           options.forEach(opt => {

&#x20;               const btn = document.createElement('button');

&#x20;               btn.className = 'option-btn';

&#x20;               btn.textContent = opt;

&#x20;               btn.onclick = () => checkEx1Retest(btn, opt, w.french);

&#x20;               grid.appendChild(btn);

&#x20;           });

&#x20;       }



&#x20;       function checkEx1Retest(btn, chosen, correct) {

&#x20;           const allBtns = document.querySelectorAll('#ex1rt-options .option-btn');

&#x20;           allBtns.forEach(b => b.disabled = true);

&#x20;           if (chosen === correct) {

&#x20;               btn.classList.add('correct');

&#x20;               triggerGlow('correct');

&#x20;               showFeedback('ex1rt-feedback', 'correct', '✓ Correct !');

&#x20;               playAudio(false, ex1RetestQueue\[ex1RetestIndex].english);

&#x20;           } else {

&#x20;               btn.classList.add('wrong');

&#x20;               allBtns.forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });

&#x20;               triggerGlow('wrong');

&#x20;               showFeedback('ex1rt-feedback', 'wrong', `✗ La bonne réponse est : "${correct}"`);

&#x20;               loseLife();

&#x20;               retestAllCorrect = false;

&#x20;           }

&#x20;           stepsCompleted++;

&#x20;           updateProgress();

&#x20;           document.getElementById('ex1rt-next-btn').classList.remove('hidden');

&#x20;       }



&#x20;       function ex1RetestNext() {

&#x20;           ex1RetestIndex++;

&#x20;           showScreen('screen-ex1-retest');

&#x20;           loadEx1Retest();

&#x20;       }



&#x20;       // ══════════════════════════════════════════

&#x20;       // EX 2 — GAME (TAP THE TRANSLATION)

&#x20;       // ══════════════════════════════════════════

&#x20;       let ex2FullQueue = \[];



&#x20;       function startEx2Part1() {

&#x20;           ex2FullQueue = shuffle(\[...words]);

&#x20;           ex2GameQueue = ex2FullQueue.slice(0, 5);

&#x20;           ex2GameIndex = 0;

&#x20;           ex2CurrentPart = 1;

&#x20;           showScreen('screen-ex2-intro');

&#x20;           document.querySelector('#screen-ex2-intro .btn-primary').setAttribute('onclick', 'startEx2Part1Game()');

&#x20;       }



&#x20;       function startEx2Part1Game() {

&#x20;           ex2GameActive = true;

&#x20;           showScreen('screen-ex2-game');

&#x20;           loadEx2GameWord();

&#x20;       }



&#x20;       function startEx2Part2() {

&#x20;           ex2GameQueue = ex2FullQueue.slice(5);

&#x20;           ex2GameIndex = 0;

&#x20;           ex2CurrentPart = 2;

&#x20;           showScreen('screen-ex2-intro');

&#x20;           document.querySelector('#screen-ex2-intro .btn-primary').setAttribute('onclick', 'startEx2Part2Game()');

&#x20;       }



&#x20;       function startEx2Part2Game() {

&#x20;           ex2GameActive = true;

&#x20;           showScreen('screen-ex2-game');

&#x20;           loadEx2GameWord();

&#x20;       }



&#x20;       // Called from intro screen - handles which part we're in

&#x20;       function startEx2Game() {

&#x20;           showScreen('screen-ex2-game');

&#x20;           loadEx2GameWord();

&#x20;       }



&#x20;       function loadEx2GameWord() {

&#x20;           if (ex2GameIndex >= ex2GameQueue.length) {

&#x20;               stepsCompleted++;

&#x20;               updateProgress();

&#x20;               // Determine which part just finished

&#x20;               if (ex2CurrentPart === 1) {

&#x20;                   // Part 1 done: go to EX1

&#x20;                   const msgs = \["Now let's test your memory!", "Exercise time!", "Keep going!"];

&#x20;                   showTransition(msgs\[Math.floor(Math.random() \* msgs.length)], startEx1);

&#x20;               } else {

&#x20;                   // Part 2 done: go to EX3

&#x20;                   const msgs = \["You're doing so well!", "Almost there!", "Fantastic!"];

&#x20;                   showTransition(msgs\[Math.floor(Math.random() \* msgs.length)], startMatch);

&#x20;               }

&#x20;               return;

&#x20;           }



&#x20;           const w = ex2GameQueue\[ex2GameIndex];

&#x20;           document.getElementById('ex2-game-french').textContent = w.french;

&#x20;           document.getElementById('ex2-game-counter').textContent = `Mot ${ex2GameIndex + 1} / ${ex2GameQueue.length}`;



&#x20;           ex2GameTimeLeft = 15;

&#x20;           ex2GameCorrectHits = 0;

&#x20;           document.getElementById('ex2-game-timer').textContent = ex2GameTimeLeft + 's';

&#x20;           const area = document.getElementById('ex2-game-area');

&#x20;           Array.from(area.children).forEach(c => {

&#x20;               if (c.id !== 'ex2-game-french') area.removeChild(c);

&#x20;           });



&#x20;           ex2GameTimerInterval = setInterval(() => {

&#x20;               ex2GameTimeLeft--;

&#x20;               document.getElementById('ex2-game-timer').textContent = ex2GameTimeLeft + 's';

&#x20;               if (ex2GameTimeLeft <= 0) {

&#x20;                   clearInterval(ex2GameTimerInterval);

&#x20;                   clearInterval(ex2GameLoopInterval);

&#x20;                   stepsCompleted++;

&#x20;                   updateProgress();

&#x20;                   ex2GameIndex++;

&#x20;                   loadEx2GameWord();

&#x20;               }

&#x20;           }, 1000);



&#x20;           for (let i = 0; i < 5; i++) {

&#x20;               spawnEx2Distractor(w.english);

&#x20;           }



&#x20;           spawnEx2Target(w.english);



&#x20;           ex2GameLoopInterval = setInterval(() => {

&#x20;               spawnEx2Distractor(w.english);

&#x20;           }, 800);

&#x20;       }



&#x20;       function createBubble(text, isTarget, onClick) {

&#x20;           const area = document.getElementById('ex2-game-area');

&#x20;           const bubble = document.createElement('div');

&#x20;           bubble.className = 'game-bubble distractor';

&#x20;           bubble.textContent = text;



&#x20;           let x, y;

&#x20;           do {

&#x20;               x = 10 + Math.random() \* 80;

&#x20;               y = 10 + Math.random() \* 80;

&#x20;           } while (x > 25 \&\& x < 75 \&\& y > 35 \&\& y < 65);



&#x20;           bubble.style.left = x + '%';

&#x20;           bubble.style.top = y + '%';



&#x20;           bubble.onclick = () => {

&#x20;               onClick(bubble);

&#x20;           };



&#x20;           area.appendChild(bubble);

&#x20;           setTimeout(() => bubble.classList.add('show'), 50);

&#x20;           return bubble;

&#x20;       }



&#x20;       function spawnEx2Target(correctWord) {

&#x20;           let alive = true;

&#x20;           const b = createBubble(correctWord, true, (bubble) => {

&#x20;               if (!alive) return;

&#x20;               alive = false;

&#x20;               ex2GameCorrectHits++;

&#x20;               bubble.classList.remove('show');

&#x20;               playAudio(false, correctWord);



&#x20;               const fly = document.createElement('div');

&#x20;               fly.className = 'game-score-fly';

&#x20;               fly.textContent = '+1';

&#x20;               fly.style.left = bubble.style.left;

&#x20;               fly.style.top = bubble.style.top;

&#x20;               document.getElementById('ex2-game-area').appendChild(fly);

&#x20;               setTimeout(() => fly.remove(), 1000);



&#x20;               setTimeout(() => bubble.remove(), 300);

&#x20;               setTimeout(() => { if (ex2GameActive \&\& ex2GameTimeLeft > 0 \&\& ex2GameQueue\[ex2GameIndex] \&\& ex2GameQueue\[ex2GameIndex].english === correctWord) spawnEx2Target(correctWord); }, 500);

&#x20;           });



&#x20;           setTimeout(() => {

&#x20;               if (alive) {

&#x20;                   alive = false;

&#x20;                   b.classList.remove('show');

&#x20;                   setTimeout(() => b.remove(), 300);

&#x20;                   setTimeout(() => { if (ex2GameActive \&\& ex2GameTimeLeft > 0 \&\& ex2GameQueue\[ex2GameIndex] \&\& ex2GameQueue\[ex2GameIndex].english === correctWord) spawnEx2Target(correctWord); }, 1000);

&#x20;               }

&#x20;           }, 5000);

&#x20;       }



&#x20;       function spawnEx2Distractor(correctWord) {

&#x20;           let word = "word";

&#x20;           const r = Math.random();

&#x20;           if (r < 0.5 \&\& allEnglish.length > 1) {

&#x20;               word = shuffle(allEnglish.filter(e => e !== correctWord))\[0] || 'word';

&#x20;           } else if (r < 0.6) {

&#x20;               if (correctWord.length > 3) {

&#x20;                   let chars = correctWord.split('');

&#x20;                   const idx = 1 + Math.floor(Math.random() \* (chars.length - 2));

&#x20;                   \[chars\[idx], chars\[idx + 1]] = \[chars\[idx + 1], chars\[idx]];

&#x20;                   word = chars.join('');

&#x20;               } else {

&#x20;                   word = correctWord + "s";

&#x20;               }

&#x20;           } else {

&#x20;               const randoms = \['lion', 'run', 'blue', 'fast', 'happy', 'house', 'tree', 'jump'];

&#x20;               word = shuffle(randoms.filter(x => x !== correctWord))\[0];

&#x20;           }



&#x20;           let alive = true;

&#x20;           const b = createBubble(word, false, (bubble) => {

&#x20;               if (!alive) return;

&#x20;               alive = false;

&#x20;               bubble.classList.remove('show');

&#x20;               bubble.style.background = 'var(--wrong)';

&#x20;               bubble.style.color = 'white';



&#x20;               const wrongDisplay = document.createElement('div');

&#x20;               wrongDisplay.className = 'game-target-center';

&#x20;               wrongDisplay.style.color = 'var(--wrong)';

&#x20;               wrongDisplay.style.zIndex = '20';

&#x20;               wrongDisplay.textContent = correctWord;

&#x20;               document.getElementById('ex2-game-area').appendChild(wrongDisplay);

&#x20;               setTimeout(() => wrongDisplay.remove(), 1000);



&#x20;               setTimeout(() => bubble.remove(), 300);

&#x20;           });



&#x20;           setTimeout(() => {

&#x20;               if (alive) {

&#x20;                   alive = false;

&#x20;                   b.classList.remove('show');

&#x20;                   setTimeout(() => b.remove(), 300);

&#x20;               }

&#x20;           }, 4000);

&#x20;       }

// ══════════════════════════════════════════

// EX2 MATCH — Matching Table

// ══════════════════════════════════════════

let matchPairs = \[];

let matchSelected = null;



function startMatch() {

&#x09;console.log('🎯 startMatch called, words:', words.length);

&#x20;   matchPairs = words.map(w => ({ english: w.english, french: w.french }));

&#x20;   matchSelected = null;

&#x20;   buildMatchTable();

&#x20;   updateMatchCounter();

&#x20;   showScreen('screen-match');

}



function buildMatchTable() {

&#x20;   const englishWords = shuffle(matchPairs.map(p => p.english));

&#x20;   const frenchWords  = shuffle(matchPairs.map(p => p.french));

&#x20;   const tbody = document.getElementById('match-tbody');

&#x20;   tbody.innerHTML = '';

&#x20;   for (let i = 0; i < matchPairs.length; i++) {

&#x20;       const tr = document.createElement('tr');

&#x20;       const makeCell = (lang, word) => {

&#x20;           const td = document.createElement('td');

&#x20;           const span = document.createElement('span');

&#x20;           span.className = 'match-cell';

&#x20;           span.textContent = word;

&#x20;           span.dataset.lang = lang;

&#x20;           span.dataset.word = word;

&#x20;           span.addEventListener('click', () => onMatchCellClick(span));

&#x20;           td.appendChild(span);

&#x20;           return td;

&#x20;       };

&#x20;       tr.appendChild(makeCell('en', englishWords\[i]));

&#x20;       tr.appendChild(makeCell('fr', frenchWords\[i]));

&#x20;       tbody.appendChild(tr);

&#x20;   }

}



function onMatchCellClick(cell) {

&#x20;   if (cell.classList.contains('matched')) return;



&#x20;   // Tap same cell again = deselect

&#x20;   if (matchSelected \&\& matchSelected.cell === cell) {

&#x20;       cell.classList.remove('selected');

&#x20;       matchSelected = null;

&#x20;       return;

&#x20;   }



&#x20;   // Tap same language = switch selection

&#x20;   if (matchSelected \&\& matchSelected.lang === cell.dataset.lang) {

&#x20;       matchSelected.cell.classList.remove('selected');

&#x20;       cell.classList.add('selected');

&#x20;       matchSelected = { lang: cell.dataset.lang, word: cell.dataset.word, cell };

&#x20;       return;

&#x20;   }



&#x20;   // Nothing selected yet = select

&#x20;   if (!matchSelected) {

&#x20;       cell.classList.add('selected');

&#x20;       matchSelected = { lang: cell.dataset.lang, word: cell.dataset.word, cell };

&#x20;       return;

&#x20;   }



&#x20;   // Two different languages selected — check pair

&#x20;   const enWord = matchSelected.lang === 'en' ? matchSelected.word : cell.dataset.word;

&#x20;   const frWord = matchSelected.lang === 'fr' ? matchSelected.word : cell.dataset.word;

&#x20;   const isCorrect = words.some(w => w.english === enWord \&\& w.french === frWord);



&#x20;   if (isCorrect) {

&#x20;       matchSelected.cell.classList.remove('selected');

&#x20;       matchSelected.cell.classList.add('matched');

&#x20;       cell.classList.add('matched');

&#x20;       matchSelected = null;

&#x20;       matchPairs = matchPairs.filter(p => !(p.english === enWord \&\& p.french === frWord));

&#x20;       updateMatchCounter();

&#x20;       if (matchPairs.length === 0) {

&#x20;           setTimeout(() => {

&#x20;               const msgs = \["All matched!", "Parfait !", "Excellent !"];

&#x20;               showTransition(msgs\[Math.floor(Math.random() \* msgs.length)], startEx3);

&#x20;           }, 600);

&#x20;       }

&#x20;   } else {

&#x20;       const cellA = matchSelected.cell;

&#x20;       matchSelected.cell.classList.remove('selected');

&#x20;       matchSelected.cell.classList.add('wrong');

&#x20;       cell.classList.add('wrong');

&#x20;       matchSelected = null;

&#x20;       loseLife();

&#x20;       setTimeout(() => {

&#x20;           cellA.classList.remove('wrong');

&#x20;           cell.classList.remove('wrong');

&#x20;       }, 700);

&#x20;   }

}



function updateMatchCounter() {

&#x20;   const matched = words.length - matchPairs.length;

&#x20;   document.getElementById('match-counter').textContent = `${matched} / ${words.length} paires trouvées`;

}

&#x20;       // ══════════════════════════════════════════

&#x20;       // EX 3 — Partial word typing

&#x20;       // ══════════════════════════════════════════

&#x20;       function startEx3() {

&#x20;           ex3Queue = shuffle(\[...words]);

&#x20;           ex3Index = 0;

&#x20;           ex3Incorrect = \[];

&#x20;           showScreen('screen-ex3');

&#x20;           loadEx3();

&#x20;       }



&#x20;       function makeAnagramWord(word) {

&#x20;           const letters = word.split('');

&#x20;           if (letters.length <= 1) return word;

&#x20;           let anagram = shuffle(letters).join('');

&#x20;           let attempts = 0;

&#x20;           while (anagram === word \&\& attempts < 5) {

&#x20;               anagram = shuffle(letters).join('');

&#x20;               attempts++;

&#x20;           }

&#x20;           return anagram;

&#x20;       }



&#x20;       function loadEx3() {

&#x20;           if (ex3Index >= ex3Queue.length) {

&#x20;               if (ex3Incorrect.length > 0) {

&#x20;                   startEx3Retest();

&#x20;               } else {

&#x20;                   showSessionComplete();

&#x20;               }

&#x20;               return;

&#x20;           }



&#x20;           const w = ex3Queue\[ex3Index];

&#x20;           const anagram = makeAnagramWord(w.english);

&#x20;           document.getElementById('ex3-french').textContent = w.french;



&#x20;           const display = \[...anagram].map(c =>

&#x20;               c === ' ' ? `\&nbsp;\&nbsp;` : `<span style="margin: 0 2px;">${c}</span>`

&#x20;           ).join('');

&#x20;           document.getElementById('ex3-partial').innerHTML = display;



&#x20;           document.getElementById('ex3-counter').textContent = `${ex3Index + 1} / ${ex3Queue.length}`;

&#x20;           document.getElementById('ex3-feedback').className = 'feedback-banner';

&#x20;           document.getElementById('ex3-next-btn').classList.add('hidden');

&#x20;           document.getElementById('ex3-input').value = '';

&#x20;           document.getElementById('ex3-input').className = 'type-input';

&#x20;           document.getElementById('ex3-input').placeholder = 'Tapez le mot anglais complet...';



&#x20;           document.getElementById('ex3-input').dataset.answer = w.english;

&#x20;           document.getElementById('ex3-input').dataset.partial = anagram;

&#x20;           document.getElementById('ex3-input').dataset.ex3Tried = "false";

&#x20;       }



&#x20;       function ex3Check() {

&#x20;           const input = document.getElementById('ex3-input');

&#x20;           const answer = input.dataset.answer.toLowerCase();

&#x20;           const val = input.value.trim().toLowerCase();

&#x20;           const tried = input.dataset.ex3Tried === "true";

&#x20;           if (tried) return; // Prevent double-fire



&#x20;           if (val === answer) {

&#x20;               input.classList.add('correct');

&#x20;               triggerGlow('correct');

&#x20;               showFeedback('ex3-feedback', 'correct', '✓ Correct !');

&#x20;               playAudio(false, answer);

&#x20;               if (!tried) {

&#x20;                   firstTryCorrect++;

&#x20;               }

&#x20;               input.dataset.ex3Tried = "true";

&#x20;           } else {

&#x20;               input.classList.add('wrong');

&#x20;               triggerGlow('wrong');

&#x20;               showFeedback('ex3-feedback', 'wrong', `✗ La bonne réponse était : "${input.dataset.answer}"`);



&#x20;               if (!wordErrors\[answer]) wordErrors\[answer] = 0;

&#x20;               wordErrors\[answer]++;

&#x20;               loseLife();

&#x20;               if (!ex3Incorrect.find(w => w.english.toLowerCase() === answer)) {

&#x20;                   ex3Incorrect.push(ex3Queue\[ex3Index]);

&#x20;               }

&#x20;               input.dataset.ex3Tried = "true";

&#x20;           }

&#x20;           stepsCompleted++;

&#x20;           updateProgress();

&#x20;           document.getElementById('ex3-next-btn').classList.remove('hidden');

&#x20;       }



&#x20;       function ex3Next() {

&#x20;           ex3Index++;

&#x20;           showScreen('screen-ex3');

&#x20;           loadEx3();

&#x20;       }



&#x20;       function startEx3Retest() {

&#x20;           ex3RetestIndex = 0;

&#x20;           showScreen('screen-ex3-retest');

&#x20;           loadEx3Retest();

&#x20;       }



&#x20;       function loadEx3Retest() {

&#x20;           if (ex3RetestIndex >= ex3Incorrect.length) {

&#x20;               showSessionComplete();

&#x20;               return;

&#x20;           }



&#x20;           ex3RetestAttempts = 0;

&#x20;           const w = ex3Incorrect\[ex3RetestIndex];

&#x20;           document.getElementById('ex3rt-french').textContent = w.french;



&#x20;           const engDisplay = document.getElementById('ex3rt-english-display');

&#x20;           engDisplay.textContent = w.english;

&#x20;           engDisplay.style.display = 'block';



&#x20;           document.getElementById('ex3rt-counter').textContent = `${ex3RetestIndex + 1} / ${ex3Incorrect.length}`;

&#x20;           document.getElementById('ex3rt-feedback').className = 'feedback-banner';

&#x20;           document.getElementById('ex3rt-next-btn').classList.add('hidden');



&#x20;           const input = document.getElementById('ex3rt-input');

&#x20;           input.value = '';

&#x20;           input.className = 'type-input hidden';

&#x20;           input.placeholder = 'Tapez le mot anglais...';

&#x20;           input.dataset.answer = w.english;

&#x20;           input.disabled = false;



&#x20;           document.getElementById('ex3rt-memorized-btn').classList.remove('hidden');

&#x20;           document.getElementById('ex3rt-verify-btn').classList.add('hidden');

&#x20;       }



&#x20;       function ex3RetestMemorized() {

&#x20;           document.getElementById('ex3rt-english-display').style.display = 'none';

&#x20;           document.getElementById('ex3rt-memorized-btn').classList.add('hidden');

&#x20;           document.getElementById('ex3rt-verify-btn').classList.remove('hidden');



&#x20;           const input = document.getElementById('ex3rt-input');

&#x20;           input.classList.remove('hidden');

&#x20;           input.focus();

&#x20;       }



&#x20;       function ex3RetestCheck() {

&#x20;           const input = document.getElementById('ex3rt-input');

&#x20;           const answer = input.dataset.answer.toLowerCase();

&#x20;           const val = input.value.trim().toLowerCase();



&#x20;           const verifyBtn = document.getElementById('ex3rt-verify-btn');



&#x20;           if (val === answer) {

&#x20;               input.classList.add('correct');

&#x20;               triggerGlow('correct');

&#x20;               showFeedback('ex3rt-feedback', 'correct', '✓ Correct !');

&#x20;               playAudio(false, answer);

&#x20;               input.disabled = true;

&#x20;               verifyBtn.classList.add('hidden');

&#x20;               document.getElementById('ex3rt-next-btn').classList.remove('hidden');

&#x20;           } else {

&#x20;               ex3RetestAttempts++;

&#x20;               input.classList.add('wrong');

&#x20;               triggerGlow('wrong');

&#x20;               retestAllCorrect = false;



&#x20;               if (ex3RetestAttempts >= 2) {

&#x20;                   showFeedback('ex3rt-feedback', 'wrong', `✗ La bonne réponse était : "${input.dataset.answer}"`);

&#x20;                   input.disabled = true;

&#x20;                   verifyBtn.classList.add('hidden');

&#x20;                   document.getElementById('ex3rt-next-btn').classList.remove('hidden');

&#x20;               } else {

&#x20;                   showFeedback('ex3rt-feedback', 'wrong', '✗ Presque... (1 tentative restante)');

&#x20;               }

&#x20;           }

&#x20;       }



&#x20;       function ex3RetestNext() {

&#x20;           ex3RetestIndex++;

&#x20;           showScreen('screen-ex3-retest');

&#x20;           loadEx3Retest();

&#x20;       }



&#x20;       // ══════════════════════════════════════════

&#x20;       // SHARED HELPERS

&#x20;       // ══════════════════════════════════════════

&#x20;       function showFeedback(id, type, msg) {

&#x20;           const el = document.getElementById(id);

&#x20;           el.className = `feedback-banner show ${type}`;

&#x20;           el.innerHTML = (type === 'correct' ? '✓ ' : '✗ ') + msg.replace(/^\[✓✗] /, '');

&#x20;       }



&#x20;       function showSessionComplete() {

&#x20;           document.getElementById('progressBar').style.width = '100%';



&#x20;           const totalChunks = Math.ceil(fullWordList.length / 10);

&#x20;           document.getElementById('complete-title').textContent = `Session terminée ! (${currentChunkIndex + 1}/${totalChunks})`;



&#x20;           const now = Date.now();

&#x20;           const diffSecs = Math.floor((now - sessionStartTime) / 1000);

&#x20;           const m = Math.floor(diffSecs / 60);

&#x20;           const s = diffSecs % 60;



&#x20;           document.getElementById('stat-time').textContent = `${m}m ${s}s`;

&#x20;           document.getElementById('stat-words').textContent = words.length;



&#x20;           const reviseList = document.getElementById('stat-revise-list');

&#x20;           reviseList.innerHTML = '';



&#x20;           const sortedErrors = Object.keys(wordErrors).sort((a, b) => wordErrors\[b] - wordErrors\[a]);

&#x20;           const topErrors = sortedErrors.slice(0, 3);



&#x20;           if (topErrors.length === 0) {

&#x20;               reviseList.innerHTML = '<li style="color:var(--correct); list-style:none;">Aucun, parfait ! 🎉</li>';

&#x20;           } else {

&#x20;               topErrors.forEach(w => {

&#x20;                   const li = document.createElement('li');

&#x20;                   li.textContent = w + ` (${wordErrors\[w]} erreur${wordErrors\[w] > 1 ? 's' : ''})`;

&#x20;                   reviseList.appendChild(li);

&#x20;               });

&#x20;           }



&#x20;           const btnNext = document.getElementById('btn-next-group');

&#x20;           if ((currentChunkIndex + 1) \* 10 < fullWordList.length) {

&#x20;               btnNext.style.display = 'block';

&#x20;           } else {

&#x20;               btnNext.style.display = 'none';

&#x20;           }



&#x20;           // Calculate score with bonuses

&#x20;           const baseScore = (firstTryCorrect \* 10) + (secondTryCorrect \* 5);

&#x20;           const perfectLivesBonus = playerLives === MAX\_LIVES ? 10 : 0;

&#x20;           const hasRetest = (ex1Incorrect.length > 0 || ex3Incorrect.length > 0);

&#x20;           const perfectRetestBonus = hasRetest \&\& retestAllCorrect ? 10 : 0;

&#x20;           const scoreGained = baseScore + perfectLivesBonus + perfectRetestBonus;



&#x20;           // Update score display

&#x20;           document.getElementById('stat-score').textContent = `${scoreGained} pts`;



&#x20;           // Show bonus breakdown if any bonuses earned

&#x20;           const bonuses = \[];

&#x20;           if (firstTryCorrect > 0) bonuses.push({ label: `${firstTryCorrect} × premier essai correct`, pts: firstTryCorrect \* 10 });

&#x20;           if (secondTryCorrect > 0) bonuses.push({ label: `${secondTryCorrect} × deuxième essai correct`, pts: secondTryCorrect \* 5 });

&#x20;           if (perfectLivesBonus) bonuses.push({ label: '🛡️ Toutes vies conservées', pts: 10 });

&#x20;           if (perfectRetestBonus) bonuses.push({ label: '⭐ Révision parfaite', pts: 10 });



&#x20;           const bonusDiv = document.getElementById('stat-bonuses');

&#x20;           const bonusList = document.getElementById('stat-bonus-list');

&#x20;           bonusList.innerHTML = bonuses.map(b =>

&#x20;               `<div style="display:flex; justify-content:space-between;"><span>${b.label}</span><span style="color:var(--accent); font-weight:600;">+${b.pts}</span></div>`

&#x20;           ).join('');

&#x20;           bonusDiv.style.display = bonuses.length > 0 ? 'block' : 'none';



&#x20;           syncProgressToServer(scoreGained);



&#x20;           showScreen('screen-complete');

&#x20;       }



&#x20;       function restartApp() {

&#x20;           stepsCompleted = 0;

&#x20;           totalSteps = words.length \* 4;

&#x20;           sessionStartTime = Date.now();

&#x20;           firstTryCorrect = 0;

&#x20;           secondTryCorrect = 0;

&#x20;           retestAllCorrect = true;

&#x20;           wordErrors = {};

&#x20;           initLives();

&#x20;           updateProgress();

&#x20;           document.getElementById('header-home-btn').classList.remove('hidden');

&#x20;           document.getElementById('header-progress-wrap').style.display = 'block';

&#x20;           showScreen('screen-encounter');

&#x20;           startEncounter();

&#x20;       }



&#x20;       function nextGroup() {

&#x20;           currentChunkIndex++;

&#x20;           startCurrentChunk();

&#x20;       }



&#x20;       // ══════════════════════════════════════════

&#x20;       // INIT \& FETCH

&#x20;       // ══════════════════════════════════════════

&#x20;       async function initializeDashboard() {

&#x20;           if (currentProfile) {

&#x20;               document.getElementById('header-profile-btn-container').style.display = 'block';

&#x20;               document.getElementById('header-avatar-btn').innerText = getAvatarEmoji(currentProfile.avatar\_id);

&#x20;           } else {

&#x20;               document.getElementById('header-profile-btn-container').style.display = 'none';

&#x20;           }

&#x20;           showScreen('screen-loading');

&#x20;           document.getElementById('loading-status').textContent = 'Chargement en cours...';

&#x20;           document.getElementById('header-home-btn').classList.add('hidden');

&#x20;           document.getElementById('header-logo').style.display = 'block';

&#x20;           document.getElementById('header-progress-wrap').style.display = 'none';



&#x20;           try {

&#x20;               const response = await fetch(INDEX\_FILE);

&#x20;               if (!response.ok) {

&#x20;                   throw new Error(`HTTP Error: ${response.status}`);

&#x20;               }

&#x20;               const data = await response.json();

&#x20;               indexDataCached = data;

&#x20;               renderHomeDashboard(data);



&#x20;               // Fetch leaderboard after rendering dashboard

&#x20;               if (currentProfile) {

&#x20;                   await fetchLeaderboard(WORD\_LIST\_FILE || null);

&#x20;               }



&#x20;               showScreen('screen-home');

&#x20;           } catch (err) {

&#x20;               console.error("Failed to load index:", err);

&#x20;               WORD\_LIST\_FILE = '';

&#x09;	currentCourseName = '';

&#x20;               showScreen('screen-error');

&#x20;           }

&#x20;       }



async function fetchLeaderboard(courseKey) {

&#x20;   document.getElementById('home-leaderboard').style.display = 'block';

&#x20;   const tbody = document.getElementById('leaderboard-body');

&#x20;   tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Chargement...</td></tr>';



&#x20;   // Update leaderboard title to show which course it's for

&#x20;   const leaderboardTitle = document.getElementById('leaderboard-title');

&#x20;   if (leaderboardTitle) {

&#x20;       leaderboardTitle.textContent = courseKey

&#x20;           ? `Classement — ${currentCourseName || 'Ce cours'}`

&#x20;           : 'Classement général';

&#x20;   }



&#x20;   const { data, error } = await sbClient

&#x20;       .from('profiles')

&#x20;       .select('username, avatar\_id, courses\_progress, total\_score, id');



&#x20;   if (error || !data) {

&#x20;       tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--wrong);">Erreur de chargement.</td></tr>';

&#x20;       return;

&#x20;   }



&#x20;   let ranked;



&#x20;   if (courseKey) {

&#x20;       // Per-course leaderboard: only show users who played this course

&#x20;       ranked = data

&#x20;           .filter(p => p.courses\_progress?.\[courseKey]?.score > 0)

&#x20;           .map(p => ({

&#x20;               ...p,

&#x20;               displayScore: p.courses\_progress\[courseKey].score

&#x20;           }))

&#x20;           .sort((a, b) => b.displayScore - a.displayScore)

&#x20;           .slice(0, 10);

&#x20;   } else {

&#x20;       // Fallback: global leaderboard

&#x20;       ranked = data

&#x20;           .map(p => ({ ...p, displayScore: p.total\_score || 0 }))

&#x20;           .sort((a, b) => b.displayScore - a.displayScore)

&#x20;           .slice(0, 10);

&#x20;   }



&#x20;   if (ranked.length === 0) {

&#x20;       tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Aucun joueur pour ce cours.</td></tr>';

&#x20;       return;

&#x20;   }



&#x20;   let html = '';

&#x20;   ranked.forEach((p, index) => {

&#x20;       const isMe = p.id === currentUser?.id;

&#x20;       const rank = index + 1;

&#x20;       let rankDisplay = rank;

&#x20;       if (rank === 1) rankDisplay = '🥇 1';

&#x20;       if (rank === 2) rankDisplay = '🥈 2';

&#x20;       if (rank === 3) rankDisplay = '🥉 3';



&#x20;       html += `

&#x20;           <tr class="${isMe ? 'highlight' : ''}">

&#x20;               <td>${rankDisplay}</td>

&#x20;               <td>

&#x20;                   <div style="display: flex; align-items: center; gap: 8px;">

&#x20;                       <span style="font-size: 1.2rem;">${getAvatarEmoji(p.avatar\_id)}</span>

&#x20;                       <span>${p.username || 'Joueur anonyme'} ${isMe ? '(Toi)' : ''}</span>

&#x20;                   </div>

&#x20;               </td>

&#x20;               <td style="font-weight: 600; color: var(--accent);">${p.displayScore}</td>

&#x20;           </tr>

&#x20;       `;

&#x20;   });

&#x20;   tbody.innerHTML = html;

}

&#x20;       async function loadWordList() {

&#x20;           showScreen('screen-loading');

&#x20;           document.getElementById('loading-status').textContent = 'Chargement de la liste...';

&#x20;           document.getElementById('header-home-btn').classList.add('hidden');

&#x20;           document.getElementById('header-logo').style.display = 'none';

&#x20;           document.getElementById('header-progress-wrap').style.display = 'none';



&#x20;           try {

&#x20;               const response = await fetch(WORD\_LIST\_FILE);

&#x20;               if (!response.ok) {

&#x20;                   throw new Error(`HTTP Error: ${response.status}`);

&#x20;               }

&#x20;               const data = await response.json();



&#x20;               let parsedWords = parseWordList(data);



&#x20;               if (!parsedWords || parsedWords.length === 0) {

&#x20;                   throw new Error("No words found in JSON.");

&#x20;               }



&#x20;               fullWordList = shuffle(parsedWords);

&#x20;               currentChunkIndex = 0;



&#x20;               await startCurrentChunk();

&#x20;           } catch (err) {

&#x20;               console.error("Failed to load words:", err);

&#x20;               showScreen('screen-error');

&#x20;           }

&#x20;       }



&#x20;       async function startCurrentChunk() {

&#x20;           showScreen('screen-loading');

&#x20;           document.getElementById('loading-status').textContent = 'Traduction et génération des phrases...';



&#x20;           const startIndex = currentChunkIndex \* 10;

&#x20;           const chunk = fullWordList.slice(startIndex, startIndex + 10);



&#x20;           words = await translateAndGenerateSentencesForSession(chunk);

&#x20;           allEnglish = words.map(w => w.english);

&#x20;           allFrench = words.map(w => w.french);



&#x20;           totalSteps = words.length \* 4;

&#x20;           stepsCompleted = 0;

&#x20;           sessionStartTime = Date.now();

&#x20;           firstTryCorrect = 0;

&#x20;           secondTryCorrect = 0;

&#x20;           retestAllCorrect = true;

&#x20;           wordErrors = {};

&#x20;           initLives();

&#x20;           updateProgress();



&#x20;           document.getElementById('header-home-btn').classList.remove('hidden');

&#x20;           document.getElementById('header-progress-wrap').style.display = 'block';



&#x20;           showScreen('screen-encounter');

&#x20;           startEncounter();

&#x20;       }



&#x20;       function handleRetry() {

&#x20;           if (WORD\_LIST\_FILE) {

&#x20;               loadWordList();

&#x20;           } else {

&#x20;               initializeDashboard();

&#x20;           }

&#x20;       }



&#x20;     async function syncProgressToServer(scoreGained) {

&#x20;   if (!currentProfile) return;

&#x20;   currentProfile.total\_score = (currentProfile.total\_score || 0) + scoreGained;



&#x20;   if (!currentProfile.courses\_progress) currentProfile.courses\_progress = {};

&#x20;   const courseKey = WORD\_LIST\_FILE || 'default\_course';

&#x20;   if (!currentProfile.courses\_progress\[courseKey]) {

&#x20;       currentProfile.courses\_progress\[courseKey] = { seen: 0, learning: 0, learnt: 0, score: 0 };

&#x20;   }



&#x20;   const progress = currentProfile.courses\_progress\[courseKey];

&#x20;   const wordsInSession = words.length;

&#x20;   const wordsLearnt = firstTryCorrect;

&#x20;   const wordsLearning = wordsInSession - wordsLearnt;



&#x20;   progress.seen += wordsInSession;

&#x20;   progress.learnt += wordsLearnt;

&#x20;   progress.learning += wordsLearning;

&#x20;   progress.score = (progress.score || 0) + scoreGained; // ← new



&#x20;   await sbClient.from('profiles').update({

&#x20;       total\_score: currentProfile.total\_score,

&#x20;       courses\_progress: currentProfile.courses\_progress

&#x20;   }).eq('id', currentUser.id);

}

&#x20;       console.log('Calling initAuth now');

&#x20;       initAuth().catch(err => {

&#x20;           console.error('initAuth uncaught error:', err);

&#x20;           showScreen('screen-login');

&#x20;       });

&#x20;   </script>

</body>



</html>

