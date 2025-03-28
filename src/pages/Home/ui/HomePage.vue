<script setup lang="ts">
import ResizableSidebarLayout, {
  Percentage,
  Px
} from './ResizableSidebarLayout.vue';
import Sidebar from './Sidebar.vue';
import Message, { type MessageVariants } from './Message.vue';
import MessageGroup from './MessageGroup.vue';
import { ref } from 'vue';
import { DateTime } from 'luxon';
import { computed } from 'vue';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { onMounted } from 'vue';

type Message = {
  id: string;
  author: string;
  text: string;
  time: DateTime;
};

const messages = ref<Message[]>([
  {
    id: '0',
    author: '0',
    text: 'message 1 looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooonglooooooonglooooooonglooooooonglooooooonlooooooong looooooong looooooong',
    time: DateTime.fromISO('2023-04-15T14:30:00')
  },
  {
    id: '1',
    author: '1',
    text: 'message 2',
    time: DateTime.fromISO('2023-04-15T14:30:00')
  },
  {
    id: '2',
    author: '1',
    text: 'message 3',
    time: DateTime.fromISO('2023-04-15T14:30:00')
  },
  {
    id: '3',
    author: '1',
    text: 'message 4',
    time: DateTime.fromISO('2023-04-15T14:30:00')
  },
  {
    id: '4',
    author: '0',
    text: 'message 5',
    time: DateTime.fromISO('2023-04-15T14:30:00')
  },
  {
    id: '5',
    author: '1',
    text: 'message 6',
    time: DateTime.fromISO('2023-04-15T14:30:00')
  },
  {
    id: '6',
    author: '1',
    text: 'message 7',
    time: DateTime.fromISO('2023-04-15T14:40:00')
  }
]);

onMounted(() => {
  for (let i = 0; i != 100; i++) {
    messages.value.push({
      id: '10' + i,
      author: '1',
      text: 'message l ' + i,
      time: DateTime.fromISO('2023-04-15T14:40:00')
    });
  }
});

type MessageGroup = {
  id: string;
  author: string;
  messages: Message[];
};
const messagesGroups = computed<MessageGroup[]>(() => {
  const createMsgGroup = (author: string): MessageGroup => ({
    author: author,
    id: '',
    messages: []
  });
  const computeId = (group: MessageGroup): string => {
    return group.messages.reduce((acc, m) => acc + `|${m.id}|`, '');
  };
  return messages.value.reduce(
    (acc: MessageGroup[], msg: Message): MessageGroup[] => {
      const currentGroup = acc.at(-1);
      const prev = currentGroup?.messages.at(-1);
      if (
        prev &&
        msg.author === prev.author &&
        msg.time.diff(prev?.time, 'minute').minutes < 10
      ) {
        currentGroup?.messages.push(msg);
      } else {
        if (currentGroup) {
          currentGroup.id = computeId(currentGroup);
        }
        const group = createMsgGroup(msg.author);
        group.messages.push(msg);
        acc.push(group);
      }
      return acc;
    },
    [] as MessageGroup[]
  );
});

function messageVariantByIdAndLength(
  i: number,
  length: number
): MessageVariants {
  if (length === 1) return 'standalone';
  if (i === 0) return 'first';
  if (i === length - 1) return 'last';
  return 'middle';
}
</script>

<template>
  <div class="h-dvh w-dvw">
    <ResizableSidebarLayout
      :collapsed-size="Px(106)"
      :min-size="Px(350)"
      :max-size="Percentage(35)"
      sidebar-class="flex flex-col"
      auto-save-id="main"
    >
      <template #sidebar>
        <Sidebar />
      </template>
      <template #content>
        <div class="flex h-full flex-col">
          <header class="h-header border-b">somting in head</header>
          <ScrollArea class="w-full grow p-5">
            <div class="flex h-full flex-col items-start justify-end gap-2">
              <MessageGroup
                v-for="messageGroup in messagesGroups"
                :key="messageGroup.id"
                :user="messageGroup.author"
                :side="messageGroup.author === '0' ? 'left' : 'right'"
              >
                <Message
                  v-for="(message, i) in messageGroup.messages"
                  :key="message.id"
                  :variant="
                    messageVariantByIdAndLength(i, messageGroup.messages.length)
                  "
                  :text="message.text"
                  :time="message.time"
                />
              </MessageGroup>
            </div>
          </ScrollArea>
        </div>
      </template>
    </ResizableSidebarLayout>
  </div>
</template>
