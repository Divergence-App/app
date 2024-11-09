import {Text, TouchableOpacity, useWindowDimensions, View, TextInput, Alert} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import fonts from '../../lib/fonts';
import {ScrollView} from 'react-native-gesture-handler';
import CustomHeader from '../../components/customHeader';
import { useContext, useState, useRef } from 'react';
import { AppContext } from '../../components/appContext';
import { setDyslexiaMode, setSubjects } from '../../lib/storage';
import { Animated } from 'react-native';
import { Platform } from 'react-native';
import GradientBlur from '../../components/GradientBlur';
import { Calendar, DateData } from 'react-native-calendars';
import { Switch } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/router';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


const HEADER_SCROLL_DISTANCE = 1;

type Props = NativeStackScreenProps<RootStackParamList, 'SubjectNotes'>;

const SubjectNotes: React.FC<Props> = ({ navigation, route }) => {
  const Context = useContext(AppContext);
  const insets = useSafeAreaInsets();
  const headerHeight = 10;
  const topSpacing = insets.top + headerHeight;
  const { width } = useWindowDimensions();
  const scrollY = new Animated.Value(0);
  const blurHeight = 100;

  const blurOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <View className='bg-[#101010] flex-1'>
      {/* Fixed header */}
      <View
        style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}
        className='bg-[#101010]'
      >
        <CustomHeader title={route.params.subject.name} showBackButton />
        {insets.top > 0 && Platform.OS !== "android" && (
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: blurHeight,
              zIndex: 1,
              opacity: blurOpacity,
            }}
          >
            <GradientBlur
              useAtTop
              locations={[1, 0.4, 0]}
              colors={["transparent", "rgba(0,0,0,0.8)", "#0B0B0B"]}
              width={width}
              height={insets.top + insets.top}
            />
          </Animated.View>
        )}
      </View>

      {/* Scrollable content */}
      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: topSpacing }}
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="scrollableAxes"
      >
        <View className="w-full items-center justify-center px-4">

            <Text className='text-white '>
                {JSON.stringify(route.params.subject)}
            </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default SubjectNotes;