import AsyncStorage from '@react-native-async-storage/async-storage';

export type BookData = {
  id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  imageLinks?: {
    thumbnail?: string; // Change from `string | null` to `string | undefined`
    smallThumbnail?: string; // Change from `string | null` to `string | undefined`
  };
  language: string;
  previewLink?: string;
  infoLink?: string;
};

const STORAGE_KEY = 'savedBooks';

export const saveBook = async (book: BookData): Promise<void> => {
  try {
    const existingBooks = await getAllSavedBooks();
    const bookExists = existingBooks.some(savedBook => savedBook.id === book.id);
    
    if (!bookExists) {
      const updatedBooks: BookData[] = [...existingBooks, book];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
    }
  } catch (error) {
    console.error('Error saving book:', error);
    throw error;
  }
};

export const getAllSavedBooks = async (): Promise<BookData[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error getting saved books:', error);
    return [];
  }
};

export const removeBook = async (bookId: string): Promise<void> => {
  try {
    const existingBooks = await getAllSavedBooks();
    const updatedBooks = existingBooks.filter(book => book.id !== bookId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBooks));
  } catch (error) {
    console.error('Error removing book:', error);
    throw error;
  }
};

export const isBookSaved = async (bookId: string): Promise<boolean> => {
  try {
    const existingBooks = await getAllSavedBooks();
    return existingBooks.some(book => book.id === bookId);
  } catch (error) {
    console.error('Error checking if book is saved:', error);
    return false;
  }
};

export const clearAllSavedBooks = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing saved books:', error);
    throw error;
  }
};