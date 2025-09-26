// Simple server demonstrating Step 4: Transition to GraphQL
// This shows the basic approach before the modular architecture

import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import schema from './schema';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/_ping', (req, res) => {
  res.send('pong');
});

// Simple mock data for Step 4 demonstration
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

// GET /chats endpoint for Step 3 of the tutorial (before GraphQL)
app.get('/chats', (req: any, res: any) => {
  res.json(chats);
});

const server = new ApolloServer({ schema });

server.applyMiddleware({
  app,
  path: '/graphql',
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Simple server is running on http://localhost:${port}${server.graphqlPath}`);
  console.log(`REST endpoint: http://localhost:${port}/chats`);
  console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
});