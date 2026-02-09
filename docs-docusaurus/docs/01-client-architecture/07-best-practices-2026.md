---
id: 07-best-practices-2026
title: Best Practices 2026
sidebar_position: 8
---

# Front-End Best Practices & Style Guide 2026

A comprehensive guide for React application engineering at MCE. This is a living document aligned with modern React 19, TypeScript 5.x, and current industry standards.

---

## Table of Contents

1. [Code Style](#code-style)
2. [Functions](#functions)
3. [TypeScript](#typescript)
4. [React Components](#react-components)
5. [Hooks](#hooks)
6. [State Management](#state-management)
7. [Styling](#styling)
8. [Performance](#performance)
9. [Testing](#testing)
10. [Error Handling](#error-handling)
11. [Accessibility](#accessibility)
12. [Comments & Documentation](#comments--documentation)

---

## Code Style

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile`, `CartItem` |
| Component files | PascalCase | `UserProfile.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth`, `useCart` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRIES`, `API_BASE_URL` |
| Types/Interfaces | PascalCase | `UserProps`, `CartState` |
| Variables & functions | camelCase | `getUserById`, `isLoading` |
| Test IDs | kebab-case | `data-testid="user-profile"` |
| CSS classes | kebab-case | `user-profile-header` |
| Enum keys | SCREAMING_SNAKE_CASE | `Status.LOADING` |

### Semantic Naming

Names should be clear, accurate, and self-documenting. Avoid generic names.

```typescript
// ✅ Good - clear intent
const activeUsers = users.filter(user => user.isActive);
const fetchUserProfile = async (userId: string) => { ... };
const cartItemCount = items.length;

// ❌ Bad - vague, generic
const arr = users.filter(u => u.isActive);
const getData = async (id: string) => { ... };
const count = items.length;
```

**Pluralization matters:**
- `userId` → single ID
- `userIds` → array of IDs
- `UserProps` → props interface (not `UserProp`)

### String Quotes

```typescript
// Single quotes for regular strings
const message = 'Hello world';

// Template literals for interpolation
const greeting = `Hello, ${userName}!`;

// Double quotes for JSX attributes
<Button aria-label="Close modal">Close</Button>
```

### Constants

Extract repeated values into constants. Keep constants close to where they're used.

```typescript
// ✅ Good - constant at module level, near usage
const DEBOUNCE_DELAY_MS = 300;
const MAX_FILE_SIZE_MB = 10;

function SearchInput() {
  const debouncedSearch = useDebouncedCallback(search, DEBOUNCE_DELAY_MS);
  // ...
}

// ❌ Bad - magic numbers inline
function SearchInput() {
  const debouncedSearch = useDebouncedCallback(search, 300);
  // ...
}
```

---

## Functions

### Arrow Function Syntax

Use implicit returns when possible for concise, readable code.

```typescript
// ✅ Good - implicit return
const double = (n: number) => n * 2;
const getUserName = (user: User) => user.profile.name;

// ✅ Good - explicit return for multi-line
const processUser = (user: User) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  return { ...user, fullName };
};

// ❌ Bad - unnecessary braces and return
const double = (n: number) => {
  return n * 2;
};
```

### Object Parameters

Pass a single object for functions with multiple parameters. This improves readability and makes parameter order irrelevant.

```typescript
// ✅ Good - object parameter with destructuring
interface FetchUsersParams {
  page: number;
  limit: number;
  filter?: UserFilter;
  sortBy?: SortField;
}

const fetchUsers = async ({ page, limit, filter, sortBy }: FetchUsersParams) => {
  // Implementation
};

// Call site is self-documenting
await fetchUsers({ page: 1, limit: 20, sortBy: 'createdAt' });

// ❌ Bad - positional arguments
const fetchUsers = async (page: number, limit: number, filter?: UserFilter) => {
  // Easy to mix up argument order
};

await fetchUsers(1, 20, undefined); // What do these numbers mean?
```

### Atomic Functions

Functions should have a single, clear purpose. Extract complex logic into helper functions.

```typescript
// ✅ Good - atomic, single-purpose functions
const calculateSubscriptionExpiry = (subscriptions: Subscription[]) => {
  const activeSubscription = findActiveSubscription(subscriptions);
  return activeSubscription?.expiresAt ?? null;
};

const findActiveSubscription = (subscriptions: Subscription[]) =>
  subscriptions.find(sub => sub.status === 'active' && !isExpired(sub));

const isExpired = (subscription: Subscription) =>
  new Date(subscription.expiresAt) < new Date();

// ❌ Bad - doing too much in one function
const getSubscriptionData = (subscriptions: Subscription[]) => {
  const active = subscriptions?.filter(sub =>
    sub?.status === 'active' &&
    sub?.attributes?.offerIds?.some(
      id => id === 'PREMIUM' || id === 'PREMIUM_PLUS'
    )
  );
  
  const expiry = active?.[0]?.attributes?.expiresAt
    ? new Date(active[0].attributes.expiresAt)
    : undefined;
  
  // ... more nested logic
};
```

### Pure Functions

Prefer pure functions that don't mutate external state and return consistent results for the same inputs.

```typescript
// ✅ Good - pure function
const sortByDate = (items: Item[]) =>
  [...items].sort((a, b) => b.createdAt - a.createdAt);

// ❌ Bad - mutates input
const sortByDate = (items: Item[]) => {
  items.sort((a, b) => b.createdAt - a.createdAt); // Mutates!
  return items;
};
```

---

## TypeScript

### Strict Configuration

Enable the strictest TypeScript settings in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Never Use `any`

Use `unknown` instead of `any`. It requires type checking before use.

```typescript
// ✅ Good - unknown requires type narrowing
const parseResponse = (data: unknown): User => {
  if (isUser(data)) {
    return data;
  }
  throw new Error('Invalid user data');
};

// Type guard function
const isUser = (data: unknown): data is User =>
  typeof data === 'object' &&
  data !== null &&
  'id' in data &&
  'email' in data;

// ❌ Bad - any bypasses all type checking
const parseResponse = (data: any): User => {
  return data; // No safety!
};
```

### Indexed Access Types

Reference types from their source rather than duplicating.

```typescript
// ✅ Good - derived from source type
interface UserCardProps {
  userId: User['id'];
  userName: User['name'];
  onSelect: (id: User['id']) => void;
}

// ❌ Bad - duplicated types drift over time
interface UserCardProps {
  userId: string;
  userName: string;
  onSelect: (id: string) => void;
}
```

### Discriminated Unions

Model state that can only be in one mode at a time.

```typescript
// ✅ Good - impossible to have both data AND error
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Use with exhaustive switch
const renderContent = (state: AsyncState<User>) => {
  switch (state.status) {
    case 'idle':
      return null;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <UserCard user={state.data} />;
    case 'error':
      return <ErrorMessage error={state.error} />;
  }
};

// ❌ Bad - allows invalid combinations
interface AsyncState<T> {
  isLoading: boolean;
  data: T | null;
  error: Error | null;
  // Can have both data AND error? isLoading true with data?
}
```

### Readonly by Default

Mark state and props as readonly to enforce immutability.

```typescript
// ✅ Good - enforced immutability
interface UserState {
  readonly id: string;
  readonly email: string;
  readonly preferences: Readonly<UserPreferences>;
}

// Or use the Readonly utility type
type UserState = Readonly<{
  id: string;
  email: string;
  preferences: UserPreferences;
}>;

// For arrays
type UserList = readonly User[];
```

### Runtime Validation with Zod

Never trust external data. Validate API responses at runtime.

```typescript
import { z } from 'zod';

// Define schema
const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  createdAt: z.string().datetime(),
});

// Infer TypeScript type from schema
type User = z.infer<typeof UserSchema>;

// Validate at API boundary
const fetchUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  return UserSchema.parse(data); // Throws if invalid
};
```

### Generic Components

Write reusable, type-safe components.

```typescript
// ✅ Generic list component
interface ListProps<T> {
  items: readonly T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

function List<T>({ items, renderItem, keyExtractor, emptyMessage }: ListProps<T>) {
  if (items.length === 0) {
    return <p>{emptyMessage ?? 'No items'}</p>;
  }
  
  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}

// Usage - types are inferred
<List
  items={users}
  renderItem={(user) => <UserCard user={user} />}
  keyExtractor={(user) => user.id}
/>
```

---

## React Components

### Function Declaration Style

In 2026, prefer regular function declarations over `React.FC`. The React team no longer recommends `React.FC`.

```typescript
// ✅ Good - function declaration with typed props
interface UserProfileProps {
  user: User;
  onEdit?: () => void;
}

function UserProfile({ user, onEdit }: UserProfileProps) {
  return (
    <article>
      <h2>{user.name}</h2>
      {onEdit && <button onClick={onEdit}>Edit</button>}
    </article>
  );
}

// ✅ Also good - arrow function for simple components
const UserAvatar = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="avatar" />
);

// ❌ Discouraged - React.FC adds implicit children and has other issues
const UserProfile: React.FC<UserProfileProps> = ({ user }) => { ... };
```

### Component Structure

Follow a consistent structure for readability.

```typescript
function UserDashboard({ userId }: UserDashboardProps) {
  // 1. Hooks (state, context, refs)
  const [isEditing, setIsEditing] = useState(false);
  const user = useUser(userId);
  const formRef = useRef<HTMLFormElement>(null);
  
  // 2. Derived state (no useEffect for derivation!)
  const displayName = user ? formatDisplayName(user) : 'Guest';
  const canEdit = user?.role === 'admin';
  
  // 3. Event handlers
  const handleSave = () => {
    // ...
  };
  
  // 4. Early returns for loading/error states
  if (!user) {
    return <Skeleton />;
  }
  
  // 5. Main render
  return (
    <main>
      <h1>{displayName}</h1>
      {canEdit && <EditButton onClick={() => setIsEditing(true)} />}
      {/* ... */}
    </main>
  );
}
```

### Keep Components Small

Components should do one thing well. Extract sub-components for complex UI.

```typescript
// ✅ Good - composed from focused components
function ProductPage({ productId }: ProductPageProps) {
  const product = useProduct(productId);
  
  if (!product) return <ProductSkeleton />;
  
  return (
    <main>
      <ProductHeader product={product} />
      <ProductGallery images={product.images} />
      <ProductDetails product={product} />
      <ProductReviews productId={productId} />
      <RelatedProducts categoryId={product.categoryId} />
    </main>
  );
}

// ❌ Bad - monolithic component doing everything
function ProductPage({ productId }: ProductPageProps) {
  // 500 lines of mixed concerns...
}
```

### Props Destructuring with Defaults

Use destructuring with default values instead of `defaultProps`.

```typescript
// ✅ Good - defaults in destructuring
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}

function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// ❌ Bad - deprecated defaultProps
Button.defaultProps = {
  variant: 'primary',
  size: 'md',
};
```

### Composition Over Configuration

Build flexible components through composition, not prop explosion.

```typescript
// ✅ Good - composable card
function Card({ children }: { children: React.ReactNode }) {
  return <article className="card">{children}</article>;
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <header className="card-header">{children}</header>;
};

Card.Body = function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="card-body">{children}</div>;
};

Card.Footer = function CardFooter({ children }: { children: React.ReactNode }) {
  return <footer className="card-footer">{children}</footer>;
};

// Usage - flexible composition
<Card>
  <Card.Header>
    <h2>Title</h2>
  </Card.Header>
  <Card.Body>
    <p>Content here</p>
  </Card.Body>
</Card>

// ❌ Bad - prop explosion
<Card
  title="Title"
  titleSize="lg"
  showHeader={true}
  headerIcon={<Icon />}
  content="Content"
  footer={<Footer />}
  footerAlign="right"
  // ... 20 more props
/>
```

---

## Hooks

### React 19 Hook Hierarchy

Use the right hook for the job:

| Need | Hook | When |
|------|------|------|
| Simple state | `useState` | Booleans, strings, numbers |
| Complex state | `useReducer` | Multiple related values, complex transitions |
| Side effects | `useEffect` | Subscriptions, DOM manipulation, external systems |
| Data fetching | `use()` + Suspense | Server data (React 19) |
| Refs | `useRef` | DOM access, mutable values without re-render |
| Memoization | React Compiler | Automatic in React 19 |

### Avoid useEffect for Derived State

This is a major code smell. Compute derived values directly.

```typescript
// ✅ Good - derived directly during render
function UserList({ users, filter }: UserListProps) {
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  return <List items={filteredUsers} />;
}

// ❌ Bad - useEffect for derivation (causes extra render!)
function UserList({ users, filter }: UserListProps) {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
  useEffect(() => {
    setFilteredUsers(
      users.filter(user => 
        user.name.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [users, filter]);
  
  return <List items={filteredUsers} />;
}
```

### useEffect is for Synchronization

Only use `useEffect` for synchronizing with external systems.

```typescript
// ✅ Good - synchronizing with external system
useEffect(() => {
  const subscription = eventSource.subscribe(handleEvent);
  return () => subscription.unsubscribe();
}, [eventSource]);

// ✅ Good - DOM manipulation
useEffect(() => {
  const element = ref.current;
  if (!element) return;
  
  const observer = new IntersectionObserver(handleIntersect);
  observer.observe(element);
  return () => observer.disconnect();
}, []);

// ❌ Bad - fetching data (use Suspense + use() in React 19)
useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]);

// ❌ Bad - derived state
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// ❌ Bad - resetting state on prop change
useEffect(() => {
  setSelection(null);
}, [items]);
```

### Custom Hooks

Extract reusable logic into custom hooks. Name them with `use` prefix.

```typescript
// ✅ Good - encapsulated, reusable logic
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage', error);
    }
  }, [key, value]);
  
  return [value, setValue] as const;
}
```

### useMemo and useCallback in 2026

With React 19's compiler, manual memoization is rarely needed. Only use when:
1. Passing callbacks to heavily optimized child components using `memo()`
2. Computing expensive values that would block the UI
3. As a dependency for other hooks

```typescript
// ✅ Often unnecessary in React 19 - compiler handles this
function ProductList({ products }: ProductListProps) {
  const handleSelect = (id: string) => {
    dispatch(selectProduct(id));
  };
  
  return products.map(p => <ProductCard key={p.id} onSelect={handleSelect} />);
}

// ✅ Still useful for genuinely expensive computations
function DataGrid({ rows }: DataGridProps) {
  const sortedRows = useMemo(
    () => complexSort(rows), // O(n log n) operation
    [rows]
  );
  
  return <Grid data={sortedRows} />;
}

// ✅ Still useful with memo'd children
const ExpensiveChild = memo(function ExpensiveChild({ onClick }: Props) {
  // ... expensive render
});

function Parent() {
  const handleClick = useCallback(() => {
    // Stable reference prevents ExpensiveChild re-render
  }, []);
  
  return <ExpensiveChild onClick={handleClick} />;
}
```

---

## State Management

### Follow the Ripe Method

For global state, follow our [Global State Composition](/client-architecture/02-global-state) guidelines:
- One global store
- State-first thinking
- Simple reducers (no logic)
- Actions as application vocabulary

### Local vs Global State

| Use Local State | Use Global State |
|-----------------|------------------|
| Form input values | Authenticated user |
| UI toggles (dropdown open) | Application settings |
| Hover/focus states | Cart contents |
| Animation state | Feature flags |

```typescript
// ✅ Local - UI concern
function Dropdown({ options }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  // ...
}

// ✅ Global - shared across app
// In store
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => { /* ... */ },
  },
});
```

### Server State

For server data, consider React Query/TanStack Query or the `use()` hook with Suspense.

```typescript
// TanStack Query approach
function UserProfile({ userId }: Props) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return <Profile user={user} />;
}
```

---

## Styling

### Recommended: CSS Modules

For performance-critical applications, CSS Modules offer the best runtime performance with zero overhead.

```typescript
// UserCard.module.css
.card {
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

.title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

// UserCard.tsx
import styles from './UserCard.module.css';

function UserCard({ user }: UserCardProps) {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{user.name}</h2>
    </article>
  );
}
```

### Design Tokens

Always use design tokens, never hard-coded values.

```typescript
// ✅ Good - design tokens
const Card = styled.div`
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  border-radius: var(--radius-md);
  
  @media (min-width: var(--breakpoint-md)) {
    padding: var(--spacing-lg);
  }
`;

// ❌ Bad - magic numbers
const Card = styled.div`
  padding: 16px;
  font-size: 14px;
  color: #333;
  border-radius: 8px;
  
  @media (min-width: 768px) {
    padding: 24px;
  }
`;
```

### Styled Components (If Used)

If using styled-components, prefer static styles over dynamic.

```typescript
// ✅ Good - static styles (better performance)
const Button = styled.button`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  
  &.primary {
    background: var(--color-primary);
    color: white;
  }
  
  &.secondary {
    background: transparent;
    border: 1px solid var(--color-primary);
  }
`;

// Usage with className
<Button className={variant}>Click me</Button>

// ❌ Avoid - dynamic styles (slower)
const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  background: ${({ variant }) => 
    variant === 'primary' ? 'var(--color-primary)' : 'transparent'};
`;
```

---

## Performance

### Code Splitting

Split code at route boundaries. Users don't need the entire app upfront.

```typescript
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load route components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

### Image Optimization

```typescript
// ✅ Good - lazy loading, proper sizing
<img
  src={imageSrc}
  alt={description}
  loading="lazy"
  decoding="async"
  width={400}
  height={300}
/>

// For hero images, don't lazy load
<img
  src={heroImage}
  alt="Welcome"
  fetchpriority="high"
  width={1200}
  height={600}
/>
```

### Virtualization for Long Lists

Don't render 1000 items. Use virtualization.

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });
  
  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size,
            }}
          >
            <ItemRow item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Bundle Analysis

Regularly analyze your bundle. Configure Vite to split vendors:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'state': ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
});
```

---

## Testing

### Use Vitest + React Testing Library

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Counter', () => {
  it('increments when button is clicked', async () => {
    // Setup user event
    const user = userEvent.setup();
    
    render(<Counter initialCount={0} />);
    
    // Query by role (accessibility-first)
    const button = screen.getByRole('button', { name: /increment/i });
    const count = screen.getByRole('status');
    
    expect(count).toHaveTextContent('0');
    
    await user.click(button);
    
    expect(count).toHaveTextContent('1');
  });
});
```

### Query Priority

Use queries that reflect how users find elements:

1. **`getByRole`** — Best for accessibility
2. **`getByLabelText`** — Form fields
3. **`getByPlaceholderText`** — Inputs
4. **`getByText`** — Non-interactive elements
5. **`getByTestId`** — Last resort

```typescript
// ✅ Good - queries by role
const submitButton = screen.getByRole('button', { name: /submit/i });
const emailInput = screen.getByRole('textbox', { name: /email/i });
const errorAlert = screen.getByRole('alert');

// ❌ Avoid - test IDs as first choice
const submitButton = screen.getByTestId('submit-button');
```

### userEvent over fireEvent

Always use `userEvent` for realistic interactions.

```typescript
// ✅ Good - realistic user behavior
const user = userEvent.setup();

await user.type(emailInput, 'user@example.com');
await user.click(submitButton);
await user.keyboard('{Enter}');

// ❌ Bad - low-level events
fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
fireEvent.click(submitButton);
```

### One Assertion Per Test

Keep tests focused and easy to debug.

```typescript
// ✅ Good - focused tests
describe('LoginForm', () => {
  it('shows error when email is invalid', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    await user.type(screen.getByLabelText(/email/i), 'invalid');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(screen.getByRole('alert')).toHaveTextContent(/valid email/i);
  });
  
  it('shows error when password is too short', async () => {
    // Separate test for different scenario
  });
});

// ❌ Bad - testing multiple things
it('validates form', async () => {
  // Tests email, password, and submission in one test
  // If it fails, which assertion failed?
});
```

---

## Error Handling

### Error Boundaries

Wrap major sections of your app in error boundaries.

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary FallbackComponent={AppError} onError={logError}>
      <Header />
      <ErrorBoundary FallbackComponent={ContentError}>
        <MainContent />
      </ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  );
}

function ContentError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
```

### Try/Catch for Unsafe Operations

Wrap operations that can throw.

```typescript
// ✅ Good - handled JSON parsing
const parseStoredData = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    captureError(error, { context: 'parseStoredData', key });
    return fallback;
  }
};

// ✅ Good - async error handling
const fetchUser = async (id: string): Promise<User | null> => {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    captureError(error, { context: 'fetchUser', userId: id });
    return null;
  }
};
```

### Meaningful Error Messages

Include context that helps debugging.

```typescript
// ✅ Good - actionable error info
captureError(error, {
  message: 'Failed to process payment',
  context: 'CheckoutPage.handlePayment',
  severity: 'critical',
  metadata: {
    userId: user.id,
    orderId: order.id,
    paymentMethod: selectedMethod,
  },
});

// ❌ Bad - unhelpful
console.error('Error occurred');
```

---

## Accessibility

### Semantic HTML

Use the right element for the job.

```typescript
// ✅ Good - semantic elements
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Content...</p>
  </article>
</main>

<button onClick={handleSubmit}>Submit</button>

// ❌ Bad - div soup
<div className="nav">
  <div onClick={goHome}>Home</div>
</div>

<div className="main">
  <div className="article">
    <div className="title">Article Title</div>
  </div>
</div>

<div className="button" onClick={handleSubmit}>Submit</div>
```

### ARIA When Needed

Only add ARIA when HTML semantics aren't enough.

```typescript
// ✅ Buttons don't need role="button"
<button>Click me</button>

// ✅ ARIA for custom widgets
<div
  role="tablist"
  aria-label="Product information"
>
  <button
    role="tab"
    aria-selected={activeTab === 'details'}
    aria-controls="details-panel"
  >
    Details
  </button>
</div>

// ✅ Live regions for dynamic content
<div role="status" aria-live="polite">
  {message}
</div>
```

### Keyboard Navigation

Ensure everything is keyboard accessible.

```typescript
function Modal({ isOpen, onClose, children }: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  
  // Focus trap and escape key
  useEffect(() => {
    if (!isOpen) return;
    
    closeRef.current?.focus();
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">Modal Title</h2>
      {children}
      <button ref={closeRef} onClick={onClose}>
        Close
      </button>
    </div>
  );
}
```

---

## Comments & Documentation

### Self-Documenting Code First

Good code rarely needs comments. Use clear names and small functions.

```typescript
// ✅ Self-documenting - no comment needed
const isEligibleForDiscount = (user: User) =>
  user.membershipTier === 'premium' && user.purchaseCount > 10;

// ❌ Comment compensating for bad naming
// Check if user can get discount
const check = (u: User) =>
  u.tier === 'p' && u.count > 10;
```

### Comment the "Why", Not the "What"

```typescript
// ✅ Good - explains non-obvious business logic
// Users who joined before 2020 are grandfathered into the old pricing tier
// per agreement with legal (see JIRA-1234)
if (user.joinDate < LEGACY_CUTOFF_DATE) {
  return applyLegacyPricing(order);
}

// ❌ Bad - obvious from code
// Check if user join date is before cutoff
if (user.joinDate < LEGACY_CUTOFF_DATE) {
  return applyLegacyPricing(order);
}
```

### JSDoc for Public APIs

Document exported functions and components.

```typescript
/**
 * Formats a price for display with currency symbol and locale.
 * 
 * @param amount - Price in cents
 * @param currency - ISO 4217 currency code
 * @param locale - BCP 47 locale string
 * @returns Formatted price string (e.g., "$12.99")
 * 
 * @example
 * formatPrice(1299, 'USD', 'en-US') // "$12.99"
 * formatPrice(1299, 'EUR', 'de-DE') // "12,99 €"
 */
export const formatPrice = (
  amount: number,
  currency: string,
  locale: string
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount / 100);
};
```

---

## Summary

This guide reflects modern React development in 2026:

- **TypeScript**: Strict mode, `unknown` over `any`, Zod for runtime validation
- **React 19**: Compiler handles memoization, `use()` for data, minimal `useEffect`
- **Components**: Function declarations, composition, small and focused
- **Testing**: Vitest, userEvent, accessibility-first queries
- **Performance**: Code splitting, virtualization, CSS Modules
- **Accessibility**: Semantic HTML, keyboard navigation, ARIA when needed

When in doubt, optimize for **readability** and **maintainability**. Future developers (including yourself) will thank you.

---

**Related docs:**
- [The Elements](/client-architecture/01-elements)
- [Global State](/client-architecture/02-global-state)
- [Functional Layers](/client-architecture/05-functional-layers)
- [Quick Reference](/client-architecture/06-quick-reference)
