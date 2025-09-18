import { Text } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';
import * as React from 'react';
import { NameContext } from './Home';

export function Profile() {
  const { name } = React.useContext(NameContext);
  return (
    <View style={styles.container}>
      <Text>{name ? `${name}'s Profile` : 'No user set'}</Text>
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
});
