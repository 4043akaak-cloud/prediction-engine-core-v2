# PEC Design System

## Overview

The PEC Design System is the visual constitution of Prediction Engine Core. It defines the design language, component patterns, and interaction models that govern all UI implementation.

This system ensures consistency, accessibility, and professional quality across all PEC interfaces.

---

## Design Principles

### Minimal
Every element must justify its existence. Remove anything that does not serve the user's immediate need.

### Professional
The interface should feel like a tool, not a toy. Avoid playfulness, trends, or decorative elements.

### Timeless
Design for longevity. Avoid trends that will age quickly. Prefer simplicity over fashion.

### Readable Within Five Seconds
A user should understand the purpose and primary action of any screen within five seconds.

### Whitespace First
Whitespace is not empty space—it is an active design ingredient. Use generous spacing to create breathing room.

### Consistency Over Decoration
Consistency is more important than visual variety. Repeat patterns to build familiarity.

### No Unnecessary Animations
Motion should serve a purpose: feedback, guidance, or delight. Never animate for animation's sake.

### No Unnecessary Colors
Use color strategically. Neutral colors for content, accent colors for actions and states.

### No Visual Noise
Every pixel should contribute to clarity. Avoid gradients, shadows, borders, and textures unless they serve a clear purpose.

---

## Color System

### Primary Colors

| Name | Value | Usage |
| :--- | :--- | :--- |
| **Foreground** | `oklch(0.235 0.015 65)` | Primary text, headings |
| **Background** | `oklch(1 0 0)` | Page background |
| **Surface** | `oklch(0.98 0.001 286.375)` | Cards, panels |

### Semantic Colors

| Name | Value | Usage |
| :--- | :--- | :--- |
| **Primary** | `oklch(0.623 0.214 259.815)` | Primary actions, focus states |
| **Secondary** | `oklch(0.98 0.001 286.375)` | Secondary actions, muted elements |
| **Success** | `oklch(0.577 0.245 27.325)` | Success states, positive feedback |
| **Warning** | `oklch(0.8 0.15 65)` | Warning states, caution |
| **Error** | `oklch(0.577 0.245 27.325)` | Error states, destructive actions |
| **Neutral** | `oklch(0.552 0.016 285.938)` | Muted text, secondary information |

### Neutral Scale

| Name | Value | Usage |
| :--- | :--- | :--- |
| **Gray 50** | `oklch(0.985 0 0)` | Lightest backgrounds |
| **Gray 100** | `oklch(0.967 0.001 286.375)` | Light backgrounds |
| **Gray 200** | `oklch(0.92 0.004 286.32)` | Borders, dividers |
| **Gray 300** | `oklch(0.9 0.005 286)` | Subtle borders |
| **Gray 400** | `oklch(0.705 0.015 286.067)` | Muted text |
| **Gray 600** | `oklch(0.552 0.016 285.938)` | Secondary text |
| **Gray 700** | `oklch(0.4 0.015 65)` | Primary text |
| **Gray 900** | `oklch(0.235 0.015 65)` | Darkest text |

---

## Typography

### Font Family

**Primary Font**: System fonts (San Francisco, Segoe UI, Roboto)

Rationale: System fonts are optimized for each platform and load instantly. They are familiar and professional.

### Typographic Scale

| Name | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Heading 1** | 48px (3rem) | 700 Bold | 1.2 | Page titles, hero sections |
| **Heading 2** | 32px (2rem) | 700 Bold | 1.2 | Section titles |
| **Heading 3** | 24px (1.5rem) | 600 Semibold | 1.3 | Subsection titles |
| **Body** | 16px (1rem) | 400 Regular | 1.6 | Paragraph text, default |
| **Body Small** | 14px (0.875rem) | 400 Regular | 1.6 | Secondary text |
| **Caption** | 12px (0.75rem) | 400 Regular | 1.5 | Labels, metadata |
| **Button** | 16px (1rem) | 600 Semibold | 1.4 | Button text |
| **Input** | 16px (1rem) | 400 Regular | 1.6 | Form input text |

### Line Height Rules

- Headings: 1.2 (tight, confident)
- Body: 1.6 (readable, comfortable)
- Captions: 1.5 (compact but readable)

### Font Weight Hierarchy

- **700 Bold**: Primary headings (Heading 1)
- **600 Semibold**: Secondary headings, buttons, labels
- **400 Regular**: Body text, inputs

---

## Spacing System

Use a consistent 4px base unit for all spacing.

| Scale | Pixels | Usage |
| :--- | :--- | :--- |
| **xs** | 4px | Tight spacing, inline elements |
| **sm** | 8px | Small gaps, component padding |
| **md** | 12px | Medium spacing, section padding |
| **lg** | 16px | Large spacing, component margins |
| **xl** | 24px | Extra large spacing, section separation |
| **2xl** | 32px | Large section separation |
| **3xl** | 48px | Hero spacing, major sections |
| **4xl** | 64px | Maximum spacing, page margins |

### Padding Rules

- **Small components** (buttons, inputs): 8px vertical, 12px horizontal
- **Medium components** (cards, sections): 16px
- **Large components** (pages, containers): 24px+

### Margin Rules

- **Between sections**: 32px
- **Between elements**: 16px
- **Between related items**: 8px

---

## Border Radius

Use a consistent border radius system:

| Name | Value | Usage |
| :--- | :--- | :--- |
| **None** | 0px | Sharp corners (rare) |
| **sm** | 4px | Subtle rounding |
| **md** | 8px | Standard rounding (buttons, inputs) |
| **lg** | 12px | Generous rounding (cards) |
| **full** | 9999px | Fully rounded (badges, pills) |

