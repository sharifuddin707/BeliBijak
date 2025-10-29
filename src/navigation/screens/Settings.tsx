import React, { useContext } from 'react';
import { StyleSheet, View, Text, Switch, TextInput, Button, Alert } from 'react-native';
import { ThemeContext, NameContext } from '../../contexts';

export function Settings() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
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
    <View style={styles.container}>
      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Who are you? see the changes in Profile tab</Text>
      {/* User name input */}
      <TextInput
        style={styles.input}
        placeholder='Enter your name...'
        value={nameInput}
        onChangeText={setNameInput}
      />
      <Button
        title="Save my Name"
        onPress={handleSaveName}
      />

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
  input: {
    width: 200,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
  },
});
