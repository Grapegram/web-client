import { DateTime } from 'luxon';
import { defineStore } from 'pinia';
import type { ChatId } from './chat';
import type { UserId } from './user';

export type MessageId = string;

export type Message = {
  id: MessageId;
  author: UserId;
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

type MessageStore = {
  message: Record<ChatId, Message[]>;
};

export const useMessagesStore = defineStore('messages', {
  state: (): MessageStore => ({
    message: { '0': mockMessages0 }
  }),

  getters: {
    getChatMessages(state) {
      return (chatId: ChatId): Message[] => state.message[chatId] ?? [];
    }
  },

  actions: {}
});

// simulateChatMessaging() {
//       let author = false;
//       for (let i = 0; i != 300; i++) {
//         if (i % 2 === 0 && Math.random() < 0.3) {
//           author = !author;
//         }
//         this.message.push({
//           id: '10' + i,
//           author: author ? '0' : '1',
//           data: {
//             type: 'text',
//             text: 'message l ' + i
//           },
//           createTime: DateTime.fromISO('2023-04-15T14:40:00')
//         });
//       }
//     }

const mockMessages0: Message[] = [
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
      //@ts-expect-error for test unavaliable type
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
];
