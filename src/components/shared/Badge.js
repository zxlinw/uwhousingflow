import styled from "@emotion/styled";

export const Badge = styled.span`
    display: inline-block;
    padding: 0.45rem 0.9rem;
    font-size: 1.2rem;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: normal;
    vertical-align: middle;
    border-radius: 999px;
    color: #2b2416;
    background: linear-gradient(135deg, #f4d03f, #ffd700);
    border: 1px solid #d4a500;
    margin-left: 0.8rem;
    box-shadow: 0 2px 8px rgba(212, 165, 0, 0.15);
    transition: transform 120ms ease, box-shadow 120ms ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(212, 165, 0, 0.25);
    }
`;
