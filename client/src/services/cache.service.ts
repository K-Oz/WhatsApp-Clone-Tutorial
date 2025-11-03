import { ApolloCache } from '@apollo/client';
import * as fragments from '../graphql/fragments';
import * as queries from '../graphql/queries';
import {
  MessageFragment,
  useMessageAddedSubscription,
  useChatAddedSubscription,
  useChatRemovedSubscription,
  ChatsQuery,
  FullChatFragment,
  ChatFragment,
} from '../graphql/types';

type Client = ApolloCache;

export const useCacheService = () => {
  useMessageAddedSubscription({
    onData: ({ client, data }) => {
      if (data.data?.messageAdded) {
        writeMessage(client.cache, data.data.messageAdded);
      }
    },
  });

  useChatAddedSubscription({
    onData: ({ client, data }) => {
      if (data.data?.chatAdded) {
        writeChat(client.cache, data.data.chatAdded);
      }
    },
  });

  useChatRemovedSubscription({
    onData: ({ client, data }) => {
      if (data.data?.chatRemoved) {
        eraseChat(client.cache, data.data.chatRemoved);
      }
    },
  });
};

export const writeMessage = (client: Client, message: MessageFragment) => {
  let fullChat: FullChatFragment | null;

  const chatId = `Chat:${message.chat?.id}`;

  if (!message.chat?.id) {
    return;
  }

  try {
    fullChat = client.readFragment<FullChatFragment>({
      id: chatId,
      fragment: fragments.fullChat,
      fragmentName: 'FullChat',
    });
  } catch (e) {
    return;
  }

  if (fullChat === null || fullChat.messages === null) {
    return;
  }
  
  // Check if the message already exists
  if (fullChat.messages.messages?.some((m: MessageFragment) => m.id === message.id)) return;

  // Add the message to the messages array
  fullChat.messages.messages.push(message);
  fullChat.lastMessage = message;

  client.writeFragment({
    id: chatId,
    fragment: fragments.fullChat,
    fragmentName: 'FullChat',
    data: fullChat,
  });

  let data;
  try {
    data = client.readQuery<ChatsQuery>({
      query: queries.chats,
    });
  } catch (e) {
    return;
  }

  if (!data || data === null) {
    return null;
  }
  if (!data.chats || data.chats === undefined) {
    return null;
  }
  const chats = data.chats;

  const chatIndex = chats.findIndex((c: ChatFragment) => c.id === message.chat?.id);
  if (chatIndex === -1) return;
  const chatWhereAdded = chats[chatIndex];

  // The chat will appear at the top of the ChatsList component
  chats.splice(chatIndex, 1);
  chats.unshift(chatWhereAdded);

  client.writeQuery({
    query: queries.chats,
    data: { chats: chats },
  });
};

export const writeChat = (client: Client, chat: ChatFragment) => {
  const chatId = `Chat:${chat.id}`;

  client.writeFragment({
    id: chatId,
    fragment: fragments.chat,
    fragmentName: 'Chat',
    data: chat,
  });

  let data;
  try {
    data = client.readQuery<ChatsQuery>({
      query: queries.chats,
    });
  } catch (e) {
    return;
  }

  if (!data) return;

  const chats = data.chats;

  if (!chats) return;
  if (chats.some((c: any) => c.id === chat.id)) return;

  chats.unshift(chat);

  client.writeQuery({
    query: queries.chats,
    data: { chats },
  });
};

export const eraseChat = (client: Client, chatId: string) => {
  const chatType = {
    __typename: 'Chat',
    id: chatId,
  };

  const chatIdFromObject = `Chat:${chatId}`;

  client.writeFragment({
    id: chatIdFromObject,
    fragment: fragments.fullChat,
    fragmentName: 'FullChat',
    data: null,
  });

  let data: ChatsQuery | null;
  try {
    data = client.readQuery<ChatsQuery>({
      query: queries.chats,
    });
  } catch (e) {
    return;
  }

  if (!data || !data.chats) return;

  const chats = data.chats;

  if (!chats) return;

  const chatIndex = chats.findIndex((c: any) => c.id === chatId);

  if (chatIndex === -1) return;

  // The chat will appear at the top of the ChatsList component
  chats.splice(chatIndex, 1);

  client.writeQuery({
    query: queries.chats,
    data: { chats: chats },
  });
};
