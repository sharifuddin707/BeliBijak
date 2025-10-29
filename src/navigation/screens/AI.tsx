import React from 'react';
import { Text, Button } from '@react-navigation/elements';
import { StyleSheet, View, TextInput, Alert, ActivityIndicator } from 'react-native';
// Picker is provided by '@react-native-picker/picker' in modern RN versions
import { Picker } from '@react-native-picker/picker';

// Match BACKEND_URL used in Home.tsx (change if needed)
const BACKEND_URL = 'https://belibijak-1.onrender.com';

export function AI() {
  const [itemName, setItemName] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [stores, setStores] = React.useState<{id: string, name: string}[]>([]);
  const [selectedStore, setSelectedStore] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<any>(null);

  React.useEffect(() => {
    // fetch stores for selection
    const fetchStores = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/stores`);
        const data = await res.json();
        setStores(data.map((s: any) => ({ id: s.id, name: s.name })));
      } catch (err) {
        setStores([]);
      }
    };
    fetchStores();
  }, []);

  const handleGetInsight = async () => {
    if (!itemName) return Alert.alert('Please enter an item name');
    setLoading(true);
    setResult(null);
    try {
      const body: any = { itemName };
      if (price) body.currentPrice = Number(price);
      if (selectedStore) body.storeId = selectedStore;
      const res = await fetch(`${BACKEND_URL}/ml/price_insight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Price Insight (AI)</Text>
      <TextInput
        style={styles.input}
        placeholder='Item name (e.g., Apple)'
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.input}
        placeholder='Current price (optional)'
        value={price}
        onChangeText={setPrice}
        keyboardType='numeric'
      />
      {/* store picker - fallback to simple TextInput for platforms without Picker */}
      {stores.length > 0 ? (
        <Picker
          selectedValue={selectedStore}
          onValueChange={(val: string | null) => setSelectedStore(val)}
          style={{ width: 220 }}
        >
          <Picker.Item label='(Select store - optional)' value={null} />
          {stores.map(s => (
            <Picker.Item key={s.id} label={s.name} value={s.id} />
          ))}
        </Picker>
      ) : (
        <Text>(No stores found)</Text>
      )}

      <Button onPress={handleGetInsight}>Get Insight</Button>

      {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

      {result && (
        <View style={{ marginTop: 12, padding: 10 }}>
          {result.error && <Text>Error: {String(result.error)}</Text>}
          {!result.error && (
            <>
              <Text>Recommendation: {String(result.recommendation)}</Text>
              <Text>Score: {String(result.score)}</Text>
              {result.expectedPrice != null && <Text>Expected price: {String(result.expectedPrice)}</Text>}
              {result.suggestedStore && <Text>Suggested store: {String(result.suggestedStore.storeId || result.suggestedStore.id)} (avg: {String(result.suggestedStore.avgPrice || result.suggestedStore.estimatedPrice)})</Text>}
              <Text>{result.message}</Text>
            </>
          )}
        </View>
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
    width: 220,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
