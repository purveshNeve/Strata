# Comprehensive Design System Prompt for Cursor AI

## 🎨 Visual Design Philosophy

Create a minimalist, professional analytics platform with a focus on data clarity and cognitive ease. The design should feel like a premium educational tool—serious but approachable, data-rich but never overwhelming.

### Core Design Principles
- **Information Hierarchy First**: Data visualization takes center stage; UI chrome fades to the background
- **Breathing Room**: Generous whitespace (minimum 24px between major sections, 16px between cards)
- **Consistent Rhythm**: Use 8px base grid system for all spacing and sizing
- **Progressive Disclosure**: Show summary first, details on interaction
- **No Decoration**: Every visual element must serve a functional purpose

---

## 🌈 Color System

### Light Theme
**Background Layers** (use these to create depth without shadows):
- Primary Background: `#FAFAF9` (warm off-white, reduces eye strain)
- Surface Level 1: `#FFFFFF` (cards, modals)
- Surface Level 2: `#F5F5F4` (nested cards, input backgrounds)
- Surface Level 3: `#E7E5E4` (disabled states, subtle dividers)

**Text Hierarchy**:
- Primary Text: `#1C1917` (near-black, 90% opacity for body text)
- Secondary Text: `#57534E` (muted brown-gray, 70% opacity for labels)
- Tertiary Text: `#78716C` (lighter gray, 50% opacity for timestamps, captions)
- Placeholder Text: `#A8A29E` (40% opacity for empty states)

**Accent & Data Colors**:
- Primary Accent: `#2563EB` (blue, for CTAs and primary actions)
- Success/High Performance: `#059669` (emerald green, for >80% mastery)
- Warning/Medium Performance: `#D97706` (amber, for 40-79% mastery)
- Error/Low Performance: `#DC2626` (red, for <40% mastery, mistakes)
- Info/Neutral: `#0891B2` (cyan, for recommendations, insights)
- Purple (Confidence): `#7C3AED` (for confidence-related metrics)
- Teal (Stability): `#0D9488` (for stability indicators)

**Interactive States**:
- Hover: Add 8% opacity overlay of accent color
- Active/Pressed: Darken by 12%
- Focus Ring: 3px solid `#2563EB` with 20% opacity
- Disabled: 40% opacity with `cursor: not-allowed`

### Dark Theme
**Background Layers**:
- Primary Background: `#0A0A0A` (true deep black)
- Surface Level 1: `#171717` (cards)
- Surface Level 2: `#262626` (nested elements)
- Surface Level 3: `#404040` (subtle borders, dividers)

**Text Hierarchy**:
- Primary Text: `#FAFAFA` (bright white, 95% opacity)
- Secondary Text: `#D4D4D4` (warm gray, 75% opacity)
- Tertiary Text: `#A3A3A3` (muted, 55% opacity)
- Placeholder: `#737373` (45% opacity)

**Accent & Data Colors** (slightly desaturated for dark mode):
- Primary Accent: `#3B82F6` (brighter blue)
- Success: `#10B981` (brighter emerald)
- Warning: `#F59E0B` (brighter amber)
- Error: `#EF4444` (brighter red)
- Info: `#06B6D4` (brighter cyan)
- Purple: `#8B5CF6` (brighter purple)
- Teal: `#14B8A6` (brighter teal)

**Border & Divider Colors**:
- Light Theme: `#E7E5E4` (1px solid)
- Dark Theme: `#404040` (1px solid)
- Use borders sparingly—prefer background color changes for separation

---

## 📐 Typography System

### Font Family
- Primary: `Inter` (for UI, body text, data labels)
- Monospace: `JetBrains Mono` (for numerical data, code-like elements like scores)
- Fallback: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### Type Scale (Desktop)
```
Display (Page Titles): 32px / 40px line-height / 700 weight / -0.02em letter-spacing
H1 (Section Headings): 24px / 32px / 600 weight / -0.01em
H2 (Card Titles): 18px / 28px / 600 weight / normal
H3 (Subsection): 16px / 24px / 600 weight / normal
Body Large: 16px / 24px / 400 weight / normal
Body: 14px / 20px / 400 weight / normal
Body Small: 13px / 18px / 400 weight / normal
Caption: 12px / 16px / 500 weight / 0.01em (all caps for labels)
```

### Type Scale (Mobile)
- Reduce Display to 28px
- Reduce H1 to 20px
- Keep others same but increase line-height by 2px for readability

