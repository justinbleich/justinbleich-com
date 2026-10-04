# Bleich Worlds

Justin Bleich's career as five small browser games, served from `public/worlds/`
at `/worlds`. Each world is a different genre and console era, and each one
unlocks **one** stop in the career when it is cleared:

| World | Path | What it is | Clearing it reveals | Finish line |
| --- | --- | --- | --- | --- |
| 1 · The Run | `world-1/` | Gray 2D platformer (Canvas 2D) | Previously → Sprinklr | Touch the flag. A portal past it goes to World 2. |
| 2 · The Gallery | `world-2/` | N64-style hall (three.js) | 2021–2024 → NFTX | Three star paintings open the door; jump into the last painting. |
| 3 · The Diorama | `world-3/` | Isometric puzzle (three.js, orthographic) | 2024–2026 → OKX | Light plinths I–III, then reach the TOP plinth. |
| 4 · Grand Prix | `world-4/` | Kart race, 2 laps, 3 AI rivals (three.js) | Current → OnePay | Cross the finish line. |
| 5 · The Lab | `world-5/` | First-person portal facility (three.js) | Finale: FRAX, Paste, contact | Clear chamber 4. |

`index.html` is the world select. It shows which stops have been unlocked.

## The shell

`shell.css` and `shell.js` are shared by every page in this folder.

- **Fullscreen.** `body[data-world="N"]` makes `.frame` fill the viewport and
  hides the old page chrome (header, title, experience list, contact, footer).
  Each world's `resize()` reads `frame.clientHeight`.
- **Persistent exit.** `shell.js` injects the pill at the top centre: `✕ Exit`
  goes to `/`, `World N/5` goes to the world select.
- **Reveal card.** Each world calls `window.BW.complete({ note, stayLabel, onClose })`
  at its finish line. The shell shows the stop, the link to the next world, and
  records the clear in `localStorage` (`bleich-worlds-cleared`).

## Content lives in one place

The career content is the `WORLDS` array (and `FINALE`) at the top of
`shell.js`. Change a role, its order, or which world reveals it there. The
worlds themselves no longer name any role: their in-game objectives are generic
(blocks, stars, plinths, gates, test chambers). Each world still carries a
hidden copy of the old experience list and a `ROLES` object keyed by the old ids
(`sprinklr`, `nftx`, `okx`, `onepay`); those ids are now just names for the four
objectives.

## Run locally

```sh
npm run dev
```

`vite.config.js` maps `/worlds` and `/worlds/world-N` to their `index.html` in
dev and preview. On Vercel, `cleanUrls` does the same, which is why every link
between worlds is absolute (`/worlds/world-2`) rather than relative.

## Tuning knobs

| World | Where | What |
| --- | --- | --- |
| 1 | `GRAV`, `JUMP`, `JUMP_CUT`, `ACC`, `FRIC`, `MAXV` | Platformer feel (pixels/second, 16 px tiles) |
| 1 | `ground()`, `plat()` calls, `BLOCKS`, `coinRow()` | Level layout |
| 2 | `G`, `JUMP`, `STEP`, `SPEED` | Character feel (meters) |
| 2 | `BOXES` / `box(...)` calls | Collision geometry; visuals are built separately |
| 3 | `tile(...)` calls, `ARM_BASE`, `lift`, `STAIRS` | Puzzle layout and mechanisms |
| 4 | `MAXS`, `ACC`, `TURN`, `LAPS` | Kart handling and race length |
| 4 | `CTRL` | Track shape (closed Catmull-Rom curve through these points) |
| 4 | `KARTS[].aiMax`, rubber-banding in `update()` | Rival difficulty |
| 5 | `PORTAL_HW`, `PORTAL_HH` | Portal size (half width/height, meters) |
| 5 | `G`, `JUMP`, `SPEED`, `STEP` | First-person movement |
| 5 | `panel(...)` calls | Which surfaces accept portals |
| 5 | `pixelRatio`, `RT_SCALE`, `adapt()` | Render resolution and auto-downscaling |

## Implementation notes

- **World 5 portals** render the scene from a virtual camera into a render
  target per portal (`renderPortal`), clipped at the destination portal plane
  with `renderer.clippingPlanes`. Only one level of recursion: a portal seen
  inside another portal shows its swirl, not a view. Render targets use
  `sRGBEncoding` so portal views match the main view under ACES tone mapping.
- **World 5 glass** in chamber 1 is solid to walk into but transparent to portal
  shots (`shoot: false` on its collider). That's on purpose so the puzzle works.
- **Shadows** in World 5 update once per frame (`shadowMap.autoUpdate = false`).
- **Pointer lock** is optional. If the browser refuses it, drag-to-look and
  click-to-shoot take over.
- **Best lap time** in World 4 is stored in `localStorage` (`bleich-gp-best`), per browser.
- **Touch controls** appear via `@media (hover: none) and (pointer: coarse)` in every world.
- Each world renders a complete first frame before any input, and lists every
  role in plain HTML below the game for accessibility and SEO.

## Testing tips

The games were checked headless with Playwright + SwiftShader by driving each
world's internal functions (pathfinding, portal placement, race autopilot). The
test hooks were removed for release. To test again, expose what you need on
`window` at the end of a world's script, for example:

```js
window.__L = { P: P, step: step, render: render, shoot: shoot, PA: PA, PB: PB };
```

SwiftShader is slow for World 5 (three scene renders per frame). Lower
`shadow.mapSize` and `pixelRatio` in a test copy.

## Ideas backlog

- Sound effects and music per world
- Lock each world until the previous one is cleared
- World 5: more chambers, floor and ceiling portals, momentum flings
