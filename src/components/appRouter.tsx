import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import screen components
import Home from '../Pages/home/index';
import {RootStackParamList} from '../types/router';
import TimeTablePage from '../Pages/timeTable';
import UserPage from '../Pages/profile';
import SubjectPage from '../Pages/subject';
import SubjectNotes from '../Pages/subjectnotes';
import RevisionFlipper from '../Pages/revisionflipper';

// Import UI components and utilities
import {useWindowDimensions, Platform} from 'react-native';
import GradientBlur from './GradientBlur';
import {
  BookText,
  Calendar,
  HomeIcon,
  User,
} from 'lucide-react-native';

// Create navigation objects
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Stack navigator for Home tab
 * Includes Home screen and SubjectNotes screen
 */
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({route, options, navigation}) => <></>, // Hide header
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

/**
 * Stack navigator for TimeTable tab
 * Includes TimeTable, Subject, and SubjectNotes screens
 */
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

/**
 * Stack navigator for Profile tab
 * Currently only includes Profile screen
 */
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

/**
 * Stack navigator for Revision tab
 * Currently only includes RevisionFlipper screen
 */
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

/**
 * Main App Router component
 * Sets up bottom tab navigation with custom styling and icons
 * Each tab has its own stack navigator for nested navigation
 */
function AppRouter() {
  const {width, height} = useWindowDimensions();

  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            headerShown: false,
            // Custom tab bar styling
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
            // Tab bar colors and label styling
            tabBarActiveTintColor: '#A5FFC9',
            tabBarInactiveTintColor: '#fff',
            tabBarLabelStyle: {
              fontSize: 0,
              marginBottom: -20,
            },
            tabBarLabel: '',
            // Custom background with gradient blur effect
            tabBarBackground: () => <GradientBlur width={width} height={80} />,
          })}>
          {/* Home Tab */}
          <Tab.Screen
            name="Home"
            options={{
              tabBarIcon: ({color, focused, size}) => (
                <HomeIcon color={color} size={size} />
              ),
            }}
            component={HomeStack}
          />
          {/* TimeTable Tab */}
          <Tab.Screen
            name="TimeTabel"
            component={TimeTableStack}
            options={{
              tabBarIcon: ({color, focused, size}) => (
                <Calendar color={color} size={size} />
              ),
            }}
          />
          {/* Revision Tab */}
          <Tab.Screen
            name="RevisionFlipper"
            component={RevisionStack}
            options={{
              tabBarIcon: ({color, focused, size}) => (
                <BookText color={color} size={size} />
              ),
            }}
          />
          {/* Profile Tab */}
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