### Text Styling Rules
- **Never use pure black** (`#000000`) on white—always use `#1C1917`
- **Numerical data**: Use monospace font with tabular figures for alignment
- **Percentages/Scores**: Bold weight (600), larger size than surrounding text
- **Labels**: All caps, 12px, 500 weight, slight letter-spacing (0.01em), secondary text color
- **Long-form text** (recommendations, reasoning): 16px body with 28px line-height for readability

---

## 🧱 Component Design Specifications

### 1. Cards & Containers

**Standard Card**:
- Border radius: 12px (soft, modern)
- Background: Surface Level 1 color
- Border: 1px solid divider color (only in light theme, omit in dark)
- Padding: 24px (desktop), 16px (mobile)
- Shadow: None (rely on background color contrast instead)
- Hover state: Subtle 4px translation upward + add 2px border in accent color (only for interactive cards)

**Nested Card** (card within card):
- Border radius: 8px
- Background: Surface Level 2
- Padding: 16px
- No border, no shadow

**Section Container**:
- Max-width: 1280px centered
- Padding: 40px horizontal (desktop), 16px (mobile)
- Gap between cards: 24px vertical, 24px horizontal in grid

### 2. Data Visualization Components

**Heatmap (Topic Mastery)**:
- Cell size: 120px × 80px (desktop), 80px × 60px (mobile)
- Border radius: 8px per cell
- Gap between cells: 12px
- Color scale:
  - 0-20%: `#FEE2E2` (light red) → Dark: `#7F1D1D`
  - 21-40%: `#FED7AA` (light orange) → Dark: `#7C2D12`
  - 41-60%: `#FEF3C7` (light yellow) → Dark: `#78350F`
  - 61-80%: `#D1FAE5` (light green) → Dark: `#064E3B`
  - 81-100%: `#A7F3D0` (rich green) → Dark: `#065F46`
- Text on cells: Centered, topic name (14px, 600 weight) + percentage (20px, mono, 700 weight)
- Hover: Scale to 1.05, show tooltip with detailed stats

**Progress Bars**:
- Height: 8px (thin, modern)
- Border radius: 4px (full pill shape)
- Background: Surface Level 3
- Fill: Gradient from accent color to slightly lighter variant
- Animated fill: 0.6s ease-out transition on load
- Show percentage label: 12px, 600 weight, positioned at end of bar

**Line Charts (Trends, Projections)**:
- Line thickness: 3px (solid for actual data)
- Projected trend: 2px dashed line with 50% opacity
- Data points: 8px diameter circles with 2px white border
- Hover: Enlarge point to 12px, show tooltip
- Grid lines: 1px, 20% opacity, horizontal only
- Axes: 1px solid, secondary text color
- Labels: 12px, secondary text color, positioned outside chart area

**Scatter Plots (Time vs Accuracy)**:
- Point size: 6-16px (varies by confidence level)
- Point style: Semi-transparent (70% opacity) circles with 1px border
- Color by correctness: Green (correct), Red (incorrect)
- Hover: Full opacity, show question details in tooltip
- Axes with labels every 30 seconds (X) and every 20% (Y)

**Pie/Donut Charts (Mistake Distribution)**:
- Outer radius: 100px, inner radius: 60px (donut style)
- Segment colors: Use error/warning/success palette
- Hover: Enlarge segment by 8px, show count + percentage
- Center: Display total count in large text (24px, mono, 700)
- Legend: Below chart, 14px, with colored squares (12px) beside labels

### 3. Form Elements

**Text Inputs**:
- Height: 44px (easy touch target)
- Border radius: 8px
- Border: 2px solid divider color
- Background: Surface Level 2
- Padding: 12px 16px
- Font: 14px body text
- Placeholder: Use placeholder text color, never gray below 40% opacity
- Focus: Border becomes accent color, add subtle glow (0 0 0 3px accent at 15% opacity)
- Error: Border becomes error color, show error message below (12px, error color)

**Dropdowns/Select**:
- Same sizing as text inputs
- Chevron icon: 16px, positioned 16px from right edge
- Dropdown menu: Surface Level 1, 8px border radius, 8px padding
- Menu items: 40px height, 12px horizontal padding
- Hover item: Surface Level 2 background
- Selected item: Accent color background with white text

**Buttons**:

*Primary Button*:
- Height: 44px (48px for hero CTAs)
- Padding: 12px 24px
- Border radius: 8px
- Background: Accent color gradient (subtle 5% lighter at top)
- Text: White, 14px, 600 weight
- Hover: Darken background by 8%, lift 2px with subtle shadow
- Active: Darken by 12%, no lift
- Disabled: 40% opacity, no hover effects

