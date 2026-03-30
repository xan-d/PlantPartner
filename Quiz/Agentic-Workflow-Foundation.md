# Agentic Workflow Foundation

A practical, offline guide for building strong programming skills while using AI agents.

Project context: PlantPartner (React frontend, Node/Express backend, SQL procedures/migrations, quiz system).
Audience: You are new to agentic workflows and want to learn deeply without becoming dependent on AI.

---

## 1) What an agentic workflow is

An agentic workflow means you use AI as an active collaborator that can:
- Read project context
- Propose plans
- Execute scoped tasks
- Validate results
- Explain trade-offs
- Help you reflect and improve

The key difference from normal prompting:
- Normal prompting: one-off answers
- Agentic workflow: iterative loop with memory, verification, and decision points

Think of it like this:
- You are the engineer and decision owner.
- The agent is an assistant that can execute quickly, but should not own your judgment.

---

## 2) Core mindset: AI as gym, not crutch

If your goal is long-term skill growth, optimize for struggle quality, not short-term speed.

Healthy struggle means:
- You attempt first
- You explain your reasoning
- You inspect failures
- You compare your mental model to reality

Unhealthy dependence means:
- You copy code you do not understand
- You skip testing and verification
- You ask for full solutions before trying
- You cannot recreate a fix later without AI

Rule of thumb:
- If you could not explain the fix to a teammate in 90 seconds, you do not own it yet.

---

## 3) A practical 7-step agent loop

Use this loop for almost every coding task:

1. Define intent
- What outcome do I need?
- How will I know it is correct?

2. Predict before action
- Write your best guess of root cause / design / SQL plan.

3. Ask for constrained help
- Ask for hints, checks, alternatives, edge cases.
- Avoid asking for full code first.

4. Implement yourself first
- Write v1 manually.

5. Use agent for review
- Ask for bug risks, security risks, regressions, test gaps.

6. Verify with tests and checks
- Run app behavior checks, test query plans, validate API responses.

7. Reflect and store learning
- What confused me?
- What pattern will I reuse next time?

This loop is where your skill compounds.

---

## 4) Agent types and when to use each

### A) Socratic Coach Agent
Use when:
- You want to learn, not just finish
- You are debugging and want to improve reasoning

Behavior:
- Asks one question at a time
- Gives hints in levels
- Reveals full answer only on request

Best for:
- Auth design
- SQL transaction reasoning
- React state bugs

### B) PR Risk Reviewer Agent
Use when:
- You have a change ready and want high-signal review

Behavior:
- Prioritizes correctness, security, and regressions
- Calls out missing tests
- Gives severity and references

Best for:
- Backend route changes
- DB schema changes
- Auth middleware updates

### C) SQL Performance Agent
Use when:
- A query is slow
- You are adding indexes or migrations

Behavior:
- Reads query patterns
- Suggests index strategy with reasoning
- Explains lock/contention risk

Best for:
- Pagination
- Composite index decisions
- Transaction scope tuning

### D) Edge Case Hunter Agent
Use when:
- You think your feature is done
- You want hidden failure modes

Behavior:
- Generates adversarial cases
- Includes expected behavior and likely breakpoints

Best for:
- Input validation
- Race conditions
- Caching correctness

### E) Incident Drill Agent
Use when:
- You want operational maturity

Behavior:
- Simulates outages and failure symptoms
- Forces hypothesis before reveal
- Teaches triage and postmortem habits

Best for:
- 401 spikes
- DB timeout incidents
- Deploy regressions

---

## 5) Learning-first defaults (very important)

Configure your workflow with these defaults:

1. Attempt-first policy
- Agent must ask for your attempt before full solution.

2. Hint ladder policy
- Hint 1: conceptual nudge
- Hint 2: pseudo-steps
- Hint 3: partial code
- Full solution only after your attempt

3. Explain-before-patch policy
- Agent explains root cause and fix strategy before writing code.

4. Verify-before-done policy
- Agent must run or propose checks/tests before declaring complete.

5. Reflection policy
- End each session with 3 bullets:
  - What I learned
  - What I still do not understand
  - What I will practice next

---

## 6) Suggested custom agents for PlantPartner

### Agent 1: PlantPartner Socratic Coach
Purpose:
- Teach through questioning across frontend/backend/SQL.

Prompt contract:
- Start with one question tied to changed files.
- Wait for answer.
- Provide critique + what is correct + what is missing.
- Offer hint or next harder question.

Hard rules:
- No final code unless user asks after attempt.
- Correct confidently when user is wrong.

### Agent 2: PlantPartner SQL Coach
Purpose:
- Improve procedure/query quality and migration safety.

Prompt contract:
- Analyze query goal
- Propose index/migration changes
- Explain trade-offs
- Give one verification query or test step

Hard rules:
- Every index suggestion must include expected query shape.
- Every migration suggestion must include rollback thought.

### Agent 3: PlantPartner API Contract Guardian
Purpose:
- Keep frontend and backend in sync.

Prompt contract:
- Validate request/response schema expectations
- Check status code consistency
- Flag backward compatibility risk

Hard rules:
- Highlight breaking changes clearly.
- Provide mitigation path.

### Agent 4: PlantPartner Incident Drill
Purpose:
- Build real troubleshooting skill.

Prompt contract:
- Present realistic symptom set
- Ask for your top 3 hypotheses
- Ask for first diagnostic commands/checks
- Reveal likely root cause after your attempt

Hard rules:
- Do not reveal answer immediately.

---

## 7) Example prompt templates (copy/paste)

