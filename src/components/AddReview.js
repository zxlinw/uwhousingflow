import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useMutation, useQuery } from '@apollo/client/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from './shared/Badge';
import { Button } from './shared/Form';
import { HOUSE, ADD_REVIEW } from './houseQueries';

const Page = styled.div`
  max-width: 72rem;
  margin: 0 auto;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 2rem;
  padding: 2.4rem;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(16px);
`;

const Field = styled.label`
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f172a;
  margin-top: 2rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 16rem;
  margin-top: 1rem;
  padding: 1.2rem 1.4rem;
  border-radius: 1.2rem;
  border: 1px solid #cbd5e1;
  font-size: 1.8rem;
  line-height: 1.5;
  resize: vertical;
  box-sizing: border-box;
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
  color: ${({ $active }) => ($active ? '#f59e0b' : '#cbd5e1')};
  font-size: 3rem;
  line-height: 1;

  &:hover {
    cursor: pointer;
    transform: translateY(-1px) scale(1.04);
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2.4rem;
  align-items: center;
`;

const SecondaryButton = styled(Button)`
  background-color: #e2e8f0;
  border-color: #e2e8f0;
  color: #0f172a;

  &:hover {
    background-color: #cbd5e1;
    border-color: #cbd5e1;
  }
`;

const RatingHint = styled.p`
  margin: 0.8rem 0 0;
  font-size: 1.5rem;
  color: #64748b;
`;

const AddReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');

  const { loading, error, data } = useQuery(HOUSE, { variables: { id } });
  const [addReview, { loading: saving }] = useMutation(ADD_REVIEW);

  const house = data?.housesCollection?.edges[0]?.node;
  const ratingText = useMemo(() => `${rating} out of 5`, [rating]);

  const handleSave = async () => {
    const trimmedComments = comments.trim();

    await addReview({
      variables: {
        body: trimmedComments,
        rating,
        house_id: id,
      },
    });

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (!house) return <p>No house found</p>;

  return (
    <Page>
      <h3>
        Add review for {house.name} <Badge>{house.address}</Badge>
      </h3>

      <Card>
        <Field>
          Rating
          <Stars>{renderStars()}</Stars>
          <RatingHint>{ratingText}</RatingHint>
        </Field>

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
  );
};

export default AddReview;