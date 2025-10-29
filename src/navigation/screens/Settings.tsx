import React, { useContext } from 'react';
import { StyleSheet, View, Text, Switch, TextInput, Button, Alert } from 'react-native';
import { ThemeContext, NameContext } from '../../contexts';

export function Settings() {
  const { isDark, toggleTheme } = useContext(require('../../contexts').ThemeContext as React.Context<{ isDark: boolean; toggleTheme: () => void }>);
  // State for user name
  const [nameInput, setNameInput] = React.useState('');
  // Context for sharing name
  const { name, setName } = React.useContext(NameContext);

  // Save user name and make available for Profile
  const handleSaveName = () => {
    if (!nameInput) {
      Alert.alert('Please enter your name');
      return;
    }
    setName(nameInput);
    Alert.alert('Name saved!');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#181A20' : '#F7F9FC' }] }>
      <View style={[styles.settingsCard, { backgroundColor: isDark ? '#23272F' : '#fff', borderColor: isDark ? '#333' : '#e0e0e0' }] }>
        <Text style={[styles.header, { color: isDark ? '#90CAF9' : '#4F8EF7' }]}>⚙️ Settings</Text>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>Profile Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? '#23272F' : '#F3F6FA', color: isDark ? '#fff' : '#222', borderColor: isDark ? '#444' : '#d0d7de' }]}
            placeholder='Enter your name...'
            placeholderTextColor={isDark ? '#aaa' : '#888'}
            value={nameInput}
            onChangeText={setNameInput}
          />
          <Button
            title="Save my Name"
            onPress={handleSaveName}
            color={isDark ? '#90CAF9' : '#4F8EF7'}
          />
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>Theme</Text>
          <View style={styles.themeRow}>
            <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 15 }}>Dark Mode</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: isDark ? '#555' : '#ccc', true: isDark ? '#90CAF9' : '#4F8EF7' }}
              thumbColor={isDark ? '#90CAF9' : '#4F8EF7'}
            />
          </View>
        </View>
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
  settingsCard: {
    width: 280,
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
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#4F8EF7',
  },
  section: {
    width: '100%',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#d0d7de',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 7,
    backgroundColor: '#F3F6FA',
    fontSize: 15,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 4,
  },
});
