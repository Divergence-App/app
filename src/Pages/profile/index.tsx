import {Image, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import fonts from '../../lib/fonts';
import {ScrollView} from 'react-native-gesture-handler';
import CustomHeader from '../../components/customHeader';
import {useContext} from 'react';
import {AppContext} from '../../components/appContext';
import {setDyslexiaMode} from '../../lib/storage';

const UserPage = () => {
  const Context = useContext(AppContext);
  return (
    <SafeAreaView className="bg-[#101010]">
      <View className="w-screen h-screen">
        <ScrollView>
          <View className="w-full items-center justify-center">
            <Image
              src="divergence_logo.png"
              className="w-32 h-32 rounded-full bg-white"
            />

            <View className="pt-2">
              <Text style={
                  Context.isDyslexiaMode
                    ? fonts.dyslexicRegular
                    : fonts.interRegular
                } className="text-white text-2xl">Robbie Morgan</Text>
            </View>

            <View className="pb-2">
              <Text style={
                  Context.isDyslexiaMode
                    ? fonts.dyslexicRegular
                    : fonts.interRegular
                } className="text-white text-xl">Joined 09/11/2024</Text>
            </View>

            <TouchableOpacity onPress={() => {
              setDyslexiaMode(!Context.isDyslexiaMode);
              Context.setIsDyslexiaMode(!Context.isDyslexiaMode);
            }} className="w-1/2 items-center">
              <Text
                className={`text-white text-lg `}
                style={
                  Context.isDyslexiaMode
                    ? fonts.dyslexicRegular
                    : fonts.interRegular
                }>
                Dyslexia mode: {Context.isDyslexiaMode ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default UserPage;
