import React from 'react';
import { gql } from "@apollo/client";
import { useQuery } from '@apollo/client/react';
import styled from '@emotion/styled';
import { Badge } from './shared/Badge';
import { List, ListItemWithLink } from './shared/List';
import {Link} from 'react-router-dom';

const Meta = styled.p`
  font-size: 1.5rem;
  color: var(--ink-500);
  margin: 1.6rem 0 0.8rem;
`;

const Empty = styled.div`
  margin-top: 2rem;
  padding: 2.2rem;
  border: 1px dashed var(--line);
  border-radius: 1.2rem;
  font-size: 1.6rem;
  color: var(--ink-700);
  background: rgba(255, 255, 255, 0.7);
`;

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

export default function Houses({newHouses, loading: searchLoading, error: searchError}) {
  const { loading, error, data } = useQuery(HOUSES);

  const renderHouses = (houses) => {
    return houses.map(({ id, name, address }) => (
      <ListItemWithLink key={id}>
        <Link to={`/house/${id}`}>
          {name} <Badge>{address}</Badge>
        </Link>
      </ListItemWithLink>
    ));
  };

  if (loading) return <Meta>Loading houses...</Meta>;
  if (error) return <Meta>Error: {error.message}</Meta>;
  if (searchLoading) return <Meta>Searching...</Meta>;
  if (searchError) return <Meta>Error: {searchError.message}</Meta>;

  const housesData = newHouses || data.housesCollection.edges.map(edge => edge.node);

  if (housesData.length === 0) {
    return <Empty>No matching homes found. Try a broader name or street search.</Empty>;
  }

  return (
    <>
      <Meta>{housesData.length} homes found</Meta>
      <List>{renderHouses(housesData)}</List>
    </>
  );
};