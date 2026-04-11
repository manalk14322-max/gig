# Theme Color Guide 🎨

## Overview
This document defines the color palette and usage guidelines for the Gig platform. Follow this ratio for consistent design:
- **70%** → Light background (white/off-white)
- **20%** → Blue (main brand)
- **5%** → Purple (premium touch)
- **5%** → Accent + gradient

---

## 🎯 Color Palette

### 1️⃣ Background Colors (70% use)
| Color | Hex | Usage |
|-------|-----|-------|
| Main Background | `#F9FAFB` | Full website background, app background, sections |
| Light Background | `#F3F4F6` | Secondary backgrounds, hover states |
| Cards/Containers | `#FFFFFF` | Gig cards, profile cards, forms, modals |

**CSS Variables:**
```css
--bg: #F9FAFB;
--bg-2: #F3F4F6;
--surface: #FFFFFF;
```

---

### 2️⃣ Primary Color (20% use)
| Color | Hex | Usage |
|-------|-----|-------|
| Deep Blue | `#1E3A8A` | Main buttons, logo color, important headings, active states |

**CSS Variables:**
```css
--primary: #1E3A8A;
--accent: #1E3A8A;
```

**Tailwind class:**
```
bg-primary, text-primary
```

---

### 3️⃣ Secondary Color (5–7% use)
| Color | Hex | Usage |
|-------|-----|-------|
| Purple | `#6D28D9` | Highlights, special sections, icons, badges |

**CSS Variables:**
```css
--secondary: #6D28D9;
```

**Tailwind class:**
```
bg-secondary, text-secondary
```

---

### 4️⃣ Gradient (Buttons / CTA) (3–5%)
| Gradient | Colors | Usage |
|----------|--------|-------|
| Primary Gradient | `#6D28D9 → #2563EB` | Sign Up button, "Hire Now" button, important CTA |

**CSS:**
```css
background: linear-gradient(135deg, #6D28D9, #2563EB);
```

**Guidelines:**
- ✅ Use ONLY on 1–2 buttons per page
- ❌ Don't overuse
- ❌ Not for all CTAs

---

### 5️⃣ Accent Color (3–5%)
| Color | Hex | Usage |
|-------|-----|-------|
| Light Blue | `#3B82F6` | Links, hover effects, active tabs, icons |

**CSS Variables:**
```css
--accent-2: #3B82F6;
```

**Tailwind class:**
```
bg-accent, text-accent
```

---

### 6️⃣ Text Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Main Text | `#111827` | Headings, important text |
| Secondary Text | `#6B7280` | Descriptions, sub text, labels |

**CSS Variables:**
```css
--text: #111827;
--muted: #6B7280;
```

---

### 7️⃣ Borders / Lines
| Color | Hex | Usage |
|-------|-----|-------|
| Border | `#E5E7EB` | Card borders, dividers, input fields |

**CSS Variables:**
```css
--line: #E5E7EB;
```

---

## 🎨 Implementation Examples

### Button Styles

#### Primary Button (CTA)
```css
background: linear-gradient(135deg, #6D28D9, #2563EB);
color: #FFFFFF;
```

#### Secondary Button
```css
background: rgba(30, 58, 138, 0.1);
color: #1E3A8A;
border: 1px solid rgba(30, 58, 138, 0.14);
```

#### Ghost Button
```css
background: #FFFFFF;
color: #111827;
border: 1px solid #E5E7EB;
```

### Card Styling
```css
background: #FFFFFF;
border: 1px solid #E5E7EB;
border-radius: 16px;
box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
```

### Input Fields
```css
background: #FFFFFF;
border: 1px solid #E5E7EB;
color: #111827;
```

**On Focus:**
```css
border-color: rgba(30, 58, 138, 0.35);
box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.1);
```

### Links & Interactive Elements
```css
color: #3B82F6;
transition: color 180ms ease;
```

```css
a:hover {
  color: #1E3A8A;
}
```

---

## 🚫 Common Mistakes to Avoid

| ❌ DO NOT | ✅ Instead |
|----------|-----------|
| Use purple everywhere | Use only for highlights and badges |
| Apply gradient to every button | Use gradient only on 1-2 main CTAs |
| Use dark colors for backgrounds | Use #F9FAFB or #FFFFFF |
| Mix multiple accent colors | Pick one accent per context |
| Use warm colors (orange, yellow) | Stick to cool palette (blue, purple) |

---

## 📊 Color Distribution Guide

### Homepage Example
```
Background: #F9FAFB (70%)
├─ Cards: #FFFFFF
├─ Text: #111827
├─ Muted: #6B7280
├─ Borders: #E5E7EB
├─ Primary Button: #1E3A8A (20%)
├─ Links: #3B82F6
└─ Gradient CTA: #6D28D9 → #2563EB (5%)
```

---

## 🔧 CSS Variables Reference

All colors are defined as CSS variables for easy maintenance:

```css
:root {
  /* Backgrounds */
  --bg: #F9FAFB;
  --bg-2: #F3F4F6;
  --surface: #FFFFFF;
  
  /* Text */
  --text: #111827;
  --muted: #6B7280;
  
  /* Accents */
  --accent: #1E3A8A;
  --accent-2: #3B82F6;
  --secondary: #6D28D9;
  
  /* Borders */
  --line: #E5E7EB;
  
  /* Gradient */
  --gradient: linear-gradient(135deg, #6D28D9, #2563EB);
}
```

---

## 🎯 Final Checklist

- ✅ Use light backgrounds (70%)
- ✅ Use blue for trust and primary actions (20%)
- ✅ Use purple sparingly for premium elements (5%)
- ✅ Use light blue for interactive elements (5%)
- ✅ White for cards and containers
- ✅ Dark gray for main text
- ✅ Light gray for secondary text
- ✅ Subtle borders in light gray

---

## 📝 Files Updated

All CSS files have been updated with the new theme:
- ✅ `styles.css` - Main theme
- ✅ `mobile.css` - Mobile theme
- ✅ `gig-builder.css` - Builder page theme
- ✅ `theme-lock.css` - Theme lock overrides
- ✅ `gig-system/client/tailwind.config.js` - Tailwind configuration
- ✅ HTML meta theme-color tags

---

**Remember:** "Keep it clean, use blue for trust, purple for premium, and white for space."
