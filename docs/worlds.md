# Worlds

Six small browser games, served from `public/worlds/` at `/worlds`. Each is a
different genre. The games carry no name or career content; the world select
and the clear screen are the only places styled like the portfolio.

| World | Path | What it is | Finish line |
| --- | --- | --- | --- |
| 1 · The Run | `world-1/` | Gray 2D platformer (Canvas 2D) | Touch the flag. A portal past it goes to World 2. |
| 2 · The Gallery | `world-2/` | N64-style hall (three.js r128) | Three star paintings open the door; jump into the last painting. |
| 3 · The Diorama | `world-3/` | Isometric puzzle (three.js r128) | Light plinths I–III, then reach the TOP plinth. |
| 4 · Grand Prix | `world-4/` | Kart race, 2 laps, 3 AI rivals (three.js r128) | Cross the finish line. |
| 5 · The Lab | `world-5/` | First-person portal facility (three.js r128) | Clear chamber 4. |
| 6 · The Library | `world-6/` | Two point-and-click rooms and a train | Solve the reading room, find three keys in the Library, ride the train. |

`index.html` is the world select. It marks the worlds that have been cleared.

## The shell

`shell.css` and `shell.js` are shared by every page in this folder.

- **Fullscreen.** `body[data-world="N"]` makes `.frame` fill the viewport.
- **Persistent exit.** `shell.js` injects the pill at the top centre: `✕ Exit`
  goes to `/`, `World N/6` goes to the world select.
- **Clear screen.** Each world calls `window.BW.complete({ note, stayLabel, onClose })`
  at its finish line. The screen is laid out like the portfolio home (same type,
  colours and row pattern as `src/styles.css`, copied into `shell.css`): the next
  world, a way to stay, the portfolio, and six colour bands showing progress.
  Clears are recorded in `localStorage` under `worlds-cleared`.
- World names, one-line descriptions and colour bands live in the `WORLDS`
  array at the top of `shell.js`; the world select repeats them in its markup.

Inside Worlds 1–5 the four objectives are still keyed `one` to `four` in a
`ROLES` object. That is only a name for the objectives; nothing is shown from it.

## World 6

Two pages and one asset folder:

- `world-6/index.html` is the reading room (three.js r128). Geometry and a
  baked lightmap come from `room/`; it is lit live on top, with the bake left in
  at about a fifth strength (`BAKE`). Solving the dials walks into the Library.
- `world-6/library/index.html` is the Library and the train (three.js 0.180 as
  an ES module). Books, keys and hints are data: `BOOKS`, `DECOYS_WEST`,
  `NODES`, `CHIPS` and `objective()`.
- `world-6/assets/` holds the Library's models, textures and the tunnel. See
  `assets/CREDITS.md`. The tunnel is CC BY 3.0 and is credited on screen during
  the ride.

Both rooms share controls: left and right turn, up steps toward what you face,
down steps back, number keys jump to a place chip, H asks for a hint. The Sound
setting is shared under `worlds-sound`.

Walkthrough:

1. Reading room: the painting's numerals give the order (sun, star, moon, key);
   set the four dials and the west shelf swings open.
2. Library: the note on the desk points to Volume I (gray, west wall).
3. Volume I → brass key → the cabinet. Volume II → silver key → the desk drawer.
4. Volume III → iron key → the untitled book on the north wall is a keyhole.
5. Stairs lead to the platform; the train rides to the finish.

Shortcut for testing: add `?ride` to the Library's address to jump to the train.

## Run locally

```sh
npm run dev
```

`vite.config.js` maps any folder under `/worlds` to its `index.html` in dev and
preview. On Vercel, `cleanUrls` does the same, which is why every link between
worlds is absolute (`/worlds/world-2`) rather than relative.
