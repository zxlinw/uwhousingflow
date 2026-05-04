import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import HouseSearch from './components/shared/HouseSearch';
import "./index.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import House from './components/House';
import AddReview from './components/AddReview';
import AuthPage from './components/auth/AuthPage';
import { supabase } from './lib/supabaseClient';
import { AuthProvider } from './context/AuthContext';

const httpLink = new HttpLink({
  uri: `${process.env.REACT_APP_SUPABASE_URL}/graphql/v1`,
});

const authLink = setContext(async (_, { headers }) => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  return {
    headers: {
      ...headers,
      apikey: process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApolloProvider client={client}>
          <Routes>
            <Route path="/house/:id" element={<House />} />
            <Route path="/house/:id/review" element={<AddReview />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<HouseSearch />} />
          </Routes>
        </ApolloProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};


const root = createRoot(document.getElementById('root')); 
root.render(<App />);

