import { StackNavigationProp } from '@react-navigation/stack';
import { BookData } from '../storage/bookStorage';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Main: undefined;
  Library: undefined;
  Book: { book: BookData };
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;
export type BookScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Book'>;
export type LibraryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Library'>;

export type BookScreenRouteProp = RouteProp<RootStackParamList, 'Book'>;
