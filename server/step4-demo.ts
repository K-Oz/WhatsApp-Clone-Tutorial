// Step 4: Transition to GraphQL - Tutorial Demo
// This file demonstrates exactly what Step 4 of the tutorial shows
// Run with: yarn ts-node step4-demo.ts

import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import { DateTimeResolver, URLResolver } from 'graphql-scalars';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/_ping', (req: any, res: any) => {
  res.send('pong');
});

// Sample data - matches the tutorial and app.ts
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
    lastMessage: '1', // Store ID reference, resolve in GraphQL
  },
  {
    id: '2',
    name: 'Bryan Wallace',
    picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg',
    lastMessage: '2',
  },
  {
    id: '3',
    name: 'Avery Stewart',
    picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg',
    lastMessage: '3',
  },
  {
    id: '4',
    name: 'Katie Peterson',
    picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg',
    lastMessage: '4',
  },
];

// Step 3: REST endpoint (what we had before)
app.get('/chats', (req: any, res: any) => {
  console.log('📡 [REST] GET /chats called');
  // In REST, we have to manually populate the lastMessage
  const chatsWithMessages = chats.map(chat => ({
    ...chat,
    lastMessage: messages.find((m) => m.id === chat.lastMessage),
  }));
  res.json(chatsWithMessages);
});

// Step 4: GraphQL Schema (what we're adding)
const typeDefs = gql`
  scalar Date
  scalar URL

  type Message {
    id: ID!
    content: String!
    createdAt: Date!
  }

  type Chat {
    id: ID!
    name: String!
    picture: URL
    lastMessage: Message
  }

  type Query {
    chats: [Chat!]!
  }
`;

const resolvers = {
  Date: DateTimeResolver,
  URL: URLResolver,

  Chat: {
    // This resolver shows the power of GraphQL field-level resolution
    lastMessage(chat: any) {
      console.log('🔥 [GraphQL] Resolving lastMessage for chat:', chat.id);
      return messages.find((m) => m.id === chat.lastMessage);
    },
  },

  Query: {
    chats() {
      console.log('🔥 [GraphQL] chats resolver called');
      return chats; // GraphQL will automatically resolve nested fields
    },
  },
};

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  // Enable introspection and playground for development
  introspection: true,
  playground: true
});

server.applyMiddleware({
  app,
  path: '/graphql',
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log('🚀 Step 4 Demo Server started!');
  console.log(`🌍 Server: http://localhost:${port}`);
  console.log(`📡 REST endpoint: http://localhost:${port}/chats`);
  console.log(`🔥 GraphQL endpoint: http://localhost:${port}${server.graphqlPath}`);
  console.log(`🎮 GraphQL Playground: http://localhost:${port}${server.graphqlPath}`);
  console.log('');
  console.log('=== STEP 4 TUTORIAL DEMONSTRATION ===');
  console.log('');
  console.log('1. Try the OLD way (REST):');
  console.log(`   curl http://localhost:${port}/chats`);
  console.log('');
  console.log('2. Try the NEW way (GraphQL):');
  console.log(`   curl -X POST -H "Content-Type: application/json" \\`);
  console.log(`     --data '{"query": "{ chats { id name picture lastMessage { id content createdAt } } }"}' \\`);
  console.log(`     http://localhost:${port}/graphql`);
  console.log('');
  console.log('Notice how GraphQL lets you specify exactly what fields you want!');
});

export { app, server };