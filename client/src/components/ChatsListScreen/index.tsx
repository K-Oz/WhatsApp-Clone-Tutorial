import React from 'react'
import ChatsNavbar from './ChatsNavbar'
import ChatsList from './ChatsList'
import { chats } from '../../db'
import styled from 'styled-components'

const Container = styled.div`
  height: 100vh;
`

const ChatsListScreen: React.FC = () => {
  return (
    <Container>
      <ChatsNavbar />
      <ChatsList chats={chats} />
    </Container>
  )
}

export default ChatsListScreen
