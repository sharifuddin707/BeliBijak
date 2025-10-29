// Change this to your computer's local IP address if running on a device
const BACKEND_URL = 'https://belibijak-1.onrender.com';

import { Button, Text } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, TextInput, Alert, Switch } from 'react-native';
import * as React from 'react';

export function Home() {
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
    if (!storeInput) {
      Alert.alert('Please enter a grocery store name');
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/stores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: storeInput })
      });
      if (!response.ok) throw new Error('Failed to add store');
      setStoreInput('');
      setSelectedStore(null);
      await fetchStores();
      Alert.alert('Store added!');
    } catch (error) {
      let msg = 'Unknown error';
      if (error instanceof Error) msg = error.message;
      Alert.alert('Error', msg);
      setSelectedStore(null);
      await fetchStores();
    }
  };

  // Update grocery store
  const handleUpdateStore = async () => {
    if (!selectedStore || !storeInput) {
      Alert.alert('Select a store and enter a new name');
      return;
    }
    console.log('Updating store:', selectedStore, 'with name:', storeInput);
    try {
      const response = await fetch(`${BACKEND_URL}/stores/${selectedStore.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: storeInput })
      });
      const result = await response.json();
      console.log('Update response:', result);
      if (!response.ok) throw new Error('Failed to update store');
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
    <View style={styles.container}>
      <Text>Welcome to BeliBijak!</Text>
      {/* Grocery store name input */}
      <Text>{"\n"}Enter Grocery Store names:</Text>
      <TextInput
        style={styles.input}
        placeholder='Grocery Store Name here...'
        value={storeInput}
        onChangeText={setStoreInput}
      />
  <Button onPress={handleAddStore}>Add Store</Button>
  <Button onPress={handleUpdateStore}>Update Store</Button>
  <Button onPress={handleDeleteStore}>Delete Store</Button>


      {/* Display all grocery stores */}
      <Text>Grocery stores:</Text>
      {stores.length === 0 ? (
        <Text>No stores yet.</Text>
      ) : (
        stores.map((s, i) => (
          <View key={s.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ marginLeft: 8 }}>{i + 1}. {s.name}</Text>
            <View style={{ width: 8 }} />
            {/* Switch to select store for update/delete */}
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
            />
          </View>
        ))
      )}
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
});
