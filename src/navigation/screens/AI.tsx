import React from 'react';
import { Text, Button } from '@react-navigation/elements';
import { StyleSheet, View, TextInput, Alert, ActivityIndicator } from 'react-native';
// Picker is provided by '@react-native-picker/picker' in modern RN versions
import { Picker } from '@react-native-picker/picker';

// Match BACKEND_URL used in Home.tsx (change if needed)
const BACKEND_URL = 'https://belibijak-1.onrender.com';

export function AI() {
  const { isDark } = React.useContext(require('../../contexts').ThemeContext as React.Context<{ isDark: boolean; toggleTheme: () => void }>);
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
  <View style={[styles.container, { backgroundColor: isDark ? '#181A20' : '#F7F9FC' }] }>
  <Text style={[styles.header, { color: isDark ? '#90CAF9' : '#4F8EF7' }]}>🧠 Price Insight (AI)</Text>
  <View style={[styles.section, { backgroundColor: isDark ? '#23272F' : '#fff', borderColor: isDark ? '#333' : '#e0e0e0' }] }>
        <Text style={styles.sectionTitle}>Enter Item Details</Text>
        <TextInput
    style={[styles.input, { backgroundColor: isDark ? '#23272F' : '#F3F6FA', color: isDark ? '#fff' : '#222', borderColor: isDark ? '#444' : '#d0d7de' }]}
    placeholder='Item name (e.g., Apple)'
    placeholderTextColor={isDark ? '#aaa' : '#888'}
    value={itemName}
    onChangeText={setItemName}
        />
        <TextInput
    style={[styles.input, { backgroundColor: isDark ? '#23272F' : '#F3F6FA', color: isDark ? '#fff' : '#222', borderColor: isDark ? '#444' : '#d0d7de' }]}
    placeholder='Current price (optional)'
    placeholderTextColor={isDark ? '#aaa' : '#888'}
    value={price}
    onChangeText={setPrice}
    keyboardType='numeric'
        />
        {stores.length > 0 ? (
          <Picker
            selectedValue={selectedStore}
            onValueChange={(val: string | null) => setSelectedStore(val)}
            style={[styles.picker, { backgroundColor: isDark ? '#23272F' : '#F3F6FA', color: isDark ? '#fff' : '#222', borderColor: isDark ? '#444' : '#d0d7de' }]}
          >
            <Picker.Item label='(Select store - optional)' value={null} />
            {stores.map(s => (
              <Picker.Item key={s.id} label={s.name} value={s.id} />
            ))}
          </Picker>
        ) : (
          <Text style={[styles.noStores, { color: isDark ? '#aaa' : '#888' }]}>(No stores found)</Text>
        )}
  <Button onPress={handleGetInsight} title="Get Insight" color={isDark ? '#90CAF9' : '#4F8EF7'}> Get Insight</Button>
        {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
      </View>

      {result && (
        <View style={[styles.resultCard, { backgroundColor: isDark ? '#23272F' : '#fff', borderColor: isDark ? '#333' : '#e0e0e0' }] }>
          <Text style={[styles.resultTitle, { color: isDark ? '#90CAF9' : '#4F8EF7' }]}>Result</Text>
          {result.error && <Text style={[styles.errorText, { color: isDark ? '#EF9A9A' : '#D32F2F' }]}>Error: {String(result.error)}</Text>}
          {!result.error && (
            <>
              <Text style={[styles.resultText, { color: isDark ? '#fff' : '#222' }]}>Recommendation: <Text style={styles.bold}>{String(result.recommendation)}</Text></Text>
              <Text style={[styles.resultText, { color: isDark ? '#fff' : '#222' }]}>Score: <Text style={styles.bold}>{String(result.score)}</Text></Text>
              {result.expectedPrice != null && <Text style={[styles.resultText, { color: isDark ? '#fff' : '#222' }]}>Expected price: <Text style={styles.bold}>{String(result.expectedPrice)}</Text></Text>}
              {result.suggestedStore && <Text style={[styles.resultText, { color: isDark ? '#fff' : '#222' }]}>Suggested store: <Text style={styles.bold}>{String(result.suggestedStore.storeId || result.suggestedStore.id)}</Text> (avg: <Text style={styles.bold}>{String(result.suggestedStore.avgPrice || result.suggestedStore.estimatedPrice)}</Text>)</Text>}
              <Text style={[styles.resultText, { color: isDark ? '#fff' : '#222' }]}>{result.message}</Text>
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
    width: 280,
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
  picker: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#F3F6FA',
    borderRadius: 7,
  },
  noStores: {
    color: '#888',
    marginBottom: 10,
  },
  resultCard: {
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
  resultTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4F8EF7',
  },
  resultText: {
    fontSize: 15,
    marginBottom: 4,
    color: '#222',
  },
  errorText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
  },
});
