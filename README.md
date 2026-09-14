# Conscious Choice — Cold-Pressed Juice (Bangkok)

A single-page, scroll-choreographed campaign site built around the real
`JUICE-3D.glb` product model. One persistent WebGL scene carries the bottle
through nine full-screen scenes; the type, the colour blocks and the product
are driven by a single GSAP timeline per section.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 ·
three.js · React Three Fiber · Drei · GSAP + ScrollTrigger · Leva (dev only)

## Run

The dependency tree was installed from a Linux sandbox, so `node_modules`
currently holds Linux binaries. Reinstall once from a macOS terminal before the
first run:

```bash
rm -rf node_modules
npm install
```

Then:

```bash
npm run dev        # http://localhost:3000
npm run build && npm start
```

Open `/?tune` in dev for the live render controls.

Routes:

| Route  | Purpose |
| ------ | ------- |
| `/`    | The landing page |
| `/lab` | Isolated product scene — orbit the GLB, tune lighting and materials (noindex) |

## How the choreography works

`src/lib/scene-state.ts` holds a single mutable `SCENE` object. GSAP tweens
those numbers directly and the R3F frame loop reads them, so **scrolling never
triggers a React re-render**.

Poses are **viewport-normalised**, not world units:

```
nx, ny   -1 → 1   (-1 = left / bottom edge, 1 = right / top edge)
height            product height as a fraction of the visible height
z                 travel toward the camera (real perspective, not scale)
```

That is what lets one pose table drive every breakpoint. `src/lib/choreography.ts`
holds the table; each scene's last keyframe is the next scene's first, so the
product keeps moving through the 100vh in which one sticky panel scrolls away and
the next scrolls in. `PRODUCT_FIT` is the single knob for the product's presence
on the page.

### Layering

The WebGL stage is `position: fixed; z-index: 20`. Sections keep `z-index: auto`
so their sticky children join the root stacking context:

```
.layer-behind   z-index 10   — type the bottle passes in front of
<canvas>        z-index 20
.layer-front    z-index 30   — type that crosses in front of the bottle
```

Two sticky panels per section (`-mt-[100svh]` on the second) overlap without
ScrollTrigger pinning, which keeps the stacking context clean.

### One rule worth knowing

Parallax lives on the clipping wrapper, reveals on the inner line. Two tweens on
the same element's transform inside one GSAP timeline will silently drop one of
them.

## Rendering

Tuned against the real GLB in `src/lib/scene-config.ts`:

- **Khronos PBR Neutral tone mapping.** ACES pulls the label's `#F4700A` toward
  pastel; Neutral holds hue and saturation, which matters when the artwork *is*
  the brand.
- A hand-built `<Environment>` of Lightformers — no HDRI download, no runtime
  network dependency, and every emitter stays tunable as the page moves from
  cream to near-black.
- Materials are upgraded to `MeshPhysicalMaterial` at runtime for clearcoat and
  sheen. **Nothing in the GLB is modified** — no geometry, colours or artwork.
- The model is normalised to exactly 1 unit tall and centred at the origin, which
  is what makes the viewport-fraction choreography possible.

### Live tuning

Append `?tune` to any URL (dev *or* production build):

- In development, a Leva panel appears with exposure, all four lights,
  material response, camera and product transform.
- In any build, `window.__CC_RENDER`, `__CC_SCENE`, `__CC_GSAP` and `__CC_ST`
  become available for tuning against a real render.

Copy the values back into `RENDER_DEFAULTS`. To remove the panel entirely, delete
the `<DebugPanel />` line in `src/components/three/Stage.tsx` — nothing else
reads from Leva, and the tuned look is preserved.

## Accessibility

Every heading is real HTML; nothing meaningful lives only in WebGL. The canvas is
`aria-hidden` and `pointer-events: none`. Under `prefers-reduced-motion: reduce`
the scrubbed timelines are replaced by per-scene pose snaps, parallax and masked
travel are dropped, stacked compositions fall back to static stacks, and the
outline ghosts are hidden.

## Performance

`dpr={[1, 1.5]}`, a dynamically imported and `ssr: false` canvas, `useGLTF.preload`,
self-hosted variable fonts (zero third-party requests), and a frame loop that
mutates the three.js graph directly rather than going through React.

## Structure

```
src/
  app/            layout (metadata + fonts), page, /lab, globals.css
  components/
    sections/     the nine scenes
    three/        Stage, Bottle, Lighting, materials, DebugPanel, ModelLab
    navigation/   Navbar
    ui/           Loader, Footer, Icons, SectionIndex
  lib/            choreography, scene-state, scene-config, brand, breakpoints
  fonts/          self-hosted Archivo + Geist variable faces
public/models/    JUICE-3D.glb  (used as supplied, unmodified)
```
