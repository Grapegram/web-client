# Guidelines for LLM Agents Working on This Codebase

## Project Overview

This is a **Vue 3 + TypeScript + Vite** project following **Feature-Sliced Design (FSD)** architecture methodology. The project uses:

- **Vue 3** with Composition API (`<script setup>`)
- **Pinia** for state management
- **Pinia Colada** for data fetching and query management
- **pinia-plugin-persistedstate** for state persistence
- **shadcn-vue** UI components (based on Reka UI)
- **Tailwind CSS v4** for styling
- **Vue Router** for routing

---

## Architecture: Feature-Sliced Design (FSD)

### Core Principles

Feature-Sliced Design is an architectural methodology that provides rules for organizing code to enhance understandability and maintainability. Follow these principles strictly:

#### 1. **Layer Hierarchy** (Import Rule)

```
app > pages > widgets > features > entities > shared
```

**Critical Rule**: Modules in a higher layer can ONLY import from layers below them. Never import upward.

```typescript
// ✅ CORRECT: Feature importing from entity and shared
import { useUserStore } from 'entities/user';
// ❌ WRONG: Entity importing from feature
import { loginMutation } from 'features/auth';
import { api } from 'shared/api';

// NEVER DO THIS
```

#### 2. **Layer Definitions**

- **`app/`** - Application initialization, global providers, routing, store setup

  - `entrypoints/` - Entry points like `App.vue`, `main.ts`
  - `router/` - Router configuration
  - `store/` - Pinia instance setup
  - `styles/` - Global styles

- **`pages/`** - Page-level components (route targets)

  - Each page is a slice named after the route
  - Contains: `ui/`, `api/`, `model/` segments
  - Public API: exports page component, loaders, metadata

- **`widgets/`** - Composite UI blocks combining features/entities

  - Self-contained UI sections (header, sidebar, chat-list)
  - Can import from `features` and `entities`
  - Contains: `ui/`, `model/` segments

- **`features/`** - User-facing functionality and business logic

  - Examples: auth, create-chat, message-input
  - Each feature is a slice with: `ui/`, `api/`, `lib/`, `model/` segments
  - Should be reusable across different pages

- **`entities/`** - Business domain models and logic

  - Examples: user, chat, message
  - Contains: `model/`, `api/`, `ui/` segments
  - Defines data structures, stores, and entity-specific components

- **`shared/`** - Reusable infrastructure code with NO business logic
  - `ui/` - Generic UI components (from shadcn-vue)
  - `api/` - API client configuration
  - `lib/` - Utility functions, helpers
  - `assets/` - Static assets
  - `icons/` - Icon components

#### 3. **Slice Structure**

Each slice (in layers that support slices) must have:

```
features/auth/
├── index.ts          # Public API (REQUIRED)
├── ui/               # UI components
│   ├── LoginForm.vue
│   └── SignupForm.vue
├── api/              # API requests
│   └── auth.api.ts
├── model/            # State, stores, types
│   ├── auth.types.ts
│   └── login.mutation.ts
└── lib/              # Internal utilities
    └── validation.schema.ts
```

#### 4. **Public API Pattern**

**Every slice MUST define a Public API** through `index.ts`:

```typescript
// features/auth/index.ts
export { LoginForm, SignupForm } from './ui';
export { useLoginMutation } from './model';
export type { LoginCredentials } from './model';
```

**Critical**: External code must ONLY import from the Public API:

```typescript
// ✅ CORRECT
import { LoginForm } from 'features/auth'

// ❌ WRONG
import { LoginForm } from 'features/auth/ui/LoginForm.vue'
```

#### 5. **Segments**

Standard segments for organizing code by technical purpose:

- **`ui/`** - Vue components, formatters, styles
- **`api/`** - API requests, data fetching functions
- **`model/`** - Pinia stores, types, business logic, query/mutation definitions
- **lib/`** - Slice-internal utilities
- **`config/`** - Configuration, feature flags

#### 6. **Cross-Slice References (@x notation)**

For entities that reference each other (same layer):

```typescript
// entities/artist/model/artist.types.ts
import type { Song } from 'entities/song/@x/artist';

