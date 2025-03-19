import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl
} from 'react-native';
import { LibraryScreenNavigationProp } from '../types/navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAllSavedBooks, clearAllSavedBooks } from '../storage/bookStorage';
import { BookData } from '../storage/bookStorage';

type Props = {
  navigation: LibraryScreenNavigationProp;
};

const LibraryScreen: React.FC<Props> = ({ navigation }) => {
  const [books, setBooks] = useState<BookData[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBooks();

    const unsubscribe = navigation.addListener('focus', () => {
      loadBooks();
    });

    return unsubscribe;
  }, [navigation]);

  const loadBooks = async () => {
    const savedBooks = await getAllSavedBooks();
    setBooks(savedBooks);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  };

  const handleClearLibrary = () => {
    Alert.alert(
      'Clear Library',
      'Are you sure you want to remove all books from your library?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearAllSavedBooks();
            setBooks([]);
          },
        },
      ],
    );
  };

  const renderBookItem = ({ item }: { item: BookData }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => navigation.navigate('Book', { book: item })}
    >
      <Image 
        source={
          item.imageLinks?.thumbnail 
            ? { uri: item.imageLinks.thumbnail } 
            : require('../assets/book-placeholder.jpg')
        }
        style={styles.bookCover}
        resizeMode="cover"
      />

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.authors?.join(', ') || 'Unknown Author'}
        </Text>

        {item.averageRating && item.averageRating > 0 && (
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>
              {'\u2605'.repeat(Math.floor(item.averageRating))}
              {item.averageRating % 1 >= 0.5 ? '\u2605' : ''}
              {'\u2606'.repeat(5 - Math.ceil(item.averageRating))}
            </Text>
          </View>
        )}

        <Text style={styles.bookPublisher} numberOfLines={1}>
          {item.publisher || 'Unknown Publisher'}
          {item.publishedDate ? `, ${item.publishedDate.substring(0, 4)}` : ''}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  const EmptyLibraryView = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>Your Library is Empty</Text>
      <Text style={styles.emptyText}>
        Scan book covers to add them to your library
      </Text>
      <TouchableOpacity
        style={styles.scanButton}
        // onPress={() => navigation.navigate('Main')}
        // onPress={() => navigation.navigate('Home')}
        onPress={() => navigation.getParent()?.navigate('Main', { screen: 'Home' })}
        >
        <Text style={styles.scanButtonText}>Scan a Book</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {books.length > 0 ? (
        <>
          <FlatList
            data={books}
            renderItem={renderBookItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#3498db']}
              />
            }
          />

          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearLibrary}
          >
            <Text style={styles.clearButtonText}>Clear Library</Text>
          </TouchableOpacity>
        </>
      ) : (
        <EmptyLibraryView />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 70,
  },
  bookItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bookCover: {
    width: 70,
    height: 100,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  bookInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  ratingContainer: {
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#f39c12',
  },
  bookPublisher: {
    fontSize: 12,
    color: '#777',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clearButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LibraryScreen;