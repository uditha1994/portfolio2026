# portfolio2026

Portfolio of **Uditha Landekumbura** — lecturer, software engineer, builder. Colombo, Sri Lanka.

The page is one working day. Scrolling moves the clock from 05:00 to midnight:
before the bell, the classroom, the afternoon loop, the night shift, signal out.

## Stack

- Vite, React 19, TypeScript
- Three.js with React Three Fiber, custom GLSL shaders, bloom and film grain
- GSAP ScrollTrigger and Lenis for scroll choreography
- Native CSS scroll-driven animations for reveals, with static fallbacks
- Variable fonts, self hosted: Anybody, Instrument Sans, Martian Mono

## The 3D

- **Android**: the source artwork rebuilt as geometry. A depth map estimated from
  the image (Depth Anything V2) displaces a dense mesh that is textured with the
  image itself, plus a particle twin that assembles on load and tears apart on scroll.
- **Globe**: procedural. Continents are about 12,000 lights sampled from Natural
  Earth coastline data, with orbit rings and signal arcs leaving Colombo.

## Run

```bash
npm install
npm run dev
npm run build
```

Content lives in `src/data.ts`.
