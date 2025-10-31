import React from 'react';
import ChatsNavbar from './ChatsNavbar';
import ChatsList from './ChatsList';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import * as queries from '../../graphql/queries';

const Container = styled.div`
  height: 100vh;
`;

const ChatsListScreen: React.FC<RouteComponentProps> = ({ history }) => {
  const { data } = useQuery<any>(queries.chats);

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
