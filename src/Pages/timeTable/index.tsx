import {Text, View, TouchableOpacity, Animated} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import {Calendar, DateData} from 'react-native-calendars';
import {useState, useEffect, useRef, useContext} from 'react';
import {AppContext} from '../../components/appContext';
import fonts from '../../lib/fonts';
import {NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../types/router';
import {SubjectType} from '../../types/components';

/**
 * Interface for storing the start and end dates of a week
 */
interface WeekDates {
  start: Date;
  end: Date;
}

/**
 * Interface for calendar marked dates formatting
 */
interface MarkedDates {
  [date: string]: {
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
  };
}

/**
 * TimeTablePage component displays a weekly schedule of subjects
 * Features include:
 * - Expandable calendar for date selection
 * - Weekly view of subjects
 * - Subject details and navigation
 */
const TimeTablePage = ({
  navigation,
}: {
  navigation: NavigationProp<RootStackParamList>;
}) => {
  const Context = useContext(AppContext);
  // State management
  const [selectedWeek, setSelectedWeek] = useState<WeekDates>({
    start: new Date(),
    end: new Date(),
  });
  const [daysInWeek, setDaysInWeek] = useState<Date[]>([]);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState<boolean>(false);
  const heightAnim = useRef(new Animated.Value(0)).current;

  /**
   * Formats a date to DD/MM/YYYY string
   */
  const formatToDD_MM_YYYY = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  /**
   * Gets the start and end dates of a week given any date within that week
   */
  const getWeekDates = (date: string | Date): WeekDates => {
    const curr = new Date(date);
    const first = curr.getDate() - curr.getDay();
    const start = new Date(curr.setDate(first));
    const end = new Date(curr.setDate(first + 6));
    return {start, end};
  };

  /**
   * Formats date to YYYY-MM-DD string for calendar
   */
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  /**
   * Generates an array of dates for the week
   */
  const generateWeekDays = (startDate: Date): Date[] => {
    const days: Date[] = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 7; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  /**
   * Filters and sorts subjects for a specific day
   * Handles both one-time and recurring subjects
   */
  const getSubjectsForDay = (date: Date): SubjectType[] => {
    const dateStr = formatToDD_MM_YYYY(date);
    return Context.subjects
      .filter(subject => {
        // Check if the subject is on this date
        if (subject.date === dateStr) return true;

        // Check if subject repeats and matches the day of week
        if (subject.repeats) {
          const subjectDate = new Date(
            subject.date.split('/').reverse().join('-'),
          );
          return subjectDate.getDay() === date.getDay();
        }
        return false;
      })
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  };

  /**
   * Handles calendar day selection and updates week view
   */
  const onDayPress = (day: DateData): void => {
    const weekDates = getWeekDates(day.dateString);
    setSelectedWeek(weekDates);
    setDaysInWeek(generateWeekDays(weekDates.start));
    toggleCalendar();
  };

  /**
   * Handles calendar expansion animation
   */
  const toggleCalendar = (): void => {
    Animated.timing(heightAnim, {
      toValue: isCalendarExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsCalendarExpanded(!isCalendarExpanded);
  };

  /**
   * Generates marked dates for calendar highlighting
   */
  const getMarkedDates = (): MarkedDates => {
    return {
      [formatDate(selectedWeek.start)]: {startingDay: true, color: '#50cebb'},
      [formatDate(selectedWeek.end)]: {endingDay: true, color: '#50cebb'},
    };
  };

  // Initialize week dates on component mount
  useEffect(() => {
    const weekDates = getWeekDates(new Date());
    setSelectedWeek(weekDates);
    setDaysInWeek(generateWeekDays(weekDates.start));
  }, []);

  // Calendar animation interpolation
  const calendarHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 350],
  });

  /**
   * Formats day string for display (e.g., "Monday, 01/01/2024")
   */
  const formatDayString = (day: Date): string => {
    const weekday = day.toLocaleDateString('en-US', {weekday: 'long'});
    const formattedDate = formatToDD_MM_YYYY(day);
    return `${weekday}, ${formattedDate}`;
  };

  /**
   * Converts 24-hour time format to 12-hour format with AM/PM
   */
  const formatTimeRange = (startsAt: string, endsAt: string): string => {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes}${ampm}`;
    };

    return `${formatTime(startsAt)} - ${formatTime(endsAt)}`;
  };

  /**
   * Subject card component displaying subject details
   * Navigates to subject notes on press
   */
  const SubjectCard = ({subject}: {subject: SubjectType}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('SubjectNotes', {subject});
      }}>
      <View
        className="mt-2 p-3 rounded-lg"
        style={{backgroundColor: subject.colour + '40'}}>
        <View className="flex-row justify-between items-center">
          <Text
            className="text-white text-base font-medium"
            style={
              Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interMedium
            }>
            {formatTimeRange(subject.startsAt, subject.endsAt)} - {subject.name}
          </Text>
          {subject.repeats && <Text className="text-white text-sm">↻</Text>}
        </View>
        <Text
          className="text-white text-sm mt-1"
          style={
            Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular
          }>
          {subject.teacher}
        </Text>
        {subject.description && (
          <Text
            className="text-white text-sm mt-1"
            style={
              Context.isDyslexiaMode
                ? fonts.dyslexicRegular
                : fonts.interRegular
            }>
            {subject.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="bg-[#101010] h-full w-full">
      {/* Week selector header */}
      <TouchableOpacity
        onPress={toggleCalendar}
        className="px-4 py-3 border-b border-gray-800 flex-row justify-between items-center">
        <Text
          className="text-white text-lg"
          style={
            Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular
          }>
          {`${formatToDD_MM_YYYY(selectedWeek.start)} - ${formatToDD_MM_YYYY(selectedWeek.end)}`}
        </Text>
        <Text className="text-white text-lg">
          {isCalendarExpanded ? '▼' : '▲'}
        </Text>
      </TouchableOpacity>

      {/* Animated calendar view */}
      <Animated.View style={{height: calendarHeight, overflow: 'hidden'}}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={getMarkedDates()}
          markingType={'period'}
          style={
            Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular
          }
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

      {/* Weekly schedule view */}
      <ScrollView className="mt-4">
        {daysInWeek.map((day: Date, index: number) => {
          const daySubjects = getSubjectsForDay(day);
          return (
            <View key={index} className="px-4 py-3 border-b border-green-300">
              <Text
                style={
                  Context.isDyslexiaMode
                    ? fonts.dyslexicRegular
                    : fonts.interRegular
                }
                className="text-white text-lg">
                {formatDayString(day)}
              </Text>

              {daySubjects.length > 0 ? (
                daySubjects.map((subject, idx) => (
                  <SubjectCard key={idx} subject={subject} />
                ))
              ) : (
                <Text
                  className="text-gray-400 mt-2 italic"
                  style={
                    Context.isDyslexiaMode
                      ? fonts.dyslexicRegular
                      : fonts.interRegular
                  }>
                  No subjects scheduled
                </Text>
              )}
            </View>
          );
        })}

        {/* Add new subject button */}
        <View className="h-4" />
        <View className="w-full h-32 justify-center items-center">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Subject');
            }}>
            <Text
              className="text-black text-lg rounded-lg bg-green-300 p-4"
              style={
                Context.isDyslexiaMode
                  ? fonts.dyslexicRegular
                  : fonts.interRegular
              }>
              Add new subject
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-16" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TimeTablePage;