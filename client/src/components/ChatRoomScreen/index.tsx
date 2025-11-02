import { defaultDataIdFromObject } from 'apollo-cache-inmemory';
import React from 'react';
import { useCallback } from 'react';
import * as fragments from '../../graphql/fragments';
import * as queries from '../../graphql/queries';
import {
  ChatsQuery,
  useGetChatQuery,
  useAddMessageMutation,
} from '../../graphql/types';

interface ChatRoomScreenParams {
  chatId: string;
}

const ChatRoomScreen: React.FC<ChatRoomScreenParams> = ({ chatId }) => {
  const { data, loading } = useGetChatQuery({
    variables: { chatId },
  });

  const [addMessage] = useAddMessageMutation();

  const onSendMessage = useCallback(
    (content: string) => {
      if (data === undefined) {
        return null;
      }
      const chat = data.chat;
      if (chat === null) return null;

      addMessage({
        variables: { chatId, content },
        optimisticResponse: {
          __typename: 'Mutation',
          addMessage: {
            __typename: 'Message',
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
            content,
          },
        },
        update: (client, result) => {
          const data = result.data;
          if (data && data.addMessage) {
            type FullChat = { [key: string]: any };
            let fullChat;
            const chatIdFromStore = defaultDataIdFromObject(chat);

            if (chatIdFromStore === null) {
              return;
            }

            try {
              fullChat = client.readFragment<FullChat>({
                id: chatIdFromStore,
                fragment: fragments.fullChat,
                fragmentName: 'FullChat',
              });
            } catch (e) {
              return;
            }

            if (fullChat === null || fullChat.messages === null) {
              return;
            }
            if (
              fullChat.messages.some(
                (currentMessage: any) =>
                  data.addMessage && currentMessage.id === data.addMessage.id
              )
            ) {
              return;
            }

            fullChat.messages.push(data.addMessage);
            fullChat.lastMessage = data.addMessage;

            client.writeFragment({
              id: chatIdFromStore,
              fragment: fragments.fullChat,
              fragmentName: 'FullChat',
              data: fullChat,
            });

            let clientChatsData: ChatsQuery | null;
            try {
              clientChatsData = client.readQuery({
                query: queries.chats,
              });
            } catch (e) {
              return;
            }

            if (!clientChatsData || !clientChatsData.chats) {
              return null;
            }
            const chats = clientChatsData.chats;

            const chatIndex = chats.findIndex(
              (currentChat: any) => currentChat.id === chatId
            );
            if (chatIndex === -1) return;
            const chatWhereAdded = chats[chatIndex];

            // The chat will appear at the top of the ChatsList component
            chats.splice(chatIndex, 1);
            chats.unshift(chatWhereAdded);

            client.writeQuery({
              query: queries.chats,
              data: { chats: chats },
            });
          }
        },
      });
    },
    [data, chatId, addMessage]
  );

  if (data === undefined) {
    return null;
  }
  const chat = data.chat;
  const loadingChat = loading;

  if (loadingChat) return null;
  if (chat === null || chat === undefined) return null;

  return (
    <div>
      {chat.picture && <img src={chat.picture} alt="Profile" />}
      <div>{chat.name}</div>
      <ul>
        {chat.messages.map((message) => (
          <li key={message.id}>
            <div>{message.content}</div>
            <div>{message.createdAt}</div>
          </li>
        ))}
      </ul>
      <button onClick={() => onSendMessage('Test message')}>Send Message</button>
    </div>
  );
};

export default ChatRoomScreen;