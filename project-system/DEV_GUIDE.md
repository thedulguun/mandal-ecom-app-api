# DEV_GUIDE.md — How to work in this repository (Humans + AI)

This repository uses the **Project Generation System – Genesis**.

The goal is to make AI‑assisted development:

- predictable
- safe
- easy to onboard into
- resilient across many chat sessions

If you understand this file, you understand how to work here.

---

## Core idea (1‑minute version)

We do **not** rely on chat memory or clever prompting.

Instead, this project has:

- a persistent **AI Project OS** in `/ai-os/`
- a small **project system** in `project-system/`
- a single root entrypoint `chat.md` for new AI chats

The flow is:

```text
read chat.md
   ↓
project-system/CHAT_INIT.md
   ↓
/ai-os/ (rules, context, workflows, summaries)
```

---

## Important paths & files

### `/ai-os/` - AI Project OS

This folder contains:

- `ai-rules.md` - how the AI must behave
- `ai-context.md` - what this project is
- `ai-workflows.md` - how to perform typical tasks
- `ai-roadmap.md` - future direction
- `OS_SUMMARY.md` - OS overview (for humans, derived from the OS)
- `PROJECT_SUMMARY.md` - project overview (for humans, derived from the OS)
 - `ai-os-schema.md` - schema for how OS files are structured
 - `ai-os-changelog.md` - short history of OS-level changes

The **source of truth** for AI behavior and project definition lives in the core OS files:

- `ai-rules.md`
- `ai-context.md`
- `ai-workflows.md`
- `ai-roadmap.md`

The two summaries are **caches** of that state, intended for fast human and AI orientation.

If you are changing how the OS itself is structured or behaves (rules, workflows, or OS files), you should also skim `ai-os-schema.md` and `ai-os-changelog.md` so that changes stay consistent with the schema and are properly logged.

---

## Commands you need to know

- `read chat.md` - initialise a new AI chat with the Project OS loaded.
- `chat resync` - reload the OS files in `/ai-os/` during an ongoing chat while keeping the current task.
- `update summaries` - when summaries feel stale or the OS has changed, ask the AI to bring `OS_SUMMARY.md` and `PROJECT_SUMMARY.md` back in sync with the core OS files.

If you are joining an existing project mid-stream:

- attach the repository in your AI tool,
- run `read chat.md`,
- then skim `/ai-os/PROJECT_SUMMARY.md` followed by `/ai-os/OS_SUMMARY.md`.

This is usually enough to get oriented.

---

### `project-system/DEV_GUIDE.md` (this file)

You are reading it.

It explains:

- how to start new AI chats
- how to re‑sync AI mid‑chat
- how the project OS is structured at a high level
- what to do when something breaks

This file is meant to be:

- human‑oriented
- relatively stable
- short enough to skim quickly

---

### `project-system/CHAT_INIT.md` (AI bootloader)

You usually do **not** need to read or edit this file.

It tells the AI, when invoked:

1. to read all core files in `/ai-os/`
2. to treat `ai-rules.md` as the highest authority
3. how to behave after boot
4. how to handle the `chat resync` command

It is loaded **indirectly** through `chat.md` at repo root.

---

### `chat.md` (root entry point)

Located at project root.

It contains a single instruction pointing to the bootloader, for example:

```md
Read project-system/CHAT_INIT.md and follow it.
```

Every new AI chat should start with:

```text
read chat.md
```

This is the only thing a new developer really needs to remember.

---

## Starting a new AI chat (correctly)

Whenever you open a **new AI chat session** for this repository:

1. Make sure the repository (or folder) is attached / visible to the AI tool.
2. In the very first message, run:
   ```text
   read chat.md
   ```
3. Wait for the AI to respond.

A correct response should:

- confirm that it has loaded the Project OS
- summarize the project in **one sentence**
- state that it will follow the OS rules and workflows
- end with a question like: *“What do you want to work on?”*

If you see that pattern, the AI is properly initialized.

---

## Re‑syncing an ongoing chat

Sometimes the AI may:

- feel “off” or confused
- seem outdated after OS changes
- behave in a way that doesn’t match `ai-rules.md`

Or OS files may have been edited while a chat is ongoing.

In this case, type:

```text
chat resync
```

