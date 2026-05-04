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
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
`;

const Brand = styled(Link)`
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  color: var(--ink-900);
`;

const Nav = styled.nav`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const NavLink = styled(Link)`
  padding: 0.8rem 1.2rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--ink-700);
  background: var(--surface);

  &:hover {
    border-color: var(--brand-500);
    color: var(--brand-700);
  }
`;

const AuthButton = styled.button`
  padding: 0.8rem 1.2rem;
  border-radius: 999px;
  border: 1px solid var(--line);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--ink-700);
  background: var(--surface);
  cursor: pointer;

  &:hover {
    border-color: var(--brand-500);
    color: var(--brand-700);
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
