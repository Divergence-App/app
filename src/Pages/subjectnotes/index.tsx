import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  TextInput,
  Alert,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import fonts from '../../lib/fonts';
import {ScrollView} from 'react-native-gesture-handler';
import CustomHeader from '../../components/customHeader';
import {useContext, useState, useRef} from 'react';
import {AppContext} from '../../components/appContext';
import {setDyslexiaMode, setSubjects} from '../../lib/storage';
import {Animated} from 'react-native';
import {Platform} from 'react-native';
import GradientBlur from '../../components/GradientBlur';
import {NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../types/router';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SubjectNotesProps} from '../../types/components';

// Azure OpenAI API configuration
const AZURE_ENDPOINT = 'https://educationhackathon.openai.azure.com/';
const AZURE_MODEL_DEPLOYMENT = 'gpt-4o';
const AZURE_API_VERSION = '2024-08-01-preview';

// Constant for header scroll animation
const HEADER_SCROLL_DISTANCE = 1;

// Props type definition using React Navigation's typing system
type Props = NativeStackScreenProps<RootStackParamList, 'SubjectNotes'>;

/**
 * SubjectNotes screen component
 * Displays and manages notes for a specific subject with AI feedback capabilities
 */
const SubjectNotes: React.FC<Props> = ({navigation, route}) => {
  // Context and hooks
  const Context = useContext(AppContext);
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  
  // Layout calculations
  const headerHeight = 10;
  const topSpacing = insets.top + headerHeight;
  const blurHeight = 100;
  
  // Animation and state
  const scrollY = new Animated.Value(0);
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState(route.params.subject);

  // Animation interpolation for blur effect
  const blurOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Scroll handler for animation
  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {useNativeDriver: false},
  );

  /**
   * Fetches AI feedback for the subject notes using Azure OpenAI API
   * Includes error handling and loading states
   */
  const getAIFeedback = async () => {
    if (!subject.notes || subject.notes.length === 0) {
      Alert.alert(
        'No Notes',
        'Please add some notes first to get AI feedback.',
      );
      return;
    }

    setIsLoading(true);

    try {
      // Format notes for AI processing
      const allNotes = subject.notes
        .map(
          (note: SubjectNotesProps) =>
            `Date: ${note.date}\nContent: ${note.content}`,
        )
        .join('\n\n');

      // Make API request to Azure OpenAI
      const response = await fetch(
        `${AZURE_ENDPOINT}/openai/deployments/${AZURE_MODEL_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key':
              'F4t6ZhKWbThgotYQuaNURBVcJsDcqL4xkebqwPiVrVHw3s8d7dTjJQQJ99AKACfhMk5XJ3w3AAABACOGoNkI',
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content:
                  'You are a helpful educational assistant specializing in neurodivergent-friendly learning strategies. Analyze the provided notes and suggest concrete, structured approaches for studying and understanding the material. Include specific schedule suggestions, break down complex topics, and provide memory aids where appropriate.',
              },
              {
                role: 'user',
                content: `Here are my notes for ${subject.name}:\n\n${allNotes}\n\nPlease provide neurodivergent-friendly feedback on how to approach studying this material, including suggested schedules and learning strategies.`,
              },
            ],
            temperature: 0.7,
            top_p: 1,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to get AI feedback');
      }

      const data = await response.json();
      Alert.alert(
        'AI Study Feedback',
        data.choices[0].message.content,
        [{text: 'OK'}],
        {cancelable: false},
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to get AI feedback. Please try again later.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="bg-[#101010] flex-1">
      {/* Fixed header with blur effect */}
      <View
        style={{position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1}}
        className="bg-[#101010]">
        <CustomHeader title={route.params.subject.name} showBackButton />
        {/* Conditional blur effect for iOS */}
        {insets.top > 0 && Platform.OS !== 'android' && (
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: blurHeight,
              zIndex: 1,
              opacity: blurOpacity,
            }}>
            <GradientBlur
              useAtTop
              locations={[1, 0.4, 0]}
              colors={['transparent', 'rgba(0,0,0,0.8)', '#0B0B0B']}
              width={width}
              height={insets.top + insets.top}
            />
          </Animated.View>
        )}
      </View>

      {/* Main scrollable content */}
      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingTop: topSpacing}}
        style={{flex: 1}}
        contentInsetAdjustmentBehavior="scrollableAxes">
        <View className="w-full items-center justify-center px-4">
          {/* Panic button for emergency teacher contact */}
          <TouchableOpacity
            onLongPress={() => {
              Alert.alert(
                "A message has been sent to your teachers, they'll respond shortly.",
              );
            }}
            className="bg-red-500 p-4 w-full h-20 rounded-xl items-center justify-center">
            <Text
              style={
                Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interBold
              }
              className="text-white text-4xl">
              PANIC!
            </Text>
          </TouchableOpacity>

          {/* Notes section header */}
          <View className="h-20 w-full justify-center items-center">
            <Text
              className="text-white text-3xl"
              style={
                Context.isDyslexiaMode
                  ? fonts.dyslexicRegular
                  : fonts.interRegular
              }>
              Notes:
            </Text>
          </View>

          {/* Notes list with delete functionality */}
          {subject.notes &&
            (subject.notes as SubjectNotesProps[]).map((note, index) => {
              return (
                <View
                  key={index}
                  className="w-full p-4 border-b border-green-300">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text
                        className="text-white text-lg"
                        style={
                          Context.isDyslexiaMode
                            ? fonts.dyslexicRegular
                            : fonts.interRegular
                        }>
                        {note.date}
                      </Text>
                      <Text
                        className="text-gray-400"
                        style={
                          Context.isDyslexiaMode
                            ? fonts.dyslexicRegular
                            : fonts.interRegular
                        }>
                        {note.content}
                      </Text>
                    </View>
                    {/* Delete note button */}
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          'Delete Note',
                          'Are you sure you want to delete this note?',
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                            {
                              text: 'Delete',
                              style: 'destructive',
                              onPress: () => {
                                const updatedNotes = subject.notes?.filter(
                                  (_: string, i: number) => i !== index,
                                );
                                setSubject({...subject, notes: updatedNotes});
                                Context.setSubjects(prev => {
                                  const updatedSubjects = prev.map(s => {
                                    if (s.id === subject.id) {
                                      return {...subject, notes: updatedNotes};
                                    }
                                    return s;
                                  });
                                  setSubjects(updatedSubjects);
                                  return updatedSubjects;
                                });
                              },
                            },
                          ],
                        );
                      }}
                      className="ml-4 p-2">
                      <Text
                        className="text-red-500 text-base"
                        style={
                          Context.isDyslexiaMode
                            ? fonts.dyslexicRegular
                            : fonts.interRegular
                        }>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

          {/* Add note input */}
          <TextInput
            placeholder="Add a note"
            style={
              Context.isDyslexiaMode
                ? fonts.dyslexicRegular
                : fonts.interRegular
            }
            className="w-full p-4 border border-green-300 rounded-lg mt-4 text-white"
            onSubmitEditing={e => {
              const newNote = {
                date:
                  new Date().toLocaleDateString() +
                  ' ' +
                  new Date().toLocaleTimeString(),
                content: e.nativeEvent.text,
              };

              const updatedSubject = {
                ...subject,
                notes: subject.notes ? [...subject.notes, newNote] : [newNote],
              };

              setSubject(updatedSubject);

              Context.setSubjects(prev => {
                const updatedSubjects = prev.map(s => {
                  if (s.id === subject.id) {
                    return updatedSubject;
                  }
                  return s;
                });
                setSubjects(updatedSubjects);
                return updatedSubjects;
              });

              if (e.target) {
                (e.target as any).clear();
              }
            }}
          />

          {/* AI Feedback button */}
          <TouchableOpacity
            onPress={getAIFeedback}
            disabled={isLoading}
            className="bg-green-500 p-4 w-full h-20 rounded-xl items-center justify-center mt-4">
            <Text
              style={
                Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interBold
              }
              className="text-white text-4xl">
              {isLoading ? 'ANALYZING...' : 'AI FEEDBACK'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default SubjectNotes;