import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import { origin } from './env';

export const app = express();

app.use(cors({ credentials: true, origin }));
app.use(express.json());
app.use(cookieParser());

app.get('/_ping', (req: any, res: any) => {
  res.send('pong');
});

// Mock data for Step 3 tutorial - basic REST endpoint
const messages = [
  {
    id: '1',
    content: 'You on your way?',
    createdAt: new Date(new Date('1-1-2019').getTime() - 60 * 1000 * 1000),
  },
  {
    id: '2',
    content: "Hey, it's me",
    createdAt: new Date(new Date('1-1-2019').getTime() - 2 * 60 * 1000 * 1000),
  },
  {
    id: '3',
    content: 'I should buy a boat',
    createdAt: new Date(new Date('1-1-2019').getTime() - 24 * 60 * 1000 * 1000),
  },
  {
    id: '4',
    content: 'This is wicked good ice cream.',
    createdAt: new Date(
      new Date('1-1-2019').getTime() - 14 * 24 * 60 * 1000 * 1000
    ),
  },
];

const chats = [
  {
    id: '1',
    name: 'Ethan Gonzalez',
    picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg',
    lastMessage: messages.find((m) => m.id === '1'),
  },
  {
    id: '2',
    name: 'Bryan Wallace',
    picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
    lastMessage: messages.find((m) => m.id === '2'),
  },
  {
    id: '3',
    name: 'Avery Stewart',
    picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
    lastMessage: messages.find((m) => m.id === '3'),
  },
  {
    id: '4',
    name: 'Katie Peterson',
    picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
    lastMessage: messages.find((m) => m.id === '4'),
  },
];

// GET /chats endpoint for Step 3 of the tutorial
app.get('/chats', (req: any, res: any) => {
  res.json(chats);
});
