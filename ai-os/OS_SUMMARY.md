File-Name: OS_SUMMARY.md
File-Role: summary
OS-Version: 0.1.0
Last-Updated: 2025-12-08T09:22:00Z
Last-Updated-By: AI
Special-OS-File: false

Note: This summary can be stale. Say "update summaries" in an AI chat to refresh it before relying on it.

# OS Snapshot
- Heavy-profile Project OS stored in `/ai-os/`; follow `chat.md` → `project-system/CHAT_INIT.md` → `/ai-os/` to initialize.
- Core files: ai-rules (behavior/safety), ai-context (project scope), ai-workflows (process), ai-roadmap (future), ai-os-schema (structure), ai-os-changelog (history), summaries (non-authoritative).

# Behavior Expectations
- Plan before non-trivial or multi-file changes; act transparently and concisely.
- No destructive or irreversible actions without explicit human confirmation.
- Keep changes minimal and reversible; ask when ambiguous or risky.

# Safety & Integrity
- Do not silently recreate/modify `/ai-os/`, `project-system/`, or `chat.md`.
- If `/ai-os/` or critical files are missing/corrupted, warn and pause; request restore or explicit regeneration.
- Warn if `GENESIS.md` exists alongside `/ai-os/`; it was a one-time bootstrap.

# Maintenance & Updates
- OS edits require schema compliance, metadata refresh, consistent `OS-Version`, and a changelog entry.
- Summaries are caches; keep reasonably in sync after OS changes.
- Run schema check against `ai-os-schema.md` after OS edits; fix or flag issues.

# How to Refresh
- Command: say `update summaries` to re-read core OS files and refresh both summaries with minimal edits.