*Secondary Button*:
- Same sizing as primary
- Background: Transparent
- Border: 2px solid accent color
- Text: Accent color, 14px, 600 weight
- Hover: Background becomes accent color at 8% opacity
- Active: 12% opacity background

*Ghost Button* (for subtle actions):
- No border, no background
- Text: Secondary text color, 14px, 500 weight
- Hover: Background becomes Surface Level 2, text becomes primary color
- Icon + text combination common here

**Toggle Switches**:
- Width: 44px, height: 24px
- Border radius: 12px (full pill)
- Background: Surface Level 3 (off), Accent color (on)
- Knob: 20px circle, white, 2px margin from edges
- Transition: 0.3s ease for knob movement and background color

**Radio Buttons & Checkboxes**:
- Size: 20px × 20px
- Border: 2px solid divider color
- Border radius: 4px (checkbox), 50% (radio)
- Checked: Accent color background, white checkmark icon (14px)
- Focus: Same focus ring as inputs

### 4. Navigation Elements

**Top Navigation Bar**:
- Height: 64px
- Background: Surface Level 1 with 1px bottom border (divider color)
- Logo: Left-aligned, 32px height
- Nav links: Horizontal list, 14px, 500 weight, secondary text color
- Active link: Primary text color with 3px bottom border (accent color)
- User menu: Right-aligned, avatar (32px circle) + dropdown

**Sidebar Navigation** (if used):
- Width: 240px (desktop), collapsible to 64px (icon-only mode)
- Background: Surface Level 1
- Nav items: 40px height, 16px padding, 8px border radius
- Icon + label layout (icon 20px, label 14px)
- Active item: Surface Level 2 background, accent color left border (3px)
- Hover: Surface Level 2 background

**Breadcrumbs**:
- 13px, secondary text color
- Separator: `/` or `›` character, 8px horizontal margin
- Current page: Primary text color, not clickable
- Previous pages: Clickable, hover to underline

**Tabs**:
- Horizontal list, 16px text, 500 weight
- Tab height: 48px
- Active tab: Primary text color, 2px bottom border (accent color)
- Inactive: Secondary text color
- Hover: Accent color at 50% opacity for bottom border
- Gap between tabs: 32px

### 5. Feedback Components

**Tooltips**:
- Background: `#262626` (dark in light theme, `#FAFAFA` in dark theme) with inverse text
- Border radius: 6px
- Padding: 8px 12px
- Font: 13px, 500 weight
- Max-width: 200px
- Arrow: 6px triangle pointing to trigger element
- Appear on hover after 0.3s delay
- Shadow: Subtle 0 4px 12px rgba(0,0,0,0.15) in light theme

**Notifications/Toasts**:
- Width: 360px (fixed)
- Height: Auto (min 64px)
- Border radius: 10px
- Position: Top-right corner, 16px margin
- Background: Surface Level 1 with 2px left border (color-coded by type)
- Left border colors: Success (green), Error (red), Warning (amber), Info (blue)
- Icon: 20px, color-matched to border, left-aligned
- Text: 14px body, secondary heading (14px, 600 weight) + body message
- Close button: 16px × icon, top-right, secondary text color
- Auto-dismiss after 5s (except errors), slide-out animation

**Loading States**:
- Spinner: 24px diameter, 3px stroke width, accent color with animated rotation
- Skeleton screens: Use Surface Level 2 rectangles with 8px border radius, subtle shimmer animation (light gradient sweeping left-to-right every 1.5s)
- Progress indicators: Thin 4px line at top of card/page, accent color, animated width increase

**Empty States**:
- Icon: 48px, muted color (tertiary text)
- Heading: 18px, 600 weight, primary text, "No data yet"
- Description: 14px, secondary text, explain what to do next
- Action button: Primary button, "Add Your First Test"
- Centered vertically and horizontally in container

**Error States**:
- Icon: 40px, error color
- Heading: 18px, 600 weight, error color
- Description: 14px, secondary text
- Retry button if applicable
- Support message: "Need help? Contact support" with link

### 6. Data Display Components

**Stat Cards** (for dashboard summary):
- Card with icon + label + large number + trend indicator
- Icon: 32px, accent color, top-left
- Label: 12px caps, secondary text, below icon
- Number: 28px, mono, 700 weight, primary text
- Trend: Small arrow + percentage (14px, green/red based on direction)
- Layout: Icon and label stacked left, number and trend stacked right

