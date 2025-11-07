# YallaWish2 - AI Coding Agent Instructions

## Project Overview
YallaWish2 is a React Native gift list wishlist app built with Expo Router, Convex backend, and Clerk authentication.

### User Roles
- **Giftee**: Creates and manages gift lists for events (birthdays, weddings, etc.), adds desired items, and shares lists with friends/family via contacts or groups
- **Gifter**: Opens shared lists from friends, claims gifts to purchase, and marks purchases as complete to prevent duplicate gifts

### Core Features
- Create private or shared gift lists with cover photos, event dates, and occasions
- Add gift items with images, prices, quantities, and purchase URLs
- Share lists via contacts/groups or password-protected links
- Claim and track gift purchases to coordinate with other gifters
- Real-time updates when gifts are claimed or purchased

## Tech Stack & Architecture

### Core Technologies
- **Frontend**: React Native 0.79.5 + React 19.0.0 + Expo SDK 53 + Expo Router 5 (file-based routing)
- **Backend**: Convex (real-time database with queries/mutations/actions)
- **Auth**: Clerk Expo SDK with token cache
- **State**: Convex React hooks (`useQuery`, `useMutation`, `useAction`)
- **Styling**: StyleSheet.create (no CSS-in-JS libraries), Nunito & Poppins fonts
- **Navigation**: Expo Router with type-safe routing via `app/` directory

### Key Dependencies
- `@clerk/clerk-expo` - Authentication with OAuth & token management
- `convex` - Backend queries/mutations with real-time subscriptions  
- `@directus/sdk` - External CMS integration (see `provider/sdkprovider.tsx`)
- `expo-notifications` - Push notification management
- `react-native-deck-swiper` - Product swiping interface

## Project Structure

### Routing Architecture (`app/`)
File-based routing with nested navigators:
- **Root Layout** (`_layout.tsx`): Wraps app in ClerkProvider → ConvexProvider → ThemeProvider
- **Tab Navigator** (`(tabs)/_layout.tsx`): 5-tab bottom navigation + hidden screens
  - Visible tabs: `index`, `favorites`, `add-product`, `global`, `messages`
  - Hidden screens (href: null): `create-list-step1/2/3`, `select-profile`, `add-gift`, `view-list`, `manage-list`, `gift-detail`, `purchase-success`
- **Auth Stack** (`(auth)/_layout.tsx`): `sign-in`, `sign-up`, `log-in` with returnTo support

**Important**: New list/gift flow screens must be added to `(tabs)/_layout.tsx` with `href: null` and optional `tabBarStyle: { display: 'none' }` for full-screen experiences.

### Data Layer (`convex/`)
Convex functions export from `convex/products.ts`:
- **Queries** (`query`): Read-only, reactive (e.g., `getListById`, `getListItems`, `getContacts`)
- **Mutations** (`mutation`): Write operations (e.g., `createList`, `createListItem`, `purchaseListItem`)
- **Actions** (`action`): External API calls (e.g., `fetchProducts` for scraping, `productMetadata`)
- **Schema** (`schema.ts`): Defines tables with typed fields and indexes

**Import convention**: 
```tsx
import { api } from "@/convex/_generated/api";
const data = useQuery(api.products.getListById, { listId });
const mutate = useMutation(api.products.createList);
```

### Database Schema (Convex)
Key tables in `convex/schema.ts`:
- `lists`: Gift lists with title, privacy (private/shared), password protection, cover photo, event date
- `list_items`: Gift items with name, price, quantity, claimed count, buy_url, image_url
- `list_shares`: Sharing configuration (group_id or contact_id can access list)
- `contacts`: User's friends/family profiles with extended fields (dateOfBirth, relation, avatarUrl)
- `groups`: Contact groups for batch list sharing
- `group_members`: Many-to-many join table
- `purchases`: Purchase records with deliveredTo, buyer info, order details
- `password_requests`: Access requests for password-protected lists
- `push_tokens`: Expo push notification tokens per user
- `products`: Scraped e-commerce products (Amazon/etc) for gift suggestions

