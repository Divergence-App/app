import {Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import fonts from '../../lib/fonts';
import {ScrollView} from 'react-native-gesture-handler';
import CustomHeader from '../../components/customHeader';
import { useContext } from 'react';
import { AppContext } from '../../components/appContext';
import { setDyslexiaMode } from '../../lib/storage';

const UserPage = () => {
    const Context = useContext(AppContext);
  return (
    <SafeAreaView className='bg-[#101010]'>
      <View className="w-screen h-screen">
        <ScrollView>
          <View className="w-full items-center justify-center">
            <Text
              style={(Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular)}
              className={`text-white text-center text-3xl`}>
              Welcome, Robbie Morgan! 👋
            </Text>

            <TouchableOpacity>
                <Text onPress={() => {
                    Context.setIsDyslexiaMode(!Context.isDyslexiaMode);
                    setDyslexiaMode(!Context.isDyslexiaMode);
                }} className={`text-white text-lg`}
                style={(Context.isDyslexiaMode ? fonts.dyslexicRegular : fonts.interRegular)}>Dyslexia mode: {Context.isDyslexiaMode ? "ON" : "OFF"}</Text>
            </TouchableOpacity>
          </View>
          
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default UserPage;
