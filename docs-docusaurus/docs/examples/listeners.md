---
id: listeners
title: Listeners Example
sidebar_position: 3
---

# Listener Middleware Patterns

This example demonstrates the Ripe Method listener patterns using Redux Toolkit. Listeners handle all business logic, side effects, and async operations.

**Key patterns:**
1. Listen to specific action
2. Listen to multiple actions
3. Listen by predicate (action type pattern)
4. Cancel previous effects (debounce/throttle)

**Source:** The Ripe Method, Slides 25-26

```typescript
/**
 * Example: Listener Middleware Patterns
 * 
 * This example demonstrates the Ripe Method listener patterns using Redux Toolkit.
 * Listeners handle all business logic, side effects, and async operations.
 * 
 * Key patterns:
 * 1. Listen to specific action
 * 2. Listen to multiple actions
 * 3. Listen by predicate (action type pattern)
 * 4. Cancel previous effects (debounce/throttle)
 * 
 * Source: The Ripe Method, Slides 25-26
 */

import { 
  createListenerMiddleware, 
  isAnyOf,
  type TypedStartListening,
} from "@reduxjs/toolkit";
import type { RootState, AppDispatch } from "./store";

// Create the listener middleware
export const listenerMiddleware = createListenerMiddleware();

// Type-safe startListening
type AppStartListening = TypedStartListening<RootState, AppDispatch>;
const startListening = listenerMiddleware.startListening as AppStartListening;

// ============================================
// Pattern 1: Listen to a specific action
// Most common pattern
// ============================================

startListening({
  actionCreator: userLoggedIn,
  effect: async (action, listenerApi) => {
    // You get full access to dispatch + getState
    listenerApi.dispatch(showWelcomeToast());

    // You can do async work
    const user = await api.getUserProfile(action.payload.userId);
    listenerApi.dispatch(userProfileLoaded(user));
  },
});

// ============================================
// Pattern 2: Listen to multiple actions at once
// Useful when multiple actions should trigger the same logic
// ============================================

startListening({
  matcher: isAnyOf(userLoggedIn, userLoggedOut, tokenExpired),
  effect: async (_, { dispatch }) => {
    dispatch(refreshSidebar());
    dispatch(checkNotifications());
  },
});

// ============================================
// Pattern 3: Listen by predicate
// Useful for catching patterns (e.g., all rejected actions)
// ============================================

startListening({
  predicate: (action) => action.type.endsWith("/rejected"),
  effect: async (action) => {
    const error = action.payload as ApiError;
    console.error("API Error:", error);
    // Could dispatch a global error notification here
  },
});

// ============================================
// Pattern 4: Cancel previous effects
// Perfect for search, autocomplete, or any "latest wins" scenario
// ============================================

startListening({
  actionCreator: searchQueryChanged,
  effect: async (action, { cancelActiveListeners, dispatch }) => {
    // Cancel any previous search that's still running
    cancelActiveListeners();

    // This will automatically cancel if a new search comes in
    const results = await api.search(action.payload);
    dispatch(searchResultsLoaded(results));
  },
});

// ============================================
// Real-world example: Location change handler
// ============================================

startListening({
  actionCreator: setLocation,
  effect: async (action, { dispatch, getState }) => {
    const { pathname } = action.payload;

    // If navigating to shop page, start polling
    if (matchPath("/shop/:shopId", pathname)) {
      setTimeout(() => {
        if (getState().service.pollingEnabled) {
          dispatch(enablePolling());
        }
      }, RETRY_DELAY);
      return;
    }

    dispatch(disablePolling());
  },
});

// ============================================
// Real-world example: Fetch with state checks
// ============================================

startListening({
  actionCreator: getServiceQueue,
  effect: async (action, { dispatch, getState }) => {
    const shopId = getState().shop.id;

    // Guard clause - check preconditions
    if (!shopId) {
      dispatch(getServiceQueueFailure({ error: "No shop id found" }));
      return;
    }

    try {
      const requests = await fetchServiceRequests(shopId);

      // Check if conditions still valid after async work
      const { pollingEnabled, queue } = getState().service;

      dispatch(getServiceQueueSuccess({ ...requests }));
    } catch (e) {
      dispatch(getServiceQueueFailure({ error: "Failed to fetch requests" }));
    }
  },
});
```

## Key Points

- **Business logic location** - All logic lives in listeners, not components or reducers
- **Type safety** - Use `TypedStartListening` for full type support
- **Cancellation** - Use `cancelActiveListeners()` for debouncing/throttling
- **State checks** - Always verify preconditions before async work
