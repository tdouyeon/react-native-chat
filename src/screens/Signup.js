import React from "react";
import styled from "styled-components/native";
import { Text, Button } from 'react-native';

const Container = styled.View`
flex: 1;
justify-contnet: center;
align-items: center;
background-color: ${({ theme }) => theme.background };
`;

const Signup = () => {
    return (
        <Container>
            <Text style={{ fontSize: 30 }}>Signup Screen</Text>
        </Container>
    );
};

export default Signup;