import React from 'react';
import styled from "@emotion/styled";
import { Input, Button } from "./Form";

const Container = styled.div`
    display: flex;
    align-items: center;
    > button {
        margin-left: 1rem;
    }
`;

const InputForm = ({input, onChange, onSubmit, buttonText}) => {
    return (
        <Container>
            <Input value={input} onChange={onChange} />
            <Button onClick={onSubmit}>{buttonText || "Search"}</Button>
        </Container>
    );
}

export default InputForm;