---
name: landing-responsive
description: "Trigger: Responsive layout, breakpoints, mobile-first patterns, grid systems, and viewport behavior for this landing page."
license: Apache-2.0
metadata:
  author: gentle-ai
  version: "1.0"
---

## Activation Contract

Use this skill when implementing or modifying responsive layouts, breakpoints, or viewport behavior.

## Hard Rules

- **Mobile-first**: base styles target phones, `sm:`/`md:`/`lg:`/`xl:` augment upward.
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` — uniform in every section.
- Horizontal overflow prevented via `overflow-x: hidden` on `body` (index.html) and App root div.
- No elements may cause horizontal scroll on mobile — test at 375px width mentally and, when possible, verify in the browser preview.
- Check touch target size, visible keyboard focus, modal Escape behavior, and `prefers-reduced-motion` for every mobile interaction.
- Do not use `animate-in`, `fade-in`, `slide-in-from-*`, or `zoom-in-*` unless the project installs the animation plugin; use classes defined in `src/index.css` instead.

## Breakpoint Usage

| Breakpoint | Typical Use |
|------------|-------------|
| Base (mobile) | Single column, stacked layout, full-width buttons |
| `sm:` | Slightly larger text, adjusted padding |
| `md:` | Two-column layouts, desktop nav visible, flex-row |
| `lg:` | Three-column grids, larger spacing |
| `xl:` | Max width constraints, additional decorative elements |

## Grid Patterns

- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` — standard card grid
- `grid-cols-2 md:grid-cols-4` — stats/counters
- `grid-cols-1 sm:grid-cols-2` — two-column split

## Typography Scaling

```
text-4xl sm:text-6xl md:text-7xl lg:text-8xl  (hero)
text-3xl sm:text-5xl                           (section headers)
text-sm sm:text-base                           (body text)
```

## Layout Patterns

- **Nav**: desktop `hidden md:flex`, mobile drawer `md:hidden`
- **Buttons**: `flex w-full flex-col sm:flex-row sm:w-auto`
- **Hero**: reverse on desktop `flex-col md:flex-row-reverse`
- **Modals**: `max-h-[90vh] overflow-y-auto`, wrapper `p-4`, inner `p-6 sm:p-8`

## Key Principle

Design for the smallest screen first. Every new element must work at 375px before adding `md:` or `lg:` enhancements. Never use fixed widths that could overflow on mobile.
