import React from 'react';
import { gql } from "@apollo/client";
import { useQuery } from '@apollo/client/react';

const HOUSES = gql`
query getAllHouses {
  housesCollection{
    edges{
      node{
        id
        name
        address
      }
    }
  }
}

`;

export default function Houses() {
  const { loading, error, data } = useQuery(HOUSES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return data.housesCollection.edges.map(({ node }) => (
  <div key={node.id}>
    <p>{node.name}</p>
    <p>{node.address}</p>
  </div>
));
}