import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import ImageEditor from '@react-native-community/image-editor';
import { useNavigation } from '@react-navigation/native';
import { recognizeTextFromImage } from '../api/ocrService';
import { searchBookByText } from '../api/googleBooks';
import LoadingSpinner from './LoadingSpinner';
import { RootStackParamList } from '../types/navigation';
import { BookData } from '../storage/bookStorage';
import { StackNavigationProp } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type CameraRef = {
  capture: () => Promise<{ uri: string }>;
} | null;

type NavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const CameraComponent: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [flashMode, setFlashMode] = useState<'on' | 'off' | 'auto'>('auto');
  const cameraRef = useRef<CameraRef>(null);
  const navigation = useNavigation<NavigationProp>();

  const takePicture = async (): Promise<void> => {
    console.log('takePicture',)
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      if (!cameraRef.current) {
        throw new Error('Camera reference is null');
      }

      const image = await cameraRef.current.capture();
      console.log('image', image)

      const processedImage = await ImageEditor.cropImage(image.uri, {
        offset: { x: 0, y: 0 },
        size: { width: 900, height: 900 },
      });
      console.log('processedImage', processedImage)

      const extractedText = await recognizeTextFromImage(image.uri);
      console.log('extractedText', extractedText)

      if (!extractedText || extractedText.length === 0) {
        Alert.alert('No text detected', 'Please try again with a clearer image of the book cover.');
        setIsProcessing(false);
        return;
      }

      const bookData = await searchBookByText(extractedText);
      console.log('bookData', bookData)

      if (!bookData) {
        Alert.alert('Book not found', 'We couldn\'t find information about this book. Please try again.');
        setIsProcessing(false);
        return;
      }

      const formattedBookData: BookData = {
        ...bookData,
        imageLinks: {
          thumbnail: bookData.imageLinks?.thumbnail || undefined,
          smallThumbnail: bookData.imageLinks?.smallThumbnail || undefined,
        },
      };

      navigation.navigate('Book', { book: formattedBookData });

    } catch (error) {
      console.error('Error scanning book:', error);
      Alert.alert('Error', 'There was an error scanning the book. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleFlash = () => {
    setFlashMode(prev => {
      if (prev === 'auto') return 'on';
      if (prev === 'on') return 'off';
      return 'auto';
    });
  };

  const goBack = () => {
    navigation.goBack();
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

      <View style={styles.overlay}>
        <View style={styles.transparentOverlay} />
        <View style={styles.horizontalOverlay}>
          <View style={styles.transparentOverlay} />
          <View style={styles.scanFrame} />
          <View style={styles.transparentOverlay} />
        </View>
        <View style={styles.transparentOverlay} />
      </View>

      <View style={styles.topControls}>

        <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
          <MaterialCommunityIcons 
              name={
                flashMode === 'auto' ? 'flash-auto' : 
                flashMode === 'on' ? 'flash' : 'flash-off'
              } 
              size={24} 
              color="white" 
            />
        </TouchableOpacity>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
          onPress={takePicture}
          disabled={isProcessing}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>

      <View style={styles.guideContainer}>
        <Text style={styles.guideText}>
          Position the book cover within the frame and tap the button
        </Text>
      </View>

      {isProcessing && <LoadingSpinner message="Scanning book..." />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
  },
  transparentOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  horizontalOverlay: {
    flexDirection: 'row',
    height: 300,
  },
  scanFrame: {
    width: 280,
    height: 300,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 50,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  guideContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 12,
  },
  guideText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CameraComponent;