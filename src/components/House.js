import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Badge } from './shared/Badge';
import { List, ListItem } from './shared/List';
import { Link, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { HOUSE } from './houseQueries';
import PageShell from './shared/PageShell';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const AddReviewButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1.4rem 2.2rem;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(135deg, var(--brand-700), var(--brand-600));
  box-shadow: 0 18px 35px rgba(212, 165, 0, 0.24);
  text-decoration: none;
  font-size: 1.8rem;
  font-weight: 700;
  transition: all 120ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 22px 40px rgba(201, 134, 15, 0.32);
    filter: brightness(1.05);
  }
`;

const FloatingActions = styled.div`
  position: fixed;
  right: 2.5rem;
  bottom: 2.5rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.9rem;
`;

const FavoriteButton = styled.button`
  width: 4.8rem;
  height: 4.8rem;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 2.1rem;
  font-weight: 700;
  color: #fff;
  background: ${({ $active }) => ($active
    ? 'linear-gradient(135deg, var(--brand-700), var(--brand-600))'
    : 'linear-gradient(135deg, #94a3b8, #64748b)')};
  box-shadow: 0 16px 30px rgba(212, 165, 0, ${({ $active }) => $active ? '0.24' : '0.12'});
  cursor: pointer;
  transition: all 120ms ease;

  &:hover {
    transform: translateY(-2px) scale(1.05);
    filter: ${({ $active }) => $active ? 'brightness(1.05)' : 'brightness(1.03)'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const AverageRatingsSection = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(244, 208, 63, 0.08));
  border: 2px solid var(--brand-500);
  border-radius: 2rem;
  padding: 2.4rem;
  margin: 2rem 0;
  box-shadow: 0 24px 60px rgba(212, 165, 0, 0.15);
  backdrop-filter: blur(16px);
`;

const SummaryPanel = styled.div`
  margin: 0 0 2rem;
  padding: 1.8rem 2rem;
  border-radius: 1.4rem;
  border: 2px solid var(--brand-500);
  background: linear-gradient(180deg, rgba(244, 208, 63, 0.06), rgba(255, 237, 78, 0.04));
`;

const SummaryLabel = styled.p`
  margin: 0 0 0.8rem;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand-700);
`;

const SummaryText = styled.p`
  margin: 0;
  font-size: 1.6rem;
  line-height: 1.6;
  color: #0f172a;
`;

const SummaryMeta = styled.p`
  margin: 1rem 0 0;
  font-size: 1.3rem;
  color: #64748b;
`;

const SummaryStatus = styled.p`
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.6;
  color: ${({ $tone }) => ($tone === 'error' ? '#b91c1c' : '#475569')};
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

const ReviewAuthor = styled.p`
  margin: 0.4rem 0 0;
  font-size: 1.2rem;
  color: #64748b;
`;

const EmptyState = styled.p`
  margin: 1.5rem 0 0;
`;

const renderStars = (rating) => Array.from({ length: 5 }, (_, index) => (
  <Star key={`${rating}-${index}`} $filled={index < rating}>★</Star>
));

const SUMMARY_API_URL = process.env.REACT_APP_SUMMARY_API_URL || 'http://127.0.0.1:8000';

