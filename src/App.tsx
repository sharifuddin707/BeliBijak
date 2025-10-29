import { Assets as NavigationAssets } from '@react-navigation/elements';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { createURL } from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
// ...existing code...
import { useColorScheme, View, Text } from 'react-native';
import { Navigation } from './navigation';
import * as React from 'react';
import { ThemeContext, NameContext } from './contexts';
Asset.loadAsync([
  ...NavigationAssets,
  require('./assets/newspaper.png'),
  require('./assets/bell.png'),
]);

SplashScreen.preventAutoHideAsync();

const prefix = createURL('/');

export function App() {
  const [isDark, setIsDark] = React.useState(false);
  const theme = isDark ? DarkTheme : DefaultTheme;
  const [name, setName] = React.useState('');

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <NameContext.Provider value={{ name, setName }}>
        <Navigation
          theme={theme}
          linking={{
            enabled: 'auto',
            prefixes: [prefix],
          }}
          onReady={() => {
            SplashScreen.hideAsync();
          }}
        />
      </NameContext.Provider>
    </ThemeContext.Provider>
  );
}
