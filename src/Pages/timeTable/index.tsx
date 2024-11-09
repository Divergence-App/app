import { Text, View, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { Calendar, DateData } from 'react-native-calendars';
import { useState, useEffect, useRef } from 'react';

import { useContext } from 'react';
import { AppContext } from '../../components/appContext';
import fonts from '../../lib/fonts';

interface WeekDates {
  start: Date;
  end: Date;
}

interface MarkedDates {
  [date: string]: {
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
  };
}

const TimeTablePage = () => {
  const Context = useContext(AppContext);
  const [selectedWeek, setSelectedWeek] = useState<WeekDates>({
    start: new Date(),
    end: new Date()
  });
  const [daysInWeek, setDaysInWeek] = useState<Date[]>([]);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState<boolean>(false);
  const heightAnim = useRef(new Animated.Value(0)).current;

  const formatToDD_MM_YYYY = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getWeekDates = (date: string | Date): WeekDates => {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay();
    const start = new Date(curr.setDate(first));
    const end = new Date(curr.setDate(first + 6));
    return { start, end };
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const generateWeekDays = (startDate: Date): Date[] => {
    const days: Date[] = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 7; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const onDayPress = (day: DateData): void => {
    const weekDates = getWeekDates(day.dateString);
    setSelectedWeek(weekDates);
    setDaysInWeek(generateWeekDays(weekDates.start));
    toggleCalendar();
  };

  const toggleCalendar = (): void => {
    Animated.timing(heightAnim, {
      toValue: isCalendarExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsCalendarExpanded(!isCalendarExpanded);
  };

  const getMarkedDates = (): MarkedDates => {
    return {
      [formatDate(selectedWeek.start)]: { startingDay: true, color: '#50cebb' },
      [formatDate(selectedWeek.end)]: { endingDay: true, color: '#50cebb' }
    };
  };

  useEffect(() => {
    const weekDates = getWeekDates(new Date());
    setSelectedWeek(weekDates);
    setDaysInWeek(generateWeekDays(weekDates.start));
  }, []);

  const calendarHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 350],
  });

  const formatDayString = (day: Date): string => {
    const weekday = day.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = formatToDD_MM_YYYY(day);
    return `${weekday}, ${formattedDate}`;
  };

  return (
    <SafeAreaView className="bg-[#101010] h-full w-full">
      {/* Week selector header */}
      <TouchableOpacity 
        onPress={toggleCalendar}
        className="px-4 py-3 border-b border-gray-800 flex-row justify-between items-center"
      >
        <Text className="text-white text-lg" style={(Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular)}>
          {`${formatToDD_MM_YYYY(selectedWeek.start)} - ${formatToDD_MM_YYYY(selectedWeek.end)}`}
        </Text>
        <Text className="text-white text-lg">
          {isCalendarExpanded ? '▼' : '▲'}
        </Text>
      </TouchableOpacity>

      {/* Animated Calendar Container */}
      <Animated.View style={{ height: calendarHeight, overflow: 'hidden' }}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={getMarkedDates()}
          markingType={'period'}
          style={(Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular)}
          theme={{
            calendarBackground: '#101010',
            textColor: 'white',
            todayTextColor: '#50cebb',
            selectedDayBackgroundColor: '#50cebb',
            dayTextColor: 'white',
            monthTextColor: 'white',
            arrowColor: 'white',
          }}
        />
      </Animated.View>

      {/* Scrollable daily view */}
      <ScrollView className="mt-4">
        {daysInWeek.map((day: Date, index: number) => (
          <View
            key={index}
            className="px-4 py-3 border-b border-green-300"
            
          >
            <Text style={(Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular)} className="text-white text-lg">
              {formatDayString(day)}
            </Text>
          </View>
        ))}

        <View className='h-12' />
        <View className='w-full h-32 justify-center items-center'>
          <TouchableOpacity> 
            <Text 
            className={`text-black text-lg rounded-lg bg-green-300 p-4`}
            style={(Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular)}>Add new subject</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default TimeTablePage;