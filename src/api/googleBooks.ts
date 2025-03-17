import axios from 'axios';

interface BookVolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  language?: string;
  previewLink?: string;
  infoLink?: string;
}

interface BookItem {
  id: string;
  volumeInfo: BookVolumeInfo;
}

interface BookSearchResponse {
  items?: BookItem[];
  totalItems?: number;
  kind?: string;
}

export interface BookData {
  id: string;
  title: string;
  subtitle: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  pageCount: number;
  categories: string[];
  averageRating: number;
  ratingsCount: number;
  imageLinks: {
    thumbnail: string | null;
    smallThumbnail: string | null;
  };
  language: string;
  previewLink: string;
  infoLink: string;
}

const API_KEY = 'YOUR_GOOGLE_BOOKS_API_KEY';
const API_URL = 'https://www.googleapis.com/books/v1/volumes';

export const searchBookByText = async (extractedText: string): Promise<BookData | null> => {
  try {
    const searchQuery = processExtractedText(extractedText);
    
    const response = await axios.get<BookSearchResponse>(API_URL, {
      params: {
        q: searchQuery,
        key: API_KEY,
        maxResults: 5,
      },
    });
    
    if (!response.data.items || response.data.items.length === 0) {
      return null;
    }
    
    return parseBookData(response.data.items[0]);
    
  } catch (error) {
    console.error('Google Books API error:', error);
    throw new Error('Failed to fetch book information');
  }
};

const processExtractedText = (text: string | null): string => {
  if (!text) return '';
  
  const lines = text.split('\n');
  
  let potentialTitle = '';
  let potentialAuthor = '';
  
  let maxLength = 0;
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    if (lines[i].length > maxLength) {
      maxLength = lines[i].length;
      potentialTitle = lines[i];
    }
  }
  
  for (const line of lines) {
    if (line.toLowerCase().includes('by ')) {
      potentialAuthor = line.toLowerCase().replace('by ', '').trim();
      break;
    }
  }
  
  if (potentialTitle && potentialAuthor) {
    return `${potentialTitle} ${potentialAuthor}`;
  } else if (potentialTitle) {
    return potentialTitle;
  } else {
    return lines.slice(0, 3).join(' ');
  }
};

const parseBookData = (bookItem: BookItem): BookData => {
  const volumeInfo = bookItem.volumeInfo || {};
  
  return {
    id: bookItem.id,
    title: volumeInfo.title || 'Unknown Title',
    subtitle: volumeInfo.subtitle || '',
    authors: volumeInfo.authors || ['Unknown Author'],
    publisher: volumeInfo.publisher || 'Unknown Publisher',
    publishedDate: volumeInfo.publishedDate || '',
    description: volumeInfo.description || 'No description available',
    pageCount: volumeInfo.pageCount || 0,
    categories: volumeInfo.categories || [],
    averageRating: volumeInfo.averageRating || 0,
    ratingsCount: volumeInfo.ratingsCount || 0,
    imageLinks: {
      thumbnail: volumeInfo.imageLinks?.thumbnail || null,
      smallThumbnail: volumeInfo.imageLinks?.smallThumbnail || null,
    },
    language: volumeInfo.language || 'en',
    previewLink: volumeInfo.previewLink || '',
    infoLink: volumeInfo.infoLink || '',
  };
};

export const searchBookByISBN = async (isbn: string): Promise<BookData | null> => {
  try {
    const response = await axios.get<BookSearchResponse>(API_URL, {
      params: {
        q: `isbn:${isbn}`,
        key: API_KEY,
      },
    });
    
    if (!response.data.items || response.data.items.length === 0) {
      return null;
    }
    
    return parseBookData(response.data.items[0]);
    
  } catch (error) {
    console.error('Google Books API error:', error);
    throw new Error('Failed to fetch book by ISBN');
  }
};

export const searchBookByTitleAndAuthor = async (title: string, author?: string): Promise<BookData | null> => {
  try {
    let query = title;
    if (author) {
      query += `+inauthor:${author}`;
    }
    
    const response = await axios.get<BookSearchResponse>(API_URL, {
      params: {
        q: query,
        key: API_KEY,
      },
    });
    
    if (!response.data.items || response.data.items.length === 0) {
      return null;
    }
    
    return parseBookData(response.data.items[0]);
    
  } catch (error) {
    console.error('Google Books API error:', error);
    throw new Error('Failed to fetch book by title and author');
  }
};