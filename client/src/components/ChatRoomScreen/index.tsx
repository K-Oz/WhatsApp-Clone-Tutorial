import { defaultDataIdFromObject } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import React from 'react';
import { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import * as queries from '../../graphql/queries';
import * as fragments from '../../graphql/fragments';

const getChatQuery = gql`
  query GetChat($chatId: ID!) {
    chat(chatId: $chatId) {
      ...FullChat
    }
  }
  ${fragments.fullChat}
`;

const addMessageMutation = gql`
  mutation AddMessage($chatId: ID!, $content: String!) {
    addMessage(chatId: $chatId, content: $content) {
      ...Message
    }
  }
  ${fragments.message}
`;

interface ChatRoomScreenParams {
  chatId: string;
}

interface ChatQueryMessage {
  id: string;
  content: string;
  createdAt: Date;
  __typename?: string;
}

interface ChatsResult {
  chats: any[];
}

interface AddMessageResult {
  addMessage: {
    id: string;
    content: string;
    createdAt: Date;
  };
}

const ChatRoomScreen: React.FC<ChatRoomScreenParams> = ({ chatId }) => {
  const { data } = useQuery<any>(getChatQuery, {
    variables: { chatId },
  });
  const chat = data?.chat;
  const [addMessage] = useMutation(addMessageMutation);

  const onSendMessage = useCallback(
    (content: string) => {
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
          const data = result.data as AddMessageResult | undefined;
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

            if (fullChat === null ||
                fullChat.messages === null ||
                data === null ||
                data.addMessage === null ||
                data.addMessage.id === null) {
              return;
            }
            if (fullChat.messages.some((currentMessage: any) => currentMessage.id === data.addMessage.id)){
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

            let clientChatsData;
            try {
              clientChatsData = client.readQuery<ChatsResult>({
                query: queries.chats,
              });
            } catch (e) {
              return;
            }

            if (!clientChatsData || clientChatsData === null) {
              return null;
            }
            if (!clientChatsData.chats || clientChatsData.chats === undefined) {
              return null;
            }
            const chats = clientChatsData.chats;

            const chatIndex = chats.findIndex((currentChat: any) => currentChat.id === chatId);
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
    [chat, chatId, addMessage]
  );

  if (!chat) return null;

  return (
    <div>
      <img src={chat.picture} alt="Profile" />
      <div>{chat.name}</div>
      <ul>
        {chat.messages.map((message: ChatQueryMessage) => (
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