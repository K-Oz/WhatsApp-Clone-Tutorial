import React from 'react';
import ChatsNavbar from './ChatsNavbar';
import ChatsList from './ChatsList';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client/react';

const Container = styled.div`
  height: 100vh;
`;

export const getChatsQuery = gql`
  query GetChats {
    chats {
      id
      name
      picture
      lastMessage {
        id
        content
        createdAt
      }
    }
  }
`;

const ChatsListScreen: React.FC<RouteComponentProps> = ({ history }) => {
  const { data } = useQuery<any>(getChatsQuery);

  if (data === undefined || data.chats === undefined) {
    return null;
  }
  const chats = data.chats;

  return (
    <Container>
      <ChatsNavbar />
      <ChatsList chats={chats} history={history} />
    </Container>
  );
};

export default ChatsListScreen;
