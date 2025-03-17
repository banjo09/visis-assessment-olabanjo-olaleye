import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BookScreenRouteProp, BookScreenNavigationProp } from '../types/navigation';
import BookDetails from '../components/BookDetails';

type Props = {
  route: BookScreenRouteProp;
  navigation: BookScreenNavigationProp;
};

const BookScreen: React.FC<Props> = ({ route }) => {
  const { book } = route.params;
  
  return (
    <View style={styles.container}>
      <BookDetails book={book} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default BookScreen;