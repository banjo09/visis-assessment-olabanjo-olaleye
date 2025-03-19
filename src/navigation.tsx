import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './screens/HomeScreen';
import BookScreen from './screens/BookScreen';
import LibraryScreen from './screens/LibraryScreen';
import { RootStackParamList } from './types/navigation';

type TabParamList = {
  Home: undefined;
  Library: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={HomeScreen}
        options={{
          title: 'Book Scanner',
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="Book"
        component={BookScreen}
        options={{
          title: 'Book Details',
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
          headerBackTitleStyle: {
            color: '#fff',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const LibraryStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          title: 'My Library',
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen
        name="Book"
        component={BookScreen}
        options={{
          title: 'Book Details',
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
          headerBackTitleStyle: {
            color: '#fff',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'alert';

            if (route.name === 'Home') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Library') {
              iconName = focused ? 'library' : 'library-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name="Home" 
          component={HomeStack}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Library"
          component={LibraryStack}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;