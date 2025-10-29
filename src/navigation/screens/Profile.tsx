import { StyleSheet, View, Text, Switch } from 'react-native';
import * as React from 'react';
import { useContext } from 'react';
import { ThemeContext, NameContext } from '../../contexts';

export function Profile() {
  const { isDark } = useContext(require('../../contexts').ThemeContext as React.Context<{ isDark: boolean; toggleTheme: () => void }>);
  const { name } = React.useContext(NameContext);
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#181A20' : '#F7F9FC' }] }>
      <View style={[styles.profileCard, { backgroundColor: isDark ? '#23272F' : '#fff', borderColor: isDark ? '#333' : '#e0e0e0' }] }>
        <View style={[styles.avatarCircle, { backgroundColor: isDark ? '#90CAF9' : '#4F8EF7' }] }>
          <Text style={styles.avatarText}>{name ? name[0].toUpperCase() : '?'}</Text>
        </View>
        <Text style={[styles.profileName, { color: isDark ? '#fff' : '#222' }]}>{name ? `${name}'s Profile` : 'No user set'}</Text>
        <Text style={[styles.profileDesc, { color: isDark ? '#aaa' : '#666' }]}>Welcome to your profile page. You can set your name in Settings.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
  },
  profileCard: {
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4F8EF7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  profileDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