export interface Artist {
  name: string;
  songs: Array<Song>;
}
```

```typescript
// entities/song/@x/artist.ts
export type { Song } from '../model/song.ts';
```

---

## Vue 3 Best Practices

### 1. **Always Use Composition API with `<script setup>`**

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Button } from '@/shared/ui/button';

// Props
interface Props {
  title: string;
  count?: number;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  update: [value: number];
  delete: [];
}>();

// Reactive state
const localCount = ref(props.count ?? 0);

// Computed
const doubleCount = computed(() => localCount.value * 2);

// Methods
function increment() {
  localCount.value++;
  emit('update', localCount.value);
}

// Lifecycle
onMounted(() => {
  console.log('Component mounted');
});
</script>

<template>
  <div>
    <h2>{{ title }}</h2>
    <p>Count: {{ localCount }} (Double: {{ doubleCount }})</p>
    <Button @click="increment">Increment</Button>
  </div>
</template>
```

### 2. **TypeScript Integration**

Always use `lang="ts"` and type your props/emits:

```vue
<script setup lang="ts">
// Type-based props declaration
interface Props {
  user: {
    id: string;
    name: string;
    email: string;
  };
  isActive?: boolean;
}

const props = defineProps<Props>();

// Type-based emits
const emit = defineEmits<{
  'update:user': [user: Props['user']];
  close: [];
}>();
</script>
```

### 3. **Component Organization**

```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'entities/user'

// 2. Props & Emits
const props = defineProps<{...}>()
const emit = defineEmits<{...}>()

// 3. Composables & Stores
const router = useRouter()
const userStore = useUserStore()

// 4. Reactive State
const count = ref(0)

// 5. Computed Properties
const doubled = computed(() => count.value * 2)

// 6. Methods
function handleClick() {
  // ...
}

// 7. Lifecycle Hooks
onMounted(() => {
  // ...
})

// 8. Watchers
watch(() => props.value, (newVal) => {
  // ...
})
</script>
```

### 4. **Template Refs**

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue';

const inputRef = ref<HTMLInputElement>();

onMounted(() => {
  inputRef.value?.focus();
});
</script>

<template>
  <input ref="inputRef" type="text" />
</template>
```

---

## Pinia State Management

### 1. **Store Location and Naming**

- Define stores in the appropriate FSD layer:
  - **Entities**: `entities/{entity}/model/{entity}.store.ts`
  - **Features**: `features/{feature}/model/{feature}.store.ts`
  - **App**: `app/store/` (for global app state only)

### 2. **Setup Stores (Composition API Style)**

**Always use Setup Stores** with Composition API:

```typescript
// entities/user/model/user.store.ts
import { computed, ref } from 'vue';

import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  // State (use ref for primitives, reactive for objects)
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);

  // Getters (use computed)
  const fullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : 'Guest'
  );

  // Actions (regular functions)
  async function login(credentials: LoginCredentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      user.value = response.data.user;
      isAuthenticated.value = true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  function logout() {
    user.value = null;
    isAuthenticated.value = false;
  }

  // Return public API
  return {
    // State
    user,
    isAuthenticated,
    // Getters
    fullName,
    // Actions
    login,
    logout
  };
});
```

### 3. **Using Stores in Components**

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { useUserStore } from 'entities/user';

const userStore = useUserStore();

// Extract reactive state with storeToRefs
const { user, isAuthenticated, fullName } = storeToRefs(userStore);

// Actions are destructured directly
const { login, logout } = userStore;
</script>

<template>
  <div v-if="isAuthenticated">
    <p>Welcome, {{ fullName }}!</p>
    <button @click="logout">Logout</button>
  </div>
</template>
```

### 4. **Composing Stores**

