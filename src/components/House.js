import React, {useState} from 'react';
import { gql } from "@apollo/client";
import { useQuery, useMutation } from '@apollo/client/react';
import { Badge } from './shared/Badge';
import { List, ListItem } from './shared/List';
import { useParams } from 'react-router-dom';
import InputForm from './shared/InputForm';

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

const ADD_REVIEW = gql`
  mutation addReview($body: String!, $house_id: UUID!) {
    insertIntoreviewCollection(
      objects: [
        {
          body: $body
          house_id: $house_id
        }
      ]
    ) {
      records {
        id
        body
        house_id
      }
    }
  }
`;

const House = () => {
    const { id } = useParams();

    const [input, setInput] = useState("");

    const { loading, error, data } = useQuery(HOUSE, { variables: { id }});

    const [addReview] = useMutation(ADD_REVIEW);

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

        <InputForm input={input} onChange={(e) => setInput(e.target.value)} onSubmit={() => {
            addReview({ variables: { body: input, house_id: id } })
            .then(() => setInput(""))
            .catch((err) => {
              setInput(err.message);
            });
        }} buttonText="Submit" />

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