# Step 4: Basic GraphQL Schema

This directory contains the basic GraphQL schema implementation as demonstrated in **Step 4: Transition to GraphQL** of the WhatsApp Clone Tutorial.

## Files

- `typeDefs.graphql` - GraphQL type definitions with scalar types (Date, URL) and object types (Message, Chat)
- `resolvers.ts` - Resolver functions that provide data for each field in the schema
- `index.ts` - Combines typeDefs and resolvers into an executable GraphQL schema

## Tutorial Context

Step 4 demonstrates the transition from a simple REST endpoint (`GET /chats`) to a basic GraphQL implementation. This is the foundation before moving to the more advanced modular GraphQL architecture used in later steps.

## Usage

The schema can be used to create a basic Apollo Server:

```typescript
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';

const server = new ApolloServer({ schema });
```

## Sample Query

```graphql
{
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
```

This implementation shows the core concepts:
- Custom scalars (Date, URL)
- Object types with relationships (Chat -> Message)
- Basic resolvers with field-level resolution
- Transition from REST to GraphQL data fetching