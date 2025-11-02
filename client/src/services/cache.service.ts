import { ApolloCache } from '@apollo/client';
import * as fragments from '../graphql/fragments';
import * as queries from '../graphql/queries';
import {
  MessageFragment,
  useMessageAddedSubscription,
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
