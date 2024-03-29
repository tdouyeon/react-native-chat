import React, {useState } from 'react';
import { StatusBar, Image,Text } from 'react-native';
import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import Navigation from './navigations';

const cacheImages = images => {
    return images.map(image => {
        if (typeof image === 'string') {
            //  prefetch(): 데이터나 리소스를 미리 불러와서 캐시에 저장해두는 기능
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image).downloadAsync();
        }
    });
};

const cacheFonts = fonts => {
    return fonts.map(font => Font.loadAsync(font));
};

const App = () => {
    const [isReady, setIsReady ] = useState(false);

    const _loadAssets = async() => {
        const imageAssets = cacheImages([require('../assets/splash.png')]);
        const fontAssets = cacheFonts([]);

        await Promise.all([...imageAssets, ...fontAssets]);
    };

    return isReady? (
        <ThemeProvider theme={theme}>
            <StatusBar barStyle={'dark-content'} />
            <Navigation />
        </ThemeProvider>
    ) : (
        <AppLoading
        startAsync={_loadAssets}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
        />
    );
};

export default App;