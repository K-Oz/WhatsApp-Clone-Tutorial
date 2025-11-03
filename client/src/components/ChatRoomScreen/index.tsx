import React from 'react';
import { useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import {
  useGetChatQuery,
  useAddMessageMutation,
} from '../../graphql/types';
import { writeMessage } from '../../services/cache.service';
import { History } from 'history';
import ChatNavbar from './ChatNavbar';

interface ChatRoomScreenParams {
  chatId: string;
  history: History;
}

const ChatRoomScreen: React.FC<ChatRoomScreenParams> = ({ chatId, history }) => {
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
            isMine: true,
            chat: {
              __typename: 'Chat',
              id: chatId,
            },
            content,
          },
        },
        update: (client, result) => {
          const data = result.data;
          if (data && data.addMessage) {
            writeMessage(client, data.addMessage);
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
  if (chat === null || chat === undefined) {
    // Chat was probably removed from cache by the subscription handler
    return <Redirect to="/chats" />;
  }

  return (
    <div>
      {chat.id && <ChatNavbar chat={chat} history={history} />}
      {chat.picture && <img src={chat.picture} alt="Profile" />}
      <div>{chat.name}</div>
      <ul>
        {chat.messages.messages.map((message) => (
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