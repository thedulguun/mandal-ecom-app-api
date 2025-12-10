# Root Structure (10-year-old version)

## Folders
- **API/** — The kitchen: it cooks the data and sends it out.
- **client/** — The waiter: it takes your order to the kitchen (API) and brings back the result.
- **docs/** — The recipe book: saved examples and notes.
- **downloaded-next-static/** — A photo album of the real website so you can look at it offline.
- **scripts/** — Tool box: little tools to help with chores.
- **ai-os/** — Rule book the AI must obey.
- **project-system/** — The switch that turns on the rule book when `chat.md` is opened.

## Root Files
- **api-test.html** — A practice table where you can try the orders (API calls) by hand.
- **chat.md** — Tells the AI to read the rule book before helping.
- **ROOT_STRUCTURE.md** — This simple map.

## How it fits together
- The kitchen (**API/**) makes the food (data); the waiter (**client/**) takes and returns orders.
- The practice table (**api-test.html**) uses the waiter to ask the kitchen for things.
- The recipe book and photos (**docs/**, **downloaded-next-static/**) show what to ask for and how it should look.
- The AI always starts with **chat.md**, then reads **project-system/** and **ai-os/** so it follows the house rules.
