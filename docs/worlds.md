# Bleich Worlds

Justin Bleich's portfolio as five small browser games. Each world is a different
genre and console era, and each tells the same career: Sprinklr → NFTX → OKX →
OnePay. The worlds link to each other in a loop:

```
index.html (world select)
   └─ World 1 → World 2 → World 3 → World 4 → World 5 ─┐
        ↑                                              │
        └──────────────────────────────────────────────┘
```

Every page is a single self-contained HTML file. There is no build step and no
`package.json`. The only external resources are Google Fonts and three.js r128
from cdnjs (Worlds 2–5).

## Structure

| Path | World | What it is | Tech |
| --- | --- | --- | --- |
| `index.html` | — | World select landing page | HTML/CSS |
| `world-1/` | The Run | Gray 2D platformer. Hit `?` blocks from below to unlock roles. A gold portal past the flag leads to World 2. | Canvas 2D |
| `world-2/` | The Gallery | N64-style hall. Jump into paintings to see roles and earn stars. 3 stars open the door to OnePay. A warp painting leads to World 3. | three.js |
| `world-3/` | The Diorama | Isometric puzzle. Tap-to-walk, rotating bridge (crank), lift (lever), stairs rise after OKX. | three.js (orthographic) |
| `world-4/` | Grand Prix | Kart race. 2 laps, 4 career gates, drift boost, boost pads, 3 AI rivals. | three.js |
| `world-5/` | The Lab | First-person portal test facility. 4 chambers, one role each. Live portal rendering. | three.js (PBR, shadows, render targets) |
| `extras/minimal/` | — | The first static one-pager. **Content is outdated** (shows OKX as current, no OnePay). | HTML/CSS |
| `extras/pool/` | — | Physics "liquidity pool" one-pager. **Content is outdated** (same as above). | Canvas 2D |

## Run locally

Any static file server works. Open the root, not a single file, so the relative
world links resolve.

```sh
npx serve .
# or
python3 -m http.server 8000
```

## Deploy

- **Vercel:** import the repo, Framework preset "Other", no build command, output directory `.`.
- **GitHub Pages:** Settings → Pages → deploy from the default branch, root folder.
- To host under a path on an existing site (for example `justinbleich.com/play/`), deploy this folder at that path. All world links are relative (`../world-2/`), so they keep working.

## Content lives in every world

The career content is duplicated per world. When roles change, update all five
files (plus `index.html`):

1. **The `ROLES` object** in each world's script: name, period, description, URL.
2. **The plain-text experience list** (`<ol class="list">`) near the bottom of each page.
3. **World-specific placements:** blocks (World 1 `BLOCKS`), paintings and plates (World 2 `PAINTINGS`, `PLATES`), plinth tiles (World 3 `tile(... { role })`), gates (World 4 `GATES`), chambers and signs (World 5 `CH`, `sign(...)`).

Contact links (email, LinkedIn, Farcaster) appear in each page's contact section
and in a few in-game end screens.

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

- Update `extras/` to current roles, or drop them
- Sound effects and music per world
- FRAX and Paste as hidden bonus content
- A persistent "world select" overlay inside each game
- World 5: more chambers, floor and ceiling portals, momentum flings
