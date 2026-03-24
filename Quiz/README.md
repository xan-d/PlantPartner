# 🌿 Plant Partner — Socratic Quiz System

Every time you push code, a 10-question interactive quiz is automatically
generated from your diff, deployed to GitHub Pages, and emailed to you.

---

## How It Works

```
git push
    └─► GitHub Actions triggers
            ├─ Analyses changed files (falls back to project-wide context if diff < 10 lines)
            ├─ Loads quiz-memory.json (difficulty level, weak areas, session count)
            ├─ Calls Claude to generate 10 questions in 3 formats:
            │       • Multiple choice (instant correct/wrong feedback)
            │       • Free text      (AI-graded via Claude Haiku)
            │       • Explained MC   (detailed explanation revealed after answering)
            ├─ Deploys quiz HTML to GitHub Pages  →  gh-pages/quizzes/<commit>.html
            └─ Emails you a styled link to take the quiz
```

---

## Setup (one-time)

### 1. Enable GitHub Pages

Go to **Settings → Pages** in your repo:
- Source: **Deploy from a branch**
- Branch: **`gh-pages`** / `/ (root)`

### 2. Add repository secrets

Go to **Settings → Secrets and variables → Actions → New repository secret**:

| Secret name | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `GMAIL_USER` | Your Gmail address (e.g. `you@gmail.com`) |
| `GMAIL_APP_PW` | A Gmail **App Password** (not your normal password) — [create one here](https://myaccount.google.com/apppasswords) |
| `QUIZ_NOTIFY_EMAIL` | Email address to send quiz notifications to |

> **Gmail App Password:** In your Google Account → Security → 2-Step Verification → App passwords. Create one named "GitHub Quiz".

### 3. Update quiz-memory.json

Edit `.github/quiz-memory.json` to set your starting difficulty and weak areas:

```json
{
  "difficultyLevel": 2,
  "weakAreas": ["Query indexing", "Auth & security", "Error handling"],
  "sessionCount": 0,
  "lastSession": null
}
```

After each quiz session, manually bump `sessionCount` and update `weakAreas`
based on where you struggled.

---

## Quiz Formats

### Multiple Choice
Pick one of four options. The correct answer and a brief explanation are
revealed immediately.

### Free Text + AI Grading
Type your answer. Claude grades it against the sample answer and gives
feedback. Requires the quiz page to have access to an Anthropic API key —
see [AI Grading](#ai-grading) below.

### Explained Multiple Choice
Pick an answer, then a full detailed explanation is revealed (good or bad).

---

## AI Grading for Free-Text Questions

Free-text questions are graded by Claude Haiku directly from the browser.
Because GitHub Pages is a static host, the call goes directly to the
Anthropic API from your browser.

**To enable it**, open the quiz page and run this in your browser console:

```javascript
document.getElementById('anth-key').value = 'sk-ant-...your-key...';
```

Or add a `?key=sk-ant-...` URL parameter (the page reads it automatically
if you modify the JS to do so).

> If no key is present, free-text questions fall back to self-grading:
> the sample answer is revealed and you mark yourself correct/incorrect.

---

## Access Control

The quiz page checks that the GitHub username you enter matches the pusher
of the commit. This is a lightweight self-attestation gate — appropriate
for a personal dev tool. For stricter access control, deploy to a platform
that supports server-side authentication (Vercel, Netlify with Identity, etc.)
and add a real OAuth flow.

---

## Difficulty Progression

Manually update `.github/quiz-memory.json` after sessions to track progress:

```json
{
  "difficultyLevel": 3,
  "weakAreas": ["Error handling", "DB transactions"],
  "sessionCount": 5,
  "lastSession": "2026-03-24"
}
```

Difficulty levels:
- `1` — Foundational (what does X do?)
- `2` — Applied (how would you use X in this codebase?)
- `3` — Edge cases (what breaks if...?)
- `4` — Expert (performance, security, architecture trade-offs)

---

## File Structure

```
.github/
  workflows/
    quiz-on-push.yml      ← the workflow
  quiz-memory.json        ← your progress tracker
```

The `gh-pages` branch is managed automatically — don't edit it manually.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| No email received | Check `GMAIL_USER`, `GMAIL_APP_PW`, and `QUIZ_NOTIFY_EMAIL` secrets. Make sure you're using an App Password, not your Gmail password. |
| Quiz page 404 | Wait 2-3 minutes for GitHub Pages to deploy. Check Settings → Pages to confirm Pages is enabled on `gh-pages`. |
| "API key error" on free-text grading | Paste your Anthropic key into the browser console as shown above. |
| Questions are generic / not about my code | The diff was too small — the workflow auto-supplements with broader project context. Push more code or check that your files match the `*.js|*.ts|*.sql|*.json|*.jsx|*.tsx` filter. |
