import {
    Text,
    TouchableOpacity,
    View,
    TextInput,
    ScrollView,
  } from 'react-native';
  import {SafeAreaView} from 'react-native-safe-area-context';
  import {Picker} from '@react-native-picker/picker';
  import {useContext, useState} from 'react';
  import {AppContext} from '../../components/appContext';
  import fonts from '../../lib/fonts';
  
  // Azure OpenAI API configuration
  const AZURE_ENDPOINT = 'https://educationhackathon.openai.azure.com/';
  const AZURE_MODEL_DEPLOYMENT = 'gpt-4o'; // Model deployment name for GPT-4
  const AZURE_API_VERSION = '2024-08-01-preview';
  
  // Define available learning style options
  const LEARNING_STYLES = {
    SUMMARIZED: 'summarized',    // For bullet-point summaries
    SIMPLIFIED: 'simplified',    // For easier comprehension
    IN_DEPTH: 'in-depth',       // For detailed analysis
  };
  
  // Interface for mapping learning styles to their respective prompts
  interface Prompts {
    [key: string]: string;
  }
  
  /**
   * Returns the appropriate prompt template based on the selected learning style
   * @param style - The selected learning style
   * @returns The corresponding prompt template
   */
  const getPromptForStyle = (style: string): string => {
    const prompts: Prompts = {
      [LEARNING_STYLES.SUMMARIZED]: 'Summarize these notes into key bullet points:',
      [LEARNING_STYLES.SIMPLIFIED]: 'Simplify these notes for easier understanding:',
      [LEARNING_STYLES.IN_DEPTH]: 'Provide an in-depth analysis and explanation of these notes:',
    };
    return prompts[style];
  };
  
  // Interface for Azure OpenAI API response structure
  interface AzureOpenAIResponse {
    choices: {message: {content: string}}[];
  }
  
  /**
   * RevisionFlipper Component
   * A React Native component that helps students process and transform their study notes
   * using Azure OpenAI API. It supports different learning styles and formatting options.
   */
  const RevisionFlipper = () => {
    // Access global app context for theme and accessibility settings
    const Context = useContext(AppContext);
    
    // State management for component
    const [notes, setNotes] = useState('');                                    // User's input notes
    const [learningStyle, setLearningStyle] = useState(                        // Selected learning style
      LEARNING_STYLES.SUMMARIZED,
    );
    const [processedNotes, setProcessedNotes] = useState('');                  // AI-processed notes
    const [isLoading, setIsLoading] = useState(false);                        // Loading state
    const [error, setError] = useState('');                                   // Error message state
  
    /**
     * Makes a call to Azure OpenAI API to process the notes
     * @param prompt - The complete prompt including user's notes
     * @returns Processed text from the API
     */
    const callAzureOpenAI = async (prompt: string): Promise<string> => {
      try {
        const response = await fetch(
          `${AZURE_ENDPOINT}/openai/deployments/${AZURE_MODEL_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': 'F4t6ZhKWbThgotYQuaNURBVcJsDcqL4xkebqwPiVrVHw3s8d7dTjJQQJ99AKACfhMk5XJ3w3AAABACOGoNkI',
            },
            body: JSON.stringify({
              messages: [
                {
                  role: 'user',
                  content: prompt,
                },
              ],
              temperature: 0.7,           // Controls randomness in the output
              top_p: 1,                   // Controls diversity of the output
              frequency_penalty: 0,        // Reduces repetition of similar words
              presence_penalty: 0,         // Reduces repetition of similar topics
            }),
          },
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to process notes');
        }
  
        const data: AzureOpenAIResponse = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.error('Azure OpenAI API Error:', error);
        throw error;
      }
    };
  
    /**
     * Handles the note processing workflow when user clicks the process button
     */
    const processNotes = async () => {
      // Validate input
      if (!notes.trim()) {
        setError('Please enter some notes first');
        return;
      }
  
      setIsLoading(true);
      setError('');
  
      try {
        // Combine the style-specific prompt with user's notes
        const prompt = `${getPromptForStyle(learningStyle)}\n\n${notes}`;
        const processedText = await callAzureOpenAI(prompt);
        setProcessedNotes(processedText.trim());
      } catch (error) {
        setError(
          (error as any).message || 'Error processing notes. Please try again.',
        );
        setProcessedNotes('');
      } finally {
        setIsLoading(false);
      }
    };
  
    // Render the UI
    return (
      <SafeAreaView className="bg-[#101010]">
        <View className="w-screen h-screen">
          <ScrollView>
            <View className="w-full items-center justify-center p-4">
              {/* Title */}
              <Text
                style={
                  Context.isDyslexiaMode
                    ? fonts.dyslexicRegular    // Use dyslexia-friendly font if enabled
                    : fonts.interRegular       // Use default font otherwise
                }
                className="text-white text-center text-3xl mb-8">
                Revision Flipper
              </Text>
  
              {/* Notes Input Area */}
              <TextInput
                style={Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular}
                className="w-full bg-[#1C1C1E] text-white p-4 rounded-lg mb-4 h-40"
                multiline
                placeholder="Enter your notes here..."
                placeholderTextColor="#666"
                value={notes}
                onChangeText={setNotes}
              />
  
              {/* Learning Style Picker */}
              <View className="w-full mb-4">
                <Text
                  style={Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular}
                  className="text-white mb-2">
                  Learning Style:
                </Text>
                <View className="bg-[#1C1C1E] rounded-lg">
                  <Picker
                    selectedValue={learningStyle}
                    onValueChange={setLearningStyle}
                    dropdownIconColor="white"
                    style={{color: 'white'}}>
                    <Picker.Item
                      label="Summarized Bullets"
                      value={LEARNING_STYLES.SUMMARIZED}
                    />
                    <Picker.Item
                      label="Simplified"
                      value={LEARNING_STYLES.SIMPLIFIED}
                    />
                    <Picker.Item
                      label="In-Depth Analysis"
                      value={LEARNING_STYLES.IN_DEPTH}
                    />
                  </Picker>
                </View>
              </View>
  
              {/* Process Button */}
              <TouchableOpacity
                className="w-full bg-blue-500 p-4 rounded-lg mb-4"
                onPress={processNotes}
                disabled={isLoading}>
                <Text
                  style={Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interBold}
                  className="text-white text-center">
                  {isLoading ? 'Processing...' : 'Process Notes'}
                </Text>
              </TouchableOpacity>
  
              {/* Error Message Display */}
              {error ? (
                <Text
                  style={Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular}
                  className="text-red-500 text-center mb-4">
                  {error}
                </Text>
              ) : null}
  
              {/* Processed Notes Display */}
              {processedNotes ? (
                <>
                  <View className="w-full bg-[#1C1C1E] p-4 rounded-lg">
                    <Text
                      style={Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular}
                      className="text-white">
                      {processedNotes}
                    </Text>
                  </View>
                  <View className="h-64" />  {/* Bottom spacing */}
                </>
              ) : null}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  };
  
  export default RevisionFlipper;