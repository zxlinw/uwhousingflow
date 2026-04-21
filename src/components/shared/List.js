import styled from "@emotion/styled";

export const List = styled.ul`
  padding: 0;
  margin: 2rem 0 10rem;
  width: min(96rem, 100%);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const ListItem = styled.li`
  display: block;
  padding: 2.4rem 2.6rem;
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: 1.4rem;
  box-shadow: 0 10px 30px rgba(19, 53, 37, 0.06);
`;

export const ListItemWithLink = styled.li`
  display: block;

  > a {
    display: block;
    background-color: var(--surface);
    padding: 2.4rem 2.6rem;
    border: 1px solid var(--line);
    border-radius: 1.4rem;
    transition: transform 120ms ease, box-shadow 160ms ease, border-color 120ms ease;

    &:hover {
      border-color: var(--brand-500);
      box-shadow: 0 14px 30px rgba(19, 53, 37, 0.12);
      transform: translateY(-1px);
      cursor: pointer;
    }
  }
`;