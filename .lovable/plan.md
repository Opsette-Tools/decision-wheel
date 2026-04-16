

# Spin the Wheel — Implementation Plan

## Overview
A standalone, mobile-first decision tool built with React + Vite + TypeScript + Ant Design. No Tailwind, no backend, localStorage only.

## Key Changes

### 1. Replace Tailwind with Ant Design
- Remove Tailwind CSS, PostCSS config, and related dependencies
- Install Ant Design (`antd`) and `@ant-design/icons`
- Install `vite-plugin-pwa` as devDependency
- Replace `index.css` with Ant Design theming (ConfigProvider for light/dark)

### 2. PWA Setup
- Configure `VitePWA()` in `vite.config.ts` with manifest, workbox settings, and autoUpdate
- Add SW registration guard in `main.tsx` (iframe/preview detection)
- Add meta tags and manifest link to `index.html`
- Generate placeholder PWA icons (192x192, 512x512) in `/public`

### 3. Wheel Component (Canvas-based)
- Dynamic SVG or Canvas wheel that adapts to any number of segments (2+)
- Rotating color palette that works in both light and dark mode
- Fixed pointer/indicator at top
- Spin animation using CSS transform or requestAnimationFrame with easing (deceleration curve)
- Result determined by final rotation angle mapped to segment

### 4. Options Panel (Ant Design components)
- Input + Add button for new options
- Editable list with drag-to-reorder, inline edit, and delete per item
- "Clear All" with Popconfirm
- "Load Examples" button for quick start
- Duplicate detection on add
- Shuffle button

### 5. App Layout
- Mobile-first: wheel on top, options panel below in a card
- Desktop: side-by-side layout (wheel left, panel right)
- Dark mode toggle in header using Ant Design Switch
- ConfigProvider wrapping app with dynamic theme algorithm

### 6. Spin Flow & Result
- Large "Spin" button (Ant Design Button, primary, large)
- Disabled when < 2 options
- On spin complete: Modal or prominent result display with the winner
- "Spin Again" and "Remove & Spin Again" (elimination mode) CTAs
- Subtle confetti or highlight animation on result

### 7. localStorage Persistence
- Auto-save option list, dark mode preference, and elimination state
- Restore on app load

### 8. Cleanup
- Remove all Tailwind references (tailwind.config.ts, postcss.config.js, @tailwind directives)
- Replace Index page entirely
- Keep router structure minimal (single page app)

