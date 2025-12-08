File-Name: OS_SUMMARY.md
File-Role: summary
OS-Version: 0.1.3
Last-Updated: 2025-12-09T02:55:00Z
Last-Updated-By: AI
Special-OS-File: false

Note: This summary can be stale. Say "update summaries" in an AI chat to refresh it before relying on it.

# OS Snapshot
- Heavy-profile Project OS lives in `/ai-os/`; boot via `chat.md` → `project-system/CHAT_INIT.md` → OS files.
- Core files: `ai-rules` (behavior/safety), `ai-context` (project scope), `ai-workflows` (process), `ai-roadmap` (future), `ai-os-schema` (structure), `ai-os-changelog` (history), summaries (non-authoritative).

# Behavior Expectations
- Plan before non-trivial or multi-file changes; keep changes minimal and reversible; be clear about intent and outcomes.
- Avoid destructive actions without explicit confirmation; pause and ask when instructions conflict or context is missing.
- Log commands and notable results; avoid exposing secrets.
- Dev note: user is new to APIs; explain simply and, when using tech nouns (e.g., CORS, API, proxy), include short bracketed explanations.

# Current Notes
- Client SDK now includes generated helpers from captures and inferred endpoint lists (`scripts/inferred-endpoints.json`); proxy has passthrough routes; test page exercises most endpoints.

# Safety & Integrity
- Do not create/modify `/ai-os/`, `project-system/`, or `chat.md` silently.
- If OS/boot files are missing or corrupted, warn and pause; request restore or explicit regeneration.
- If `GENESIS.md` coexists with `/ai-os/`, warn (Genesis was one-time).

# Maintenance & Updates
- OS edits need schema compliance, refreshed metadata (`OS-Version`, timestamps, authors), and a changelog entry.
- Run schema check against `ai-os-schema.md` after OS edits; fix or clearly flag issues.
- Summaries are caches; keep reasonably aligned after OS changes.

# How to Refresh
- Say `update summaries` to reload core OS files and refresh both summaries with minimal edits.
