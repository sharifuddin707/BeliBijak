// Change this to your computer's local IP address if running on a device
const BACKEND_URL = 'https://belibijak-1.onrender.com';

import { Button, Text } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, TextInput, Alert, Switch } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../../contexts';
import * as React from 'react';

export function Home() {
  const { isDark } = useContext(ThemeContext);
  // State for grocery store name
  const [storeInput, setStoreInput] = React.useState('');
  // State for list of grocery stores (now with id and name)
  const [stores, setStores] = React.useState<{id: string, name: string}[]>([]);
  // State for selected store for update/delete
  const [selectedStore, setSelectedStore] = React.useState<{id: string, name: string} | null>(null);
  // Navigation
  const navigation = useNavigation();

  // Add grocery store
    const handleAddStore = async () => {
      if (!storeInput.trim()) {
        Alert.alert('Please enter a grocery store name');
        return;
      }
      try {
        const response = await fetch(`${BACKEND_URL}/stores`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: storeInput.trim() }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result?.message || 'Failed to add store');
        setStoreInput('');
        await fetchStores();
        Alert.alert('Store added!');
      } catch (error) {
        let msg = 'Unknown error';
        if (error instanceof Error) msg = error.message;
        Alert.alert('Error', msg);
      }
    };
  
    // Update grocery store
    const handleUpdateStore = async () => {
      if (!selectedStore) {
        Alert.alert('Select a store to update');
        return;
      }
      if (!storeInput.trim()) {
        Alert.alert('Please enter a grocery store name');
        return;
      }
      try {
        const response = await fetch(`${BACKEND_URL}/stores/${selectedStore.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: storeInput.trim() }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result?.message || 'Failed to update store');
        setStoreInput('');
        setSelectedStore(null);
        await fetchStores();
        Alert.alert('Store updated!');
      } catch (error) {
        let msg = 'Unknown error';
        if (error instanceof Error) msg = error.message;
        Alert.alert('Error', msg);
        setSelectedStore(null);
        await fetchStores();
      }
    };

  // Delete grocery store
  const handleDeleteStore = async () => {
    if (!selectedStore) {
      Alert.alert('Select a store to delete');
      return;
    }
    console.log('Deleting store:', selectedStore);
    try {
      const response = await fetch(`${BACKEND_URL}/stores/${selectedStore.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      console.log('Delete response:', result);
      if (!response.ok) throw new Error('Failed to delete store');
      setStoreInput('');
      setSelectedStore(null);
      await fetchStores();
      Alert.alert('Store deleted!');
    } catch (error) {
      let msg = 'Unknown error';
      if (error instanceof Error) msg = error.message;
      Alert.alert('Error', msg);
      setSelectedStore(null);
      await fetchStores();
    }
  };

  // Fetch all grocery stores from backend
  const fetchStores = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/stores`);
      const data = await response.json();
      setStores(data.map((s: any) => ({ id: s.id, name: s.name })));
    } catch (error) {
      setStores([]);
    }
  };

  // Fetch stores on mount
  React.useEffect(() => {
    fetchStores();
  }, []);

  console.log('stores:', stores);
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#181A20' : '#F7F9FC' }] }>
      <Text style={[styles.header, { color: isDark ? '#90CAF9' : '#4F8EF7' }]}>🏪 Welcome to BeliBijak!</Text>
      <View style={[styles.section, { backgroundColor: isDark ? '#23272F' : '#fff', borderColor: isDark ? '#333' : '#e0e0e0' }] }>
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>Add or Edit Grocery Store</Text>
        <TextInput
          style={[styles.input, { backgroundColor: isDark ? '#23272F' : '#F3F6FA', color: isDark ? '#fff' : '#222', borderColor: isDark ? '#444' : '#d0d7de' }]}
          placeholder='Grocery Store Name here...'
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          value={storeInput}
          onChangeText={setStoreInput}
        />
        <View style={styles.buttonRow}>
          <Button onPress={handleAddStore} title="Add" color={isDark ? '#90CAF9' : '#4F8EF7'} >Add</Button>
          <Button onPress={handleUpdateStore} title="Update" color={isDark ? '#FFD54F' : '#FFA726'} >Update</Button>
          <Button onPress={handleDeleteStore} title="Delete" color={isDark ? '#EF9A9A' : '#D32F2F'} >Delete</Button>
        </View>
      </View>

      <View style={[styles.listCard, { backgroundColor: isDark ? '#23272F' : '#fff', borderColor: isDark ? '#333' : '#e0e0e0' }] }>
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>Grocery Stores</Text>
        {stores.length === 0 ? (
          <Text style={[styles.noStores, { color: isDark ? '#aaa' : '#888' }]}>No stores yet.</Text>
        ) : (
          stores.map((s, i) => (
            <View key={s.id} style={styles.storeRow}>
              <Text style={[styles.storeText, { color: isDark ? '#fff' : '#222' }]}>{i + 1}. {s.name}</Text>
              <Switch
                value={selectedStore?.id === s.id}
                onValueChange={(val) => {
                  if (val) {
                    setSelectedStore(s);
                    setStoreInput(s.name);
                  } else {
                    setSelectedStore(null);
                    setStoreInput('');
                  }
                }}
                trackColor={{ false: isDark ? '#555' : '#ccc', true: isDark ? '#90CAF9' : '#4F8EF7' }}
                thumbColor={selectedStore?.id === s.id ? (isDark ? '#90CAF9' : '#4F8EF7') : (isDark ? '#333' : '#fff')}
              />
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 32,
    backgroundColor: '#F7F9FC',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#4F8EF7',
  },
  section: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 2,
  },
  listCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  noStores: {
    color: '#888',
    marginBottom: 10,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F6FA',
  },
  storeText: {
    fontSize: 15,
    color: '#222',
  },
});
