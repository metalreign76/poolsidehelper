import React, { useGlobal } from 'reactn';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function ConnectedStatusView(props) {

  const [clubName, setClubName] = useGlobal('clubName');
  const [clubGUID, setClubGUID] = useGlobal('clubGUID');
  const [scmToken, setSCMToken] = useGlobal('scmToken');
  const [scmConnected, setSCMConnected] = useGlobal('scmConnected');
  const [awsConnected, setAWSConnected] = useGlobal('awsConnected');

  return (
    <View>
        <Text style={styles.displayText}>{props.header}</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  displayText: {
      marginTop: 50,
      textAlign: "center",
      color: '#014576',
      fontSize: 30
  }
});
