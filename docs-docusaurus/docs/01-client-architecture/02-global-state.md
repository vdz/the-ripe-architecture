---
id: 02-global-state
title: Global State
sidebar_position: 3
---

# Global State Composition

> **Commandment I:** Envision One Global Application State

---

## The Core Idea

The **State** is a single global map of everything your application needs to show to the user.

Think of it as a configuration JSON. If you printed out the entire state object, you'd see every piece of data your application displays: which user is logged in, what items are in the cart, whether a modal is open, what the current loading status is.

## How to Think About State

Every time you're about to add a feature, ask yourself:

> "What state changes will this feature require?"

Describe the state first. Then write the code. This state-first thinking prevents you from scattering data across components and ensures everything ends up in the right place.

---

## State Concepts

### Single Source of Truth

All application data lives in the global store. There's no local component state for business data. When you need to know what's happening in the app, you look in one place.

### No In-Component State

Components don't hold application state. They read from the store and dispatch actions. That's it.

```typescript
// ❌ Don't do this
const [items, setItems] = useState([]);

// ✅ Do this instead
const items = useAppSelector(state => state.products.items);
```

### Reflects the UI

The state contains everything needed to render the current view. If a modal is open, there's a flag for it. If an item is selected, there's a reference to it.

### Optimized for Access

We structure data for quick lookup. Arrays for ordered lists, objects for O(1) access by ID.

### Features Have Their Own Branch

Each major feature gets its own slice of state. The cart has its branch. The user has its branch. Products have their branch.

### Always Has Defaults

State always starts with sensible default values. There's never a moment where the app is in an undefined state.

---

## State Structure Example

Here's what a typical application state looks like:

![State Structure Example](/images/state-structure-example.jpeg)

```typescript
{
  app: {
    loaded: boolean,
    online: boolean
  },
  ui: {
    modalShow: boolean,
    contextMenus: { [itemId: string]: { show: boolean } }
  },
  products: {
    status: 'idle' | 'loading' | 'loaded' | 'error',
    items: {...},
    by_id: {...}
  },
  cart: {
    items: [],        // Array for order
    by_id: {...},     // Object for fast lookup
    show: boolean
  },
  user: {
    profile: {...}
  }
}
```

Notice the patterns:

- **Branches** — Top-level keys group related state (`app`, `ui`, `products`, `cart`, `user`)
- **Status flags** — Loading states are explicit (`'idle' | 'loading' | 'loaded' | 'error'`)
- **Dual structures** — Both array (for order) and object (for O(1) lookup) when needed
- **UI state** — Even visibility flags live in the store

---

## State Mutations

### Only via Reducers

Changes are introduced to the state **only through reducers**. There's no other way to modify state.

### Reducers Contain No Logic

Reducers are "dumb." They only do simple assignment and removal. They don't compute, transform, or make decisions.

```typescript
// ✅ Simple reducer - just assigns the value
.addCase(setUserProfile, (state, action) => {
  state.user.profile = action.payload;
})

// ❌ Don't put logic in reducers
.addCase(setUserProfile, (state, action) => {
  if (action.payload.isValid) {  // No logic here!
    state.user.profile = transform(action.payload);  // No transformation!
  }
})
```

### Payloads Match State Structure

Action payloads should be pre-formatted to fit directly into the state. The work of transforming data happens before the action is dispatched, not in the reducer.

---

## Simple Reducers in Practice

Here's the anatomy of a reducer file using Redux Toolkit:

![Simple Reducers](/images/simple-reducers.jpeg)

> **Full example:** See [reducer/examples/reducer](../examples/reducer/examples/reducer)

```typescript
import { createReducer } from "@reduxjs/toolkit";

// Always start with a default (initial) state
export const defaultState: RequestState = {
  items: [],
  byId: {},
  timelinesById: {},
  current: null,
  loading: LoadingStates.IDLE,
};

export const reducer = createReducer<RequestState>(defaultState, (builder) => {
  builder
    // Simple status change
    .addCase(getServiceQueue, (state) => {
      state.loading = LoadingStates.LOADING;
    })
    
    // Payload already formatted for state
    .addCase(getServiceQueueSuccess, (state, action) => {
      state.loading = LoadingStates.SUCCESS;
      state.queue = action.payload.queue;
      state.byId = action.payload.byId;
    })
    
    // Error handling
    .addCase(getServiceQueueFailure, (state) => {
      state.loading = LoadingStates.ERROR;
    })
    
    // Classic assignment
    .addCase(setCurrentServiceRequest, (state, action) => {
      state.current = action.payload.id;
    })
    
    // Data removal with cleanup
    .addCase(statusComplete, (state, action) => {
      state.queue = state.queue.filter(id => id !== action.payload.id);
      delete state.byId[action.payload.id];
      delete state.timelinesById[action.payload.id];
    });
});
```

Key patterns:

1. **Default state** — Always defined, always complete
2. **Status changes** — Simple flag updates
3. **Data assignment** — Payload goes directly into state
4. **Cleanup** — When removing data, clean up all related structures

---

## Common Mistakes

### Storing Derived Data

```typescript
// ❌ Don't store computed values
state.totalPrice = state.items.reduce((sum, item) => sum + item.price, 0);

// ✅ Compute in a selector instead
const selectTotalPrice = (state) => 
  state.cart.items.reduce((sum, item) => sum + item.price, 0);
```

### Duplicating Data

```typescript
// ❌ Don't duplicate data across branches
state.user.cartItems = [...];  // Already in cart.items!

// ✅ Reference by ID if needed
state.user.cartItemIds = [1, 2, 3];
```

### Complex Reducer Logic

```typescript
// ❌ Don't do this
.addCase(addItem, (state, action) => {
  const exists = state.items.find(i => i.id === action.payload.id);
  if (exists) {
    exists.quantity += 1;
  } else {
    state.items.push({...action.payload, quantity: 1});
  }
})

// ✅ Handle this logic in a listener, dispatch the right action
// The reducer just does the simple thing
.addCase(incrementItemQuantity, (state, action) => {
  state.byId[action.payload.id].quantity += 1;
})
.addCase(addNewItem, (state, action) => {
  state.items.push(action.payload.id);
  state.byId[action.payload.id] = action.payload;
})
```

---

## Summary

- **One global state** — Everything in one place, inspectable and predictable
- **State-first thinking** — Design the state before writing the feature
- **Simple reducers** — No logic, just assignment
- **Formatted payloads** — Data transformation happens before dispatch
- **Optimized structures** — Arrays for order, objects for lookup

---

**Next:** [Information Flow](/client-architecture/03-information-flow)
