<script lang="ts"></script>

<script setup lang="ts">
import MessageGroup from './MessageGroup.vue';
import { onMounted, ref } from 'vue';
import { DateTime } from 'luxon';
import { computed } from 'vue';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { useTemplateRef } from 'vue';
import { watch } from 'vue';
import { Textarea } from '@/shared/ui/textarea';
import TextMessage from './TextMessage.vue';
import ImageMessage from './ImageMessage.vue';
import FallbackMessage from './FallbackMessage.vue';

type MessageData = {
  id: string;
  author: string;
  data:
    | {
        type: 'text';
        text: string;
      }
    | {
        type: 'img';
        url: string;
      };
  createTime: DateTime;
};
type MessageGroup = {
  id: string;
  author: string;
  messages: MessageData[];
};

const currentUserId = ref('1');
const isScrolled = ref(true);
const scrollArea = useTemplateRef('scroll-area');

const messageComponents = {
  text: {
    component: TextMessage
  },
  img: {
    component: ImageMessage
  },
  fallback: {
    component: FallbackMessage
  }
};

const messages = ref<MessageData[]>([
  {
    id: '0',
    author: '0',
    data: {
      type: 'text',
      text: '     message 1 looooooong looooooong \nlooooooong\n\nlooooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooong looooooonglooooooonglooooooonglooooooonglooooooonlooooooong looooooong looooooong'
    },
    createTime: DateTime.fromISO('2023-04-15T14:30:00')
  },
  {
    id: '33',
    author: '1',
    data: {
      type: 'lol'
    },
    createTime: DateTime.fromISO('2023-04-15T14:30:00')
  },
  {
    id: '35',
    author: '1',
    data: {
      type: 'text',
      text: '\'"**Bold** *Italic* \n_Underlined_ ~~Strikethrough~~ [Link](https://example.com)          example.com    `asdf`\nlolllll\n\n\n\n```javascript\nconsole.log\nconsole.log\n```'
    },
    createTime: DateTime.fromISO('2023-04-15T14:10:00')
  },
  {
    id: '1',
    author: '1',
    data: {
      type: 'img',
      url: 'https://get.pxhere.com/photo/animal-pet-kitten-cat-small-mammal-fauna-heal-blue-eye-close-up-nose-whiskers-vertebrate-domestic-lying-tabby-cat-norwegian-forest-cat-ginger-fur-small-to-medium-sized-cats-cat-like-mammal-carnivoran-domestic-short-haired-cat-domestic-long-haired-cat-609263.jpg'
    },
    createTime: DateTime.fromISO('2023-04-15T14:10:00')
  },
  {
    id: '13',
    author: '1',
    data: {
      type: 'img',
      url: 'https://get.pxhere.com/photo/animal-pet-kitten-cat-small-mammal-fauna-heal-blue-eye-close-up-nose-whiskers-vertebrate-domestic-lying-tabby-cat-norwegian-forest-cat-ginger-fur-small-to-medium-sized-cats-cat-like-mammal-carnivoran-domestic-short-haired-cat-domestic-long-haired-cat-609263.jpg'
    },
    createTime: DateTime.fromISO('2023-04-15T14:20:00')
  },
  {
    id: '2',
    author: '1',
    data: {
      type: 'text',
      text: 'message 3'
    },
    createTime: DateTime.fromISO('2023-04-15T14:30:00')
  },
  {
    id: '3',
    author: '1',
    data: {
      type: 'text',
      text: 'message 4'
    },
    createTime: DateTime.fromISO('2023-04-15T14:30:00')
  },
  {
    id: '4',
    author: '0',
    data: {
      type: 'text',
      text: 'message 5'
    },
    createTime: DateTime.fromISO('2023-04-15T14:30:00')
  },
  {
    id: '5',
    author: '1',
    data: {
      type: 'text',
      text: 'message 6'
    },
    createTime: DateTime.fromISO('2023-04-15T14:30:00')
  },
  {
    id: '6',
    author: '1',
    data: {
      type: 'text',
      text: 'message 7'
    },
    createTime: DateTime.fromISO('2023-04-15T14:40:00')
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
    (acc: MessageGroup[], msg: MessageData): MessageGroup[] => {
      const currentGroup = acc.at(-1);
      const prev = currentGroup?.messages.at(-1);
      if (
        prev &&
        msg.author === prev.author &&
        msg.createTime.diff(prev?.createTime, 'minute').minutes < 10
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
      data: {
        type: 'text',
        text: 'message l ' + i
      },
      createTime: DateTime.fromISO('2023-04-15T14:40:00')
    });
  }
});
</script>

<template>
  <ScrollArea
    @scroll="onScroll"
    ref="scroll-area"
    class="m-4 mb-2 ml-2 grow rounded border p-5"
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
          :messages="messageGroup.messages"
          :message-components="messageComponents"
        >
        </MessageGroup>
      </div>
    </div>
  </ScrollArea>
  <div
    class="m-4 mt-2 ml-2 flex min-h-16 items-center justify-start rounded border"
  >
    <Textarea
      class="h-10 w-[60%] border-0"
      placeholder="Type your message..."
    />
  </div>
</template>
