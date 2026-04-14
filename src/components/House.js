import React from 'react';
import { gql } from "@apollo/client";
import { useQuery } from '@apollo/client/react';
import { Badge } from './shared/Badge';
import { List, ListItem } from './shared/List';
import { useParams } from 'react-router-dom';

const HOUSE = gql`
  query getHouse($id: UUID!) {
    housesCollection(filter: { id: { eq: $id } }) {
      edges {
        node {
          id
          name
          address
          reviewCollection{
            edges{
              node{
                id
                body
              }
            }
          }
        }
      }
    }
  }
`;

const House = () => {
    const { id } = useParams();

    const { loading, error, data } = useQuery(HOUSE, { variables: { id },    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    const house = data?.housesCollection?.edges[0]?.node;

    if (!house) return <p>No house found</p>;

    const { name, address, reviewCollection } = house;

    const reviews = reviewCollection?.edges.map(edge => edge.node) || [];

    return (
        <div>
        <h3>
            {name} <Badge>{address}</Badge>
        </h3>

        <List>
            {reviews.length === 0 ? (
            <p>No reviews yet</p>
            ) : (
            reviews.map((review) => (
                <ListItem key={review.id}>{review.body}</ListItem>
            ))
            )}
        </List>
        </div>
    );
};

export default House;