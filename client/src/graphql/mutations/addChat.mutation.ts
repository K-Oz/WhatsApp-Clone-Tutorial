import gql from 'graphql-tag';
import * as fragments from '../fragments';

export default gql`
  mutation AddChat($recipientId: ID!) {
    addChat(recipientId: $recipientId) {
      ...Chat
    }
  }
  ${fragments.chat}
`;
