import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { setGlobal, useGlobal } from 'reactn';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppNavigator from './navigation/AppNavigator';
import { AsyncStorage } from 'react-native';


  // Set an initial global state directly:
  setGlobal({
    clubName: '',
    clubGUID: '',
    scmToken: '',
    isLoadingComplete: false,
    members: [],
    apiToken: ''
  });


export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useGlobal('isLoadingComplete');
  const [clubName, setClubName] = useGlobal('clubName');
  const [clubGUID, setClubGUID] = useGlobal('clubGUID');
  const [scmToken, setSCMToken] = useGlobal('scmToken');
  const [apiToken, setApiToken] = useGlobal('apiToken');
  const [securityPin, setSecurityPin] = useGlobal('securityPin');

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={() => loadResourcesAsync(setClubGUID, setSCMToken, setApiToken, setSecurityPin)}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

async function loadResourcesAsync(setClubGUID, setSCMToken, setApiToken, setSecurityPin) {
  let resultsArray = await Promise.all([
    Asset.loadAsync([
      require('./assets/images/poolsidehelper.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
      AsyncStorage.multiGet(['CLUBGUID', 'SCMTOKEN', 'APITOKEN', 'SECURITYPIN'])
  ]);
  setClubGUID(resultsArray[2][0][1]);
  setSCMToken(resultsArray[2][1][1])
  setApiToken(resultsArray[2][2][1])
  setSecurityPin(resultsArray[2][3][1]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