const formatSummaryApiUrl = (value) => value.replace(/\/$/, '');

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
  const { user, loading: authLoading } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [favError, setFavError] = useState('');
  const [reviewSummary, setReviewSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  const { loading, error, data } = useQuery(HOUSE, { variables: { id } });
  const house = data?.housesCollection?.edges[0]?.node;
  const name = house?.name || '';
  const address = house?.address || '';
  const reviewCollection = house?.reviewCollection;
  const reviews = useMemo(() => reviewCollection?.edges.map((edge) => edge.node) || [], [reviewCollection]);
  const averages = useMemo(() => calculateAverages(reviews), [reviews]);
  const currentUserName = useMemo(() => {
    const username = user?.user_metadata?.username;
    if (username && String(username).trim()) {
      return String(username).trim();
    }

    const email = user?.email;
    if (email && String(email).trim()) {
      return String(email).trim();
    }

    return null;
  }, [user]);

  useEffect(() => {
    let mounted = true;

    const loadFavorite = async () => {
      if (!user || !id) {
        if (mounted) setIsFavorite(false);
        return;
      }

      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('house_id', id)
        .limit(1);

      if (mounted) setIsFavorite(Array.isArray(data) && data.length > 0);
    };

    loadFavorite();

    return () => { mounted = false; };
  }, [user, id]);

  const toggleFavorite = async () => {
    if (!user) return;
    setFavLoading(true);
    setFavError('');

    try {
      if (!isFavorite) {
        const { error: insertError } = await supabase.from('favorites').insert({ user_id: user.id, house_id: id });
        if (insertError) throw insertError;
        setIsFavorite(true);
      } else {
        const { error: deleteError } = await supabase.from('favorites').delete().match({ user_id: user.id, house_id: id });
        if (deleteError) throw deleteError;
        setIsFavorite(false);
      }
    } catch (requestError) {
      setFavError(requestError.message || 'Unable to update favorites.');
    } finally {
      setFavLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const generateSummary = async () => {
      if (!house || reviews.length === 0) {
        setReviewSummary('');
        setSummaryLoading(false);
        setSummaryError('');
        return;
      }

      try {
        setSummaryLoading(true);
        setSummaryError('');

        const response = await fetch(`${formatSummaryApiUrl(SUMMARY_API_URL)}/api/house-summary`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            address,
            reviews: reviews.map(({ body, rating, cost, cleanliness, location, management }) => ({
              body,
              rating,
              cost,
              cleanliness,
              location,
              management,
            })),
          }),
        });

        if (!response.ok) {
          throw new Error(`Summary request failed with status ${response.status}`);
        }

        const result = await response.json();

        if (!cancelled) {
          setReviewSummary(result.summary || '');
        }
      } catch (requestError) {
        if (!cancelled) {
          setReviewSummary('');
          setSummaryError('AI overview unavailable right now. Start the Python backend and Ollama, then reload this page.');
        }
      } finally {
        if (!cancelled) {
          setSummaryLoading(false);
        }
      }
    };

    generateSummary();

    return () => {
      cancelled = true;
    };
  }, [address, house, name, reviews]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (!house) return <p>No house found</p>;

  return (
    <PageShell
      title={name}
      subtitle={address}
      navItems={[
        { to: '/', label: 'Home' },
        { to: `/house/${id}/review`, label: 'Add Review' },
      ]}
    >
      <h3>
        Reviews <Badge>{address}</Badge>
      </h3>

        <FloatingActions>
          <AddReviewButton to={`/house/${id}/review`}>Add Review</AddReviewButton>
          <FavoriteButton
            type="button"
            onClick={toggleFavorite}
            disabled={favLoading || authLoading}
            $active={isFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '♥' : '♡'}
          </FavoriteButton>
        </FloatingActions>

        {favError && <SummaryStatus $tone="error">{favError}</SummaryStatus>}

        {averages && reviews.length > 0 && (
          <AverageRatingsSection>
            <SectionTitle>Average Ratings</SectionTitle>
            <SummaryPanel>
              <SummaryLabel>AI Overview</SummaryLabel>
              {summaryLoading && (
                <SummaryStatus>Generating a short overview from the existing reviews...</SummaryStatus>
              )}
              {!summaryLoading && reviewSummary && <SummaryText>{reviewSummary}</SummaryText>}
              {!summaryLoading && !reviewSummary && summaryError && (
                <SummaryStatus $tone="error">{summaryError}</SummaryStatus>
              )}
              {!summaryLoading && !reviewSummary && !summaryError && (
                <SummaryStatus>No summary available yet.</SummaryStatus>
              )}
              <SummaryMeta>
                Based on {reviews.length} review{reviews.length === 1 ? '' : 's'} with LangChain and a free Ollama model.
              </SummaryMeta>
            </SummaryPanel>
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

                  <div style={{ fontSize: '0.95rem', color: '#475569' }}>{review.body || 'No comments provided.'}</div>
                  <ReviewAuthor>
                    — {review.user_id && user && review.user_id === user.id
                      ? (currentUserName || `User ${String(review.user_id).slice(0, 8)}`)
                      : (review.user_id ? `User ${String(review.user_id).slice(0, 8)}` : 'Anonymous')}
                  </ReviewAuthor>
                </ReviewCard>
              </ListItem>
            ))}
          </List>
        )}
        </PageShell>
  );
};

export default House;