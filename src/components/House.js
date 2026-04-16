import React from 'react';
import { useQuery } from '@apollo/client/react';
import { Badge } from './shared/Badge';
import { List, ListItem } from './shared/List';
import { Link, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { HOUSE } from './houseQueries';

const AddReviewButton = styled(Link)`
  position: fixed;
  right: 2.5rem;
  bottom: 2.5rem;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1.4rem 2.2rem;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(135deg, #1d4ed8, #0f766e);
  box-shadow: 0 18px 35px rgba(15, 23, 42, 0.24);
  text-decoration: none;
  font-size: 1.8rem;
  font-weight: 700;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 22px 40px rgba(15, 23, 42, 0.28);
  }
`;

const ReviewCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Star = styled.span`
  color: ${({ $filled }) => ($filled ? '#f59e0b' : '#cbd5e1')};
  font-size: 1.8rem;
`;

const RatingLabel = styled.span`
  font-size: 1.5rem;
  color: #475569;
`;

const EmptyState = styled.p`
  margin: 1.5rem 0 0;
`;

const House = () => {
    const { id } = useParams();

    const { loading, error, data } = useQuery(HOUSE, { variables: { id }});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    const house = data?.housesCollection?.edges[0]?.node;

    if (!house) return <p>No house found</p>;

    const { name, address, reviewCollection } = house;

    const reviews = reviewCollection?.edges.map(edge => edge.node) || [];

    const renderStars = (rating) => Array.from({ length: 5 }, (_, index) => (
      <Star key={`${rating}-${index}`} $filled={index < rating}>★</Star>
    ));

    return (
        <div>
        <h3>
            {name} <Badge>{address}</Badge>
        </h3>

        <AddReviewButton to={`/house/${id}/review`}>Add Review</AddReviewButton>

        {reviews.length === 0 ? (
          <EmptyState>No reviews yet</EmptyState>
        ) : (
          <List>
            {reviews.map((review) => (
              <ListItem key={review.id}>
                <ReviewCard>
                  <RatingRow>
                    <div>{renderStars(review.rating || 0)}</div>
                    <RatingLabel>{review.rating ? `${review.rating}/5` : 'No rating'}</RatingLabel>
                  </RatingRow>
                  <div>{review.body || 'No comments provided.'}</div>
                </ReviewCard>
              </ListItem>
            ))}
          </List>
        )}
        </div>
    );
};

export default House;