import {Text, TouchableOpacity, View, TextInput, ScrollView, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Picker} from '@react-native-picker/picker';
import Tts from 'react-native-tts';
import { useContext, useState } from 'react';
import { AppContext } from '../../components/appContext';
import fonts from '../../lib/fonts';

// Azure OpenAI Configuration constants
const AZURE_ENDPOINT = "https://educationhackathon.openai.azure.com/";
const AZURE_MODEL_DEPLOYMENT = "gpt-4o";
const AZURE_API_VERSION = "2024-08-01-preview";

const LEARNING_STYLES = {
  AUDITORY: 'auditory',
  SUMMARIZED: 'summarized',
  SIMPLIFIED: 'simplified',
  IN_DEPTH: 'in-depth',
};

const TTS_VOICES = {
  DEFAULT: 'Default',
  MALE: 'Male',
  FEMALE: 'Female',
};

const RevisionFlipper = () => {
  const Context = useContext(AppContext);
  const [notes, setNotes] = useState('');
  const [learningStyle, setLearningStyle] = useState(LEARNING_STYLES.SUMMARIZED);
  const [selectedVoice, setSelectedVoice] = useState(TTS_VOICES.DEFAULT);
  const [processedNotes, setProcessedNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');

interface Prompts {
    [key: string]: string;
}

const getPromptForStyle = (style: string): string => {
    const prompts: Prompts = {
        [LEARNING_STYLES.AUDITORY]: 'Convert these notes into a conversational, easy-to-listen-to format:',
        [LEARNING_STYLES.SUMMARIZED]: 'Summarize these notes into key bullet points:',
        [LEARNING_STYLES.SIMPLIFIED]: 'Simplify these notes for easier understanding:',
        [LEARNING_STYLES.IN_DEPTH]: 'Provide an in-depth analysis and explanation of these notes:',
    };
    return prompts[style];
};

interface AzureOpenAIResponse {
    choices: { text: string }[];
}

const callAzureOpenAI = async (prompt: string): Promise<string> => {
    try {
        const response = await fetch(
            `${AZURE_ENDPOINT}/openai/deployments/${AZURE_MODEL_DEPLOYMENT}/completions?api-version=${AZURE_API_VERSION}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': 'F4t6ZhKWbThgotYQuaNURBVcJsDcqL4xkebqwPiVrVHw3s8d7dTjJQQJ99AKACfhMk5XJ3w3AAABACOGoNkI',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    max_tokens: 1000,
                    temperature: 0.7,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                    stop: null
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to process notes');
        }

        const data: AzureOpenAIResponse = await response.json();
        return data.choices[0].text;
    } catch (error) {
        console.error('Azure OpenAI API Error:', error);
        throw error;
    }
};

  const processNotes = async () => {
    if (!notes.trim()) {
      setError('Please enter some notes first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const prompt = `${getPromptForStyle(learningStyle)}\n\n${notes}`;
      const processedText = await callAzureOpenAI(prompt);
      setProcessedNotes(processedText.trim());
    } catch (error) {
      setError((error as any).message || 'Error processing notes. Please try again.');
      setProcessedNotes('');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeech = async () => {
    if (isPlaying) {
      Tts.stop();
      setIsPlaying(false);
    } else if (processedNotes) {
      setIsPlaying(true);
      try {
        await Tts.speak(processedNotes);
        setIsPlaying(false);
      } catch (error) {
        console.error('TTS Error:', error);
        setIsPlaying(false);
        setError('Error playing audio. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView className='bg-[#101010]'>
      <View className="w-screen h-screen">
        <ScrollView>
          <View className="w-full items-center justify-center p-4">
            <Text
              style={Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular}
              className="text-white text-center text-3xl mb-8"
            >
              Revision Flipper
            </Text>
            
            <TextInput
              style={Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular}
              className="w-full bg-[#1C1C1E] text-white p-4 rounded-lg mb-4"
              multiline
              placeholder="Enter your notes here..."
              placeholderTextColor="#666"
              value={notes}
              onChangeText={setNotes}
            />

            <View className="w-full mb-4">
              <Text
                style={Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular}
                className="text-white mb-2"
              >
                Learning Style:
              </Text>
              <View className="bg-[#1C1C1E] rounded-lg">
                <Picker
                  selectedValue={learningStyle}
                  onValueChange={setLearningStyle}
                  dropdownIconColor="white"
                  style={{color: 'white'}}
                >
                  <Picker.Item label="Summarized Bullets" value={LEARNING_STYLES.SUMMARIZED} />
                  <Picker.Item label="Simplified" value={LEARNING_STYLES.SIMPLIFIED} />
                  <Picker.Item label="In-Depth Analysis" value={LEARNING_STYLES.IN_DEPTH} />
                  <Picker.Item label="Auditory" value={LEARNING_STYLES.AUDITORY} />
                </Picker>
              </View>
            </View>

            {learningStyle === LEARNING_STYLES.AUDITORY && (
              <View className="w-full mb-4">
                <Text
                  style={Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular}
                  className="text-white mb-2"
                >
                  Voice:
                </Text>
                <View className="bg-[#1C1C1E] rounded-lg">
                  <Picker
                    selectedValue={selectedVoice}
                    onValueChange={setSelectedVoice}
                    dropdownIconColor="white"
                    style={{color: 'white'}}
                  >
                    {Object.entries(TTS_VOICES).map(([key, value]) => (
                      <Picker.Item key={key} label={key} value={value} />
                    ))}
                  </Picker>
                </View>
              </View>
            )}

            <TouchableOpacity 
              className="w-full bg-blue-500 p-4 rounded-lg mb-4"
              onPress={processNotes}
              disabled={isLoading}
            >
              <Text
                style={Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interBold}
                className="text-white text-center"
              >
                {isLoading ? 'Processing...' : 'Process Notes'}
              </Text>
            </TouchableOpacity>

            {error ? (
              <Text
                style={Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular}
                className="text-red-500 text-center mb-4"
              >
                {error}
              </Text>
            ) : null}

            {processedNotes ? (
              <View className="w-full bg-[#1C1C1E] p-4 rounded-lg">
                <Text
                  style={Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular}
                  className="text-white"
                >
                  {processedNotes}
                </Text>
                
                {learningStyle === LEARNING_STYLES.AUDITORY && (
                  <TouchableOpacity 
                    className="w-full bg-green-500 p-4 rounded-lg mt-4"
                    onPress={toggleSpeech}
                  >
                    <Text
                      style={Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interBold}
                      className="text-white text-center"
                    >
                      {isPlaying ? 'Stop' : 'Play'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default RevisionFlipper;