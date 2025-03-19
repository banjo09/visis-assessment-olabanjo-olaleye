import axios from 'axios';
import { Platform } from 'react-native';
import { VISION_API_URL, API_KEY } from '@env';
interface OCRResponse {
  data: {
    responses: Array<{
      textAnnotations?: Array<{
        description: string;
        locale?: string;
        boundingPoly?: {
          vertices: Array<{
            x: number;
            y: number;
          }>;
        };
      }>;
    }>;
  };
}

interface AlternativeOCRResponse {
  data: {
    ParsedResults?: Array<{
      ParsedText: string;
      ErrorMessage?: string;
      FileParseExitCode?: number;
    }>;
    IsErroredOnProcessing?: boolean;
    ErrorMessage?: string;
  };
}

export const recognizeTextFromImage = async (imageUri: string): Promise<string | null> => {
  try {
    const base64Image = await imageToBase64(imageUri);
    console.log('base64Image', base64Image)
    
    const requestData = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: 'TEXT_DETECTION',
              maxResults: 5,
            },
          ],
        },
      ],
    };
    
    const response: OCRResponse = await axios.post(`${VISION_API_URL}?key=${API_KEY}`, requestData);
    console.log('response',JSON.stringify(response), response)
    
    const detections = response.data.responses[0].textAnnotations;
    console.log('detections', detections)
    
    if (!detections || detections.length === 0) {
      return null;
    }
    
    return detections[0].description;
    
  } catch (error) {
    console.error('OCR service error:', error);
    throw new Error('Failed to perform text recognition');
  }
};

const imageToBase64 = async (uri: string): Promise<string> => {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result?.toString().split(',')[1];
        if (base64data) {
          resolve(base64data);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } else {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result?.toString().split(',')[1];
        if (base64data) {
          resolve(base64data);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
};

export const alternativeOCRService = async (imageUri: string): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    } as any);
    formData.append('apikey', 'YOUR_OCR_SPACE_API_KEY');
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    
    const response: AlternativeOCRResponse = await axios.post('https://api.ocr.space/parse/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data && response.data.ParsedResults && response.data.ParsedResults.length > 0) {
      return response.data.ParsedResults[0].ParsedText;
    }
    
    return null;
  } catch (error) {
    console.error('Alternative OCR service error:', error);
    throw new Error('Failed to perform text recognition');
  }
};
