# Testing GraphQL Subscriptions - Step 10

This document explains how to test the live updates feature implemented in Step 10.

## Prerequisites

1. Make sure you have PostgreSQL running (via Docker or locally)
2. Server dependencies installed
3. Client dependencies installed

## Starting the Application

### 1. Start the Server

```bash
cd server
# If using Docker for PostgreSQL:
docker-compose up -d postgresql

# Start the server
npm start
```

The server should start on `http://localhost:4000`

### 2. Start the Client

In a separate terminal:

```bash
cd client
npm start
```

The client should start on `http://localhost:3000`

## Testing Live Updates

### Testing Message Subscriptions

1. **Open two browser windows/tabs**:
   - Window A: `http://localhost:3000`
   - Window B: `http://localhost:3000`

2. **Navigate to the same chat** in both windows:
   - Click on any chat in the list
   - Both windows should show the same chat room

3. **Send a message from Window A**:
   - Click the "Send Message" button in Window A
   - You should see the message appear in Window A immediately (optimistic update)
   - **Within a second, the message should also appear in Window B without refreshing!**

4. **Send a message from Window B**:
   - Click the "Send Message" button in Window B
   - You should see the message appear in Window B immediately
   - The message should also appear in Window A without refreshing

### What's Happening Behind the Scenes

1. **WebSocket Connection**: When the app starts, it establishes a WebSocket connection to the GraphQL server at `ws://localhost:4000/graphql`

2. **Subscription Active**: The `useCacheService` hook subscribes to the `messageAdded` subscription

3. **Message Flow**:
   ```
   User sends message → 
   Mutation sent to server → 
   Server processes mutation → 
   Server publishes messageAdded event → 
   All connected clients receive event via WebSocket → 
   Cache service updates Apollo cache → 
   UI re-renders with new message
   ```

4. **Cache Updates**: The `writeMessage` function:
   - Adds the new message to the chat's messages array
   - Updates the chat's lastMessage
   - Moves the chat to the top of the chats list

## Troubleshooting

### WebSocket Connection Issues

If you see errors about WebSocket connections in the browser console:

1. Make sure the server is running
2. Check that the `REACT_APP_SERVER_URL` environment variable is set correctly
3. Verify that your server supports WebSocket connections (it should with the current implementation)

### Messages Not Appearing

If messages don't appear in real-time:

1. Check the browser console for errors
2. Verify the WebSocket connection is established (Network tab → WS filter)
3. Make sure both windows are looking at the same chat

### Database Issues

If you get database connection errors:

1. Make sure PostgreSQL is running
2. Check the database credentials in the server's environment variables
3. Try running with `FAKED_DB=1` for development without a real database

## Implementation Details

### Files Changed

- `client/src/client.ts` - Added WebSocket link configuration
- `client/src/services/cache.service.ts` - Subscription handling and cache updates
- `client/src/App.tsx` - Initialize cache service
- `client/src/graphql/subscriptions/messageAdded.subscription.ts` - Subscription document
- `client/src/graphql/fragments/message.fragment.ts` - Added chat.id field

### Key Technologies

- **graphql-ws**: Modern WebSocket transport for GraphQL subscriptions
- **Apollo Client 4.x**: Split link for routing operations
- **GraphQL Code Generator**: Type-safe subscription hooks

## Next Steps

Once subscriptions are working, you can:

1. Implement `chatAdded` subscription for new chat notifications
2. Implement `chatRemoved` subscription for deleted chats
3. Add user presence indicators
4. Add typing indicators
5. Add read receipts

## Resources

- [Apollo Client Subscriptions](https://www.apollographql.com/docs/react/data/subscriptions/)
- [graphql-ws Documentation](https://github.com/enisdenjo/graphql-ws)
- [Step 10 Tutorial](https://github.com/Urigo/WhatsApp-Clone-Tutorial/blob/master/.tortilla/manuals/views/step10.md)
