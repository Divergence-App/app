import {Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import fonts from '../../lib/fonts';
import {ScrollView} from 'react-native-gesture-handler';
import {useContext} from 'react';
import {AppContext} from '../../components/appContext';
import {SubjectType} from '../../types/components';
import {RootStackParamList} from '../../types/router';
import {NavigationProp} from '@react-navigation/native';

const HomePage = ({
  navigation,
}: {
  navigation: NavigationProp<RootStackParamList>;
}) => {
  const Context = useContext(AppContext);

  const getNextLesson = (): SubjectType | null => {
    if (Context.subjects.length === 0) return null;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today =
      now.getDate().toString().padStart(2, '0') +
      '/' +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      '/' +
      now.getFullYear();

    // Filter today's subjects that haven't started yet
    const todaySubjects = Context.subjects.filter(subject => {
      if (subject.date === today && subject.startsAt > currentTime) {
        return true;
      }
      // Handle repeating subjects
      if (subject.repeats) {
        const subjectDate = new Date(
          subject.date.split('/').reverse().join('-'),
        );
        return (
          subjectDate.getDay() === now.getDay() &&
          subject.startsAt > currentTime
        );
      }
      return false;
    });

    // If no subjects today, look for next occurrence
    if (todaySubjects.length === 0) {
      const futureSubjects = Context.subjects.filter(subject => {
        const subjectDate = new Date(
          subject.date.split('/').reverse().join('-'),
        );
        return subjectDate > now || subject.repeats;
      });

      if (futureSubjects.length === 0) return null;

      // Sort by date and time
      return futureSubjects.sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        return a.startsAt.localeCompare(b.startsAt);
      })[0];
    }

    // Return the next subject today
    return todaySubjects.sort((a, b) =>
      a.startsAt.localeCompare(b.startsAt),
    )[0];
  };

  const formatTimeForDisplay = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const nextLesson = getNextLesson();

  return (
    <SafeAreaView className="bg-[#101010]">
      <View className="w-screen h-screen">
        <ScrollView>
          <View className="w-full items-center justify-center p-4">
            <Text
              style={
                Context.isDyslexiaMode
                  ? fonts.dyslexicRegular
                  : fonts.interRegular
              }
              className="text-white text-center text-3xl mb-8">
              Welcome, Robbie Morgan! 👋
            </Text>

            <View className="w-full mt-4">
              <Text
                style={
                  Context.isDyslexiaMode
                    ? fonts.dyslexicRegular
                    : fonts.interRegular
                }
                className="text-white text-xl mb-4">
                Next Lesson
              </Text>

              {nextLesson ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('SubjectNotes', {subject: nextLesson});
                  }}>
                  <View
                    className="w-full p-4 rounded-lg"
                    style={{backgroundColor: nextLesson.colour + '40'}}>
                    <Text
                      style={
                        Context.isDyslexiaMode
                          ? fonts.dyslexicRegular
                          : fonts.interBold
                      }
                      className="text-white text-xl mb-1">
                      {nextLesson.name}
                    </Text>

                    <Text
                      style={
                        Context.isDyslexiaMode
                          ? fonts.dyslexicRegular
                          : fonts.interRegular
                      }
                      className="text-white mb-1">
                      {`${formatTimeForDisplay(nextLesson.startsAt)} - ${formatTimeForDisplay(nextLesson.endsAt)}`}
                    </Text>

                    <Text
                      style={
                        Context.isDyslexiaMode
                          ? fonts.dyslexicRegular
                          : fonts.interRegular
                      }
                      className="text-white opacity-80">
                      {nextLesson.teacher}
                    </Text>

                    {nextLesson.repeats && (
                      <Text
                        style={
                          Context.isDyslexiaMode
                            ? fonts.dyslexicRegular
                            : fonts.interRegular
                        }
                        className="text-white opacity-60 text-sm mt-2">
                        Repeats weekly ↻
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ) : (
                <View className="w-full p-4 rounded-lg bg-[#1C1C1E]">
                  <Text
                    style={
                      Context.isDyslexiaMode
                        ? fonts.dyslexicRegular
                        : fonts.interRegular
                    }
                    className="text-white text-center opacity-60">
                    No upcoming subjects!
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomePage;
