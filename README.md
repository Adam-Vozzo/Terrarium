# Terrarium

A top-down, procedural ecosystem sandbox built with native Canvas and 16 × 16 pixel sprites. Designed for touch, with a quiet observation mode and an optional experimental playground.

## Run

Requires Node.js 20 or later. No packages to install.

```sh
npm start
```

Open `http://localhost:5173`. `dist/` is the complete static site and can be served by any static host.

```sh
npm run check
npm test
npm run build
```

The build creates `build/Terrarium.html`, a self-contained version that works offline. No server, account, API key, or network is required by the simulation. The modular site optionally loads Google Fonts; the offline bundle uses system fonts.

## GitHub Pages

The repository is ready for GitHub Pages. Enable it once in [Settings → Pages](https://github.com/Adam-Vozzo/Terrarium/settings/pages):

1. Under **Build and deployment**, set **Source** to **GitHub Actions**.
2. Open **Actions → Deploy Terrarium to GitHub Pages → Run workflow** and run it on `main`. If a run failed before Pages was enabled, rerun it.
3. Open the website link shown by the successful deployment or by Settings → Pages.

After this setup, every push to `main` checks syntax, runs the simulation tests, and publishes `dist/` automatically. The site needs no server, package installation, repository secret, or custom domain. Relative asset paths support the `/Terrarium/` project URL and custom domains.

For branch publishing instead, choose **Deploy from a branch → main → /(root)** and save. The root entry page opens the game in `dist/`; `.nojekyll` keeps the files static. The Actions option above runs the validation checks before deployment.

Configuration follows [GitHub's Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). Adding these files does not itself enable Pages in repository settings.

## Play

- **Observe:** drag to pan, pinch or scroll to zoom, tap creatures and plants to inspect.
- **Life / Land:** select a brush, then tap or paint. Two fingers always move the camera.
- **Time:** pause or choose 1×, 3×, or 8×. One world day lasts 30 seconds at 1×.
- **Undo:** restores the complete simulation to before the last intervention, including time, random state, tuning, player, and discoveries.
- **Dev tweaks:** open the experimental content. Nothing requires editing source code.

## Dev playground

| Area | Implemented experiments |
| --- | --- |
| Worlds | Woodland, meadow, wetland, desert, tundra, archipelago, ashlands, elder forest; repeatable seeds |
| Themes | Naturalist, Feywild, Moon garden, Copper age; theme-only changes preserve the world |
| Creatures | Rabbits, foxes, bees, deer, wolves, boars, frogs, fish, beetles, fireflies, slimes, wisps, ember drakes |
| Flora | Grass, trees, flowers, berries, fungi, resonant crystals, luminous flowers |
| Weather | Clear, rain, thunderstorms, fog, snow, drought, aurora |
| Disasters | Spreading wildfire, temporary floods, meteors, earthquakes, spore blooms; random disasters are opt-in |
| Wanderer | Tap-to-walk pathfinding, WASD/arrows, resource gathering, planting, bridges, sanctuaries, rest, hazard damage and camp recovery |
| Exploration | Eight seeded landmarks, lore, supply rewards, insight, discovery perks, and a journal of actual world events |
| Tuning | Growth, hunger, reproduction, population ceiling, shadows, particles, fire spread, camera motion, sound, haptics, reduced motion |

Five scenario starters connect these systems: **Return of the wolves**, **Life after fire**, **The waking forest**, **The river remembers**, and **The bridge keeper**.

## Interactions that produce stories

- Deer eat berries, then carry their seeds into other clearings.
- Predators reduce grazing; frogs reduce pollinating insects.
- Remains feed decomposers and fungi; fungi sustain fireflies.
- Fire enriches soil with ash; rain extinguishes flames and makes regrowth possible.
- Rivers prevent fire from spreading between adjacent banks.
- Floods temporarily open aquatic habitat, then leave moist, fertile ground.
- Crystals sustain wisps, which grow luminous flowers nearby.
- Bridges change walkable routes. Sanctuaries nourish nearby plants and repel wolves.

The journal records these outcomes when their conditions actually occur. Landmark prose is seeded fiction; this is a playful ecological model, not a scientific simulation.

## Design choices

The interface applies Nielsen’s heuristics through visible tool and time states, familiar language, labelled controls, immediate feedback, complete undo, habitat validation, safe defaults, progressive disclosure, keyboard shortcuts, and contextual help. The field guide credits [Jakob Nielsen’s ten usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/).

Terrain under trees uses the same grass palette as open land. Small stepped, dithered shadows replace the former dark square tiles. Sprites are 16 × 16, rendered without smoothing. Reduced-motion settings suppress hopping, screen shake, flashes, and weather particles. Sound and haptics are off by default.

## Project layout

- `dist/ecosystem.mjs` — seeded ecology and snapshot/restore.
- `dist/experiments.mjs` — extra species, habitats, weather, hazards, player, lore, outcomes.
- `dist/pixels.mjs` — original pixel sprites and palette variants.
- `dist/world-render.mjs` — terrain colours, soft pixel shadows, weather, landmarks, player.
- `dist/dev-menu.mjs` — experiment controls, census and journal.
- `dist/app.mjs` — rendering loop, touch/keyboard controls, feedback, inspection, WebMCP adapters.
- `dist/index.html`, `dist/style.css` — responsive interface.
- `scripts/` — dependency-free local server and standalone bundler.
- `test/` — deterministic simulation and interaction tests.

## Prototype boundaries

This is an experimental sandbox, not a full RPG or colony simulator. There is no combat system, settlement AI, multiplayer, or durable save system. Closing the tab ends the current session. Population ceilings protect phone performance; lowering a ceiling prevents new births without deleting existing creatures. The ceiling is not a claim of ecological carrying capacity.

Engine, scenario, undo, terrain, sprite-size, and rendering checks are included. Real-device browser testing has not yet been completed.
