import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Badge } from './shared/Badge';
import { List, ListItemWithLink } from './shared/List';
import PageShell from './shared/PageShell';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const Meta = styled.p`
  font-size: 1.5rem;
  color: var(--ink-500);
  margin: 1.2rem 0;
`;

const Empty = styled.div`
  margin-top: 2rem;
  padding: 2.2rem;
  border: 2px dashed var(--brand-500);
  border-radius: 1.2rem;
  font-size: 1.6rem;
  color: var(--ink-700);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(244, 208, 63, 0.06));
`;

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadFavorites = async () => {
      if (authLoading) {
        return;
      }

      if (!user) {
        if (mounted) {
          setHouses([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError('');

      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('house_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (favoritesError) {
        if (mounted) {
          setError(favoritesError.message || 'Unable to load favorites.');
          setHouses([]);
          setLoading(false);
        }
        return;
      }

      const houseIds = (favoritesData || []).map((favorite) => favorite.house_id).filter(Boolean);

      if (houseIds.length === 0) {
        if (mounted) {
          setHouses([]);
          setLoading(false);
        }
        return;
      }

      const { data: housesData, error: housesError } = await supabase
        .from('houses')
        .select('id,name,address')
        .in('id', houseIds);

      if (housesError) {
        if (mounted) {
          setError(housesError.message || 'Unable to load saved houses.');
          setHouses([]);
          setLoading(false);
        }
        return;
      }

      const byId = (housesData || []).reduce((acc, house) => {
        acc[house.id] = house;
        return acc;
      }, {});

      // Preserve the saved-order from favoritesData.
      const ordered = houseIds.map((houseId) => byId[houseId]).filter(Boolean);

      if (mounted) {
        setHouses(ordered);
        setLoading(false);
      }
    };

    loadFavorites();

    return () => {
      mounted = false;
    };
  }, [authLoading, user]);

  return (
    <PageShell
      title="Saved Houses"
      subtitle="Your favorited listings, ordered by when you saved them."
      navItems={[{ to: '/', label: 'Home' }]}
    >
      {authLoading && <Meta>Checking your account...</Meta>}

      {!authLoading && !user && (
        <Empty>
          Sign in to save houses and view your favorites. <Link to="/auth">Go to authentication</Link>.
        </Empty>
      )}

      {!authLoading && user && loading && <Meta>Loading saved houses...</Meta>}
      {!authLoading && user && error && <Meta>Error: {error}</Meta>}

      {!authLoading && user && !loading && !error && houses.length === 0 && (
        <Empty>
          You have no favorites yet. Open any house page and click the heart to save it.
        </Empty>
      )}

      {!authLoading && user && !loading && !error && houses.length > 0 && (
        <>
          <Meta>{houses.length} saved home{houses.length === 1 ? '' : 's'}</Meta>
          <List>
            {houses.map(({ id, name, address }) => (
              <ListItemWithLink key={id}>
                <Link to={`/house/${id}`}>
                  {name} <Badge>{address}</Badge>
                </Link>
              </ListItemWithLink>
            ))}
          </List>
        </>
      )}
    </PageShell>
  );
};

export default Favorites;