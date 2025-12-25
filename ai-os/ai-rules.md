File-Name: ai-rules.md
File-Role: rules
OS-Version: 0.1.7
Last-Updated: 2025-12-25T15:32:30Z
Last-Updated-By: AI
Special-OS-File: false

# AI Rules (Heavy Profile, Authoritative)

## Purpose & Authority
- Governs all AI behavior in this repository. Overrides chat history and ad-hoc instructions.
- Enforces safety, transparency, and OS integrity before speed when risk exists.

## Global Principles
- Be clear, concise, and explicit about intent, plans, and outcomes.
- Prefer minimal, reversible changes; avoid speculative edits.
- Default to planning for any non-trivial or multi-file change before execution.
- Stop and ask when instructions conflict, context is missing, or actions may be destructive.

## Permissions & Limits
- Allowed: read/write within the repo; propose and apply code/OS changes consistent with these rules and user approvals.
- Not allowed: destructive operations (deletes, large rewrites, format migrations, overwriting config/OS files) without explicit human confirmation.
- No silent recreation or modification of `chat.md`, `project-system/` files, or `/ai-os/` files.
- Network/API calls only when explicitly required and permitted by environment; surface constraints if blocked.

## Plans & Approvals
- Produce a short plan before non-trivial or multi-file work. Keep plans updated after notable progress or changes.
- Seek explicit confirmation before destructive/irreversible actions.
- When unsure about intent, scope, or risk, pause and ask concise, focused questions.

## Safety & Failsafes
- If `/ai-os/` is missing/unreadable: treat OS as missing; warn user to restore or explicitly request regeneration. Do not recreate silently.
- If any critical OS file is missing (`ai-rules.md`, `ai-context.md`, `ai-workflows.md`, `ai-roadmap.md`, `ai-os-schema.md`): declare degraded state; identify missing files; ask whether to pause or regenerate with approval.
- If `project-system/CHAT_INIT.md` is missing/unreadable when booting: warn, instruct restore from version control or recreate canonical bootloader; pause normal work.
- If `chat.md` is missing when user attempts to boot: explain required canonical content, ask for restore, do not proceed until fixed.
- If `/ai-os/` exists while `GENESIS.md` is present: warn that Genesis was one-time and recommend human deletion after confirming system health.
- If system files appear corrupted or schema-invalid: warn, avoid guesses, and request guidance or permission to repair/regenerate specific files.

## Boot & Entry Flow
- On `read chat.md`: read root `chat.md`, then `project-system/CHAT_INIT.md`, then load `/ai-os/` per bootloader. If any piece is missing, follow the Safety & Failsafes rules.

## OS Maintenance & Editing
- OS changes require: (1) explicit intent, (2) plan, (3) approval when risk is present.
- After OS edits: keep files within `ai-os-schema.md` constraints; update metadata headers (timestamps, `Last-Updated-By`); bump `OS-Version` consistently across OS files; log changes in `ai-os-changelog.md`.
- Perform a schema check against `ai-os-schema.md` after OS edits; fix or clearly flag violations before resuming normal work.
- Do not create new OS files without describing purpose, schema fit, and user acknowledgement.

## Summaries
- `OS_SUMMARY.md` and `PROJECT_SUMMARY.md` are non-authoritative caches. Keep reasonably in sync via incremental edits after OS changes.
- When the user says `update summaries`, re-read core OS files and refresh both summaries to match the current state.

## Logging & Transparency
- Clearly describe commands run and notable results. Surface blockers (e.g., sandbox limits, missing creds, network restrictions).
- Avoid exposing secrets; prefer `.env` and redaction where possible.

## OS Invariants
- All OS files include the metadata header defined in `ai-os-schema.md` and share the current `OS-Version`.
- Summaries must not conflict with core OS files. Workflows must respect permissions in this document.
- When ambiguity or inconsistency is detected, pause and request clarification before proceeding.

## Dev Note
- I'm new to this whole API thing.
- When you use tech nouns like CORS, API, proxy, etc., explain things simply and add short bracketed notes after the tech names so I learn both the name and what it means.
