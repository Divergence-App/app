import {Text, TouchableOpacity, useWindowDimensions, View, TextInput, Alert, Platform} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import fonts from '../../lib/fonts';
import {ScrollView} from 'react-native-gesture-handler';
import CustomHeader from '../../components/customHeader';
import { useContext, useState, useRef } from 'react';
import { AppContext } from '../../components/appContext';
import { setDyslexiaMode, setSubjects } from '../../lib/storage';
import { Animated } from 'react-native';
import GradientBlur from '../../components/GradientBlur';
import { Calendar, DateData } from 'react-native-calendars';
import { Switch } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/router';
import DateTimePicker from '@react-native-community/datetimepicker';

import { SubjectType } from '../../types/components';

const HEADER_SCROLL_DISTANCE = 1;

const SubjectPage = ({
  navigation
}: {
  navigation: NavigationProp<RootStackParamList>;
}) => {
  const Context = useContext(AppContext);
  const insets = useSafeAreaInsets();
  const headerHeight = 10;
  const topSpacing = insets.top + headerHeight;
  const { width, height } = useWindowDimensions();
  const scrollY = new Animated.Value(0);
  const blurHeight = 100;
  
  // Form state
  const [subject, setSubject] = useState<SubjectType>({
    id: Math.random().toString(36).substr(2, 9),
    name: '',
    teacher: '',
    colour: '#50cebb',
    startsAt: '09:00',
    endsAt: '10:00',
    date: '',
    repeats: false,
    description: '',
    notes: []
  });
  
  // Time picker states
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
  // Calendar state
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const heightAnim = useRef(new Animated.Value(0)).current;

  const blurOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const toggleCalendar = (): void => {
    Animated.timing(heightAnim, {
      toValue: isCalendarVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsCalendarVisible(!isCalendarVisible);
  };

  const calendarHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 350],
  });

  const onDayPress = (day: DateData): void => {
    const formattedDate = formatToDD_MM_YYYY(new Date(day.dateString));
    setSelectedDate(formattedDate);
    setSubject(prev => ({ ...prev, date: formattedDate }));
    toggleCalendar();
  };

  const formatToDD_MM_YYYY = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (hours: number, minutes: number): string => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const onStartTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const timeString = formatTime(hours, minutes);
      setSubject(prev => ({ ...prev, startsAt: timeString }));
    }
  };

  const onEndTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const timeString = formatTime(hours, minutes);
      setSubject(prev => ({ ...prev, endsAt: timeString }));
    }
  };

  const formatTimeForDisplay = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const submitSubject = () => {
    if (!subject.name || !subject.teacher || !subject.startsAt || !subject.endsAt || !subject.date) {  
      Alert.alert('Please fill in all fields');
      return;
    }

    // Validate that end time is after start time
    const [startHours, startMinutes] = subject.startsAt.split(':').map(Number);
    const [endHours, endMinutes] = subject.endsAt.split(':').map(Number);
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;

    if (endTotal <= startTotal) {
      Alert.alert('End time must be after start time');
      return;
    }

    Context.setSubjects((prev) => {
      setSubjects([...prev, subject]);
      return [...prev, subject];
    });
    
    navigation.goBack();
    Alert.alert('Subject added successfully');
  };

  return (
    <View className='bg-[#101010] flex-1'>
      <View
        style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}
        className='bg-[#101010]'
      >
        <CustomHeader title="Add Subject" showBackButton />
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

      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: topSpacing }}
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="scrollableAxes"
      >
        <View className="w-full items-center justify-center px-4">
          <Text
            style={[
              Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular
            ]}
            className="text-white text-center text-3xl mb-8"
          >
            Enter your subject 📚
          </Text>

          <View className="w-full space-y-4">
            <View>
              <Text className="text-white mb-2">Subject Name</Text>
              <TextInput
                className="bg-[#1C1C1E] text-white p-4 rounded-lg"
                value={subject.name}
                onChangeText={(text) => setSubject(prev => ({ ...prev, name: text }))}
                placeholder="Enter subject name"
                placeholderTextColor="#666"
              />
            </View>

            <View>
              <Text className="text-white mb-2 mt-2">Teacher</Text>
              <TextInput
                className="bg-[#1C1C1E] text-white p-4 rounded-lg"
                value={subject.teacher}
                onChangeText={(text) => setSubject(prev => ({ ...prev, teacher: text }))}
                placeholder="Enter teacher's name"
                placeholderTextColor="#666"
              />
            </View>

            {/* Time Selection */}
            <View>
              <Text className="text-white mb-2 mt-2">Time</Text>
              
              <View className="bg-[#1C1C1E] rounded-lg overflow-hidden">
                {/* Start Time */}
                <View className="border-b border-gray-800">
                  <TouchableOpacity 
                    onPress={() => setShowStartPicker(!showStartPicker)}
                    className="w-full"
                  >
                    <View className="p-4 flex-row justify-between items-center">
                      <Text className="text-white">Starts at</Text>
                      <Text className="text-white">{formatTimeForDisplay(subject.startsAt)}</Text>
                    </View>
                    
                    {showStartPicker && Platform.OS === 'ios' && (
                      <View className="w-full bg-[#2C2C2E] px-2">
                        <DateTimePicker
                          value={(() => {
                            const [hours, minutes] = subject.startsAt.split(':').map(Number);
                            const date = new Date();
                            date.setHours(hours, minutes, 0);
                            return date;
                          })()}
                          mode="time"
                          is24Hour={true}
                          onChange={onStartTimeChange}
                          display="spinner"
                          textColor="white"
                          style={{ height: 120, width: '100%' }}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                {/* End Time */}
                <View>
                  <TouchableOpacity 
                    onPress={() => setShowEndPicker(!showEndPicker)}
                    className="w-full"
                  >
                    <View className="p-4 flex-row justify-between items-center">
                      <Text className="text-white">Ends at</Text>
                      <Text className="text-white">{formatTimeForDisplay(subject.endsAt)}</Text>
                    </View>
                    
                    {showEndPicker && Platform.OS === 'ios' && (
                      <View className="w-full bg-[#2C2C2E] px-2">
                        <DateTimePicker
                          value={(() => {
                            const [hours, minutes] = subject.endsAt.split(':').map(Number);
                            const date = new Date();
                            date.setHours(hours, minutes, 0);
                            return date;
                          })()}
                          mode="time"
                          is24Hour={true}
                          onChange={onEndTimeChange}
                          display="spinner"
                          textColor="white"
                          style={{ height: 120, width: '100%' }}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Android Time Picker Modal */}
              {Platform.OS === 'android' && showStartPicker && (
                <DateTimePicker
                  value={(() => {
                    const [hours, minutes] = subject.startsAt.split(':').map(Number);
                    const date = new Date();
                    date.setHours(hours, minutes, 0);
                    return date;
                  })()}
                  mode="time"
                  is24Hour={true}
                  onChange={onStartTimeChange}
                />
              )}

              {Platform.OS === 'android' && showEndPicker && (
                <DateTimePicker
                  value={(() => {
                    const [hours, minutes] = subject.endsAt.split(':').map(Number);
                    const date = new Date();
                    date.setHours(hours, minutes, 0);
                    return date;
                  })()}
                  mode="time"
                  is24Hour={true}
                  onChange={onEndTimeChange}
                />
              )}
            </View>

            {/* Date Picker */}
            <View>
              <Text className="text-white mb-2 mt-2">Date</Text>
              <TouchableOpacity 
                onPress={toggleCalendar}
                className="bg-[#1C1C1E] p-4 rounded-lg flex-row justify-between items-center"
              >
                <Text className="text-white">
                  {subject.date || "Select date"}
                </Text>
                <Text className="text-white">
                  {isCalendarVisible ? '▼' : '▲'}
                </Text>
              </TouchableOpacity>
              
              <Animated.View style={{ height: calendarHeight, overflow: 'hidden' }}>
                <Calendar
                  onDayPress={onDayPress}
                  markingType={'period'}
                  theme={{
                    calendarBackground: '#1C1C1E',
                    textColor: 'white',
                    todayTextColor: '#50cebb',
                    selectedDayBackgroundColor: '#50cebb',
                    dayTextColor: 'white',
                    monthTextColor: 'white',
                    arrowColor: 'white',
                  }}
                />
              </Animated.View>
            </View>

            <View className="flex-row justify-between items-center pt-2 pb-2">
              <Text className="text-white">Repeats Weekly</Text>
              <Switch
                value={subject.repeats}
                onValueChange={(value) => setSubject(prev => ({ ...prev, repeats: value }))}
              />
            </View>

            <View>
              <Text className="text-white mb-2">Description (Optional)</Text>
              <TextInput
                className="bg-[#1C1C1E] text-white p-4 rounded-lg"
                value={subject.description}
                onChangeText={(text) => setSubject(prev => ({ ...prev, description: text }))}
                placeholder="Enter description"
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity 
              className="bg-[#50cebb] p-4 rounded-lg mt-4"
              onPress={submitSubject}
            >
              <Text className="text-white text-center font-bold">Save Subject</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-8" />
      </Animated.ScrollView>
    </View>
  );
};

export default SubjectPage;