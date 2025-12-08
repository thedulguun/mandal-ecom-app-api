File-Name: ai-os-schema.md
File-Role: schema
OS-Version: 0.1.0
Last-Updated: 2025-12-08T09:22:00Z
Last-Updated-By: AI
Special-OS-File: false

# OS Schema

## Purpose
Defines required structure, metadata, and invariants for all `/ai-os/` files. All OS files must conform unless explicitly marked as special.

## Metadata Header Requirements
- Each OS file begins with plain text fields (one per line):
  - `File-Name`
  - `File-Role` (rules | context | workflows | roadmap | summary | schema | changelog | extension)
  - `OS-Version` (shared across OS files)
  - `Last-Updated` (ISO 8601 date/time)
  - `Last-Updated-By` (`human` | `AI` | `human+AI`)
  - `Special-OS-File` (`true` | `false`)
- Metadata appears before any headings/content.

## General Invariants
- All core OS files share the same `OS-Version`.
- Summaries (`OS_SUMMARY.md`, `PROJECT_SUMMARY.md`) are non-authoritative and must align with core files.
- When OS files change, metadata timestamps and `Last-Updated-By` are refreshed; changelog is updated; schema compliance is checked.
- No silent creation or modification of OS/boot files.

## Default OS File Schemas
- `ai-rules.md` (File-Role: rules)
  - Sections: Purpose & Authority; Global Principles; Permissions & Limits; Plans & Approvals; Safety & Failsafes; Boot & Entry Flow; OS Maintenance & Editing; Summaries; Logging & Transparency; OS Invariants.
- `ai-context.md` (File-Role: context)
  - Sections: Project Overview; Goals & Scope; Users & Stakeholders; Constraints & Preferences; Non-Goals; Assumptions; Open Questions.
- `ai-workflows.md` (File-Role: workflows)
  - Sections: Workflow Structure; individual workflows (Feature/Enhancement, Bugfix, Refactor/Cleanup, Documentation/Notes, OS Maintenance, Boot/Resync).
  - Each workflow subsection includes: When to use; Preconditions; Steps; Outputs; Safety Notes.
- `ai-roadmap.md` (File-Role: roadmap)
  - Sections: Near-Term; Mid-Term; Risks & Unknowns.
- `OS_SUMMARY.md` (File-Role: summary)
  - Starts with stale-warning note.
  - Sections: OS Snapshot; Behavior Expectations; Safety & Integrity; Maintenance & Updates; How to Refresh.
- `PROJECT_SUMMARY.md` (File-Role: summary)
  - Starts with stale-warning note.
  - Sections: Project Snapshot; Current Scope; Constraints & Preferences; Risks & Unknowns; How to Work With It.
- `ai-os-schema.md` (File-Role: schema)
  - Sections: Purpose; Metadata Header Requirements; General Invariants; Default OS File Schemas; Additional OS Files Template; Schema Validation Guidance.
- `ai-os-changelog.md` (File-Role: changelog)
  - Sections: Changelog Entries.
  - Entry format: `## [OS-Version] YYYY-MM-DDTHH:MM:SSZ - Short label` plus 1-3 bullets summarizing changes and impacted files.

## Additional OS Files Template
- Use `File-Role: extension` unless another canonical role applies.
- Minimum sections: Purpose; Scope; Interactions (how it relates to existing OS files); Maintenance (when/how it is updated).
- If deviation is necessary, set `Special-OS-File: true` and still include metadata plus clear rationale.

## Schema Validation Guidance
- After any OS edit, check that: metadata exists and is correct; required sections are present and ordered; `OS-Version` is consistent across files; summaries match current core content; changelog includes the latest OS change.
- If validation fails or files are missing/corrupted, flag the issue, pause normal work, and request direction or approval to repair.
