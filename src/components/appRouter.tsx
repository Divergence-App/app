import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../Pages/home/index';
import {RootStackParamList} from '../types/router';

import {BlurView} from '@react-native-community/blur';
import {View, StyleSheet, useWindowDimensions, Platform} from 'react-native';

import GradientBlur from './GradientBlur';

import LinearGradient from 'react-native-linear-gradient';
import {
  BookOpenText,
  BookText,
  Calendar,
  CalendarHeart,
  HomeIcon,
  User,
} from 'lucide-react-native';
import TimeTablePage from '../Pages/timeTable';
import UserPage from '../Pages/profile';
import SubjectPage from '../Pages/subject';
import SubjectNotes from '../Pages/subjectnotes';
import RevisionFlipper from '../Pages/revisionflipper';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({route, options, navigation}) => <></>,
        animation: Platform.OS === 'android' ? 'slide_from_bottom' : 'default',
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="SubjectNotes"
        component={SubjectNotes}
        initialParams={{
          subject: {},
        }}
      />
    </Stack.Navigator>
  );
}

function TimeTableStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({route, options, navigation}) => <></>,
        animation: Platform.OS === 'android' ? 'slide_from_bottom' : 'default',
      }}>
      <Stack.Screen name="TimeTable" component={TimeTablePage} />
      <Stack.Screen name="Subject" component={SubjectPage} />
      <Stack.Screen
        name="SubjectNotes"
        component={SubjectNotes}
        initialParams={{
          subject: {},
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({route, options, navigation}) => <></>,
        animation: Platform.OS === 'android' ? 'slide_from_bottom' : 'default',
      }}>
      <Stack.Screen name="Profile" component={UserPage} />
    </Stack.Navigator>
  );
}

function RevisionStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({route, options, navigation}) => <></>,
        animation: Platform.OS === 'android' ? 'slide_from_bottom' : 'default',
      }}>
      <Stack.Screen name="RevisionFlipper" component={RevisionFlipper} />
    </Stack.Navigator>
  );
}

function AppRouter() {
  const {width, height} = useWindowDimensions();
  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            headerShown: false,
            tabBarStyle: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 0,
              backgroundColor: 'transparent',
              height: 80,
              borderTopWidth: 0,
            },
            tabBarActiveTintColor: '#A5FFC9',
            tabBarInactiveTintColor: '#fff',
            tabBarLabelStyle: {
              fontSize: 0,
              marginBottom: -20,
            },
            tabBarLabel: '',
            tabBarBackground: () => <GradientBlur width={width} height={80} />,
          })}>
          <Tab.Screen
            name="Home"
            options={{
              tabBarIcon: ({color, focused, size}) => (
                <HomeIcon color={color} size={size} />
              ),
            }}
            component={HomeStack}
          />
          <Tab.Screen
            name="TimeTabel"
            component={TimeTableStack}
            options={{
              tabBarIcon: ({color, focused, size}) => (
                <Calendar color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="RevisionFlipper"
            component={RevisionStack}
            options={{
              tabBarIcon: ({color, focused, size}) => (
                <BookText color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileStack}
            options={{
              tabBarIcon: ({color, focused, size}) => (
                <User color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

export default AppRouter;
