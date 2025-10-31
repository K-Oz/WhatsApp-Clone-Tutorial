import { DateTimeResolver, URLResolver } from 'graphql-scalars';

// Simple mock data for Step 4 tutorial - matches the data in app.ts
const messages = [
  {
    id: '1',
    content: 'You on your way?',
    createdAt: new Date(new Date('1-1-2019').getTime() - 60 * 1000 * 1000),
  },
  {
    id: '2',
    content: "Hey, it's me",
    createdAt: new Date(new Date('1-1-2019').getTime() - 2 * 60 * 1000 * 1000),
  },
  {
    id: '3',
    content: 'I should buy a boat',
    createdAt: new Date(new Date('1-1-2019').getTime() - 24 * 60 * 1000 * 1000),
  },
  {
    id: '4',
    content: 'This is wicked good ice cream.',
    createdAt: new Date(
      new Date('1-1-2019').getTime() - 14 * 24 * 60 * 1000 * 1000
    ),
  },
];

const chats = [
  {
    id: '1',
    name: 'Ethan Gonzalez',
    picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
    messages: ['1'],
  },
  {
    id: '2',
    name: 'Bryan Wallace',
    picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
    messages: ['2'],
  },
  {
    id: '3',
    name: 'Avery Stewart',
    picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
    messages: ['3'],
  },
  {
    id: '4',
    name: 'Katie Peterson',
    picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
    messages: ['4'],
  },
];

const resolvers = {
  Date: DateTimeResolver,
  URL: URLResolver,

  Chat: {
    messages(chat: any) {
      return messages.filter((m) => chat.messages.includes(m.id));
    },

    lastMessage(chat: any) {
      const lastMessage = chat.messages[chat.messages.length - 1];
      return messages.find((m) => m.id === lastMessage);
    },
  },

  Query: {
    chats() {
      return chats;
    },

    chat(root: any, { chatId }: any) {
      return chats.find(c => c.id === chatId);
    },
  },

  Mutation: {
    addMessage(root: any, { chatId, content }: any) {
      const chatIndex = chats.findIndex(c => c.id === chatId);

      if (chatIndex === -1) return null;

      const chat = chats[chatIndex];

      const messagesIds = messages.map(currentMessage => Number(currentMessage.id));
      const messageId = String(Math.max(...messagesIds) + 1);
      const message = {
        id: messageId,
        createdAt: new Date(),
        content,
      };

      messages.push(message);
      chat.messages.push(messageId);
      // The chat will appear at the top of the ChatsList component
      chats.splice(chatIndex, 1);
      chats.unshift(chat);

      return message;
    },
  },
};

export default resolvers;