/**
 * AIRKLIM Mobile App - React Native
 * App mobile completa per iOS e Android
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import NetInfo from '@react-native-community/netinfo';
import Geolocation from '@react-native-community/geolocation';

// ===== CONFIGURAZIONE PUSH NOTIFICATIONS =====
export const configurePushNotifications = () => {
  PushNotification.configure({
    onRegister: (token) => {
      console.log('TOKEN:', token);
      AsyncStorage.setItem('pushToken', token.token);
    },
    onNotification: (notification) => {
      console.log('NOTIFICATION:', notification);
      notification.finish(PushNotification.NotificationAction.Reply);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
  });
};

// ===== SCHERMATA HOME =====
export function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadUser();
    loadProducts();
    
    // Monitor connessione
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const cachedProducts = await AsyncStorage.getItem('products');
      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
      } else {
        // Fetch da API
        const response = await fetch('https://api.airklim.it/api/products');
        const data = await response.json();
        setProducts(data);
        await AsyncStorage.setItem('products', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Modalità offline - usa cache
    }
  };

  return (
    <ScrollView style={styles.container}>
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>📡 Sei offline - Modalità cache attiva</Text>
        </View>
      )}

      {user && (
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>Ciao, {user.name}!</Text>
          <Text style={styles.subText}>Bentornato in AIRKLIM</Text>
        </View>
      )}

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.actionIcon}>📦</Text>
          <Text style={styles.actionText}>Prodotti</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Orders')}
        >
          <Text style={styles.actionIcon}>🛒</Text>
          <Text style={styles.actionText}>Ordini</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('AR')}
        >
          <Text style={styles.actionIcon}>📱</Text>
          <Text style={styles.actionText}>AR View</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Chat')}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Supporto</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prodotti in Evidenza</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {products.slice(0, 5).map(product => (
            <TouchableOpacity 
              key={product.id}
              style={styles.productCard}
              onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
            >
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>€{product.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Offerte Speciali</Text>
        <View style={styles.offerCard}>
          <Text style={styles.offerTitle}>🔥 Conto Termico 3.0</Text>
          <Text style={styles.offerText}>Risparmia fino al 65%</Text>
          <TouchableOpacity style={styles.offerButton}>
            <Text style={styles.offerButtonText}>Scopri di più</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// ===== SCHERMATA PRODOTTI =====
export function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    brand: 'all',
    category: 'all',
    priceRange: 'all'
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const cached = await AsyncStorage.getItem('products');
      if (cached) {
        setProducts(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = filters.brand === 'all' || product.brand === filters.brand;
    const matchesCategory = filters.category === 'all' || product.category === filters.category;
    return matchesSearch && matchesBrand && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Cerca prodotti..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView horizontal style={styles.filtersContainer}>
        <TouchableOpacity style={styles.filterChip}>
          <Text>Panasonic</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Text>TCL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Text>Etherea</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Text>BreezeIN</Text>
        </TouchableOpacity>
      </ScrollView>

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.productListItem}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.listProductImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productBrand}>{item.brand}</Text>
              <Text style={styles.productPrice}>€{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ===== SCHERMATA DETTAGLIO PRODOTTO =====
export function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    const products = JSON.parse(await AsyncStorage.getItem('products') || '[]');
    const found = products.find(p => p.id === productId);
    setProduct(found);
  };

  if (!product) return <Text style={styles.loading}>Caricamento...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.detailImage} />
      
      <View style={styles.detailContent}>
        <Text style={styles.detailBrand}>{product.brand}</Text>
        <Text style={styles.detailName}>{product.name}</Text>
        <Text style={styles.detailPrice}>€{product.price}</Text>
        
        <View style={styles.specsContainer}>
          <Text style={styles.specsTitle}>Specifiche Tecniche</Text>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Potenza:</Text>
            <Text style={styles.specValue}>{product.power} kW</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>SEER:</Text>
            <Text style={styles.specValue}>{product.specifications.seer}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>SCOP:</Text>
            <Text style={styles.specValue}>{product.specifications.scop}</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Rumore:</Text>
            <Text style={styles.specValue}>{product.specifications.noiseLevel}</Text>
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Caratteristiche</Text>
          {product.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureCheck}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.arButton}
            onPress={() => navigation.navigate('ARViewer', { product })}
          >
            <Text style={styles.arButtonText}>📱 Vedi in AR</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={() => addToCart(product)}
          >
            <Text style={styles.addToCartText}>Aggiungi al Carrello</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// ===== SCHERMATA AR VIEWER =====
export function ARViewerScreen({ route }) {
  const { product } = route.params;
  const [arSession, setArSession] = useState(null);

  useEffect(() => {
    startARSession();
  }, []);

  const startARSession = async () => {
    try {
      // Inizia sessione AR
      console.log('Starting AR session for:', product.name);
      // Qui integreresti ARKit (iOS) o ARCore (Android)
    } catch (error) {
      Alert.alert('Errore', 'Impossibile avviare la sessione AR');
    }
  };

  return (
    <View style={styles.arContainer}>
      <View style={styles.arOverlay}>
        <Text style={styles.arTitle}>{product.name}</Text>
        <Text style={styles.arInstructions}>
          Punta la fotocamera verso una superficie piana per visualizzare il prodotto
        </Text>
      </View>

      <View style={styles.arControls}>
        <TouchableOpacity style={styles.arControlButton}>
          <Text>🔄 Ruota</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.arControlButton}>
          <Text>📏 Misura</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.arControlButton}>
          <Text>📸 Screenshot</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ===== SCHERMATA CHATBOT AI =====
export function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Ciao! Sono l\'assistente virtuale AIRKLIM. Come posso aiutarti?', sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user'
    };

    setMessages([...messages, userMessage]);
    setInputText('');

    // Simula risposta AI
    setTimeout(() => {
      const botResponse = generateAIResponse(inputText);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot'
      }]);
    }, 1000);
  };

  const generateAIResponse = (query) => {
    const responses = {
      'prezzo': 'I nostri prezzi partono da €590 per il TCL BreezeIN fino a €1,590 per il Panasonic Etherea XZ35. Vuoi vedere il catalogo completo?',
      'installazione': 'Offriamo installazione certificata DM 37/08. Il costo varia da €300 a €600 in base alla complessità. Vuoi prenotare un sopralluogo gratuito?',
      'garanzia': 'Tutti i nostri prodotti hanno 5 anni di garanzia sul compressore e 2 anni sulle parti. Sei un PRO Partner? Hai garanzie estese!',
      'conto termico': 'Con il Conto Termico 3.0 puoi ottenere fino al 65% di detrazione. Vuoi calcolare il tuo incentivo?',
      'default': 'Posso aiutarti con informazioni su prodotti, prezzi, installazione, garanzia e incentivi. Cosa ti interessa?'
    };

    const lowerQuery = query.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerQuery.includes(key)) return response;
    }
    return responses.default;
  };

  return (
    <View style={styles.chatContainer}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.sender === 'user' ? styles.userMessage : styles.botMessage
          ]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.chatInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Scrivi un messaggio..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Invia</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ===== SCHERMATA ORDINI =====
export function OrdersScreen() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const cached = await AsyncStorage.getItem('orders');
      if (cached) setOrders(JSON.parse(cached));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Ordine #{item.id}</Text>
              <Text style={[
                styles.orderStatus,
                item.status === 'delivered' ? styles.statusDelivered : styles.statusPending
              ]}>
                {item.status}
              </Text>
            </View>
            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString('it-IT')}
            </Text>
            <Text style={styles.orderTotal}>€{item.total}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ===== FUNZIONI UTILITY =====
export const addToCart = async (product) => {
  try {
    const cart = JSON.parse(await AsyncStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    await AsyncStorage.setItem('cart', JSON.stringify(cart));
    Alert.alert('Successo', 'Prodotto aggiunto al carrello');
  } catch (error) {
    Alert.alert('Errore', 'Impossibile aggiungere al carrello');
  }
};

export const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Permesso Posizione',
        message: 'AIRKLIM ha bisogno della tua posizione per trovare installatori vicini',
        buttonNeutral: 'Chiedi dopo',
        buttonNegative: 'Annulla',
        buttonPositive: 'Consenti',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

// ===== STILI =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  offlineBanner: {
    backgroundColor: '#f59e0b',
    padding: 10,
    alignItems: 'center',
  },
  offlineText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  welcomeCard: {
    backgroundColor: '#0ea5e9',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    width: 80,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: 150,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  productName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  productPrice: {
    color: '#0ea5e9',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  offerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
  },
  offerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  offerText: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 8,
  },
  offerButton: {
    backgroundColor: '#0ea5e9',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  offerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 8,
    color: '#fff',
  },
  filtersContainer: {
    paddingHorizontal: 16,
  },
  filterChip: {
    backgroundColor: '#1e293b',
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  productListItem: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    margin: 8,
    padding: 12,
    borderRadius: 12,
  },
  listProductImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productBrand: {
    color: '#94a3b8',
    fontSize: 12,
  },
  detailImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#1e293b',
  },
  detailContent: {
    padding: 16,
  },
  detailBrand: {
    color: '#94a3b8',
    fontSize: 14,
  },
  detailName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  detailPrice: {
    color: '#0ea5e9',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  specsContainer: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  specsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  specLabel: {
    color: '#94a3b8',
  },
  specValue: {
    color: '#fff',
    fontWeight: 'bold',
  },
  featuresContainer: {
    marginTop: 16,
  },
  featuresTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureCheck: {
    color: '#10b981',
    fontSize: 20,
    marginRight: 8,
  },
  featureText: {
    color: '#fff',
    flex: 1,
  },
  actionsContainer: {
    marginTop: 24,
  },
  arButton: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  arButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  arContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  arOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
    borderRadius: 12,
  },
  arTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  arInstructions: {
    color: '#94a3b8',
    marginTop: 8,
  },
  arControls: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  arControlButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 8,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    margin: 8,
  },
  userMessage: {
    backgroundColor: '#0ea5e9',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#1e293b',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1e293b',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    color: '#fff',
  },
  sendButton: {
    backgroundColor: '#0ea5e9',
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: '#1e293b',
    margin: 8,
    padding: 16,
    borderRadius: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderId: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusDelivered: {
    color: '#10b981',
  },
  statusPending: {
    color: '#f59e0b',
  },
  orderDate: {
    color: '#94a3b8',
    marginTop: 8,
  },
  orderTotal: {
    color: '#0ea5e9',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default {
  HomeScreen,
  ProductsScreen,
  ProductDetailScreen,
  ARViewerScreen,
  ChatScreen,
  OrdersScreen,
  configurePushNotifications,
  addToCart,
  requestLocationPermission
};
