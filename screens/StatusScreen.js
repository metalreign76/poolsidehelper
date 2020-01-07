import * as WebBrowser from 'expo-web-browser';
import React, { useGlobal } from 'reactn';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ConnectedStatusView from '../components/connectedStatusView';

export default function StatusScreen() {

  const [clubName, setClubName] = useGlobal('clubName');
  const [clubGUID, setClubGUID] = useGlobal('clubGUID');
  const [scmToken, setSCMToken] = useGlobal('scmToken');
  const [scmConnected, setSCMConnected] = useGlobal('scmConnected');
  const [awsConnected, setAWSConnected] = useGlobal('awsConnected');

  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={styles.container}>
        <ConnectedStatusView header="SCM Connection"/>
      </View>
      <View style={styles.container}>
        <ConnectedStatusView header="Facial Rec. Connection"/>
      </View>
    </View>
  );
}

StatusScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 0.25,
    borderColor: '#014576',
  },
});
