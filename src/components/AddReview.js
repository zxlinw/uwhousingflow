import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useMutation, useQuery } from '@apollo/client/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from './shared/Badge';
import { Button } from './shared/Form';
import { HOUSE, ADD_REVIEW } from './houseQueries';
import PageShell from './shared/PageShell';
import { useAuth } from '../context/AuthContext';

const Page = styled.div`
  max-width: 72rem;
  margin: 0 auto;
`;

const Card = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(244, 208, 63, 0.08));
  border: 2px solid var(--brand-500);
  border-radius: 2rem;
  padding: 2.4rem;
  box-shadow: 0 24px 60px rgba(212, 165, 0, 0.15);
  backdrop-filter: blur(16px);
`;

const Field = styled.label`
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--ink-900);
  margin-top: 2rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 16rem;
  margin-top: 1rem;
  padding: 1.2rem 1.4rem;
  border-radius: 1.2rem;
  border: 2px solid var(--line);
  font-size: 1.8rem;
  line-height: 1.5;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
  transition: all 120ms ease;

  &:focus {
    outline: none;
    border-color: var(--brand-600);
    box-shadow: 0 0 0 3px rgba(212, 165, 0, 0.12);
    background: linear-gradient(135deg, rgba(244, 208, 63, 0.02), rgba(255, 237, 78, 0.02));
  }
`;

const Stars = styled.div`
  display: inline-flex;
  gap: 0.6rem;
  margin-top: 1rem;
`;

const StarButton = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  color: ${({ $active }) => ($active ? 'var(--brand-600)' : '#d1d5db')};
  font-size: 3rem;
  line-height: 1;
  transition: all 120ms ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px) scale(1.1);
    color: var(--brand-600);
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2.4rem;
  align-items: center;
`;

const SecondaryButton = styled(Button)`
  background: linear-gradient(135deg, rgba(148, 163, 184, 0.5), rgba(100, 116, 139, 0.5));
  border-color: transparent;
  color: #fff;

  &:hover {
    background: linear-gradient(135deg, rgba(148, 163, 184, 0.7), rgba(100, 116, 139, 0.7));
    filter: brightness(1.05);
  }
`;

const RatingHint = styled.p`
  margin: 0.8rem 0 0;
  font-size: 1.5rem;
  color: #64748b;
`;

const CategoryRatingSection = styled.div`
  margin-top: 2rem;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
`;

const CategoryCard = styled.div`
  background: rgba(148, 163, 184, 0.08);
  padding: 1.5rem;
  border-radius: 1.2rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
`;

const CategoryLabel = styled.p`
  margin: 0 0 1rem;
  font-size: 1.6rem;
  font-weight: 600;
  color: #0f172a;
`;

const CategoryStars = styled.div`
  display: inline-flex;
  gap: 0.4rem;
`;

const CategoryStarButton = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  color: ${({ $active }) => ($active ? '#f59e0b' : '#cbd5e1')};
  font-size: 1.8rem;
  line-height: 1;

  &:hover {
    cursor: pointer;
    transform: translateY(-1px) scale(1.08);
  }
`;

const Subtitle = styled.p`
  margin: 0.5rem 0 0;
  font-size: 1.3rem;
  color: #94a3b8;
  font-weight: 400;
`;

const AuthNotice = styled.div`
  max-width: 72rem;
  margin: 2rem auto 0;
  padding: 2rem;
  border-radius: 1.4rem;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(255, 255, 255, 0.92);
`;

const AuthNoticeText = styled.p`
  margin: 0;
  font-size: 1.6rem;
  color: #0f172a;

  a {
    color: #1d4ed8;
    font-weight: 700;
  }
