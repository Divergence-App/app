// init to app

import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppRouter from './components/appRouter';

import './css/globals.css';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AppContextProvider} from './components/appContext';

function App() {
  return (
    <SafeAreaProvider>
      <AppContextProvider>
        <GestureHandlerRootView>
          <AppRouter />
        </GestureHandlerRootView>
      </AppContextProvider>
    </SafeAreaProvider>
  );
}

export default App;
