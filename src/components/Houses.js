import React from 'react';
import { gql } from "@apollo/client";
import { useQuery } from '@apollo/client/react';
import { Badge } from './shared/Badge';
import { List, ListItem } from './shared/List';

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

export default function Houses({newHouses}) {
  const { loading, error, data } = useQuery(HOUSES);

  const renderHouses = (houses) => {
    return houses.map(({ id, name, address }) => (
      <ListItem key={id}>
        {name} <Badge>{address}</Badge>
      </ListItem>
    ));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const housesData = newHouses || data.housesCollection.edges.map(edge => edge.node);

  return <List>{renderHouses(housesData)}</List>;
};