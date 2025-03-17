import { StackNavigationProp } from '@react-navigation/stack';
import { BookData } from '../storage/bookStorage';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Library: undefined;
  Book: { book: BookData };
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type BookScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Book'>;
export type LibraryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Library'>;

export type BookScreenRouteProp = RouteProp<RootStackParamList, 'Book'>;