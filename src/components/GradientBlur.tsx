import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from '@react-native-community/blur';

/**
 * GradientBlur component creates a platform-specific blur effect with gradient
 * Used for creating visually appealing blurred backgrounds
 * 
 * @param {number} width - Width of the gradient blur
 * @param {number} height - Height of the gradient blur
 * @param {boolean} useAtTop - Whether to position the blur at top (default: bottom)
 * @param {number[]} locations - Custom gradient stop locations
 * @param {string[]} colors - Custom gradient colors
 * @param {number} androidOpacity - Opacity value for Android fallback (default: 0.8)
 */
const GradientBlur = ({
  width,
  height,
  useAtTop,
  locations,
  colors,
  androidOpacity = 0.8,
}: {
  width: number;
  height: number;
  useAtTop?: boolean;
  locations?: number[];
  colors?: string[];
  androidOpacity?: number;
}) => {
  // Default gradient colors if none provided
  const colrs = colors || ['transparent', 'rgba(0,0,0,1)', '#0B0B0B'];
  // Default gradient locations if none provided
  let locs = locations || [0, 0.8, 1];

  return (
    <View
      style={[
        // Apply different styles based on whether blur should be at top or bottom
        !useAtTop ? styles.blurContainer : stylesTop.blurContainer,
        {width, height},
      ]}>
      <MaskedView
        // Use LinearGradient as mask to create fade effect
        maskElement={
          <LinearGradient
            locations={locs}
            colors={colrs}
            style={StyleSheet.absoluteFill}
          />
        }
        style={StyleSheet.absoluteFill}>
        {/* Platform-specific blur implementation */}
        {Platform.OS === 'ios' ? (
          // iOS uses native blur effect
          <BlurView
            blurType={'dark'}
            blurAmount={100}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          // Android uses semi-transparent background as fallback
          <View
            style={[
              StyleSheet.absoluteFill,
              {backgroundColor: `rgba(0,0,0,${androidOpacity})`},
            ]}
          />
        )}
      </MaskedView>
    </View>
  );
};

/**
 * Styles for top-positioned blur
 */
const stylesTop = StyleSheet.create({
  blurContainer: {
    position: 'absolute',
    top: 0,        // Position at top
    zIndex: 2,     // Ensure blur appears above content
  },
});

/**
 * Styles for bottom-positioned blur
 */
const styles = StyleSheet.create({
  blurContainer: {
    position: 'absolute',
    bottom: 0,     // Position at bottom
    zIndex: 2,     // Ensure blur appears above content
  },
});

export default GradientBlur;