import React from 'react';
import ChatsNavbar from './ChatsNavbar';
import ChatsList from './ChatsList';
import AddChatButton from './AddChatButton';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { useChatsQuery } from '../../graphql/types';

const Container = styled.div`
  height: 100vh;
`;

const ChatsListScreen: React.FC<RouteComponentProps> = ({ history }) => {
  const { data } = useChatsQuery();

  if (data === undefined || data.chats === undefined) {
    return null;
  }
  const chats = data.chats;

  return (
    <Container>
      <ChatsNavbar history={history} />
      <ChatsList chats={chats} history={history} />
      <AddChatButton history={history} location={history.location} match={{} as any} />
    </Container>
  );
};

export default ChatsListScreen;