**Default**: Use `md` (8px) for most components.

---

## Shadows

Shadows should be minimal and professional. Use only when necessary to create elevation.

### Shadow System

| Name | CSS | Usage |
| :--- | :--- | :--- |
| **None** | none | Default state |
| **sm** | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| **md** | `0 4px 6px rgba(0,0,0,0.1)` | Standard elevation |
| **lg** | `0 10px 15px rgba(0,0,0,0.1)` | Prominent elevation |

**Rule**: Avoid shadows on most elements. Use only for modals, dropdowns, and floating elements.

---

## Components

### Buttons

#### Primary Button

- **Background**: Gray 900
- **Text**: White
- **Padding**: 12px 24px
- **Border Radius**: 8px
- **Hover**: Gray 800
- **Disabled**: Gray 300 background, Gray 400 text

#### Secondary Button

- **Background**: Gray 100
- **Text**: Gray 900
- **Padding**: 12px 24px
- **Border Radius**: 8px
- **Hover**: Gray 200
- **Disabled**: Gray 100 background, Gray 400 text

#### Button States

- **Default**: Opaque, full color
- **Hover**: Slightly darker shade
- **Active**: Darker shade, slight scale down (0.97)
- **Disabled**: Muted colors, no cursor
- **Loading**: Spinner, disabled state

### Inputs

#### Text Input

- **Background**: White
- **Border**: 1px Gray 300
- **Padding**: 12px 16px
- **Border Radius**: 8px
- **Font Size**: 16px
- **Focus**: Ring 2px Primary, border transparent
- **Error**: Border Red 500
- **Disabled**: Background Gray 100, text Gray 400

#### Input States

- **Default**: Gray border
- **Focused**: Primary ring, no border
- **Error**: Red border
- **Disabled**: Muted background and text

### Cards

#### Prediction Card

- **Background**: White
- **Border**: 1px Gray 200 (top only)
- **Padding**: 24px
- **Spacing**: 24px between sections
- **Typography**: Heading 3 for labels, Body for content

#### Diary Card

- **Background**: White
- **Border**: 1px Gray 200 (bottom only)
- **Padding**: 16px
- **Spacing**: 12px between items
- **Typography**: Caption for labels, Body for content

### Expandable Sections

#### Details Section

- **Header**: Semibold text, toggle icon (▶/▼)
- **Content**: Indented, subtle background (Gray 50)
- **Padding**: 16px
- **Spacing**: 12px between items
- **Default State**: Collapsed

#### Counter Prediction Section

- **Header**: "Counter Prediction", "Alternative Scenario"
- **Visual Hierarchy**: Secondary (lighter text, smaller size)
- **Spacing**: 32px above (separates from primary prediction)
- **Default State**: Collapsed

---

## Mobile Rules

### Touch Targets

- **Minimum size**: 44px × 44px
- **Minimum spacing**: 8px between targets

### Margins

- **Page margins**: 16px (mobile), 24px (tablet), 32px (desktop)
- **Maximum content width**: 100% (mobile), 768px (tablet), 1280px (desktop)

### Typography Adjustments

- **Heading 1**: 32px (mobile), 48px (desktop)
- **Heading 2**: 24px (mobile), 32px (desktop)
- **Heading 3**: 18px (mobile), 24px (desktop)

### Layout

- **Single column** on mobile
- **Two columns** on tablet (768px+)
- **Three columns** on desktop (1280px+)

---

## Accessibility

### Color Contrast

- **Minimum contrast ratio**: 4.5:1 for normal text
- **Minimum contrast ratio**: 3:1 for large text (18px+)
- **Never use color alone** to convey information

### Keyboard Navigation

- **Tab order**: Logical, left-to-right, top-to-bottom
- **Focus indicator**: Visible, minimum 2px outline
- **Skip links**: Available on all pages

### Screen Reader Friendly

- **Semantic HTML**: Use `<button>`, `<input>`, `<label>` correctly
- **ARIA labels**: Provide when text is insufficient
- **Headings**: Use proper hierarchy (h1 → h2 → h3)
- **Images**: Provide alt text for all images

### Motion

- **Respect `prefers-reduced-motion`**: Disable animations if user prefers
- **Animations**: Maximum 300ms duration
- **Transitions**: Use `ease-out` for entering, `ease-in-out` for moving

---

## Implementation Rules

### CSS Architecture

- **Utility-first**: Use Tailwind CSS utilities
- **Custom components**: Extract to React components
- **Design tokens**: Use CSS variables for colors, spacing, typography
- **Responsive**: Mobile-first approach

### Component Structure

```tsx
// Example: Button Component
interface ButtonProps {
  variant: 'primary' | 'secondary'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ variant, size, disabled, children, onClick }: ButtonProps) {
  // Implementation
}
```

### Naming Conventions

- **Components**: PascalCase (e.g., `PredictionCard`)
- **Props**: camelCase (e.g., `isDisabled`)
- **CSS classes**: kebab-case (e.g., `prediction-card`)
- **Variables**: camelCase (e.g., `primaryColor`)

---

## Future Enhancements

This Design System will evolve as PEC grows. Future additions may include:

- Dark mode support
- Animation guidelines
- Icon system
- Data visualization guidelines
- Internationalization rules

---

## References

- **Color Format**: OKLCH (perceptually uniform, modern)
- **Typography**: System fonts (platform-optimized)
- **Spacing**: 4px base unit (flexible, consistent)
- **Accessibility**: WCAG 2.1 AA standard

---

## Version History

| Version | Date | Changes |
| :--- | :--- | :--- |
| 0.1 | 2026-07-03 | Initial Design System |
