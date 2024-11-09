import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeft, MoreVertical} from 'lucide-react-native';
import fonts from '../lib/fonts';
import {SafeAreaView} from 'react-native-safe-area-context';

/**
 * Interface defining the props for the CustomHeader component
 */
interface CustomHeaderProps {
  title: string;                          // Title text to display in header
  showBackButton?: boolean;               // Optional flag to show/hide back button
  showMoreOptions?: boolean;              // Optional flag to show/hide more options button
  onMoreOptionsPress?: () => void;        // Optional callback for more options button press
}

/**
 * CustomHeader component that provides a consistent header across the app
 * Features:
 * - Back button navigation
 * - Centered title
 * - Optional more options button
 * - Safe area handling
 */
const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = true,
  showMoreOptions = false,
  onMoreOptionsPress,
}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Left section - Back button */}
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconButton}>
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center section - Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Right section - More options button */}
        <View style={styles.rightContainer}>
          {showMoreOptions && (
            <TouchableOpacity
              onPress={onMoreOptionsPress}
              style={styles.iconButton}>
              <MoreVertical color="#fff" size={24} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

/**
 * Styles for the CustomHeader component
 */
const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',     // Position header at top of screen
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,              // Ensure header appears above other content
  },
  container: {
    flexDirection: 'row',    // Layout children horizontally
    alignItems: 'center',    // Center children vertically
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftContainer: {
    flex: 1,                 // Take up 1/4 of space
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 2,                 // Take up 2/4 of space for centered title
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,                 // Take up 1/4 of space
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 8,              // Increase touch target size
  },
  title: {
    ...fonts.interBold,      // Apply custom font
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});

export default CustomHeader;