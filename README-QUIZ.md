# 🧠 Socratic Reviewer Agent

A self-quiz system that acts as your senior engineer interviewer — asks you questions about your own code, hides the answers, tracks your weak spots, and gets harder over time.

---

## Quick Setup (5 minutes)

### 1. Copy files into your project

```
your-project/
├── .github/
│   ├── copilot-instructions.md   ← Agent brain
│   ├── quiz-memory.json          ← Your progress tracker
│   ├── prompts/
│   │   └── quiz-me.prompt.md     ← VS Code slash command
│   └── workflows/
│       └── quiz-on-pr.yml        ← Auto-quiz on every PR
└── .vscode/
    └── settings.json             ← Enables custom instructions
```

### 2. Add your Anthropic API key (for GitHub Action)

Go to: **GitHub repo → Settings → Secrets → Actions → New secret**

```
Name:  ANTHROPIC_API_KEY
Value: sk-ant-...
```

> Get a key at [console.anthropic.com](https://console.anthropic.com)

### 3. Enable Copilot instruction files in VS Code

The `.vscode/settings.json` already does this. Just make sure you have the **GitHub Copilot Chat** extension installed.

---

## How to Use

### Option A: VS Code Slash Command (manual session)

1. Open **Copilot Chat** (`Ctrl+Shift+I` / `Cmd+Shift+I`)
2. Type: `/quiz-me`
3. Attach your memory file when prompted: `#file:.github/quiz-memory.json`
4. The agent starts your session

**During the session:**
| Say this | What happens |
|----------|-------------|
| *(your answer)* | Agent evaluates, asks follow-up or next question |
| `hint please` | Get a Socratic hint (not the answer) |
| `show answer` | Full answer revealed with explanation |
| `harder` | Skip to a harder question |
| `save session` | Agent outputs updated `quiz-memory.json` to paste back |

### Option B: GitHub Action (automatic on every PR)

Every time you open or update a PR:
1. The action reads your changed files
2. Loads your `quiz-memory.json` for difficulty + weak areas  
3. Generates 3 targeted questions as a PR comment
4. Answers are hidden in collapsed `<details>` blocks

After answering, update your `quiz-memory.json` manually or via a Copilot Chat session.

---

## Tracking Your Progress

The `quiz-memory.json` file is your persistent brain:

```json
{
  "lastSession": "2024-01-20",
  "difficultyLevel": 3,
  "weakAreas": ["indexing", "error handling"],
  "strongAreas": ["normalization", "REST conventions"],
  "questionsAsked": ["Why use file paths vs binary?"],
  "sessionCount": 7
}
```

**Update it after each session** — either manually or by asking Copilot:
> "Output my updated quiz-memory.json based on today's session"

---

## Difficulty Levels

| Level | Label | Example question |
|-------|-------|-----------------|
| L1 | Foundational | "What is a foreign key?" |
| L2 | Applied | "Why did you choose this DB structure?" |
| L3 | Edge Cases | "What happens if the file is deleted but the DB row remains?" |
| L4 | Expert | "How would you handle 10k concurrent image uploads?" |

The agent automatically adjusts based on your answers.

---

## Tips

- **Commit `quiz-memory.json`** — it's how the GitHub Action knows your history
- **Don't peek at `<details>` until you've written your answer** — honor system!
- **After 3-4 wrong answers on a topic** → it'll keep coming back until you nail it
- **Use `#changes` in Copilot Chat** to give it context on what you recently built