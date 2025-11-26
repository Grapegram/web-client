# UsersList Widget

A reusable widget component for displaying and selecting users with search functionality.

## Features

- 📋 Display all users from the user store
- 🔍 Real-time search by username, display name, or email
- ✅ Single or multi-select mode
- 🎨 Visual feedback with accent-colored border on selection
- 👤 User avatars with color fallbacks
- ✨ Verified user badges
- 📱 Responsive and scrollable list

## Usage

### Basic Usage

```vue
<script setup lang="ts">
import { UsersList } from '@/widgets/users-list';
</script>

<template>
  <UsersList />
</template>
```

### With Selection (Single Select)

```vue
<script setup lang="ts">
import { ref } from 'vue';

import { UsersList } from '@/widgets/users-list';

const selectedUserIds = ref<string[]>([]);

const handleSelectUser = (userId: string) => {
  console.log('User selected:', userId);
};
</script>

<template>
  <UsersList
    v-model:selected-user-ids="selectedUserIds"
    selectable
    @select-user="handleSelectUser"
  />
</template>
```

### With Multi-Select

```vue
<script setup lang="ts">
import { ref } from 'vue';

import { UsersList } from '@/widgets/users-list';

const selectedUserIds = ref<string[]>([]);

const handleSelectUser = (userId: string) => {
  console.log('User clicked:', userId);
};
</script>

<template>
  <UsersList
    v-model:selected-user-ids="selectedUserIds"
    selectable
    multi-select
    @select-user="handleSelectUser"
  />
</template>
```

### With Add User Button

```vue
<script setup lang="ts">
import { UsersList } from '@/widgets/users-list';

const handleAddUser = () => {
  console.log('Add user clicked');
  // Open a dialog or navigate to add user page
};
</script>

<template>
  <UsersList show-add-button @add-user="handleAddUser" />
</template>
```

### In a Dialog (Like ChatHeader)

```vue
<script setup lang="ts">
import { ref } from 'vue';

import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { UsersList } from '@/widgets/users-list';

const isOpen = ref(false);
const selectedUserIds = ref<string[]>([]);

const handleAddUsers = () => {
  console.log('Adding users:', selectedUserIds.value);
  isOpen.value = false;
};
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="max-h-[80vh]">
      <div class="h-[400px]">
        <UsersList
          v-model:selected-user-ids="selectedUserIds"
          selectable
          multi-select
        />
      </div>
    </DialogContent>
  </Dialog>
</template>
```

## Props

| Prop              | Type       | Default     | Description                                           |
| ----------------- | ---------- | ----------- | ----------------------------------------------------- |
| `class`           | `string`   | `undefined` | Additional CSS classes                                |
| `showAddButton`   | `boolean`  | `false`     | Show the "Add User" button in header                  |
| `selectable`      | `boolean`  | `false`     | Enable user selection                                 |
| `multiSelect`     | `boolean`  | `false`     | Allow multiple user selection (requires `selectable`) |
| `selectedUserIds` | `string[]` | `[]`        | Array of selected user IDs (use with v-model)         |

## Events

| Event                    | Payload             | Description                                    |
| ------------------------ | ------------------- | ---------------------------------------------- |
| `selectUser`             | `userId: string`    | Emitted when a user is clicked (if selectable) |
| `addUser`                | none                | Emitted when the add user button is clicked    |
| `update:selectedUserIds` | `userIds: string[]` | Emitted when selection changes (for v-model)   |

## Visual Feedback

### Selected State

When a user is selected:

- The avatar gets a 2px accent-colored ring with offset
- The background becomes slightly highlighted with `bg-accent/50`
- Selection state persists during search filtering

### Hover State

- Rows highlight with `bg-accent` on hover
- Cursor changes to pointer when `selectable` is true

## Search Functionality

The search bar filters users in real-time by:

- Username (e.g., `@john_doe`)
- Display name (e.g., `John Doe`)
- Email address (e.g., `john.doe@example.com`)

Search is case-insensitive and shows "No users match your search" when no results are found.

## User Display

Each user item shows:

- **Avatar**: Color-generated fallback with user initials
- **Display Name**: Primary name shown in bold
- **Username**: Shown with @ prefix in muted text
- **Bio**: Optional user bio in smaller text
- **Verified Badge**: Shows "Verified" badge for verified users

## Dependencies

- `@/entities/user` - User store for data
- `@/features/user-avatar-display` - UserAvatar component
- `@grapegram/ui-kit` - Input component
- `lucide-vue-next` - Icons (Search, UserPlus)
- `@/shared/ui/button` - Button component
- `@/shared/ui/scroll-area` - ScrollArea component

## Store Integration

The component automatically integrates with the user store:

```ts
import { useUserStore } from '@/entities/user';

const userStore = useUserStore();

// Component uses:
// - userStore.allUsers - Get all users
// - userStore.searchUsers(query) - Filter users by query
```

## Loading Mock Data

For testing/development, use the mock data composable:

```ts
import { useMockData } from '@/shared/lib/mock';

// In your component
useMockData(); // Loads 10 mock users automatically
```

## Styling

The component uses Tailwind CSS classes and follows the project's design system:

- Accent colors for selection
- Muted colors for secondary text
- Card backgrounds
- Responsive spacing and gaps

## Example: Complete Implementation

See `src/pages/Home/ui/ChatHeader.vue` for a complete example of using UsersList in a dialog to add users to a chat.
