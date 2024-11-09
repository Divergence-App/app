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
import { SubjectNotesProps } from '../../types/components';


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

  const [subject, setSubject] = useState(route.params.subject);

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

            <TouchableOpacity onLongPress={() => {
                Alert.alert("A message has been sent to your teachers, they'll respond shortly.")
            }} className='bg-red-500 p-4 w-full h-20 rounded-xl items-center justify-center'>
                <Text style={(Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interBold)} className='text-white text-4xl'>
                    PANIC!
                </Text>
            </TouchableOpacity>

            <View className='h-20 w-full justify-center items-center'>
                <Text className='text-white text-3xl' style={(Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular)}>
                    Notes:
                </Text>

                
            </View>

            {subject.notes && (
              (subject.notes as SubjectNotesProps[]).map((note, index) => {
                return (
                  <View key={index} className='w-full p-4 border-b border-green-300'>
                    <View className='flex-row justify-between items-start'>
                      <View className='flex-1'>
                        <Text className='text-white text-lg' style={(Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular)}>
                          {note.date}
                        </Text>
                        <Text className='text-gray-400' style={(Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular)}>
                          {note.content}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => {
                          Alert.alert(
                            "Delete Note",
                            "Are you sure you want to delete this note?",
                            [
                              {
                                text: "Cancel",
                                style: "cancel"
                              },
                              {
                                text: "Delete",
                                style: 'destructive',
                                onPress: () => {
                                  // Remove the note from the subject
                                  const updatedNotes = subject.notes?.filter((_: string, i: number) => i !== index);
                                  setSubject({...subject, notes: updatedNotes});
                                  
                                  // Update the context and storage
                                  Context.setSubjects((prev) => {
                                    const updatedSubjects = prev.map((s) => {
                                      if (s.id === subject.id) {
                                        return {...subject, notes: updatedNotes};
                                      }
                                      return s;
                                    });
                                    setSubjects(updatedSubjects);
                                    return updatedSubjects;
                                  });
                                }
                              }
                            ]
                          );
                        }}
                        className='ml-4 p-2'
                      >
                        <Text className='text-red-500 text-base' style={(Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular)}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              })
            )}

                <TextInput
                    placeholder="Add a note"
                    style={(Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular)}
                    className='w-full p-4 border border-green-300 rounded-lg mt-4 text-white'
                    onSubmitEditing={(e) => {
                        const newNote = {
                            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
                            content: e.nativeEvent.text
                        }
                        if (!subject.notes) {
                            setSubject({...subject, notes: [newNote]});
                        }
                        else {
                            setSubject({...subject, notes: [...subject.notes, newNote]});
                        }
                        setSubjects(Context.subjects);
                        Context.setSubjects((prev) => {
                            const updatedSubjects = prev.map((s) => {
                                if (s.id === subject.id) {
                                    return {...subject};
                                }
                                return s;
                            });
                            return updatedSubjects;
                        });
                        e.nativeEvent.text = '';
                    }}
                />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default SubjectNotes;