File-Name: ai-workflows.md
File-Role: workflows
OS-Version: 0.1.0
Last-Updated: 2025-12-08T09:22:00Z
Last-Updated-By: AI
Special-OS-File: false

# Workflows

## Workflow Structure
- Each workflow lists: When to use, Preconditions, Steps, Outputs, Safety Notes.
- Follow `ai-rules.md` for planning, approvals, and safety; do not duplicate rules here.

## Feature / Enhancement
- When to use: adding new API endpoints, expanding static page features, or integrating new ebuuhia actions.
- Preconditions: clear goal; available request samples or assumptions noted; environment ready.
- Steps:
  1) Draft a short plan (even if simple multi-file work).
  2) Inspect relevant files and captured requests; confirm env vars needed.
  3) Implement code incrementally; keep changes minimal and testable.
  4) Validate via local calls or static page; note any blocked external calls.
  5) Summarize changes and next steps; update docs if behavior changed.
- Outputs: updated code/config, brief validation notes, identified follow-ups.
- Safety Notes: avoid destructive edits; if endpoint behavior is uncertain, mock or stub and ask for clarity.

## Bugfix
- When to use: incorrect API behavior, failed requests, token handling issues.
- Preconditions: reproduce or describe failure; note environment and inputs.
- Steps:
  1) Plan briefly; identify suspected areas.
  2) Reproduce if possible; capture logs/errors.
  3) Patch minimally; prefer targeted fixes.
  4) Re-test the failing path; document outcome.
  5) Record any remaining issues or TODOs.
- Outputs: fix applied, proof-of-fix or observed behavior, open questions if unresolved.
- Safety Notes: avoid broad refactors while fixing; keep changes scoped.

## Refactor / Cleanup
- When to use: improve structure, readability, or maintainability without changing behavior.
- Preconditions: stable baseline and agreement on scope.
- Steps:
  1) Plan scope and guardrails.
  2) Make small, verifiable changes.
  3) Spot-check behavior; keep parity with prior behavior.
  4) Summarize impacts and any follow-up work.
- Outputs: cleaner code, notes on behavioral parity.
- Safety Notes: avoid simultaneous feature changes; split risky refactors into smaller passes.

## Documentation / Notes
- When to use: updating README/docs, adding inline guidance, writing usage notes.
- Preconditions: source-of-truth identified (capture from code/behavior).
- Steps:
  1) Plan the doc update scope.
  2) Edit docs clearly and concisely.
  3) Ensure docs align with current behavior and OS.
  4) Summaries reflect new guidance.
- Outputs: updated documentation, brief summary.
- Safety Notes: keep docs consistent with `ai-context.md` and actual behavior.

## OS Maintenance
- When to use: changes to OS files, summaries, schema, or boot setup.
- Preconditions: explicit intent and user acknowledgement for OS edits.
- Steps:
  1) Plan the OS change; identify impacted files and version bump.
  2) Apply edits within `ai-os-schema.md` constraints; update metadata headers.
  3) Bump `OS-Version` consistently; add entry to `ai-os-changelog.md`.
  4) Run schema check against `ai-os-schema.md`; fix or flag issues.
  5) Refresh summaries if OS meaningfully changed.
- Outputs: updated OS files, changelog entry, confirmation of schema alignment.
- Safety Notes: no silent repairs; pause if files are missing or corrupted.

## Boot / Resync
- When to use: starting a session or when system files seem out-of-sync.
- Preconditions: `chat.md` and `project-system/CHAT_INIT.md` readable.
- Steps:
  1) Read `chat.md`, then `project-system/CHAT_INIT.md`, then `/ai-os/`.
  2) If missing/invalid, warn and request restore per `ai-rules.md`.
  3) On `update summaries`, re-read OS files and refresh both summaries with minimal edits.
- Outputs: confirmation of loaded state or warnings with requested actions.
- Safety Notes: do not recreate boot/OS files without explicit approval.
