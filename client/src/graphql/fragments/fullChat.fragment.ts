import gql from 'graphql-tag';
import chat from './chat.fragment';
import message from './message.fragment';

export default gql`
  fragment FullChat on Chat {
    ...Chat
    messages(limit: 100, after: 0) {
      hasMore
      cursor
      messages {
        ...Message
      }
    }
  }
  ${chat}
  ${message}
`;
