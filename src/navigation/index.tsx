import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Home } from './screens/Home';
import { Profile } from './screens/Profile';
import { Settings } from './screens/Settings';
import { AI } from './screens/AI';
import { NotFound } from './screens/NotFound';
import React from 'react';

const HomeTabs = createBottomTabNavigator({
  screens: {
    Home: {
      screen: Home,
      options: {
        title: 'Home Screen',
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Ionicons name="home" color={color} size={size} />
        ), 
      },
    },
    AI: {
      screen: AI,
      options: {
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Ionicons name="document" color={color} size={size} />
        ), 
      },
    },
    Settings: {
      screen: Settings,
      options: {
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Ionicons name="settings" color={color} size={size} />
        ), 
      },
    },
    Profile: {
      screen: Profile,
      options: {
        tabBarIcon: ({ color, size }: { color: string; size: number }) => (
          <Ionicons name="person-circle" color={color} size={size} />
        ), 
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    HomeTabs: {
      screen: HomeTabs,
      options: {
        title: 'Home',
        headerShown: false,
      },
    },
    // Profile and Settings are now tabs, not stack screens
    NotFound: {
      screen: NotFound,
      options: {
        title: '404',
      },
      linking: {
        path: '*',
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
