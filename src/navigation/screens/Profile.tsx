import { StyleSheet, View, Text, Switch } from 'react-native';
import * as React from 'react';
import { useContext } from 'react';
import { ThemeContext, NameContext } from '../../contexts';

export function Profile() {
  const { isDark } = useContext(ThemeContext);
  const { name } = React.useContext(NameContext);
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>{name ? `${name}'s Profile` : 'No user set'}</Text>
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
