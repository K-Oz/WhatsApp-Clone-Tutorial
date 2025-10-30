// Step 4 Demo: Transition from REST to GraphQL
// This shows both approaches side by side

import React, { useState, useMemo } from 'react'
import ChatsNavbar from './ChatsNavbar'
import ChatsList from './ChatsList'
import { Chat } from '../../db'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router-dom';

const Container = styled.div`
  height: 100vh;
`

const ToggleContainer = styled.div`
  padding: 10px;
  background: #f0f0f0;
  text-align: center;
`

const ToggleButton = styled.button<{ active: boolean }>`
  margin: 0 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: ${(props) => (props.active ? '#007bff' : '#ccc')};
  color: ${(props) => (props.active ? 'white' : 'black')};
`

// GraphQL query as shown in the tutorial
const getChatsQuery = `
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

const ChatsListScreenStep4Demo: React.FC<RouteComponentProps> = ({ history }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [useGraphQL, setUseGraphQL] = useState(false);

  const fetchChatsREST = async () => {
    console.log('🔄 Fetching chats via REST...');
    const body = await fetch(`${process.env.REACT_APP_SERVER_URL}/chats`);
    const chats = await body.json();
    setChats(chats);
    console.log('✅ REST response:', chats);
  };

  const fetchChatsGraphQL = async () => {
    console.log('🔄 Fetching chats via GraphQL...');
    const body = await fetch(`${process.env.REACT_APP_SERVER_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: getChatsQuery }),
    });
    const {
      data: { chats },
    } = await body.json();
    setChats(chats);
    console.log('✅ GraphQL response:', chats);
  };

  useMemo(async () => {
    if (useGraphQL) {
      await fetchChatsGraphQL();
    } else {
      await fetchChatsREST();
    }
  }, [useGraphQL]);

  const handleToggle = (graphql: boolean) => {
    setUseGraphQL(graphql);
  };

  return (
    <Container>
      <ToggleContainer>
        <h3>Step 4 Demo: REST vs GraphQL</h3>
        <ToggleButton 
          active={!useGraphQL} 
          onClick={() => handleToggle(false)}
        >
          Use REST (Step 3)
        </ToggleButton>
        <ToggleButton 
          active={useGraphQL} 
          onClick={() => handleToggle(true)}
        >
          Use GraphQL (Step 4)
        </ToggleButton>
        <p>
          {useGraphQL 
            ? '🔥 Using GraphQL endpoint - check developer console to see the structured query!'
            : '📡 Using REST endpoint - simple but less flexible'
          }
        </p>
      </ToggleContainer>
      <ChatsNavbar />
      <ChatsList chats={chats} history={history} />
    </Container>
  )
}

export default ChatsListScreenStep4Demo