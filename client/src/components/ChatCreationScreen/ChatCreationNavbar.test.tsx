import { createMemoryHistory } from 'history';
import React from 'react';
import { cleanup, render, fireEvent, waitFor } from '@testing-library/react';
import ChatCreationNavbar from './ChatCreationNavbar';
import { Router } from 'react-router-dom';

describe('ChatCreationNavbar', () => {
  afterEach(cleanup);

  it('goes back on arrow click', async () => {
    const history = createMemoryHistory();

    history.push('/new-chat');

    await waitFor(() => expect(history.location.pathname).toEqual('/new-chat'));

    {
      const { container, getByTestId } = render(
        <Router history={history}>
          <ChatCreationNavbar history={history} location={history.location} match={{} as any} />
        </Router>
      );

      fireEvent.click(getByTestId('back-button'));

      await waitFor(() => expect(history.location.pathname).toEqual('/chats'));
    }
  });
});
