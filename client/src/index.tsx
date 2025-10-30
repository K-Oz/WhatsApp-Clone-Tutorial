import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/client/react';
import './index.css'
import App from './App'
import client from './client';
import reportWebVitals from './reportWebVitals'

const theme = createTheme({
  palette: {
    primary: { main: '#2c6157' },
    secondary: { main: '#6fd056' },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
