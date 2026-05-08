import React from 'react';
import styled from "@emotion/styled";
import { Input, Button } from "./Form";

const Container = styled.form`
    display: flex;
        flex-wrap: wrap;
    align-items: center;
        gap: 1rem;
        width: min(96rem, 100%);
        padding: 1.6rem;
        border: 2px solid var(--brand-500);
        border-radius: 1.6rem;
        background: linear-gradient(135deg, var(--surface), rgba(244, 208, 63, 0.08));
        box-shadow: var(--shadow-lg);

        > input {
            flex: 1 1 28rem;
        }

    > button {
            flex: 0 0 auto;
    }
`;

const Hint = styled.p`
    width: 100%;
    margin: 0;
    font-size: 1.4rem;
    color: var(--ink-500);
`;

const InputForm = ({input, onChange, onSubmit, buttonText}) => {
    return (
                <Container
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSubmit();
                    }}
                >
                        <Input
                            value={input}
                            onChange={onChange}
                            placeholder="Search by house name or address"
                            aria-label="Search by house name or address"
                        />
                        <Button type="submit">{buttonText || "Search"}</Button>
                        <Hint>Try: 15th Ave, University Way, or a house name</Hint>
        </Container>
    );
}

export default InputForm;