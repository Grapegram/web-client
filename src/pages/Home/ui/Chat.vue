<script lang="ts"></script>

<script setup lang="ts">
import Message, { type MessageVariants } from './Message.vue';
import MessageGroup from './MessageGroup.vue';
import { onMounted, ref } from 'vue';
import { DateTime } from 'luxon';
import { computed } from 'vue';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { useTemplateRef } from 'vue';
import { watch } from 'vue';

type Message = {
  id: string;
  author: string;
  text: string;
  time: DateTime;
};
type MessageGroup = {
  id: string;
  author: string;
  messages: Message[];
};

const currentUserId = ref('1');
const isScrolled = ref(true);
const scrollArea = useTemplateRef('scroll-area');

const messages = ref<Message[]>([
  {
    id: '0',
    author: '0',
    text: '     message 1 looooooong looooooong \nlooooooong\n\nlooooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooonglooooooonglooooooonglooooooonglooooooonlooooooong looooooong looooooong',
    time: DateTime.fromISO('2023-04-15T14:30:00')
  },
  {
    id: '1',
    author: '1',
    text: '\'"**Bold** *Italic* \n_Underlined_ ~~Strikethrough~~ [Link](https://example.com)          example.com    `asdf`\nlolllll\n\n\n\n```javascript\nconsole.log\nconsole.log\n```',
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

function onScroll(e: Event) {
  if (!e.target) return;
  const view = e.target as HTMLElement;
  isScrolled.value =
    view.scrollHeight - (view.scrollTop + view.getBoundingClientRect().height) <
    10;
}

watch(
  () => messages.value.length,
  () => {
    if (!scrollArea.value) return;
    const scrollView = (scrollArea.value.$el as HTMLElement).children[0];
    if (isScrolled.value) {
      scrollView.scrollTo({ top: scrollView.scrollHeight, behavior: 'smooth' });
      isScrolled.value = true;
    }
  },
  {
    flush: 'post'
  }
);

const wait = async (delay: number) => {
  await new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};

onMounted(async () => {
  let author = false;
  await wait(2000);
  for (let i = 0; i != 300; i++) {
    if (i % 2 === 0 && Math.random() < 0.3) {
      author = !author;
      await wait(500);
    }
    messages.value.push({
      id: '10' + i,
      author: author ? '0' : '1',
      text: 'message l ' + i,
      time: DateTime.fromISO('2023-04-15T14:40:00')
    });
  }
});
</script>

<template>
  <ScrollArea
    @scroll="onScroll"
    ref="scroll-area"
    class="m-4 ml-2 grow rounded border p-5"
  >
    <div class="flex h-full flex-col items-start justify-end gap-2">
      <div
        :key="messageGroup.id"
        v-for="messageGroup in messagesGroups"
        class="relative w-full"
      >
        <MessageGroup
          :user="messageGroup.author"
          :class="
            messageGroup.author !== currentUserId ? 'float-left' : 'float-right'
          "
          :side="messageGroup.author !== currentUserId ? 'left' : 'right'"
          :show-avatar="messageGroup.author !== currentUserId"
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
    </div>
  </ScrollArea>
</template>
