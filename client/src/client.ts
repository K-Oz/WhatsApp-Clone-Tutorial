import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpUri = process.env.REACT_APP_SERVER_URL + '/graphql';

const httpLink = new HttpLink({
  uri: httpUri,
});

const inMemoryCache = new InMemoryCache();

const client = new ApolloClient({
  link: httpLink,
  cache: inMemoryCache,
});

export default client;
