import * as React from 'react';

export const ThemeContext = React.createContext({
  isDark: false,
  toggleTheme: () => {},
});

export const NameContext = React.createContext({
  name: '',
  setName: (n: string) => {},
});

export default {};
