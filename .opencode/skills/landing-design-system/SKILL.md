---
name: landing-design-system
description: "Trigger: Visual design, styling, Tailwind classes, color scheme, typography, animations, custom CSS utilities, and aesthetic decisions for this landing."
license: Apache-2.0
metadata:
  author: gentle-ai
  version: "1.0"
---

## Activation Contract

Use this skill when working on visual design, styling, colors, typography, animations, or CSS utilities in this landing page.

## Hard Rules

- **Tailwind v4 — NO config file exists.** Do not look for or create `tailwind.config.*`. All customization is via CSS custom properties in `index.css` inside `@layer base`.
- Design tokens: `--font-cyber` (Space Grotesk), `--font-display`, `--font-body` — defined as CSS custom properties.
- Body styles: `font-family: var(--font-body)`, `background: #08090e`, `color: #f1f5f9`, `overflow-x: hidden`.
- Colors: native Tailwind palettes (cyan, purple, amber, emerald, slate) + arbitrary hex `bg-[#08090e]`.
- Custom utilities defined in `index.css`: `.animate-pulse-glow`, `.animate-float`, `.cyber-grid-bg`, `.cyber-dots-bg`, `.neon-border-cyan/purple/amber`, `.neon-text-cyan/purple`, `.cyber-clip-corner`, `.cyber-clip-btn`.

## ⚠️ Critical Gotcha — Dead Animation Classes

The classes `animate-in`, `fade-in`, `slide-in-from-top-4`, `zoom-in-95` appear in 5 files but the `tailwindcss-animate` package is **NOT installed**. These classes produce **no CSS**. Do NOT add new usages of these classes. If entrance animations are needed, use native Tailwind transitions or custom keyframes in `index.css`.

## Section Shell Pattern

Every section follows this exact structure:

```tsx
<section id="sectionId" className="relative py-20 md:py-24 bg-[#hex] border-t border-b border-{color}-500/10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    {/* section content */}
  </div>
</section>
```

## Section Header Triad

1. **Pill badge**: `inline-flex items-center gap-2 px-3 py-1 rounded-full bg-{color}-500/10 border border-{color}-500/30 text-{color}-400 text-xs font-cyber tracking-widest uppercase mb-3`
2. **H2 headline**: `text-3xl sm:text-5xl font-black font-cyber text-white tracking-tight uppercase mb-4` with gradient `<span className="text-transparent bg-clip-text bg-gradient-to-r from-{c1} to-{c2}">`
3. **Muted paragraph**: `text-slate-400 text-sm sm:text-base`

## Button Patterns

- **Primary CTA (gradient)**: `rounded-xl font-cyber text-xs uppercase tracking-widest font-black text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200`
- **Secondary**: `rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono`

## Card Pattern

`bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-{color}-500/50 group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`

## Animation Rules

- Use ONLY native Tailwind utilities: `animate-pulse`, `animate-bounce`, `transition-all`, `hover:scale-[1.02]`, `active:scale-[0.98]`, `hover:-translate-y-1`.
- Custom keyframes in `index.css`: `pulseGlow`, `floatSlow`, `gridMove`.
- `@keyframes scanline` is defined but unused — dead CSS.
- No framer-motion, no GSAP, no animation libraries.
- Animations must be subtle and professional — never distracting.

## Color Palette

- Background: `#08090e` (near-black)
- Text: `#f1f5f9` (slate-100)
- Accents: cyan-400/500, purple-400/500, amber-400/500, emerald-400/500
- Muted: slate-400, slate-500
- Borders: slate-800, with color accents at `/10` or `/30` opacity
