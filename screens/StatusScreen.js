import React, { useGlobal, setGlobal } from 'reactn';
import { useState, useEffect } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements'


import ConnectedStatusView from '../components/connectedStatusView';

function showAppropriateStatusIcon(status) {

  switch(status) {
    case 'connected': 
      return <Icon
              name='check-circle'
              type='font-awesome'
              color='green'
              size={60}
            />
          break;
    case 'failed': 
      return <Icon
              name='times-circle'
              type='font-awesome'
              color='red'
              size={60}
            />
        break;
        case 'pending' :
    default: 
    return <ActivityIndicator size="large" color="#014576"/>
  }

}
export default function StatusScreen() {

  const [clubName, setClubName] = useGlobal('clubName');
  const [clubGUID, setClubGUID] = useGlobal('clubGUID');
  const [scmToken, setSCMToken] = useGlobal('scmToken');
  const [membersArr, setMembersArr] = useGlobal('members');
  const [apiToken, setApiToken] = useGlobal('apiToken');
  const [scmConnected, setSCMConnected] = useState(null);
  const [awsConnected, setAWSConnected] = useState(null);

  useEffect( () => {

    if(scmConnected) return;

    console.log("Calling SCM with ", scmToken)

    setSCMConnected('pending');

    fetch('https://nx3dyozzzd.execute-api.eu-west-1.amazonaws.com/beta/SCM/members', {
      method: 'GET', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        'Authorization-Token': scmToken,
        'x-api-key': apiToken
      }
    })
    .then((response) => {
      return response.json()
    })
    .then((responseJSON) => {
      console.log('Members returned:', responseJSON.data.length);
      setSCMConnected('connected');
      setMembersArr(responseJSON.data);
    })
    .catch((error) => {
      setSCMConnected('failed')
      console.error('Error:', error);
    });

  }, [scmConnected])

  useEffect( () => {
    if(awsConnected) return;

    console.log("Calling SCM with ", scmToken)

    setAWSConnected('pending');

    fetch('https://nx3dyozzzd.execute-api.eu-west-1.amazonaws.com/beta/AWS/collection', {
      method: 'GET', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        'Authorization-Token': scmToken,
        'x-api-key': apiToken
      }
    })
    .then((response) => {
      switch(response.status) {
        case 200: 
          return response.json();
          break;
        default:
          throw new Error("Error received: "+response.status);
          break;
      }
    })
    .then((responseJSON) => {
      console.log('Data returned:', responseJSON.data);
      setAWSConnected('connected');
    })
    .catch((error) => {
      setAWSConnected('failed')
      console.log('Error returned:', error);
    });

  }, [awsConnected])

  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={styles.container}>
        <ConnectedStatusView header="SCM Connection"/>
        <View style={styles.statusContainer}>{ showAppropriateStatusIcon(scmConnected) }</View>
        <Icon
              name='retweet'
              type='font-awesome'
              color='#014576'
              size={50}
              onPress={() => { setSCMConnected(null)}}
            />
      </View>
      <View style={styles.container}>
        <ConnectedStatusView header="Facial Rec. Connection"/>
        <View style={styles.statusContainer}>{ showAppropriateStatusIcon(awsConnected) }</View>
        <Icon
              name='retweet'
              type='font-awesome'
              color='#014576'
              size={50}
              onPress={() => { setAWSConnected(null)}}
            />
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
  statusContainer: {
    marginVertical: 40
  }
});
