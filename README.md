# James Hu Portfolio 2026

A hiring-focused portfolio for financial frontend and full-stack roles. The site is built around the kinds of UI problems that show up in trading, risk, operations, market data, Python-backed data pipelines, and compliance workflows: latency, dense tables, realtime state, validation breaks, audit trails, and visual explanation.

## What this project is meant to prove

- **Financial frontend judgment**: case studies for blotters, replay timelines, stress matrices, risk graphs, and evidence trails.
- **Python/data pipeline awareness**: an ETL control-room case for ingestion, validation, reconciliation, freshness, and safe reruns.
- **Browser performance awareness**: Web Workers, WebAssembly, route-level code splitting, and GSAP animations that avoid blocking interaction.
- **Data-heavy UI craft**: D3, Three.js, React, TypeScript, Python pipeline thinking, SVG/WebGL prototypes, and dense interface composition.
- **Production communication**: each case explains constraints, frontend moves, and what it proves in an interview.

## Main routes

- `/` - recruiter-friendly overview and navigation into the strongest proof points.
- `/labs` - finance frontend case studies for trading, risk, market data, Python data pipelines, operations, and compliance UI.
- `/wasm` - WASM + Web Worker compute prototype.
- `/three` - WebGL liquidity-surface style prototype.
- `/d3` - D3 risk/dependency graph prototype.

## Stack

React 19, TypeScript, Vite/Rolldown, Tailwind CSS, GSAP + ScrollTrigger, D3, Three.js / React Three Fiber, Web Workers, Rust/WebAssembly demo code, and Python/FastAPI/Pandas pipeline positioning in the case-study content.

## Local development

```bash
bun install
bun run dev
```

## Quality checks

```bash
bun run lint
bun run build
```
