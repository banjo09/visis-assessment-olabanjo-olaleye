import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Share,
  ImageSourcePropType
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { saveBook, isBookSaved, removeBook } from '../storage/bookStorage';
import { BookData } from '../storage/bookStorage';

interface BookDetailsProps {
  book: BookData;
}

const BookDetails: React.FC<BookDetailsProps> = ({ book }) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkIfSaved = async (): Promise<void> => {
      const saved = await isBookSaved(book.id);
      setIsSaved(saved);
    };
    
    checkIfSaved();
  }, [book.id]);

  const handleSaveBook = async (): Promise<void> => {
    if (isSaved) {
      await removeBook(book.id);
      setIsSaved(false);
    } else {
      await saveBook(book);
      setIsSaved(true);
    }
  };

  const handleShareBook = async (): Promise<void> => {
    try {
      await Share.share({
        message: `Check out this book: ${book.title} by ${book.authors.join(', ')}`,
        url: book.infoLink || '',
      });
    } catch (error) {
      console.error('Error sharing book:', error);
    }
  };

  const imageSource: ImageSourcePropType = book.imageLinks?.thumbnail 
    ? { uri: book.imageLinks.thumbnail } 
    : require('../assets/book-placeholder.jpg');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={imageSource}
          style={styles.coverImage}
          resizeMode="contain"
        />
        
        <View style={styles.headerDetails}>
          <Text style={styles.title}>{book.title}</Text>
          {book.subtitle && <Text style={styles.subtitle}>{book.subtitle}</Text>}
          <Text style={styles.author}>by {book.authors.join(', ')}</Text>

          <View style={styles.publishInfo}>
            {book.publisher && <Text style={styles.publisher}>{book.publisher}</Text>}
            {book.publishedDate && <Text style={styles.publishDate}>{book.publishedDate}</Text>}
          </View>

          {book.averageRating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>
                {'\u2605'.repeat(Math.floor(book.averageRating))}
                {book.averageRating % 1 >= 0.5 ? '\u2605' : ''}
                {'\u2606'.repeat(5 - Math.ceil(book.averageRating))}
              </Text>
              <Text style={styles.ratingCount}>({book.ratingsCount || 0} ratings)</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, isSaved ? styles.removeButton : styles.saveButton]}
          onPress={handleSaveBook}
        >
          <Text style={styles.actionButtonText}>
            {isSaved ? 'Remove from Library' : 'Add to Library'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleShareBook}
        >
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{book.description || 'No description available'}</Text>
      </View>

      {book.categories && book.categories.length > 0 && (
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesList}>
            {book.categories.map((category, index) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.additionalInfo}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Language:</Text>
          <Text style={styles.infoValue}>{book.language.toUpperCase()}</Text>
        </View>
        {book.pageCount && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pages:</Text>
            <Text style={styles.infoValue}>{book.pageCount}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', padding: 16 },
  coverImage: { width: 120, height: 180, borderRadius: 8 },
  headerDetails: { flex: 1, marginLeft: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666' },
  author: { fontSize: 16, color: '#555' },
  publishInfo: { flexDirection: 'row' },
  publisher: { fontSize: 14, color: '#777' },
  publishDate: { fontSize: 14, color: '#777' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  rating: { fontSize: 16, color: '#f39c12' },
  ratingCount: { fontSize: 14, color: '#999' },
  actions: { flexDirection: 'row', padding: 16 },
  actionButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  saveButton: { backgroundColor: '#2ecc71' },
  removeButton: { backgroundColor: '#e74c3c' },
  actionButtonText: { color: 'white', fontWeight: 'bold' },
  descriptionContainer: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  description: { fontSize: 16, color: '#444' },
  categoriesContainer: { padding: 16 },
  categoriesList: { flexDirection: 'row', flexWrap: 'wrap' },
  categoryTag: { backgroundColor: '#f0f0f0', borderRadius: 16, padding: 6, margin: 4 },
  categoryText: { color: '#555' },
  additionalInfo: { padding: 16 },
  infoRow: { flexDirection: 'row', marginBottom: 8 },
  infoLabel: { width: 100, fontSize: 16, color: '#555' },
  infoValue: { fontSize: 16, color: '#333' },
});

export default BookDetails;