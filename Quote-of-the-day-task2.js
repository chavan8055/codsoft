import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const quotes = [
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "You are never too old to set another goal or to dream a new dream.",
  "Act as if what you do makes a difference. It does."
];

export default function App() {
  const [quote, setQuote] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadQuote();
    loadFavorites();
  }, []);

  const loadQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  };

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    } catch (error) {
      console.error(error);
    }
  };

  const saveFavorite = async () => {
    if (!favorites.includes(quote)) {
      const newFavorites = [...favorites, quote];
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  };

  const shareQuote = async () => {
    try {
      await Share.share({ message: quote });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quote of the Day</Text>
      <Text style={styles.quote}>{quote}</Text>
      <TouchableOpacity style={styles.button} onPress={loadQuote}>
        <Text style={styles.buttonText}>New Quote</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={saveFavorite}>
        <Text style={styles.buttonText}>Save to Favorites</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={shareQuote}>
        <Text style={styles.buttonText}>Share</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.favorite}>{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  quote: { fontSize: 18, fontStyle: 'italic', textAlign: 'center', marginVertical: 20 },
  button: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginVertical: 5 },
  buttonText: { color: 'white', fontSize: 16 },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  favorite: { fontSize: 16, marginVertical: 5, textAlign: 'center' }
});
