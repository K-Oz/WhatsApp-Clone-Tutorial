import React, { useState, useMemo } from 'react';
import ChatsNavbar from './ChatsNavbar';
import ChatsList from './ChatsList';
import { Chat } from '../../db';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';

const Container = styled.div`
  height: 100vh;
`;

const ChatsListScreen: React.FC<RouteComponentProps> = ({ history }) => {
  const [chats, setChats] = useState<Chat[]>([]);

  useMemo(async () => {
    const body = await fetch(`${process.env.REACT_APP_SERVER_URL}/chats`);
    const chats = await body.json();
    setChats(chats);
  }, []);

  return (
    <Container>
      <ChatsNavbar />
      <ChatsList chats={chats} history={history} />
    </Container>
  );
};

export default ChatsListScreen;