### Components (`components/`)
**Shared Component Patterns**:
- Export from barrel files (`components/index.ts`, `components/list/index.ts`)
- Styles via `StyleSheet.create` at file bottom or imported from `styles/`
- Props typed with explicit TypeScript interfaces
- **List Components** (`components/list/`): Reusable list view elements
  - `HeaderBar`: Title + back button
  - `ListCover`: Cover image with gradient overlay
  - `GiftItemCard`: Gift item display with claim progress
  - `ActionsBar`: Filter, privacy, share count display
  - `FooterBar`: Share & manage buttons
  - `PasswordGate`: Password entry + request access form
- **Responsive Layout** (`ResponsiveAuthLayout`): Scalable desktop/mobile auth pages
  - Split-screen desktop (45% hero image / 55% form)
  - Full-screen mobile with overlay
  - Auto-detects via `Platform.OS === 'web' && width >= 768`
  - Usage: Wrap auth pages with `<ResponsiveAuthLayout>` component

### Styling Conventions (`styles/`)
- Centralized style exports: `styles/index.ts`, `styles/addGiftStyles.ts`, `styles/auth.ts`
- Use `@/styles/[file]` imports to avoid duplication
- Colors reference `constants/Colors.ts` for theme consistency
- Primary purple: `#330065`, Accent teal: `#03FFEE`
- Font families: Nunito (UI text), Poppins (alternate)
- Font weights: 300Light, 400Regular, 500Medium, 600SemiBold, 700Bold, 900Black

### Authentication Flow (Clerk)
**Access Control Patterns**:
```tsx
const { isSignedIn, userId } = useAuth();
// Private lists: only owner can view
if (privacy === 'private' && list.user_id !== userId) {
  return <Redirect href="/sign-in" />;
}
// Shared lists: password gate or contact-based access
if (requiresPassword && !unlocked) {
  return <PasswordGate />;
}
```

**returnTo Pattern**: Preserve navigation context across auth:
```tsx
const returnTo = `${pathname}?listId=${listId}`;
<Redirect href={{ pathname: "/sign-in", params: { returnTo: encodeURIComponent(returnTo) } }} />
```

## Development Workflows

### Running the App
```bash
npm start           # Start Expo dev server (Metro bundler)
npm run ios         # Launch iOS simulator
npm run android     # Launch Android emulator
npm run web         # Launch web browser
```

**Convex Backend**: Runs separately, configure via `.env`:
```
EXPO_PUBLIC_CONVEX_URL=https://[deployment].convex.cloud
```

### Push Notifications Setup
Hook: `usePushNotifications()` in `hooks/usePushNotifications.ts`
- Auto-registers token on sign-in
- Saves to Convex `push_tokens` table
- Requires EAS project ID from `app.json` → `extra.eas.projectId`

### Environment Variables
- `EXPO_PUBLIC_*` prefix required for Expo runtime access
- Example: `process.env.EXPO_PUBLIC_CONVEX_URL` in `app/_layout.tsx`
- Store secrets in `.env.local` (gitignored)

## Common Patterns & Conventions

### Navigation
```tsx
import { router } from "expo-router";
router.push({ pathname: "/view-list", params: { listId: String(id) } });
router.replace("/"); // Clear stack
router.back();
```

### Type-Safe Params
```tsx
const { listId } = useLocalSearchParams<{ listId?: string }>();
```

### Convex Data Fetching
```tsx
// Query with skip pattern
const items = useQuery(
  api.products.getListItems as any, 
  listId ? { list_id: listId } as any : "skip"
);

// Mutation with error handling
const createList = useMutation(api.products.createList);
try {
  const id = await createList({ title, privacy, user_id: userId });
} catch (e) {
  console.error('Failed to create list', e);
}
```

### Image Handling
```tsx
import { Image } from "expo-image"; // NOT react-native's Image
<Image 
  source={{ uri: imageUrl }} 
  style={{ width: 200, height: 200 }} 
  contentFit="cover" 
/>
```

