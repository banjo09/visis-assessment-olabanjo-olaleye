# Book Scanner App

A React Native mobile application that helps users manage their reading activities by scanning book covers to retrieve book information.

## Features

- **Book Cover Scanning**: Scan book covers using the device's camera to identify books
- **OCR Integration**: Uses OCR technology to extract text from book covers
- **Google Books API**: Retrieves detailed book information from the Google Books API
- **Personal Library Management**: Save your favorite books to your personal library for quick access
- **Rich Book Details**: View comprehensive information about each book including covers, descriptions, ratings, and more

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or higher)
- npm (v6 or higher) or Yarn (v1.22 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Physical device or emulator for testing

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/banjo09/visis-assessment-olabanjo-olaleye.git
   cd visis-assessment-olabanjo-olaleye
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Setup API Keys:
   - You'll need to obtain API keys for:
     - Google Cloud Vision API (for OCR)
     - Google Books API
   - Create a `.env` file in the root directory with your API keys:
     ```
     VISION_API_URL=goggle_vision_url
     BOOKS_API_URL=goggle_books_url
     API_KEY=your_goggle_api_key
     ```

4. Run the Metro bundler:
   ```
   npm start
   # or
   yarn start
   ```

5. Run the app on an Android device/emulator:
   ```
   npm run android
   # or
   yarn android
   ```

6. Run the app on an iOS device/simulator (macOS only):
   ```
   npm run ios
   # or
   yarn ios
   ```

## Building the Release APK

To generate a release APK for Android:

1. Generate a signing key (if you don't have one already):
   ```
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Place the keystore file in `android/app` directory

3. Add signing configuration to `android/app/build.gradle`:
   ```gradle
   android {
       ...
       defaultConfig { ... }
       signingConfigs {
           release {
               storeFile file('my-release-key.keystore')
               storePassword 'your_keystore_password'
               keyAlias 'my-key-alias'
               keyPassword 'your_key_password'
           }
       }
       buildTypes {
           release {
               ...
               signingConfig signingConfigs.release
           }
       }
   }
   ```

4. Build the release APK:
   ```
   cd android
   ./gradlew assembleRelease
   ```

5. The APK file will be generated at `android/app/build/outputs/apk/release/app-release.apk`

## Project Structure

```
src/
├── api/               # API integration
│   ├── googleBooks.js # Google Books API integration
│   └── ocrService.js  # OCR service integration
├── components/        # Reusable UI components
│   ├── BookDetails.js # Book details display component
│   ├── Camera.js      # Camera component for scanning
│   └── LoadingSpinner.js # Loading indicator
├── screens/           # App screens
│   ├── HomeScreen.js  # Main screen with camera
│   ├── BookScreen.js  # Book details screen
│   └── LibraryScreen.js # Saved books screen
├── storage/           # Local storage
│   └── bookStorage.js # AsyncStorage for saving books
├── App.js             # Main app component
└── navigation.js      # Navigation setup
```

## Architecture Decisions

1. **Camera Integration**:
   - Used `react-native-camera-kit` for camera functionality due to its comprehensive feature set and good performance.

2. **OCR Implementation**:
   - Integrated with Google Cloud Vision API for OCR due to its high accuracy for text recognition.
   - Added logic to process and clean up OCR results to improve book search accuracy.

3. **API Integration**:
   - Used the Google Books API to fetch detailed book information.
   - Implemented robust error handling and fallback strategies.

4. **State Management**:
   - Used React's built-in useState and useEffect hooks for local component state.
   - AsyncStorage for persisting the user's book library.

5. **Navigation**:
   - Used React Navigation with a combination of Stack and Tab navigators for an intuitive user experience.

6. **UI/UX Design**:
   - Implemented a clean, user-friendly interface with visual feedback during scanning.
   - Added loading indicators and error messages for a better user experience.

## Usage

1. Open the app and grant camera permissions when prompted.
2. Point your camera at a book cover and tap the capture button.
3. The app will scan the cover, extract text, and search for book information.
4. Once a book is found, you can view detailed information about it.
5. Add books to your library by tapping the "Add to Library" button.
6. View and manage your saved books in the Library tab.

## Demo Video

[Watch the demo video](https://www.youtube.com/watch?v=UADy3qZEgxs)

## APK Download

[Download the APK](https://drive.google.com/file/d/13GwOhyMDLUVb2ZgmnjmZrz3So3Vc3DUl/view?usp=sharing)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

If you have any questions, feel free to reach out:

- Email: olabanjoolaleye@gmail.com
- GitHub: [olabanjo](https://github.com/banjo09/)