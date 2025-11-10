# Create List Step 3 Desktop Migration

## Why
- Bring the “Who can see this list?” step to parity with the new desktop Create List flow established in Step 2.
- Consolidate state management so mobile and desktop share the same data mutations and selection logic.
- Follow the product spec that introduces the sidebar stepper and wide option cards for desktop users.

## What Changed
- `app/(tabs)/create-list-step3.tsx`
  - Introduced responsive branching on the `DESKTOP_BREAKPOINT`, mirroring the Step 2 pattern.
  - Split the UI into shared state hooks plus `MobileLayout` and `DesktopLayout` renderers.
  - Added desktop-specific option cards, password settings, and a modal for managing “My People” selections.
  - Reused Convex queries/mutations (privacy, shares, seeding) across layouts to avoid duplication.
- `app/(tabs)/step3styles.ts`
  - Added a `desktopStyles` block with the sidebar, option card, and share modal styling needed by the new layout.
- No backend or navigation changes were required; existing routes and mutations already supported the additional UI.

## How It Works
1. Shared state is computed once (`selectedOption`, password flags, prefilled shares, filtered groups/friends).
2. When width ≥ 1024 on web, `DesktopLayout` renders:
   - Left rail stepper (same wording as design).
   - Three option cards with radio selection, password controls, and “Manage Share” action.
   - Desktop share modal reusing the mobile lists but with wider cards.
3. Otherwise, the original mobile gradient header + bottom sheet stay intact, using the same handlers.
4. Privacy updates and `setShares` calls run in `handleContinue`/`confirmShareAndClose`, so behaviour matches prior mobile-only flow.

## Follow Ups / Gotchas
- `bunx tsc --noEmit` still fails because legacy auth screens reference the non-existent `"apple1"` icon. Fix those before treating the codebase as type-clean.
- If we introduce future sharing rules, update both the `DesktopShareModal` and mobile bottom sheet—they now share the same filtering state, so helper utilities may make sense.
- Ensure any future layout tweaks continue to respect the 1024 breakpoint so desktop does not regress to the mobile version.

