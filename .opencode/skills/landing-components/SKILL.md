---
name: landing-components
description: "Trigger: React component creation, modification, or refactoring for this landing page. Covers component structure, props patterns, state management, naming conventions, and export patterns."
license: Apache-2.0
metadata:
  author: gentle-ai
  version: "1.0"
---

## Activation Contract

Use this skill when creating, modifying, or refactoring any React component in this landing page project.

## Hard Rules

- Every component: `export const ComponentName: React.FC<Props>` — never `function` keyword.
- Props interface: `interface ComponentNameProps` declared above the component, same file, NOT exported.
- Import React at top: `import React, { useState } from 'react'` (only what's needed).
- Import order: React → lucide-react icons → data (`../data/tournamentData`) → local components.
- Callback props: `on`-prefix camelCase (`onClose`, `onSelectHouse`, `onOpenQuiz`).
- Handlers: `handle`-prefix camelCase (`handleSubmit`, `handleScroll`).
- State typing: always explicit — `useState<House | null>(null)`, never untyped `useState()`.
- Data constants: `UPPER_SNAKE_CASE` exported from `data/tournamentData.ts`.
- Data interfaces: singular nouns, exported inline (`export interface House`).
- Modal pattern: always mounted, gate with `if (!data) return null`, accept `onClose` + data props.
- Cross-section navigation: `document.getElementById(id).scrollIntoView({ behavior: 'smooth' })` — no router.
- Named exports for components; `export default` only for App.
- No semicolons, single quotes, 2-space indent.
- Section components end in `Section` suffix (e.g., `HousesSection`, `DisciplinesSection`).

## Decision Gates

| Situation | Action |
|-----------|--------|
| New section component | Create `src/components/{Name}Section.tsx`, add to `App.tsx` |
| New modal | Create `src/components/{Name}Modal.tsx`, mount in parent, gate with null return |
| New data type | Add interface + constant to `data/tournamentData.ts` |
| Shared UI pattern (cards, buttons, pills) | Extract as inline Tailwind classes, not separate components — keep flat |
| Form handling | Single `formData` state object, spread update: `setFormData({ ...formData, field: value })` |

## Component Template

```tsx
import React, { useState } from 'react'
import { IconName } from 'lucide-react'
import { DATA_TYPE } from '../data/tournamentData'

interface ComponentNameProps {
  propName: string
  onAction: () => void
}

export const ComponentName: React.FC<ComponentNameProps> = ({ propName, onAction }) => {
  const [state, setState] = useState<STATE_TYPE>(initialValue)

  return (
    <div>
      {/* content */}
    </div>
  )
}
```

## Key Patterns

- **Emoji extraction**: `house.mascot.split(' ')[0]` — recurring idiom across 5+ files.
- **Filter pills**: active = `bg-{color}-400 text-black`, inactive = `bg-slate-900 text-slate-400 border border-slate-800`.
- **Conditional rendering**: ternary `{condition ? <A/> : <B/>}`.
- **No custom hooks, no context, no useMemo/useCallback** — keep it simple.
