export interface Chat {
  id: string
  name: string
  picture: string
  lastMessage: {
    id: string
    content: string
    createdAt: Date
  }
}

export interface Message {
  id: string
  content: string
  createdAt: Date
  user: string
}

export const chats: Chat[] = [
  {
    id: '1',
    name: 'Ethan Gonzalez',
    picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
    lastMessage: {
      id: '1',
      content: 'You on your way?',
      createdAt: new Date('2024-01-01T02:22:00Z'),
    },
  },
  {
    id: '2',
    name: 'Bryan Wallace',
    picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
    lastMessage: {
      id: '2',
      content: "Hey, it's me",
      createdAt: new Date('2024-01-01T09:42:00Z'),
    },
  },
  {
    id: '3',
    name: 'Avery Stewart',
    picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
    lastMessage: {
      id: '3',
      content: 'I should buy a boat',
      createdAt: new Date('2024-01-01T14:15:00Z'),
    },
  },
  {
    id: '4',
    name: 'Katie Peterson',
    picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
    lastMessage: {
      id: '4',
      content: 'Look at my mukluks!',
      createdAt: new Date('2024-01-01T16:30:00Z'),
    },
  },
]

export const messages: Message[] = [
  {
    id: '1',
    content: 'You on your way?',
    createdAt: new Date('2024-01-01T02:22:00Z'),
    user: 'Ethan Gonzalez',
  },
  {
    id: '2',
    content: "Hey, it's me",
    createdAt: new Date('2024-01-01T09:42:00Z'),
    user: 'Bryan Wallace',
  },
  {
    id: '3',
    content: 'I should buy a boat',
    createdAt: new Date('2024-01-01T14:15:00Z'),
    user: 'Avery Stewart',
  },
  {
    id: '4',
    content: 'Look at my mukluks!',
    createdAt: new Date('2024-01-01T16:30:00Z'),
    user: 'Katie Peterson',
  },
]
