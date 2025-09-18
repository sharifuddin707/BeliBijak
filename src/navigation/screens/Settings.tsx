import React, { useContext } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { ThemeContext } from '../../App';

export function Settings() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Dark Mode</Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
  },
});