```typescript
// features/checkout/model/checkout.store.ts
import { computed } from 'vue';

import { defineStore } from 'pinia';

import { useCartStore } from 'entities/cart';
import { useUserStore } from 'entities/user';

export const useCheckoutStore = defineStore('checkout', () => {
  const userStore = useUserStore();
  const cartStore = useCartStore();

  const canCheckout = computed(
    () => userStore.isAuthenticated && cartStore.itemCount > 0
  );

  async function processCheckout() {
    if (!canCheckout.value) {
      throw new Error('Cannot checkout');
    }

    const orderData = {
      userId: userStore.user?.id,
      items: cartStore.items,
      total: cartStore.total
    };

    // Process checkout...
  }

  return {
    canCheckout,
    processCheckout
  };
});
```

### 5. **Type Safety**

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const preferences = ref<UserState['preferences']>({
    theme: 'light',
    notifications: true
  });

  return { user, preferences };
});
```

---

## Pinia Plugin PersistedState

### 1. **Enable Persistence**

```typescript
// entities/user/model/user.store.ts
import { ref } from 'vue';

import { defineStore } from 'pinia';

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);

    return { user, token };
  },
  {
    persist: true // Enable with defaults
  }
);
```

### 2. **Custom Configuration**

```typescript
export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);
    const tempData = ref<string>('');

    return { user, token, tempData };
  },
  {
    persist: {
      key: 'grapegram-user', // Custom storage key
      storage: localStorage, // or sessionStorage
      pick: ['user', 'token'] // Only persist these
      // Alternative: omit: ['tempData'] // Don't persist these
    }
  }
);
```

### 3. **Multiple Storage Targets**

```typescript
export const useAppStore = defineStore(
  'app',
  () => {
    const userPreferences = ref({});
    const sessionData = ref({});
    const temporaryState = ref({});

    return { userPreferences, sessionData, temporaryState };
  },
  {
    persist: [
      {
        key: 'app-preferences',
        storage: localStorage,
        pick: ['userPreferences']
      },
      {
        key: 'app-session',
        storage: sessionStorage,
        pick: ['sessionData']
      }
      // temporaryState is not persisted
    ]
  }
);
```

### 4. **Lifecycle Hooks**

```typescript
export const useDataStore = defineStore(
  'data',
  () => {
    const data = ref([]);

    return { data };
  },
  {
    persist: {
      beforeHydrate: ctx => {
        console.log('About to hydrate:', ctx.store.$id);
      },
      afterHydrate: ctx => {
        console.log('Hydrated:', ctx.store.$id);
        // Perform post-hydration logic
      }
    }
  }
);
```

---

## Pinia Colada (Data Fetching)

### 1. **Setup in App Layer**

```typescript
// app/entrypoints/main.ts
import { createPinia } from 'pinia';

import { PiniaColada } from '@pinia/colada';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(PiniaColada);
```

### 2. **Queries (Data Fetching)**

Define queries in `model/` segment:

```typescript
// entities/user/model/users.query.ts
import { useQuery } from '@pinia/colada';

import { getUsers } from '../api/users.api';

export function useUsersQuery() {
  return useQuery({
    key: ['users', 'list'],
    query: () => getUsers(),
    staleTime: 60000 // 1 minute
  });
}
```

Use in components:

```vue
<script setup lang="ts">
import { useUsersQuery } from 'entities/user';

const { data: users, isPending, error, refetch } = useUsersQuery();
</script>

<template>
  <div>
    <div v-if="isPending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <ul v-else>
      <li v-for="user in users" :key="user.id">{{ user.name }}</li>
    </ul>
  </div>
</template>
```

### 3. **Mutations (Data Updates)**

```typescript
// features/auth/model/login.mutation.ts
import { useMutation, useQueryCache } from '@pinia/colada';

import { login } from '../api/auth.api';

export function useLoginMutation() {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (credentials: LoginCredentials) => login(credentials),
    onSuccess: data => {
      // Invalidate user queries to refetch
      queryCache.invalidateQueries({ key: ['user'] });
    },
    onError: error => {
      console.error('Login failed:', error);
    }
  });
}
```

Use in components:

```vue
<script setup lang="ts">
import { useLoginMutation } from 'features/auth';

