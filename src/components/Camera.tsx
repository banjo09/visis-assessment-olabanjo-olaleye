import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';
import { recognizeTextFromImage } from '../api/ocrService';
import { searchBookByText } from '../api/googleBooks';
import LoadingSpinner from './LoadingSpinner';
import { RootStackParamList } from '../types/navigation'; // Import the correct type
import { BookData } from '../storage/bookStorage'; // Import BookData type
import { StackNavigationProp } from '@react-navigation/stack';

type CameraRef = {
  capture: () => Promise<{ uri: string }>;
} | null;

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const CameraComponent: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const cameraRef = useRef<CameraRef>(null);
  const navigation = useNavigation<NavigationProp>();

  const takePicture = async (): Promise<void> => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      if (!cameraRef.current) {
        throw new Error('Camera reference is null');
      }

      const image = await cameraRef.current.capture();

      const processedImage = await ImageManipulator.manipulateAsync(
        image.uri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const extractedText = await recognizeTextFromImage(processedImage.uri);

      if (!extractedText || extractedText.length === 0) {
        Alert.alert('No text detected', 'Please try again with a clearer image of the book cover.');
        setIsProcessing(false);
        return;
      }

      const bookData = await searchBookByText(extractedText);

      if (!bookData) {
        Alert.alert('Book not found', 'We couldn\'t find information about this book. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Ensure bookData matches the BookData type
      const formattedBookData: BookData = {
        ...bookData,
        imageLinks: {
          thumbnail: bookData.imageLinks?.thumbnail || undefined, // Convert null to undefined
          smallThumbnail: bookData.imageLinks?.smallThumbnail || undefined, // Convert null to undefined
        },
      };

      // Navigate to the Book screen with the formatted book data
      navigation.navigate('Book', { book: formattedBookData });

    } catch (error) {
      console.error('Error scanning book:', error);
      Alert.alert('Error', 'There was an error scanning the book. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef as any}
        style={styles.camera}
        flashMode="auto"
        focusMode="on"
        zoomMode="on"
      />

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePicture}
          disabled={isProcessing}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>

      {isProcessing && <LoadingSpinner message="Scanning book..." />}

      <View style={styles.guideContainer}>
        <Text style={styles.guideText}>
          Position the book cover within the frame and tap the button
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  guideContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    padding: 10,
  },
  guideText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default CameraComponent;