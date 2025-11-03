import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import {
  cleanup,
  render,
  fireEvent,
  waitFor,
  screen,
} from '@testing-library/react';
import { mockApolloClient } from '../test-helpers';
import UsersList, { UsersListQuery } from './UsersList';

describe('UsersList', () => {
  afterEach(cleanup);

  it('renders fetched users data', async () => {
    const client = mockApolloClient([
      {
        request: { query: UsersListQuery },
        result: {
          data: {
            users: [
              {
                __typename: 'User',
                id: 1,
                name: 'Charles Dickhead',
                picture: 'https://localhost:4000/dick.jpg',
              },
            ],
          },
        },
      },
    ]);

    {
      const { container, getByTestId } = render(
        <ApolloProvider client={client}>
          <UsersList />
        </ApolloProvider>
      );

      await waitFor(() => screen.getByTestId('name'));

      expect(getByTestId('name')).toHaveTextContent('Charles Dickhead');
      expect(getByTestId('picture')).toHaveAttribute(
        'src',
        'https://localhost:4000/dick.jpg'
      );
    }
  });

  it('triggers onUserPick() callback on user-item click', async () => {
    const client = mockApolloClient([
      {
        request: { query: UsersListQuery },
        result: {
          data: {
            users: [
              {
                __typename: 'User',
                id: 1,
                name: 'Charles Dickhead',
                picture: 'https://localhost:4000/dick.jpg',
              },
            ],
          },
        },
      },
    ]);

    const onUserPick = jest.fn(() => {});

    {
      const { container, getByTestId } = render(
        <ApolloProvider client={client}>
          <UsersList onUserPick={onUserPick} />
        </ApolloProvider>
      );

      await waitFor(() => screen.getByTestId('user'));

      fireEvent.click(getByTestId('user'));

      await waitFor(() => expect(onUserPick.mock.calls.length).toBe(1));

      const firstCall = onUserPick.mock.calls[0] as any[];
      expect(firstCall[0].name).toEqual('Charles Dickhead');
      expect(firstCall[0].picture).toEqual(
        'https://localhost:4000/dick.jpg'
      );
    }
  });
});
