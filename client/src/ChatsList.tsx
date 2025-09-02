import React from 'react'
import moment from 'moment'
import { Chat } from './db'

interface ChatsListProps {
  chats: Chat[]
}

const ChatsList: React.FC<ChatsListProps> = ({ chats }) => {
  return (
    <div>
      {chats.map((chat) => (
        <div
          key={chat.id}
          style={{
            display: 'flex',
            padding: '16px',
            borderBottom: '1px solid #e0e0e0',
            alignItems: 'center',
          }}
        >
          <img
            src={chat.picture}
            alt={chat.name}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              marginRight: '16px',
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {chat.name}
            </div>
            <div style={{ color: '#666', fontSize: '14px' }}>
              {chat.lastMessage ? (
                <React.Fragment>{chat.lastMessage.content}</React.Fragment>
              ) : null}
            </div>
          </div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            {chat.lastMessage
              ? moment(chat.lastMessage.createdAt).format('HH:mm')
              : ''}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatsList
