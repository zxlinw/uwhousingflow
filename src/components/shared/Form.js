import styled from "@emotion/styled";

export const Input = styled.input`
  height: 5.2rem;
  padding: 0.9rem 1.4rem;
  margin: 0;
  font-size: 1.8rem;
  line-height: 1.5;
  border-radius: 1.1rem;
  display: block;
  width: 100%;
  color: var(--ink-900);
  background-color: var(--surface);
  background-clip: padding-box;
  border: 1px solid var(--line);

  &:focus {
    outline: none;
    border-color: var(--brand-600);
    box-shadow: 0 0 0 3px rgba(45, 133, 91, 0.16);
  }
`;

export const Button = styled.button`
  color: #fff;
  background: linear-gradient(135deg, var(--brand-700), var(--brand-500));
  border-color: transparent;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  border: 1px solid transparent;
  padding: 1rem 1.8rem;
  font-size: 1.7rem;
  font-weight: 700;
  line-height: 1.5;
  min-height: 5.2rem;
  border-radius: 1.1rem;
  user-select: none;
  transition: transform 120ms ease, box-shadow 160ms ease, filter 120ms ease;

  &:hover {
    cursor: pointer;
    transform: translateY(-1px);
    filter: brightness(1.03);
    box-shadow: 0 12px 26px rgba(20, 80, 54, 0.28);
  }

  &:active {
    transform: translateY(0);
    filter: brightness(0.98);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    box-shadow: none;
  }
`;