**Tables** (for attempt history, recommendations list):
- Row height: 56px
- Header: Surface Level 2 background, 12px caps, 600 weight, sticky on scroll
- Rows: Alternate transparent and Surface Level 3 background (zebra striping, subtle)
- Cell padding: 16px horizontal, 20px vertical
- Borders: No vertical borders, 1px horizontal divider between rows
- Hover row: Surface Level 2 background
- Sortable columns: Show up/down arrow icon (16px) on hover
- Action column: Right-aligned, icon buttons (24px)

**Recommendation Cards**:
- Larger card: 16px padding
- Header: Priority badge (high/medium/low) + focus area (18px, 600 weight)
- Body sections:
  - "Why this matters": 14px body text, secondary color
  - "Evidence": Bullet list, 13px, icons for each point
  - "Action steps": Numbered list, 14px, accent color numbers
  - "Confidence": Progress bar + label (e.g., "High confidence - 18 data points")
- Footer: Timestamp + "Mark as followed" button
- Priority badge: 8px border radius, 22px height, 10px padding, colored background (high=red, medium=amber, low=blue) with white text

**Timeline** (Advice Evolution):
- Vertical line: 2px, accent color, left-aligned
- Timeline nodes: 12px circle on line, filled with accent color
- Cards: Attached to right of line with 24px gap
- Card connection: 2px line from node to card edge
- Dates: Above each node, 12px, secondary text
- Card content: Condensed recommendation summary

### 7. Modal & Overlay Components

**Modal Dialog**:
- Overlay: Full-screen, `rgba(0,0,0,0.5)` in light theme, `rgba(0,0,0,0.75)` in dark
- Modal: Centered, max-width 600px, Surface Level 1 background
- Border radius: 16px
- Padding: 32px
- Header: 24px, 600 weight, 24px bottom margin
- Close button: Top-right, 24px icon, secondary text color
- Footer: Right-aligned buttons, 16px top margin
- Animation: Fade in overlay (0.2s), scale modal from 0.95 to 1 (0.3s ease-out)

**Dropdown Menu**:
- Surface Level 1 background
- Border radius: 8px
- Shadow: 0 8px 24px rgba(0,0,0,0.12)
- Padding: 8px
- Menu item: 40px height, 12px padding, 6px border radius
- Hover: Surface Level 2 background
- Divider: 1px, divider color, 8px vertical margin
- Icons: 20px, left-aligned with 12px margin-right

**Sidebar Panel** (for deep details):
- Width: 480px (desktop), full-width (mobile)
- Slides in from right
- Background: Surface Level 1
- Shadow: Large left shadow (0 0 40px rgba(0,0,0,0.2))
- Header: 64px fixed height, title + close button
- Body: Scrollable, 24px padding
- Footer: Fixed at bottom, 64px height, action buttons

---

## 🎬 Animations & Interactions

### Micro-Interactions Philosophy
Every animation should feel purposeful, not decorative. Speed is critical—prefer 0.2-0.4s durations. Longer feels sluggish, shorter feels jarring.

### Transition Timing Functions
- **Entering elements**: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out with slight bounce)
- **Exiting elements**: `cubic-bezier(0.4, 0, 1, 1)` (ease-in, quick)
- **Transformations**: `cubic-bezier(0.4, 0, 0.2, 1)` (standard ease-in-out)
- **Data updates**: `cubic-bezier(0, 0, 0.2, 1)` (smooth counter animations)

### Specific Animation Behaviors

**Page Transitions**:
- Fade in new page (0.3s) while previous fades out
- Content staggers in: First header (0s delay), then cards (0.05s delay each)
- No sliding left/right (feels slow)

**Card Hover**:
- Transform: `translateY(-4px)` (0.2s)
- Border: Accent color appears (0.2s)
- Shadow: None (maintain flat design)

**Button Click**:
- Scale: `scale(0.95)` on mousedown, return on mouseup (0.1s)
- Background color: Darken immediately (0s transition)
- No ripple effects (keep minimal)

**Data Loading**:
- Numbers: Animate count from 0 to final value (0.8s, ease-out)
- Charts: Bars/lines draw from left-to-right or bottom-to-top (1s, ease-out)
- Skeleton to content: Fade transition (0.4s), no morph animation

**Form Feedback**:
- Input focus: Border color change (0.15s)
- Error shake: Translate -8px → 8px → -4px → 0 (0.4s total)
- Success checkmark: Scale from 0 to 1 with rotation (0.5s, bounce)

