import React from 'react'
import { ApolloProvider } from '@apollo/client/react';
import { render, waitFor } from '@testing-library/react'
import ChatsList from './ChatsList'
import * as queries from '../../graphql/queries';
import { mockApolloClient } from '../../test-helpers';

describe('ChatsList', () => {
  it('renders fetched chats data', async () => {
    const client = mockApolloClient([
      {
        request: { query: queries.chats },
        result: {
          data: {
            chats: [
              {
                __typename: 'Chat',
                id: '1',
                name: 'Foo Bar',
                picture: 'https://localhost:4000/picture.jpg',
                lastMessage: {
                  __typename: 'Message',
                  id: '1',
                  content: 'Hello',
                  createdAt: new Date('1 Jan 2019 GMT'),
                },
              },
            ],
          },
        },
      },
    ]);

    const mockHistory = {
      push: jest.fn(),
      replace: jest.fn(),
      go: jest.fn(),
      goBack: jest.fn(),
      goForward: jest.fn(),
      block: jest.fn(),
      listen: jest.fn(),
      location: { pathname: '/', search: '', hash: '', state: undefined },
      length: 1,
      action: 'PUSH' as const,
      createHref: jest.fn(),
    }

    const mockChats = [
      {
        id: '1',
        name: 'Foo Bar',
        picture: 'https://localhost:4000/picture.jpg',
        lastMessage: {
          id: '1',
          content: 'Hello',
          createdAt: new Date('1 Jan 2019 GMT'),
        },
      },
    ]

    const { container, getByTestId } = render(
      <ApolloProvider client={client}>
        <ChatsList chats={mockChats} history={mockHistory} />
      </ApolloProvider>
    )

    await waitFor(() => container)

    expect(getByTestId('name')).toHaveTextContent('Foo Bar')
    expect(getByTestId('picture')).toHaveAttribute(
      'src',
      'https://localhost:4000/picture.jpg'
    )
    expect(getByTestId('content')).toHaveTextContent('Hello')
    expect(getByTestId('date')).toHaveTextContent('00:00')
  })
})