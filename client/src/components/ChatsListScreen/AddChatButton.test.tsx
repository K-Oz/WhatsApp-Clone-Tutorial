import { createMemoryHistory } from 'history';
import { ApolloProvider } from '@apollo/client/react';
import React from 'react';
import { cleanup, render, fireEvent, waitFor } from '@testing-library/react';
import AddChatButton from './AddChatButton';
import { mockApolloClient } from '../../test-helpers';
import { Router } from 'react-router-dom';

describe('AddChatButton', () => {
  afterEach(cleanup);

  it('goes to /new-chat on button click', async () => {
    const history = createMemoryHistory();
    const client = mockApolloClient();

    {
      const { container, getByTestId } = render(
        <ApolloProvider client={client}>
          <Router history={history}>
            <AddChatButton history={history} location={history.location} match={{} as any} />
          </Router>
        </ApolloProvider>
      );

      fireEvent.click(getByTestId('new-chat-button'));

      await waitFor(() =>
        expect(history.location.pathname).toEqual('/new-chat')
      );
    }
  });
});