The AI is required to:

1. Re‑read the relevant files in `/ai-os/`.
2. Re‑align its behavior with the current OS.
3. Respond briefly:
   - confirming resync
   - noting any important changes that affect the current work
   - continuing the **same task** unless you ask to reset

It must **not** silently reset the conversation or change tasks on `chat resync`.

---

## What to read first (new developers)

If you are new to this repository, the recommended reading order is:

1. `/ai-os/PROJECT_SUMMARY.md`  
2. `/ai-os/OS_SUMMARY.md`  
3. `project-system/DEV_GUIDE.md` (this file)

You usually do **not** need to read all the OS files in detail to be productive.

---

## When the project or rules change

If any of the following change:

- project scope
- core workflows
- important rules in `ai-rules.md`
- major assumptions or constraints

Then, whoever made the change should:

1. Update the relevant core OS file(s) in `/ai-os/`.
2. In an AI chat for this repo, ask the AI to **refresh the summaries** (for example by saying `update summaries`) so that:
   - `OS_SUMMARY.md`
   - `PROJECT_SUMMARY.md`
   are brought back in line with the current OS.

These summaries are designed so that any human or AI can understand the project in **under 2 minutes**.

If the summaries and OS files ever disagree, assume the core OS files are authoritative and the summaries are stale. You can always ask the AI to refresh them.

---

## System file safety (what to do when things break)

The following are considered **system files**:

- `chat.md`
- `project-system/DEV_GUIDE.md`
- `project-system/CHAT_INIT.md`
- everything in `/ai-os/`

If any of these are deleted or corrupted:

- The AI is required (by `ai-rules.md`) to **warn you explicitly**.
- The AI must **not** silently recreate or modify system files.
- Recovery is a **developer responsibility**.

Some common cases:

### 1. `chat.md` was deleted

If you run `read chat.md` in a new chat and it fails:

- Recreate `chat.md` at repo root with this canonical content:

  ```md
  Read project-system/CHAT_INIT.md and follow it.
  ```

- Or restore it from version control (git).

Then start a new chat and run `read chat.md` again.

### 2. `project-system/CHAT_INIT.md` is missing

If `chat.md` exists but the AI reports that it cannot read `project-system/CHAT_INIT.md`:

- Restore `project-system/CHAT_INIT.md` from version control.
- Or, if needed, recreate it based on the starter kit definition (a bootloader that loads `/ai-os/` and defines `chat resync` behavior).

Until `CHAT_INIT.md` exists and is readable, the system cannot safely initialize.

### 3. `/ai-os/` or core OS files are missing

If `/ai-os/` or core OS files like `ai-rules.md`, `ai-context.md`, `ai-workflows.md`, `ai-roadmap.md`, `ai-os-schema.md`, or any additional OS files created for this project are missing:

- The AI will warn you and treat the OS as degraded.
- You should either:
  - restore the files from version control, or
  - explicitly instruct the AI to help regenerate the missing pieces.

The AI must **not** silently guess or invent the previous OS.

### 4. System files look corrupted or inconsistent

If the AI reports that OS or system files exist but appear corrupted, structurally invalid, or inconsistent with each other (for example, missing required sections or rules that contradict each other):

- treat the OS as being in a degraded state,
- review recent changes or diffs and restore known-good versions from version control where possible,
- or explicitly ask the AI to help regenerate specific files, with your approval.

The AI must not guess what the previous rules or context were based only on memory. It should warn and wait for your direction.

---

## Historical note: GENESIS.md

At the very beginning of this project, a file called `GENESIS.md` was used to:

- ask questions about the project
- design the Project OS
- generate `/ai-os/`
- move `DEV_GUIDE.md` and `CHAT_INIT.md` into `project-system/`
- create `chat.md` at the root

After that, `GENESIS.md` was deleted and should not return.

You do **not** need Genesis for day‑to‑day work.

---

## Mental model (keep this in your head)

- `/ai-os/` → AI’s constitution and memory  
- `project-system/CHAT_INIT.md` → AI bootloader  
- `project-system/DEV_GUIDE.md` → human guide  
- `chat.md` → universal entrypoint for new chats  
- `chat resync` → “reload the OS, keep the task”  

If you follow this, you won’t get lost.
