import React from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import HouseSearch from './components/shared/HouseSearch';
import "./index.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import House from './components/House';
import AddReview from './components/AddReview';

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
    <BrowserRouter>
        <ApolloProvider client={client}>
          <Routes>
            <Route path="/house/:id" element={<House />} />
            <Route path="/house/:id/review" element={<AddReview />} />
            <Route path="/" element={<HouseSearch />} />
          </Routes>
        </ApolloProvider>
      </BrowserRouter>
  );


const root = createRoot(document.getElementById('root')); 
root.render(<App />);