const { mutate: loginMutate, isPending, error } = useLoginMutation();

async function handleLogin() {
  try {
    await loginMutate({ email: '...', password: '...' });
    // Success handling
  } catch (err) {
    // Error already handled in mutation
  }
}
</script>
```

### 4. **Optimistic Updates**

```typescript
export function useUpdateTodoMutation() {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (todo: Todo) => updateTodo(todo),
    onMutate: newTodo => {
      // Save previous state
      const previousTodos = queryCache.getQueryData(['todos']);

      // Optimistically update
      queryCache.setQueryData(['todos'], (old: Todo[] = []) =>
        old.map(t => (t.id === newTodo.id ? newTodo : t))
      );

      return { previousTodos };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryCache.setQueryData(['todos'], context.previousTodos);
      }
    },
    onSettled: () => {
      // Refetch to ensure correctness
      queryCache.invalidateQueries({ key: ['todos'] });
    }
  });
}
```

### 5. **Query Invalidation**

```typescript
import { useQueryCache } from '@pinia/colada';

const queryCache = useQueryCache();

// Invalidate specific query
queryCache.invalidateQueries({ key: ['users', userId], exact: true });

// Invalidate all queries matching prefix
queryCache.invalidateQueries({ key: ['users'] });

// Refetch all active queries
queryCache.invalidateQueries();
```

---

## shadcn-vue UI Components

### 1. **Installation**

Components are installed via CLI:

```bash
pnpm dlx shadcn-vue@latest add button
pnpm dlx shadcn-vue@latest add input
pnpm dlx shadcn-vue@latest add dialog
```

### 2. **Component Location**

All shadcn-vue components go in `shared/ui/`:

```
shared/ui/
├── button/
│   ├── Button.vue
│   └── index.ts
├── input/
│   ├── Input.vue
│   └── index.ts
└── dialog/
    ├── Dialog.vue
    ├── DialogContent.vue
    ├── DialogHeader.vue
    └── index.ts
```

### 3. **Usage in Features/Pages**

```vue
<script setup lang="ts">
import { ref } from 'vue';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';

const isOpen = ref(false);
const email = ref('');
</script>

<template>
  <div>
    <Button @click="isOpen = true">Open Dialog</Button>

    <Dialog v-model:open="isOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Email</DialogTitle>
        </DialogHeader>
        <Input v-model="email" type="email" placeholder="email@example.com" />
      </DialogContent>
    </Dialog>
  </div>
</template>
```

### 4. **Creating Custom Components**

When creating custom UI components, distinguish between:

- **Shared UI** (`shared/ui/`) - Generic, reusable, no business logic
- **Feature UI** (`features/{feature}/ui/`) - Feature-specific, contains business logic
- **Entity UI** (`entities/{entity}/ui/`) - Entity-specific components

```vue
<!-- shared/ui/logo/Logo.vue -->
<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
});
</script>

<template>
  <div :class="cn('logo', `logo-${size}`)">
    <img src="@/shared/assets/logo.svg" alt="Logo" />
  </div>
</template>
```

---

## Tailwind CSS v4 Best Practices

### 1. **Utility-First Approach**

Use utility classes directly in templates:

```vue
<template>
  <div class="flex items-center gap-4 rounded-lg bg-white p-6 shadow-lg">
    <img class="size-12 rounded-full" :src="user.avatar" />
    <div class="flex flex-col">
      <h3 class="text-lg font-semibold text-gray-900">{{ user.name }}</h3>
      <p class="text-sm text-gray-500">{{ user.email }}</p>
    </div>
  </div>
</template>
```

### 2. **Responsive Design**

```vue
<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card v-for="item in items" :key="item.id">
      <!-- content -->
    </Card>
  </div>
</template>
```

### 3. **State Variants**

```vue
<template>
  <Button
    class="bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
    :disabled="isPending"
  >
    {{ isPending ? 'Loading...' : 'Submit' }}
  </Button>
