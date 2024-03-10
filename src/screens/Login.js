import React from 'react';
import styled from 'styled-components/native';
import {Text, Button} from 'react-native';

const Container = styled.View`
flex: 1;
justify-content: center;
align-items: center;
background-color: ${({ theme }) => theme.background};
`;

const Login = ({ navigation }) => {
    return (
        <Container>
            <Text style={{ fontSize: 30 }}>Login Screen</Text>
            {/* navigation.navigate(): 화면 이동, 이름이나 경로 매개변수로 넣으면 됨 */}
            <Button title="Signup" onPress={() => navigation.navigate('Signup')} />
        </Container>
    );
};

export default Login;