### Font Usage
Explicitly declare font family in styles:
```tsx
text: {
  fontFamily: 'Nunito_700Bold',
  fontSize: 24,
  color: '#1C0335',
}
```

### Date Formatting
See `formatEventDate()` in `view-list.tsx` for ISO date → display format

### Responsive Design Pattern
**Desktop Detection**:
```tsx
const { width } = Dimensions.get("window");
const isDesktop = Platform.OS === "web" && width >= 768;
```

**Component Styling**:
```tsx
<View style={[styles.input, isDesktop && styles.inputDesktop]} />
```

**Auth Pages**: Use `ResponsiveAuthLayout` wrapper for automatic desktop/mobile layouts

## Critical Implementation Notes

### List Privacy Model
1. **Private**: Only list owner can view (enforced in `view-list.tsx`)
2. **Shared**: Accessible via `list_shares` table (group_id or contact_id) OR password entry

### Claim/Purchase Flow
1. User views gift via `gift-detail.tsx`
2. Claim quantity via `setClaim` mutation
3. Submit purchase details → `purchaseListItem` mutation
4. Updates `purchases` table + increments `list_items.claimed`
5. Redirect to `purchase-success.tsx` with confetti animation

### Anonymous Access Pattern
Some screens allow anonymous viewing (encoded in `(tabs)/_layout.tsx`):
```tsx
const allowAnonymous = ['/view-list', '/gift-detail', '/purchase-success']
  .some(p => pathname?.includes(p));
```

### Multi-Step List Creation
Progressive disclosure across 3 steps:
- Step 1: "For myself" vs "Someone else" → optionally select contact
- Step 2: List details (title, note, event date, occasion, cover photo)
- Step 3: Privacy settings (private/shared, password, contact/group sharing)

## Testing & Debugging

### Common Issues
1. **"Convex query undefined"**: Ensure backend function exported in `convex/products.ts`
2. **Navigation fails**: Check screen registered in `(tabs)/_layout.tsx`
3. **Fonts not loading**: Verify `useFonts()` in `_layout.tsx` waits for fonts before hiding splash
4. **Push notifications fail**: Check EAS project ID in `app.json` + permissions granted

### Build & Deploy
```bash
eas build --platform ios          # iOS build via EAS
eas build --platform android      # Android build
eas submit -p ios                 # Submit to App Store
```

## When Making Changes

1. **New Screens**: Add to `app/(tabs)/` with proper `_layout.tsx` registration
2. **New Convex Functions**: Export from `convex/products.ts`, import via `api.products.[name]`
3. **New Styles**: Add to existing `styles/` files or create domain-specific stylesheet
4. **Auth Changes**: Update both `sign-in.tsx` and `log-in.tsx` for consistency
5. **Schema Updates**: Modify `convex/schema.ts` → run `npx convex dev` to regenerate types
6. **Responsive Pages**: Use `ResponsiveAuthLayout` for auth flows; detect desktop via `Platform.OS === 'web' && width >= 768`gating)

## External Integrations

- **Directus CMS**: Initialized in `provider/sdkprovider.tsx` (not actively used in current codebase)
- **Amazon Product Scraping**: `convex/fetchProducts.ts` + `convex/scrape.ts` for metadata extraction
- **Expo Linking**: Deep linking for list sharing (`Linking.createURL()`)

## When Making Changes

1. **New Screens**: Add to `app/(tabs)/` with proper `_layout.tsx` registration
2. **New Convex Functions**: Export from `convex/products.ts`, import via `api.products.[name]`
3. **New Styles**: Add to existing `styles/` files or create domain-specific stylesheet
4. **Auth Changes**: Update both `sign-in.tsx` and `log-in.tsx` for consistency
5. **Schema Updates**: Modify `convex/schema.ts` → run `npx convex dev` to regenerate types

---

**Last Updated**: Based on codebase analysis (2025-11-05)
