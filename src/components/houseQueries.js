import { gql } from '@apollo/client';

export const HOUSE = gql`
  query getHouse($id: UUID!) {
    housesCollection(filter: { id: { eq: $id } }) {
      edges {
        node {
          id
          name
          address
          reviewCollection {
            edges {
              node {
                id
                body
                rating
              }
            }
          }
        }
      }
    }
  }
`;

export const ADD_REVIEW = gql`
  mutation addReview($body: String!, $rating: Int!, $house_id: UUID!) {
    insertIntoreviewCollection(
      objects: [
        {
          body: $body
          rating: $rating
          house_id: $house_id
        }
      ]
    ) {
      records {
        id
        body
        rating
        house_id
      }
    }
  }
`;