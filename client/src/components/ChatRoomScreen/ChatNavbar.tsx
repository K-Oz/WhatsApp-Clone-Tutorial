import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import DeleteIcon from '@material-ui/icons/Delete';
import gql from 'graphql-tag';
import React from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';
import { History } from 'history';
import { useRemoveChatMutation } from '../../graphql/types';
import { eraseChat } from '../../services/cache.service';

const Container = styled(Toolbar)`
  padding: 0;
  display: flex;
  background-color: var(--primary-bg);
  color: var(--primary-text);
  font-size: 20px;
  line-height: 40px;
`;

const BackButton = styled(Button)`
  svg {
    color: var(--primary-text);
  }
`;

const Rest = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const Picture = styled.img`
  height: 40px;
  width: 40px;
  object-fit: cover;
  border-radius: 50%;
`;

const Name = styled.div`
  line-height: 56px;
`;

const DeleteButton = styled(Button)`
  color: var(--primary-text) !important;
`;

export const removeChatMutation = gql`
  mutation RemoveChat($chatId: ID!) {
    removeChat(chatId: $chatId)
  }
`;

interface ChatNavbarProps {
  history: History;
  chat: {
    picture?: string | null;
    name?: string | null;
    id: string;
  };
}

const ChatNavbar: React.FC<ChatNavbarProps> = ({ chat, history }) => {
  const [removeChat] = useRemoveChatMutation({
    update: (client, { data }) => {
      if (data && data.removeChat) {
        eraseChat(client, data.removeChat);
      }
    },
  });

  const handleRemoveChat = useCallback(() => {
    removeChat({
      variables: {
        chatId: chat.id,
      },
    }).then(() => {
      history.replace('/chats');
    });
  }, [removeChat, history, chat.id]);

  const navBack = useCallback(() => {
    history.replace('/chats');
  }, [history]);

  return (
    <Container>
      <BackButton data-testid="back-button" onClick={navBack}>
        <ArrowBackIcon />
      </BackButton>
      {chat && (
        <React.Fragment>
          {chat.picture && chat.picture !== '' && (
            <Picture data-testid="chat-picture" src={chat.picture} />
          )}
          <Name data-testid="chat-name">{chat.name}</Name>
        </React.Fragment>
      )}
      <Rest>
        <DeleteButton data-testid="delete-button" onClick={handleRemoveChat}>
          <DeleteIcon />
        </DeleteButton>
      </Rest>
    </Container>
  );
};

export default ChatNavbar;