</template>
```

### 4. **Custom Theme Configuration**

Customize in `app/styles/main.css`:

```css
@import 'tailwindcss';

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --radius-base: 0.5rem;
}
```

### 5. **Conditional Classes**

Use `cn()` helper from shadcn-vue:

```vue
<script setup lang="ts">
import { cn } from '@/shared/lib/utils';

interface Props {
  variant?: 'default' | 'primary' | 'danger';
  isActive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  isActive: false
});
</script>

<template>
  <div
    :class="
      cn('rounded-lg p-4', {
        'bg-gray-100': variant === 'default',
        'bg-blue-500 text-white': variant === 'primary',
        'bg-red-500 text-white': variant === 'danger',
        'ring-2 ring-blue-300': isActive
      })
    "
  >
    <slot />
  </div>
</template>
```

---

## File Naming Conventions

### 1. **Vue Components**

- **PascalCase** for components: `LoginForm.vue`, `UserAvatar.vue`
- **kebab-case** for folders: `user-avatar/`, `create-chat/`

### 2. **TypeScript Files**

- **kebab-case** for files: `auth.api.ts`, `user.types.ts`, `login.mutation.ts`
- **PascalCase** for type/interface files if preferred: `User.types.ts`

### 3. **Index Files**

Every slice must have `index.ts` for Public API:

```typescript
// features/auth/index.ts
export { LoginForm, SignupForm } from './ui';
export { useLoginMutation, useRegisterMutation } from './model';
export type { LoginCredentials, RegisterData } from './model';
```

---

## Import Aliases

Configure in `vite.config.ts` and use consistently:

```typescript
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      app: path.resolve(__dirname, './src/app'),
      pages: path.resolve(__dirname, './src/pages'),
      widgets: path.resolve(__dirname, './src/widgets'),
      features: path.resolve(__dirname, './src/features'),
      entities: path.resolve(__dirname, './src/entities'),
      shared: path.resolve(__dirname, './src/shared')
    }
  }
});
```

Usage:

```typescript
// ✅ Use layer aliases
import { useUserStore } from 'entities/user'
import { LoginForm } from 'features/auth'
import { Button } from '@/shared/ui/button'

// ❌ Don't use relative imports across layers
import { useUserStore } from '../../../entities/user'
```

---

## Testing Conventions

### 1. **Test File Location**

Co-locate tests with source files:

```
features/auth/
├── ui/
│   ├── LoginForm.vue
│   └── LoginForm.test.ts
├── model/
│   ├── login.mutation.ts
│   └── login.mutation.test.ts
└── api/
    ├── auth.api.ts
    └── auth.api.test.ts
```

### 2. **Naming**

- Test files: `{name}.test.ts` or `{name}.spec.ts`
- Use `describe` blocks for grouping
- Use descriptive test names

---

## Common Patterns

### 1. **Creating a New Feature**

```bash
# Create folder structure
mkdir -p src/features/my-feature/{ui,api,model,lib}

# Create public API
touch src/features/my-feature/index.ts

# Create components
touch src/features/my-feature/ui/MyComponent.vue

# Create types
touch src/features/my-feature/model/my-feature.types.ts

# Create API
touch src/features/my-feature/api/my-feature.api.ts
```

### 2. **Creating a New Entity**

```bash
mkdir -p src/entities/my-entity/{ui,api,model}
touch src/entities/my-entity/index.ts
touch src/entities/my-entity/model/my-entity.store.ts
touch src/entities/my-entity/model/my-entity.types.ts
```

### 3. **Creating a New Page**

```bash
mkdir -p src/pages/my-page/{ui,api}
touch src/pages/my-page/index.ts
touch src/pages/my-page/ui/MyPage.vue

