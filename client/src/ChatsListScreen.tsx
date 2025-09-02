import React from 'react'
import ChatsNavbar from './ChatsNavbar'
import ChatsList from './ChatsList'
import { chats } from './db'

const ChatsListScreen: React.FC = () => {
  return (
    <div>
      <ChatsNavbar />
      <ChatsList chats={chats} />
    </div>
  )
}

export default ChatsListScreen