**Notification Appearance**:
- Slide in from right + fade (0.3s, ease-out)
- Slide out to right + fade (0.2s, ease-in) on dismiss

**Tooltip**:
- Fade in (0.2s, 0.3s delay to prevent accidental triggers)
- No scale or slide effects (too distracting)

**Scroll Behaviors**:
- Smooth scroll: `scroll-behavior: smooth` (but only for programmatic scrolls)
- Parallax: None (keep focused on data)
- Sticky headers: Snap immediately (no transition)
- Infinite scroll: Load next page 200px before bottom, show subtle loading indicator

**Drag and Drop** (if used for reordering):
- Drag item: Lift with slight scale (1.05) and shadow
- Drop zone: Background highlight with accent color at 10% opacity
- Snap animation: Return to grid (0.3s, ease-out)

---

## 🖼️ Icon System

### Custom Icon Guidelines
You mentioned replacing with custom assets—here's how to maintain consistency:

**Icon Specifications**:
- Size: 20px default, 16px small, 24px large, 32px hero
- Style: Outline style (not filled), 2px stroke width
- Grid: Design on 24px grid with 2px padding (20px active area)
- Corner radius: 2px for rounded corners within icons
- Visual weight: Match Inter font at 500 weight

**Required Icon Set**:
*Navigation*:
- Dashboard (grid of 4 squares)
- Insights (lightbulb or sparkles)
- Recommendations (target with arrow)
- Progress (line chart ascending)
- Settings (gear)

*Actions*:
- Add (plus in circle)
- Delete (trash can)
- Edit (pencil)
- Upload (cloud with up arrow)
- Download (cloud with down arrow)
- Refresh (circular arrow)
- Search (magnifying glass)
- Filter (funnel)
- Sort (two arrows vertical)

*Data Visualization*:
- High performance (arrow up in circle, green)
- Low performance (arrow down in circle, red)
- Stable (checkmark in shield)
- Unstable (warning triangle)
- Confident (filled star)
- Uncertain (hollow star)
- Time (clock)
- Accuracy (target)

*Feedback*:
- Success (checkmark in circle)
- Error (X in circle)
- Warning (exclamation in triangle)
- Info (i in circle)
- Loading (circular spinner)

*UI Controls*:
- Close (X)
- Chevron down, up, left, right
- Menu (three horizontal lines)
- More (three dots horizontal)
- Help (question mark in circle)
- User (person silhouette)

**Icon Usage Rules**:
- Always include 8px margin around icons in buttons
- Use accent color for interactive icons, secondary text color for decorative
- Hover: Darken by 15%
- Disabled: 40% opacity
- Never rotate icons (except refresh spinner)
- Pair with text labels for important actions, icon-only for obvious functions

---

## 📱 Responsive Behavior

### Breakpoints
```
Mobile: 320px - 767px
Tablet: 768px - 1023px
Desktop: 1024px+
Large Desktop: 1440px+ (max-width container)
```

### Layout Adaptations

**Mobile (< 768px)**:
- Single column layout for all cards
- Navigation becomes bottom tab bar (fixed, 64px height)
- Dashboard stats: 1 card per row
- Heatmap: Horizontal scroll with snap points
- Charts: Full-width, simplified axes
- Tables: Horizontal scroll or card-based view
- Modals: Full-screen (no border radius at edges)
- Padding: 16px (never less)
- Font sizes: Reduce display/H1 by 20%, keep body same

**Tablet (768px - 1023px)**:
- 2-column grid for dashboard cards
- Sidebar navigation collapses to icon-only by default, expands on hover
- Charts: Full-width
- Tables: Show fewer columns, add "Show more" button

**Desktop (1024px+)**:
- 3-column grid for dashboard cards
- Full sidebar navigation visible
- Charts: Side-by-side where appropriate (e.g., mastery heatmap + stability chart)
- Tables: All columns visible
- Hover states active

### Touch Targets
- Minimum size: 44px × 44px (Apple HIG standard)
- Spacing between targets: 8px minimum
- Swipe gestures: Left swipe on table row to reveal delete action (mobile)

---

## 🎯 Accessibility Requirements

### Color Contrast
- All text must meet WCAG AA standards (4.5:1 for body, 3:1 for large text)
- Test all accent colors against backgrounds
- Never rely on color alone (use icons + text for status)

### Keyboard Navigation
- Tab order follows logical reading flow (top-to-bottom, left-to-right)
- Focus indicators: Visible 3px outline (accent color) on all interactive elements
- Skip links: "Skip to main content" at page top (hidden until focused)
- Shortcuts: Document keyboard shortcuts in help section (e.g., Cmd+K for search)