# Update router
# Add route in app/router/index.ts
```

---

## Code Quality Rules

### 1. **TypeScript**

- Always use TypeScript
- Avoid `any` type
- Define interfaces for all data structures
- Use type inference where possible

### 2. **Vue**

- Use `<script setup lang="ts">`
- Define props with TypeScript interfaces
- Type emits
- Use composables for reusable logic

### 3. **Pinia**

- Use Setup Stores (Composition API style)
- Keep stores focused and single-responsibility
- Define clear action names
- Type all store properties

### 4. **Components**

- Keep components focused (Single Responsibility)
- Extract reusable logic to composables
- Prefer composition over inheritance
- Use props for data down, emits for events up

### 5. **API Calls**

- Centralize API calls in `api/` segments
- Use Pinia Colada for data fetching
- Handle errors gracefully
- Type API responses

---

## Migration Checklist for New Code

When adding new functionality, ensure:

- [ ] Correct FSD layer selected
- [ ] Proper folder structure (`ui/`, `api/`, `model/`, `lib/`)
- [ ] Public API defined in `index.ts`
- [ ] TypeScript types defined
- [ ] Imports follow layer hierarchy rules
- [ ] Components use Composition API with `<script setup>`
- [ ] State management uses Pinia Setup Stores
- [ ] Data fetching uses Pinia Colada
- [ ] Persistence configured if needed (pinia-plugin-persistedstate)
- [ ] UI components from shadcn-vue when applicable
- [ ] Tailwind CSS for styling
- [ ] Proper naming conventions followed

---

## Anti-Patterns to Avoid

### ❌ Don't Do This

```typescript
// Importing from internal structure
import { LoginForm } from 'features/auth/ui/LoginForm.vue'

// Upward imports (violates FSD layer rule)
import { SomeFeature } from 'features/something' // in an entity

// Mixed API styles
export default defineComponent({...}) // in a <script setup> context

// Mutating props directly
props.value.count++ // Never mutate props

// Direct localStorage usage
localStorage.setItem('user', JSON.stringify(user)) // Use pinia-plugin-persistedstate

// Business logic in shared
// shared/lib/calculateUserDiscount.ts // Business logic doesn't belong in shared

// Options API
export default {
  data() { return { count: 0 } }
}
```

### ✅ Do This Instead

```typescript
// Import from Public API
import { LoginForm } from 'features/auth'

// Follow layer hierarchy
import { User } from 'entities/user' // in a feature

// Use Composition API
<script setup lang="ts">
const count = ref(0)
</script>

// Emit events for prop updates
const emit = defineEmits<{ 'update:count': [number] }>()
emit('update:count', newCount)

// Use pinia-plugin-persistedstate
defineStore('user', () => {...}, { persist: true })

// Place business logic in appropriate layer (features/entities)

// Use Composition API with <script setup>
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>
```

---

## Questions to Ask Before Coding

1. **Which FSD layer does this belong to?**

   - Is it app initialization? → `app/`
   - Is it a route/page? → `pages/`
   - Is it a composite UI block? → `widgets/`
   - Is it user-facing functionality? → `features/`
   - Is it a business entity? → `entities/`
   - Is it generic infrastructure? → `shared/`

2. **What segments do I need?**

   - UI components? → `ui/`
   - API calls? → `api/`
   - State/types? → `model/`
   - Utilities? → `lib/`

3. **What should be exported in the Public API?**

   - Components, composables, types that other layers need

4. **Am I following the import rules?**

   - Only importing from lower layers?
   - Using Public API imports?

5. **Is this state management correct?**

   - Using Pinia Setup Store?
   - Should it be persisted?
   - Do I need Pinia Colada for data fetching?

6. **Are my types defined?**
   - Props, emits, store state, API responses?

---

## Summary

- **Architecture**: Feature-Sliced Design with strict layer hierarchy
- **Framework**: Vue 3 + Composition API (`<script setup lang="ts">`)
- **State**: Pinia Setup Stores + pinia-plugin-persistedstate
- **Data Fetching**: Pinia Colada queries and mutations
- **UI**: shadcn-vue components in `shared/ui/`
- **Styling**: Tailwind CSS v4 utility classes
- **Types**: TypeScript everywhere
- **Imports**: Use Public APIs and layer aliases

Always follow FSD principles, use Composition API, type everything, and leverage the provided libraries according to their best practices.