`;

const AddReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [rating, setRating] = useState(5);
  const [cost, setCost] = useState(0);
  const [cleanliness, setCleanliness] = useState(0);
  const [location, setLocation] = useState(0);
  const [management, setManagement] = useState(0);
  const [comments, setComments] = useState('');

  const { loading, error, data } = useQuery(HOUSE, { variables: { id } });
  const [addReview, { loading: saving }] = useMutation(ADD_REVIEW);

  const house = data?.housesCollection?.edges[0]?.node;
  const ratingText = useMemo(() => `${rating} out of 5`, [rating]);

  const handleSave = async () => {
    const trimmedComments = comments.trim();
    const variables = {
      body: trimmedComments,
      rating,
      house_id: id,
      user_id: user.id,
    };

    // Only include optional ratings if they have a value > 0
    if (cost > 0) variables.cost = cost;
    if (cleanliness > 0) variables.cleanliness = cleanliness;
    if (location > 0) variables.location = location;
    if (management > 0) variables.management = management;

    await addReview({ variables });

    navigate(`/house/${id}`);
  };

  const renderStars = () => Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;

    return (
      <StarButton
        key={starValue}
        type="button"
        $active={starValue <= rating}
        onClick={() => setRating(starValue)}
        aria-label={`${starValue} star${starValue === 1 ? '' : 's'}`}
      >
        ★
      </StarButton>
    );
  });

  const renderCategoryStars = (value, setter) => Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;

    return (
      <CategoryStarButton
        key={starValue}
        type="button"
        $active={starValue <= value}
        onClick={() => setter(starValue)}
        aria-label={`${starValue} star${starValue === 1 ? '' : 's'}`}
      >
        ★
      </CategoryStarButton>
    );
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (!house) return <p>No house found</p>;

  if (authLoading) {
    return <p>Checking your account...</p>;
  }

  if (!user) {
    return (
      <PageShell
        title={`Add Review: ${house.name}`}
        subtitle={house.address}
        navItems={[
          { to: '/', label: 'Home' },
          { to: `/house/${id}`, label: 'Back to House' },
        ]}
      >
        <AuthNotice>
          <AuthNoticeText>
            Sign in to add a review. <Link to="/auth">Go to authentication</Link>.
          </AuthNoticeText>
        </AuthNotice>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={`Add Review: ${house.name}`}
      subtitle={house.address}
      navItems={[
        { to: '/', label: 'Home' },
        { to: `/house/${id}`, label: 'Back to House' },
      ]}
    >
    <Page>
      <h3>
        New Review <Badge>{house.address}</Badge>
      </h3>

      <Card>
        <Field>
          Rating
          <Stars>{renderStars()}</Stars>
          <RatingHint>{ratingText}</RatingHint>
        </Field>

        <CategoryRatingSection>
          <Field as="div">Optional Category Ratings</Field>
          <Subtitle>You can rate individual aspects of this house. Leave unrated to skip.</Subtitle>
          <CategoryGrid>
            <CategoryCard>
              <CategoryLabel>Cost</CategoryLabel>
              <CategoryStars>{renderCategoryStars(cost, setCost)}</CategoryStars>
            </CategoryCard>
            <CategoryCard>
              <CategoryLabel>Cleanliness</CategoryLabel>
              <CategoryStars>{renderCategoryStars(cleanliness, setCleanliness)}</CategoryStars>
            </CategoryCard>
            <CategoryCard>
              <CategoryLabel>Location</CategoryLabel>
              <CategoryStars>{renderCategoryStars(location, setLocation)}</CategoryStars>
            </CategoryCard>
            <CategoryCard>
              <CategoryLabel>Management</CategoryLabel>
              <CategoryStars>{renderCategoryStars(management, setManagement)}</CategoryStars>
            </CategoryCard>
          </CategoryGrid>
        </CategoryRatingSection>

        <Field htmlFor="review-comments">
          Comments
          <Textarea
            id="review-comments"
            value={comments}
            onChange={(event) => setComments(event.target.value)}
            placeholder="Share anything helpful about this house"
          />
        </Field>

        <Actions>
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <SecondaryButton type="button" onClick={() => navigate(`/house/${id}`)} disabled={saving}>
            Cancel
          </SecondaryButton>
        </Actions>
      </Card>
    </Page>
    </PageShell>
  );
};

export default AddReview;