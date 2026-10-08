import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { getProducts, type Product } from '../api/client';

export default function CatalogScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await getProducts('?limit=50');
      setProducts(r.data);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <FlatList
      contentContainerStyle={{ padding: 12 }}
      data={products}
      keyExtractor={(p) => p.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      ListHeaderComponent={error ? <Text style={styles.error}>Errore: {error}</Text> : null}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.brand}>{item.brand} · {item.category}</Text>
          <Text style={styles.price}>€ {Number(item.price).toFixed(2)}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, elevation: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  brand: { color: '#64748b', marginTop: 2 },
  price: { color: '#0ea5e9', fontWeight: '700', marginTop: 6 },
  error: { color: '#dc2626', marginBottom: 10 },
});
