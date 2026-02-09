# Quick Reference

A condensed cheat sheet for daily use.

---

## The Four Commandments

| # | Commandment | One-liner |
|---|-------------|-----------|
| I | **One Global State** | All app data in a single store |
| II | **Unidirectional Flow** | Action → Reducer → State → View |
| III | **Fixed File Structure** | Same folders, every project |
| IV | **Three Functional Layers** | Store, Logic, View — separate concerns |

---

## Project Structure

```
src/
├── components/     # React components only
├── store/          # State management
├── modules/        # Utils, hooks, helpers
├── routes/         # Routing config
└── main.tsx        # Entry point
```

---

## Naming Conventions

| What | Convention | Example |
|------|------------|---------|
| Component folders | PascalCase | `Cart/`, `UserProfile/` |
| Component files | PascalCase | `Cart.tsx`, `Cart.styled.tsx` |
| Store folders | lowercase | `cart/`, `user/` |
| Store files | dot-separated | `cart.actions.ts` |
| Modules | camelCase | `useAuth.ts`, `timeUtils.ts` |
| Actions | verbFeatureVariant | `fetchItemsSuccess` |

---

## Store Branch Template

```
store/feature/
├── types.ts              # State + payload types
├── feature.actions.ts    # Action creators
├── feature.reducer.ts    # Default state + reducer
├── feature.selectors.ts  # Selectors (optional)
├── feature.listeners.ts  # Business logic (optional)
└── api/
    └── fetchFeature.ts   # API functions
```

---

## Component Template

```typescript
export function MyComponent() {
  // 1. Setup - hooks, selectors, helpers
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectData);
  
  // 2. Early returns
  if (!data) return null;
  
  // 3. Return JSX (as early as possible)
  return (
    <Wrapper>
      <Content>{data.title}</Content>
      <Button onClick={() => dispatch(doThing())}>{t("action")}</Button>
    </Wrapper>
  );
  
  // 4. Helper functions (below return)
  function formatTitle() { ... }
}
```

---

## Action Template

```typescript
// Simple action
export const showModal = createAction("ui/showModal");

// Action with payload
export const setUser = createAction<SetUserPayload>("user/setUser");

// Payload interface
export interface SetUserPayload {
  id: string;
  name: string;
}
```

---

## Reducer Template

```typescript
export const defaultState: FeatureState = {
  items: [],
  byId: {},
  loading: 'idle',
};

export const reducer = createReducer(defaultState, (builder) => {
  builder
    .addCase(fetchStart, (state) => {
      state.loading = 'loading';
    })
    .addCase(fetchSuccess, (state, action) => {
      state.loading = 'loaded';
      state.items = action.payload.items;
      state.byId = action.payload.byId;
    })
    .addCase(fetchFailure, (state) => {
      state.loading = 'error';
    });
});
```

---

## Listener Template

```typescript
listenerMiddleware.startListening({
  actionCreator: triggerAction,
  effect: async (action, { dispatch, getState }) => {
    // Get current state if needed
    const currentValue = getState().feature.value;
    
    // Do async work
    const result = await api.doSomething(action.payload);
    
    // Dispatch follow-up action
    dispatch(resultAction(result));
  },
});
```

---

## Do's and Don'ts

### State

| Do | Don't |
|----|-------|
| Keep all app data in store | Use useState for app data |
| Use arrays for order | Store derived data |
| Use objects for O(1) lookup | Duplicate data across branches |
| Pre-format payloads | Transform data in reducers |

### Reducers

| Do | Don't |
|----|-------|
| Simple assignment only | Put logic in reducers |
| Have default state | Make decisions in reducers |
| Keep it declarative | Call APIs from reducers |

### Components

| Do | Don't |
|----|-------|
| Read from selectors | Hold application state |
| Dispatch actions | Call APIs directly |
| Keep JSX clean | Put business logic in handlers |
| Use semantic names | Use generic div wrappers |

### Listeners

| Do | Don't |
|----|-------|
| Handle all side effects | Modify state directly |
| Make decisions here | Put UI logic here |
| Call APIs here | Skip error handling |
| Dispatch follow-up actions | Create infinite loops |

---

## Quick Checks

Before committing, ask yourself:

- [ ] Is app state in the global store (not useState)?
- [ ] Do reducers only do simple assignment?
- [ ] Is business logic in listeners (not components)?
- [ ] Are files ~100 lines or less?
- [ ] Do names follow conventions?
- [ ] Is the component return statement near the top?

---

## Common Patterns

### Loading States

```typescript
type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';

// In state
loading: LoadingState;

// In component
if (loading === 'loading') return <Spinner />;
if (loading === 'error') return <Error />;
```

### Normalized Data

```typescript
// State shape
{
  ids: ['1', '2', '3'],           // For order
  byId: {                          // For O(1) lookup
    '1': { id: '1', name: 'A' },
    '2': { id: '2', name: 'B' },
  }
}
```

### Selector with Memoization

```typescript
export const selectActiveItems = createSelector(
  [(state) => state.items.byId, (state) => state.items.ids],
  (byId, ids) => ids.map(id => byId[id]).filter(item => item.active)
);
```

---

## Links

**Documentation:**
- [Introduction](00-introduction.md)
- [Elements](01-elements.md)
- [Global State](02-global-state.md)
- [Information Flow](03-information-flow.md)
- [App Structure](04-app-structure.md)
- [Functional Layers](05-functional-layers.md)
- [Best Practices 2026](07-best-practices-2026.md)

**Code Examples:**
- [Reducer Example](../examples/reducer.example.ts)
- [Actions Example](../examples/actions.example.ts)
- [Listeners Example](../examples/listeners.example.ts)
- [Component Example](../examples/component.example.tsx)
