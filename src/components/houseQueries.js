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
                user_id
                rating
                cost
                cleanliness
                location
                management
              }
            }
          }
        }
      }
    }
  }
`;

export const ADD_REVIEW = gql`
  mutation addReview(
    $body: String!
    $rating: Int!
    $house_id: UUID!
    $user_id: UUID!
    $cost: Int
    $cleanliness: Int
    $location: Int
    $management: Int
  ) {
    insertIntoreviewCollection(
      objects: [
        {
          body: $body
          rating: $rating
          house_id: $house_id
          user_id: $user_id
          cost: $cost
          cleanliness: $cleanliness
          location: $location
          management: $management
        }
      ]
    ) {
      records {
        id
      }
    }
  }
`;