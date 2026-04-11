import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import Houses from './components/Houses';
import Search from './components/Search';
import "./index.css";

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${process.env.REACT_APP_SUPABASE_URL}/graphql/v1`,
    headers: {
      apikey: process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY
    },
  }),
  cache: new InMemoryCache(),
});

  const App = () => (
    <ApolloProvider client={client}>
    <Search> </Search>
      <Houses />
  </ApolloProvider>
  );


const root = createRoot(document.getElementById('root')); 
root.render(<App />);

