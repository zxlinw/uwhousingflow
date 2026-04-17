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

const AverageRatingsSection = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 2rem;
  padding: 2.4rem;
  margin: 2rem 0;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(16px);
`;

const SectionTitle = styled.h4`
  margin: 0 0 2rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f172a;
`;

const RatingsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CircularProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const CircularProgress = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CircleSvg = styled.svg`
  transform: rotate(-90deg);
`;

const ProgressText = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const ProgressPercentage = styled.div`
  font-size: 2.8rem;
  font-weight: 700;
  color: #0f172a;
`;

const ProgressLabel = styled.div`
  font-size: 1.4rem;
  color: #64748b;
`;

const CategoryRatingsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CategoryRatingRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CategoryRatingLabel = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
  display: flex;
  justify-content: space-between;
`;

const HorizontalProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #ef4444);
  width: ${({ $percentage }) => $percentage}%;
  transition: width 0.3s ease;
`;

const ReviewCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  font-weight: 600;
`;

const CategoryRatings = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;

const CategoryRatingTag = styled.div`
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 0.8rem;
  padding: 0.6rem 1rem;
  font-size: 1.3rem;
  color: #b45309;
  font-weight: 500;
`;

const EmptyState = styled.p`
  margin: 1.5rem 0 0;
`;

const renderStars = (rating) => Array.from({ length: 5 }, (_, index) => (
  <Star key={`${rating}-${index}`} $filled={index < rating}>★</Star>
));

const calculateAverages = (reviews) => {
  if (reviews.length === 0) return null;

  const averages = {
    rating: 0,
    cost: 0,
    cleanliness: 0,
    location: 0,
    management: 0,
    count: {
      cost: 0,
      cleanliness: 0,
      location: 0,
      management: 0,
    }
  };

  reviews.forEach(review => {
    if (review.rating) averages.rating += review.rating;
    if (review.cost) {
      averages.cost += review.cost;
      averages.count.cost += 1;
    }
    if (review.cleanliness) {
      averages.cleanliness += review.cleanliness;
      averages.count.cleanliness += 1;
    }
    if (review.location) {
      averages.location += review.location;
      averages.count.location += 1;
    }
    if (review.management) {
      averages.management += review.management;
      averages.count.management += 1;
    }
  });

  averages.rating = (averages.rating / reviews.length) * 20; // Convert to percentage
  if (averages.count.cost > 0) averages.cost = (averages.cost / averages.count.cost) * 20;
  if (averages.count.cleanliness > 0) averages.cleanliness = (averages.cleanliness / averages.count.cleanliness) * 20;
  if (averages.count.location > 0) averages.location = (averages.location / averages.count.location) * 20;
  if (averages.count.management > 0) averages.management = (averages.management / averages.count.management) * 20;

  return averages;
};

const House = () => {
    const { id } = useParams();

    const { loading, error, data } = useQuery(HOUSE, { variables: { id }});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    const house = data?.housesCollection?.edges[0]?.node;

    if (!house) return <p>No house found</p>;

    const { name, address, reviewCollection } = house;

    const reviews = reviewCollection?.edges.map(edge => edge.node) || [];
    const averages = calculateAverages(reviews);

    return (
        <div>
        <h3>
            {name} <Badge>{address}</Badge>
        </h3>

        <AddReviewButton to={`/house/${id}/review`}>Add Review</AddReviewButton>

        {averages && reviews.length > 0 && (
          <AverageRatingsSection>
            <SectionTitle>Average Ratings</SectionTitle>
            <RatingsContainer>
              <CircularProgressContainer>
                <CircularProgress>
                  <CircleSvg width="180" height="180" viewBox="0 0 180 180">
                    <circle cx="90" cy="90" r="85" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                    <circle
                      cx="90"
                      cy="90"
                      r="85"
                      fill="none"
                      stroke="url(#grad)"
                      strokeWidth="6"
                      strokeDasharray={`${(averages.rating / 100) * 534.07} 534.07`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </CircleSvg>
                  <ProgressText>
                    <ProgressPercentage>{Math.round(averages.rating)}%</ProgressPercentage>
                    <ProgressLabel>Overall</ProgressLabel>
                  </ProgressText>
                </CircularProgress>
                <div style={{ textAlign: 'center', fontSize: '1.4rem', color: '#64748b' }}>
                  {(averages.rating / 20).toFixed(1)} / 5.0
                </div>
              </CircularProgressContainer>

              {(averages.count.cost > 0 || averages.count.cleanliness > 0 || 
                averages.count.location > 0 || averages.count.management > 0) && (
                <CategoryRatingsGrid>
                  {averages.count.cost > 0 && (
                    <CategoryRatingRow>
                      <CategoryRatingLabel>
                        <span>Cost</span>
                        <span>{Math.round(averages.cost)}%</span>
                      </CategoryRatingLabel>
                      <HorizontalProgressBar>
                        <ProgressFill $percentage={averages.cost} />
                      </HorizontalProgressBar>
                    </CategoryRatingRow>
                  )}
                  {averages.count.cleanliness > 0 && (
                    <CategoryRatingRow>
                      <CategoryRatingLabel>
                        <span>Cleanliness</span>
                        <span>{Math.round(averages.cleanliness)}%</span>
                      </CategoryRatingLabel>
                      <HorizontalProgressBar>
                        <ProgressFill $percentage={averages.cleanliness} />
                      </HorizontalProgressBar>
                    </CategoryRatingRow>
                  )}
                  {averages.count.location > 0 && (
                    <CategoryRatingRow>
                      <CategoryRatingLabel>
                        <span>Location</span>
                        <span>{Math.round(averages.location)}%</span>
                      </CategoryRatingLabel>
                      <HorizontalProgressBar>
                        <ProgressFill $percentage={averages.location} />
                      </HorizontalProgressBar>
                    </CategoryRatingRow>
                  )}
                  {averages.count.management > 0 && (
                    <CategoryRatingRow>
                      <CategoryRatingLabel>
                        <span>Management</span>
                        <span>{Math.round(averages.management)}%</span>
                      </CategoryRatingLabel>
                      <HorizontalProgressBar>
                        <ProgressFill $percentage={averages.management} />
                      </HorizontalProgressBar>
                    </CategoryRatingRow>
                  )}
                </CategoryRatingsGrid>
              )}
            </RatingsContainer>
          </AverageRatingsSection>
        )}

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

                  {(review.cost || review.cleanliness || review.location || review.management) && (
                    <CategoryRatings>
                      {review.cost && (
                        <CategoryRatingTag>Cost: {review.cost}/5</CategoryRatingTag>
                      )}
                      {review.cleanliness && (
                        <CategoryRatingTag>Cleanliness: {review.cleanliness}/5</CategoryRatingTag>
                      )}
                      {review.location && (
                        <CategoryRatingTag>Location: {review.location}/5</CategoryRatingTag>
                      )}
                      {review.management && (
                        <CategoryRatingTag>Management: {review.management}/5</CategoryRatingTag>
                      )}
                    </CategoryRatings>
                  )}

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