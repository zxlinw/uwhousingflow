import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import PageShell from '../shared/PageShell';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

const Card = styled.div`
  max-width: 56rem;
  margin: 0 auto;
  padding: 2.6rem;
  border-radius: 1.8rem;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 24px 60px rgba(14, 41, 29, 0.12);
`;

const Tabs = styled.div`
  display: inline-flex;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.4rem;
  background: var(--surface-alt);
`;

const TabButton = styled.button`
  border: 0;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? 'var(--brand-600)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : 'var(--ink-700)')};
  font-size: 1.4rem;
  font-weight: 700;
  padding: 0.75rem 1.4rem;
  cursor: pointer;
`;

const Group = styled.label`
  display: block;
  margin-top: 1.6rem;
  font-size: 1.4rem;
  color: var(--ink-700);
`;

const Input = styled.input`
  width: 100%;
  margin-top: 0.6rem;
  border: 1px solid var(--line);
  border-radius: 1rem;
  padding: 1rem 1.2rem;
  font-size: 1.6rem;
  font-family: inherit;
`;

const PrimaryButton = styled.button`
  margin-top: 2rem;
  border: 1px solid var(--brand-600);
  background: var(--brand-600);
  color: #fff;
  border-radius: 999px;
  padding: 1rem 1.7rem;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Hint = styled.p`
  margin: 1rem 0 0;
  font-size: 1.3rem;
  color: var(--ink-500);
`;

const Message = styled.p`
  margin: 1.5rem 0 0;
  font-size: 1.4rem;
  color: ${({ $error }) => ($error ? '#b91c1c' : 'var(--brand-700)')};
`;

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const title = useMemo(() => (mode === 'signin' ? 'Sign In' : 'Create Account'), [mode]);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }

        navigate('/');
      } else {
        const normalizedUsername = username.trim();

        if (!normalizedUsername) {
          throw new Error('Please choose a username.');
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: normalizedUsername,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        setMessage('Account created. Check your inbox for a confirmation email if your project requires email verification.');
      }
    } catch (requestError) {
      setError(requestError.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell
      title={title}
      subtitle="Use your Supabase Auth account to add reviews."
      navItems={[{ to: '/', label: 'Home' }]}
    >
      <Card>
        <Tabs role="tablist" aria-label="Authentication mode">
          <TabButton type="button" $active={mode === 'signin'} onClick={() => setMode('signin')}>
            Sign In
          </TabButton>
          <TabButton type="button" $active={mode === 'signup'} onClick={() => setMode('signup')}>
            Sign Up
          </TabButton>
        </Tabs>

        <form onSubmit={handleSubmit}>
          <Group htmlFor="auth-email">
            Email
            <Input
              id="auth-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Group>

          <Group htmlFor="auth-password">
            Password
            <Input
              id="auth-password"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              minLength={6}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Group>

          {mode === 'signup' && (
            <Group htmlFor="auth-username">
              Username
              <Input
                id="auth-username"
                type="text"
                autoComplete="username"
                minLength={2}
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </Group>
          )}

          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </PrimaryButton>
        </form>

        {message && <Message>{message}</Message>}
        {error && <Message $error>{error}</Message>}

        <Hint>
          After signing in, go back to any house page and add a review. <Link to="/">Return to search.</Link>
        </Hint>
      </Card>
    </PageShell>
  );
};

export default AuthPage;
