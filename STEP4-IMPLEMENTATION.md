# Step 4: Transition to GraphQL - Implementation Guide

This document explains how **Step 4: Transition to GraphQL** is implemented in this repository.

## Overview 

Step 4 demonstrates the transition from a simple REST endpoint to basic GraphQL implementation. This is the foundation before moving to the advanced modular GraphQL architecture used in later steps.

## Repository Structure

The repository contains multiple implementations showing the progression:

### 1. Step 3: Basic REST Endpoint
- **File**: `server/app.ts` (lines 69-72)
- **Endpoint**: `GET /chats`
- **Description**: Simple REST endpoint that returns chat data with populated lastMessage

### 2. Step 4: Basic GraphQL Schema
- **Directory**: `server/schema/`
- **Files**:
  - `typeDefs.graphql` - GraphQL type definitions
  - `resolvers.ts` - Resolver functions 
  - `index.ts` - Executable schema combination
  - `README.md` - Documentation

### 3. Step 4: Demo Server
- **File**: `server/step4-demo.ts`
- **Command**: `yarn step4-demo`
- **Description**: Standalone server showing both REST and GraphQL endpoints side by side

### 4. Client Implementation
- **Current**: `client/src/components/ChatsListScreen/index.tsx` (uses REST)
- **Demo**: `client/src/components/ChatsListScreen/index-step4-demo.tsx` (shows both approaches)

## How to Run Step 4 Demo

### Server Side

1. **Start the Step 4 demo server**:
   ```bash
   cd server
   yarn step4-demo
   ```

2. **Test the REST endpoint** (Step 3):
   ```bash
   curl http://localhost:4000/chats
   ```

3. **Test the GraphQL endpoint** (Step 4):
   ```bash
   curl -X POST -H "Content-Type: application/json" \
     --data '{"query": "{ chats { id name picture lastMessage { id content createdAt } } }"}' \
     http://localhost:4000/graphql
   ```

4. **Use GraphQL Playground**:
   Open http://localhost:4000/graphql in your browser

### Client Side

The client demonstrates the transition from REST to GraphQL calls:

**Before (REST approach)**:
```typescript
const body = await fetch(`${process.env.REACT_APP_SERVER_URL}/chats`);
const chats = await body.json();
```

**After (GraphQL approach)**:
```typescript
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

const body = await fetch(`${process.env.REACT_APP_SERVER_URL}/graphql`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: getChatsQuery }),
});
const { data: { chats } } = await body.json();
```

## Key Concepts Demonstrated

### 1. Custom Scalars
```graphql
scalar Date
scalar URL
```
- Uses `graphql-scalars` library for Date and URL validation
- Shows how to extend GraphQL's built-in scalar types

### 2. Type Definitions
```graphql
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
```
- Demonstrates object type relationships
- Shows nullable vs non-nullable fields (`!`)

### 3. Field-Level Resolution
```typescript
Chat: {
  lastMessage(chat: any) {
    return messages.find((m) => m.id === chat.lastMessage);
  },
}
```
- Shows how GraphQL resolves nested fields on-demand
- Demonstrates the power of field-level data fetching

### 4. Query Flexibility
GraphQL allows clients to request exactly what they need:

**Minimal query**:
```graphql
{ chats { id name } }
```

**Full query**:
```graphql
{ chats { id name picture lastMessage { id content createdAt } } }
```

## Differences from Advanced Implementation

This basic Step 4 implementation differs from the advanced modular approach in later steps:

| Step 4 (Basic) | Advanced (Later Steps) |
|----------------|------------------------|
| Single schema file | Modular schema with GraphQL Modules |
| Simple resolvers | Complex resolvers with dependency injection |
| Mock data | Database integration with PostgreSQL |
| Basic Apollo Server | Advanced Apollo Server with subscriptions |
| No authentication | JWT authentication and authorization |

## Next Steps

After understanding Step 4:
1. The tutorial progresses to testing (Step 5)
2. Then to more advanced GraphQL features
3. Eventually to the full modular architecture seen in the current repository

This progression shows how to build GraphQL applications incrementally, starting with simple concepts and growing to production-ready systems.

## Testing the Implementation

You can verify that Step 4 works correctly by:

1. **Running the demo server**: `yarn step4-demo`
2. **Testing both endpoints**: REST vs GraphQL
3. **Comparing responses**: Both should return identical data
4. **Checking server logs**: See the resolver execution flow
5. **Using GraphQL Playground**: Interactive query testing

The implementation successfully demonstrates the core concepts of transitioning from REST to GraphQL as outlined in the tutorial.