### Screen Reader Support
- All icons have `aria-label` attributes
- Charts include `aria-description` with data summary
- Live regions: Use `aria-live="polite"` for notifications, data updates
- Form labels: Always associate `<label>` with inputs
- Button text: Descriptive (not just "Click here")

### Motion & Animation
- Respect `prefers-reduced-motion` media query
- If enabled: Disable all animations, use instant transitions (0s duration)
- Critical animations (loading spinners) remain but simplified

---

## 🎨 Custom Asset Integration Points

### Illustration Style (for empty states, onboarding)
- Line art style, 2px stroke weight
- Use accent color + one secondary color maximum per illustration
- Geometric shapes (circles, rounded rectangles)
- No complex gradients
- Size: 240px × 180px for hero illustrations, 120px × 90px for inline

### Logo Treatment
- Wordmark + icon combination
- Icon: 32px × 32px, usable standalone in small spaces (favicon)
- Wordmark: Clean sans-serif, similar weight to Inter
- Color: Accent color for icon, primary text for wordmark (dark theme: white)

### Data Visualization Custom Elements
- Custom axis markers: Small geometric shapes instead of default lines
- Custom legend symbols: Rounded squares (8px, 2px radius) instead of circles
- Custom node shapes in timeline: Hexagons or rounded diamonds instead of circles

---

## 🔧 Implementation Notes for Cursor

### Component Naming Convention
Use descriptive, prefixed names:
- `Card*` for container components (CardDashboard, CardRecommendation)
- `Chart*` for visualizations (ChartMastery, ChartTimeline)
- `Button*` for button variants (ButtonPrimary, ButtonGhost)
- `Input*` for form elements (InputText, InputDropdown)

### CSS Organization
- Use CSS modules or styled-components for scoping
- Create design tokens file: `tokens.css` with all colors, spacing, typography
- Utility classes for common patterns (flex-center, text-secondary, mt-24)
- No inline styles except for dynamic values (chart dimensions, bar widths)

### Component Structure Pattern
Each component should include:
1. Props interface with types
2. Default props for optional values
3. Variants object for different states (primary/secondary, success/error)
4. Accessibility attributes (aria-*, role)
5. Loading and error states

### Performance Considerations
- Lazy load charts (don't render until visible)
- Virtualize long lists (tables with 100+ rows)
- Debounce search inputs (300ms delay)
- Optimize re-renders: Use React.memo for static components
- Skeleton screens: Show instantly while data loads

---

## ✨ Special Features to Enhance UX

### Smart Defaults
- Auto-detect user's timezone for timestamps
- Remember last viewed tab/filter (stored in localStorage)
- Pre-fill form fields from context (if adding question from Test 3, pre-select Test 3)

### Contextual Hints
- First-time tooltips: Appear on first visit, dismissible, never shown again
- Empty state guidance: Show example data when no user data exists
- Inline validation: Show green checkmark as user types valid data

### Progressive Enhancement
- Base experience works without JavaScript (forms submit, links navigate)
- Charts render as tables if canvas unavailable
- CSV parsing fallback: Server-side if client-side fails

### Delight Moments (Subtle)
- Confetti animation when user improves mastery by 20%+ (brief, 2s duration)
- Smooth number counting: Watch score increase from 67% to 83%
- Personalized greeting: "Good morning, Alex" based on time of day
- Celebration badge: "First perfect mock test! 🎯" with subtle shine animation

---

## 🎓 Design Validation Checklist

Before finalizing, ensure:
- [ ] All interactive elements have hover and focus states
- [ ] Color contrast passes WCAG AA for all text
- [ ] Loading states exist for every async action
- [ ] Error messages are helpful, not technical
- [ ] Empty states explain what to do next
- [ ] Mobile layout doesn't require horizontal scroll
- [ ] Touch targets are 44px minimum
- [ ] Forms show success feedback after submission
- [ ] Disabled states are visually clear
- [ ] Icons have consistent stroke weight
- [ ] Spacing follows 8px grid system
- [ ] Typography scale is consistent throughout
- [ ] Dark theme has proper contrast (not just inverted colors)
- [ ] Data visualizations have accessible alternatives (tables)
- [ ] Navigation is reachable from any page

---

This design system provides a complete foundation for building a professional, minimalist analytics platform. The focus on natural colors, generous spacing, and purposeful interactions creates a calm, focused environment for students to understand their performance. Every design decision supports the core goal: making complex data feel simple and actionable.