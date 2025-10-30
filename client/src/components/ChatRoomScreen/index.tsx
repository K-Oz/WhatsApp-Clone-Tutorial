import gql from 'graphql-tag';
import React from 'react';
import { useCallback } from 'react';
import { useApolloClient, useQuery } from '@apollo/client/react';

const getChatQuery = gql`
  query GetChat($chatId: ID!) {
    chat(chatId: $chatId) {
      id
      name
      picture
      messages {
        id
        content
        createdAt
      }
    }
  }
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

interface ChatQueryResult {
  id: string;
  name: string;
  picture: string;
  messages: Array<ChatQueryMessage>;
  __typename?: string;
}

type OptionalChatQueryResult = ChatQueryResult | null;

const ChatRoomScreen: React.FC<ChatRoomScreenParams> = ({ chatId }) => {
  const client = useApolloClient();
  const { data } = useQuery<any>(getChatQuery, {
    variables: { chatId },
  });
  const chat = data?.chat;

  const onSendMessage = useCallback(
    (content: string) => {
      if (!chat) return;

      const message = {
        id: (chat.messages.length + 10).toString(),
        createdAt: new Date(),
        content,
        __typename: 'Message',
      };

      client.writeQuery({
        query: getChatQuery,
        variables: { chatId },
        data: {
          chat: {
            ...chat,
            messages: chat.messages.concat(message),
          },
        },
      });
    },
    [chat, chatId, client]
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