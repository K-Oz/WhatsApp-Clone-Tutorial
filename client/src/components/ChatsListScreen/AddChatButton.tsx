import Button from '@material-ui/core/Button';
import ChatIcon from '@material-ui/icons/Chat';
import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';

const Container = styled.div`
  position: fixed;
  right: 10px;
  bottom: 10px;

  button {
    min-width: 50px;
    width: 50px;
    height: 50px;
    border-radius: 999px;
    background-color: var(--secondary-bg);
    color: white;
  }
`;

const AddChatButton: React.FC<RouteComponentProps> = ({ history }) => {
  const onClick = () => {
    history.push('/new-chat');
  };

  return (
    <Container>
      <Button
        data-testid="new-chat-button"
        variant="contained"
        color="secondary"
        onClick={onClick}>
        <ChatIcon />
      </Button>
    </Container>
  );
};

export default AddChatButton;
