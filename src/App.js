import React from 'react';
import { StatusBar, Text } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Text>왕</Text>
            <StatusBar barStyle={'dark-content'} />
        </ThemeProvider>
    )
}

export default App;