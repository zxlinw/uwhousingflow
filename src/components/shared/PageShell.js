import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';

const Shell = styled.div`
  width: min(102rem, 100%);
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.4rem 1.8rem;
  border-radius: 1.5rem;
  border: 2px solid var(--brand-500);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(244, 208, 63, 0.08));
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(212, 165, 0, 0.1);
`;

const Brand = styled(Link)`
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  background: linear-gradient(135deg, var(--brand-700), var(--brand-600));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: transform 120ms ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const NavLink = styled(Link)`
  padding: 0.8rem 1.2rem;
  border-radius: 999px;
  border: 2px solid transparent;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--ink-700);
  background: var(--surface);
  cursor: pointer;
  transition: all 120ms ease;
  position: relative;

  &:hover {
    border-color: var(--brand-600);
    color: var(--brand-700);
    background: linear-gradient(135deg, rgba(244, 208, 63, 0.1), rgba(255, 237, 78, 0.08));
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 165, 0, 0.15);
  }
`;

const AuthButton = styled.button`
  padding: 0.8rem 1.2rem;
  border-radius: 999px;
  border: 2px solid transparent;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--ink-700);
  background: var(--surface);
  cursor: pointer;
  transition: all 120ms ease;

  &:hover {
    border-color: var(--brand-600);
    color: var(--brand-700);
    background: linear-gradient(135deg, rgba(244, 208, 63, 0.1), rgba(255, 237, 78, 0.08));
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 165, 0, 0.15);
  }
`;

const Title = styled.h1`
  margin: 1rem 0 1.6rem;
  font-size: clamp(2.4rem, 3.4vw, 3.6rem);
  line-height: 1.12;
`;

const Subtitle = styled.p`
  margin: -0.8rem 0 2.2rem;
  font-size: 1.6rem;
  color: var(--ink-500);
`;

const PageShell = ({ title, subtitle, children, navItems = [] }) => {
  const { user } = useAuth();

  return (
    <Shell>
      <Header>
        <Brand to="/">UWHousingFlow</Brand>
        <Nav>
          {navItems.map((item) => (
            <NavLink to={item.to} key={`${item.to}-${item.label}`}>
              {item.label}
            </NavLink>
          ))}

          {user && <NavLink to="/favorites">Favorites</NavLink>}

          {user ? (
            <AuthButton type="button" onClick={() => supabase.auth.signOut()}>
              Sign Out
            </AuthButton>
          ) : (
            <NavLink to="/auth">Sign In</NavLink>
          )}
        </Nav>
      </Header>

      {title && <Title>{title}</Title>}
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
      {children}
    </Shell>
  );
};

export default PageShell;
