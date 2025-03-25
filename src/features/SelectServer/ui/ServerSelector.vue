<script setup lang="ts">
import {
  Combobox,
  ComboboxAnchor,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger
} from '@shared/ui/combobox';
import { FormControl } from '@shared/ui/form';
import { useArrayFilter } from '@vueuse/core';
import { Check, ChevronDown } from 'lucide-vue-next';
import { computed } from 'vue';
import { ref } from 'vue';

type ServerInfo = {
  label: string;
  value: string;
};

const servers = ref<ServerInfo[]>([
  { label: 'grapegram.com', value: 'https://grapegram.com' },
  { label: 'localhost:3030', value: 'http://localhost:3030' }
]);

const value = ref('');
const isOpenWithButton = ref(false);
const serverSuggestionsList = useArrayFilter(servers, server =>
  server.label.startsWith(value.value)
);

const serversList = computed<ServerInfo[]>(() => {
  return isOpenWithButton.value ? servers.value : serverSuggestionsList.value;
});
const open = ref(false);
const inputRef = ref<InstanceType<typeof ComboboxInput>>();

function handleChange(_e: InputEvent) {
  isOpenWithButton.value = false;
}

function handleSelect(e: CustomEvent) {
  const input = inputRef.value?.$el as HTMLInputElement;
  if (!input) return;

  const selectedValue = e.detail.value;
  if (!selectedValue) return;
  value.value = (selectedValue as ServerInfo).value;
  open.value = false;

  // prevent setting `ComboobxInput`
  e.preventDefault();
}
</script>

<template>
  <Combobox v-model:open="open">
    <FormControl>
      <ComboboxAnchor class="w-full">
        <div class="relative w-full items-center">
          <ComboboxInput
            placeholder="Server"
            ref="inputRef"
            v-model="value"
            @input="handleChange"
            @pointerdown="open = false"
            @keydown.enter="
              (ev: KeyboardEvent) => {
                if (open) ev.preventDefault();
              }
            "
            @keydown.left.right="open = false"
          />
          <ComboboxTrigger
            class="absolute inset-y-0 end-0 flex items-center justify-center px-3"
          >
            <ChevronDown class="text-muted-foreground size-4" />
          </ComboboxTrigger>
        </div>
      </ComboboxAnchor>
    </FormControl>

    <ComboboxList v-if="serversList.length">
      <ComboboxGroup>
        <ComboboxItem
          v-for="server in serversList"
          :key="server.value"
          :value="server"
          @select="handleSelect"
        >
          {{ server.label }}
          <ComboboxItemIndicator>
            <Check class="ml-auto h-4 w-4" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