### Template: Socratic session
I want learning mode. Ask one question at a time about my recent changes.
Do not provide full code until I attempt.
Use a hint ladder (concept, pseudo-step, partial code, full only if asked).
Correct me directly if I am wrong.

### Template: Debug with minimal help
I will share my hypothesis first. Challenge it and ask me 2 diagnostic checks.
Do not give final fix yet.

### Template: SQL review
Review this query and migration idea for performance and safety.
Return: risk level, likely bottleneck, better index strategy, rollback note, one validation query.

### Template: PR risk review
Review this change with risk-first order:
1) correctness/regression
2) security
3) missing tests
Then provide concise fixes.

### Template: Incident drill
Run a realistic incident drill in my stack. Do not reveal root cause until I provide hypotheses and first triage steps.

---

## 8) How to avoid weak skill loops

Weak loop:
- Ask AI for full code
- Paste
- Ship
- Forget

Strong loop:
- Attempt
- Fail visibly
- Ask for targeted critique
- Patch
- Verify
- Explain in your own words
- Revisit same pattern later

Operational rule:
- No merge of code you cannot explain.

---

## 9) Skill-building scorecard (per session)

Rate each item 0, 1, or 2.

- I made an attempt before asking for full code.
- I wrote my hypothesis before debugging.
- I asked for edge cases, not just happy path.
- I verified behavior after changes.
- I can explain root cause and fix clearly.
- I recorded one reusable pattern.

Score interpretation:
- 0-4: heavy AI dependence session
- 5-8: mixed session
- 9-12: strong learning session

Use this score to track trend, not perfection.

---

## 10) Flight-friendly study routine (no internet)

You can run this as a 90-120 minute block.

Block A (25 min):
- Do 15 quiz questions from hard set.
- Mark confidence high/medium/low.

Block B (25 min):
- For each miss, write why your answer was wrong.
- Write one general rule learned.

Block C (20 min):
- Pick one backend/API concept and explain from memory:
  - auth flow
  - status code semantics
  - transaction boundaries

Block D (20-30 min):
- Design drill on paper:
  - "How would I prevent stale permission bugs with caching?"
  - Include failure modes, tests, rollout plan.

Optional final 10 min:
- Write 5 interview-style questions from your own weak areas.

---

## 11) Decision trees for common tasks

### Debugging decision tree
1. Is behavior reproducible?
- No -> add logs/metrics to make it reproducible
- Yes -> continue

2. Is it data issue, control flow issue, or environment issue?
- Data -> inspect input/output and schema assumptions
- Control flow -> trace code path and branches
- Environment -> config, secrets, deployments

3. What changed recently?
- Check recent file diffs and deployments

4. Can you write a minimal failing case?
- If yes, you have leverage

5. Apply smallest fix and verify

### SQL tuning decision tree
1. Identify slow query pattern and target latency
2. Inspect execution plan
3. Check selectivity and index usage
4. Evaluate index candidate with workload trade-off
5. Re-test with realistic data shape

---

## 12) Common anti-patterns in agent usage

- Asking broad "fix this" with no acceptance criteria
- Accepting suggestions without verification
- Ignoring security and edge cases
- Treating green tests as proof of correctness when tests are shallow
- No post-change reflection

Countermeasure:
- Always define done conditions before coding.

---

## 13) Good acceptance criteria examples

Bad:
- "Make auth better"

Good:
- Login rejects invalid credentials with 401
- Protected routes require valid token
- Ownership checks return 403 on cross-user access
- Error body follows consistent schema
- Add tests for success, invalid token, expired token, wrong owner

Bad:
- "Optimize query"

Good:
- Endpoint p95 from 900ms to <250ms on dataset X
- Query plan uses index seek, not full scan
- No write latency regression >10%

---

## 14) Suggested progression path (4 weeks)

Week 1: Foundations
- Use Socratic mode for all sessions
- Force attempt-first
- Do 2 quiz sessions

Week 2: Debugging depth
- Run 2 incident drills
- Practice writing hypotheses before fixes

Week 3: SQL and API rigor
- Focus on query plans, indexes, contract consistency
- Do one migration design review

Week 4: Review discipline
- Do risk-first reviews on your own PRs
- Build a personal checklist from repeated mistakes

Outcome target by end of month:
- You can independently diagnose and explain most issues before asking AI for final code.

---

## 15) Minimal custom agent stack to start

Keep it simple first. Start with only 3 agents.

1. Socratic Coach
2. SQL Coach
3. PR Risk Reviewer

Why only three:
- Fewer tools means better habits
- You avoid process overhead
- You can clearly measure impact

Add more only after these are routine.

---

## 16) Personal rules you can adopt today

- I will attempt before asking for full solution.
- I will ask for hints before code.
- I will verify every change with a concrete check.
- I will explain every merged fix in plain language.
- I will revisit weak topics with spaced repetition.

If you follow these five consistently, your skill growth will be obvious within a month.

---

## 17) Quick glossary

Agentic workflow:
- Iterative AI-assisted process with planning, execution, checks, and memory.

Socratic prompting:
- Teaching by guided questions rather than direct answers.

Hint ladder:
- Graduated help from conceptual hints to full solution.

Contract drift:
- Frontend and backend assumptions diverge.

Idempotency:
- Repeating request produces same effective result.

Tail latency:
- Slowest requests (p95/p99), often user pain driver.

Blameless postmortem:
- Focus on systems and learning, not individual blame.

---

## 18) Final note

You are not behind. Most engineers overuse AI at first because speed is seductive.
The key is not avoiding AI; it is shaping the workflow so your brain does the hard parts.

If you treat AI like a coach that can execute, instead of a replacement thinker, your programming skill will improve quickly and sustainably.
