# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (Vite on port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Lint code
npm run lint
```

## Environment Setup

**Required Environment Variables** (in `.env` file):
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: All env vars must be prefixed with `VITE_` for Vite to expose them to the client. After modifying `.env`, restart the dev server.

## Database Setup

Execute these SQL files **in order** via Supabase SQL Editor:
1. `create_business_cards_table.sql` - Stores user's saved cards
2. `create_user_profiles_table.sql` - Stores user profile information
3. `create_custom_images_table.sql` - Stores user-uploaded images

All tables have Row Level Security (RLS) enabled - users can only access their own data.

## Architecture Overview

### State Management Pattern

**Two-Provider Architecture**:
```jsx
<AuthProvider>           // Manages authentication state globally
  <ToastProvider>        // Manages toast notifications globally
    <AppContent />       // Main app with user-specific state
  </ToastProvider>
</AuthProvider>
```

The app uses a centralized state approach where `AppContent` holds the card data state and passes it down to components. This is intentional - card data needs to be accessible across tabs (Create, Saved Cards, Profile).

### Data Flow

**User Profile → Card Data (Auto-fill)**:
- On login, `loadUserProfile()` fetches user profile from Supabase
- Profile data automatically populates `cardData` state (name, title, contact info)
- If no profile exists, falls back to default values (Clara Schumann example)
- This enables "set once, use everywhere" UX

**Custom Images**:
- On login, `getUserCustomImages()` loads user's uploaded images
- Custom images appear **first** in the image grid, before preset images
- Images are stored as base64 in Supabase `custom_images` table
- Duplicate detection prevents same image from being uploaded twice

**Card Saving**:
- Duplicate detection compares ALL fields (name, title, phone, email, instagram, blog, image, theme, layout, image_gradient)
- Uses `savedCardsRef.current.refresh()` to update SavedCards list without remounting
- Toast notifications provide feedback for all operations

### Component Communication

**Parent-Child Ref Pattern** (SavedCards):
```jsx
// App.jsx exposes refresh method via ref
const savedCardsRef = useRef(null);

// SavedCards uses forwardRef + useImperativeHandle
const SavedCards = forwardRef(({ onLoadCard }, ref) => {
  useImperativeHandle(ref, () => ({
    refresh: loadCards
  }));
});

// App calls it after saving
savedCardsRef.current.refresh();
```

This allows parent to trigger child updates without prop drilling or full re-renders.

### Service Layer Pattern

All Supabase operations are isolated in service files (`src/utils/*Service.js`):
- `cardService.js` - CRUD for business cards
- `userProfileService.js` - CRUD for user profiles
- `customImageService.js` - CRUD for custom images

Each returns `{ data, error }` pattern for consistent error handling:
```javascript
const { data, error } = await saveCard(cardData, userId);
if (error) {
  // Handle error
} else {
  // Handle success
}
```

## Key Implementation Details

### Card Preview Rendering

CardPreview component renders the actual business card using:
- Dynamic CSS classes: `.theme-{theme}` and `.layout-{layout}`
- Card size: 600×350px (standard business card aspect ratio)
- Mobile scaling via `scale()` transform in CSS media queries
- Same component used for live preview AND saved cards grid (scaled to 70%)

### Export Mechanism

Uses `html-to-image` and `jsPDF` to convert CardPreview DOM:
```javascript
// PNG export
const dataUrl = await toPng(element);
// Downloads file

// PDF export
const imgData = await toPng(element);
const pdf = new jsPDF({ orientation: 'landscape' });
pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
```

Export functions are in `src/utils/export.js` and operate on element with `id="business-card"`.

### Theme System

Uses CSS Variables defined in `:root` and theme-specific overrides:
```css
.theme-pastel {
  --card-bg: #fce7f3;
  --card-text: #831843;
  /* ... */
}
```

Each theme class overrides the card-specific variables, while global UI uses standard `--primary`, `--background`, etc.

### Image Gradient Overlay

Controlled by `imageGradient` boolean in cardData:
- Standard/Bold layouts: Linear gradient from left (90% → transparent)
- Organic/Elegant/Creative/Geometric: Radial gradient from center (80% → transparent)
- Implemented via CSS `mask-image` property on `.card-image-section.has-gradient`

## Common Modification Patterns

**Adding a new theme**:
1. Add option to `CardForm.jsx` theme select
2. Add `.theme-{name}` CSS class in `index.css` with color variables
3. No other changes needed - theming is purely CSS-driven

**Adding a new layout**:
1. Add option to `CardForm.jsx` layout select
2. Add `.layout-{name}` CSS class in `index.css` with structural styles
3. Optionally add decorative elements in `CardPreview.jsx` (see `layout === 'creative'` example)

**Adding a new database table**:
1. Create SQL file with RLS policies (use existing files as templates)
2. Create service file in `src/utils/` with CRUD operations
3. Import and use service in `App.jsx` or relevant component

## Supabase Integration Notes

**Authentication Flow**:
- Session is persisted in browser (`persistSession: true`)
- `onAuthStateChange` listener keeps user state synchronized
- Email confirmation can be disabled in Supabase dashboard (Auth → Providers → Email)

**RLS Policy Pattern**:
All tables use `auth.uid() = user_id` pattern:
```sql
CREATE POLICY "Users can view their own data"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);
```

This ensures users can only access their own data, enforced at database level.

## Deployment

**Vercel**:
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Post-Deploy**: Update Supabase Auth settings with production URL in Redirect URLs list.
