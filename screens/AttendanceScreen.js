import React, { useGlobal, setGlobal } from 'reactn';
import { Button } from 'react-native-elements';
import { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Platform} from 'react-native';
import { Icon } from 'react-native-elements'
import SearchableDropdown from 'react-native-searchable-dropdown';
import { Camera } from 'expo-camera';
import { NavigationEvents } from 'react-navigation';
import * as ImageManipulator from 'expo-image-manipulator';

function findSwimmerName(members, memberId) {
  console.log("Looking for", memberId)
  for(var i=0; i< members.length; i++) {
    if(members[i].id == memberId)
      return members[i].name
  }
  return "Could not identify Swimmer by Name"
}

function sendImageForProcessing(
  apiToken, 
  picData, 
  setPictureStatus, 
  setRegButtonDisabled, 
  setStatusMessage,
  clubGuid, members) {

  var responseStatus;

  ImageManipulator.manipulateAsync(picData.uri,
    [{ resize: {width: 200} }],
    { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  )
  .then((smallImage) => {
    console.log("ImageSize", smallImage.base64.length)

    return fetch('https://nx3dyozzzd.execute-api.eu-west-1.amazonaws.com/beta/AWS/match', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiToken
      },
      body: JSON.stringify({
        photo64: smallImage.base64,
        clubGUID: clubGuid
      })
    })
  })
  .then((response) => {
    responseStatus = response.status;
    return response.json();
  })
  .then((responseJSON) => {
    switch(responseStatus) {
      case 200: 
        setRegButtonDisabled(false);
        console.log("Response:", responseJSON)
        if(responseJSON.data.length == 0) {
          setPictureStatus('failed');
          setStatusMessage('Sorry, we couldnt match your picture. Try again? - or let a coach know you arent marked in')
        }
        else {
          setPictureStatus('processed');
          setStatusMessage(findSwimmerName(members, responseJSON.data[0]))
        }
        break;
      default:
        setPictureStatus('failed');
        throw new Error("Error received: "+responseJSON.status);
        break;
    }
  })
  .catch((error) => {
    console.log('Error:', error);
    setPictureStatus('failed');
    setRegButtonDisabled(false);
    setStatusMessage('Sorry, we couldnt match your picture. Try again? - or let a coach know you arent marked in')
  });
}

function showAppropriateStatusIcon(status) {

  switch(status) {
    case '': 
      return <View></View>
          break;
    case 'processed': 
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
              color='#a30d17'
              size={60}
            />
        break;
    case 'processing' :
    default: 
      return <ActivityIndicator size="large" color="#014576"/>
  }

}

export default function AttendanceScreen() {

  const [clubGUID, setClubGUID] = useGlobal('clubGUID');
  const [scmToken, setSCMToken] = useGlobal('scmToken');
  const [membersArr, setMembersArr] = useGlobal('members');
  const [apiToken, setApiToken] = useGlobal('apiToken');
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [regButtonDisabled, setRegButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('Register');
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [pictureStatus, setPictureStatus] = useState('');
  const [screenLoaded, setScreenLoaded] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  var theCamera;
  
  useEffect( () => {
    const membersList = membersArr.map((member) => {
      return {
        id: member.Guid,
        name: member.MemberName
      }
    })
    setMembers(membersList);
  }, [membersArr])

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={styles.container}>
      <NavigationEvents
          onWillFocus={payload => setScreenLoaded(true)}
          onDidBlur={payload => setScreenLoaded(false)}/>
          { screenLoaded && (
            <Camera style={styles.camera} type={type} ref={ref => {theCamera = ref;}}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              captureAudio={false}
            >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row'
            }}>
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}>
              <Icon
                name={Platform.OS === 'ios' ? 'ios-reverse-camera' : 'md-reverse-camera'}                
                type='ionicon'
                color='white'
                size={30}
                containerStyle={{marginLeft: 5, marginBottom: 5}}
              />
            </TouchableOpacity>
          </View>
          </Camera>           
          )}
      </View>
      <View style={styles.container}>
        <Button
          title={'Mark Me Present!'}
          buttonStyle={styles.buttonStyle}
          disabled={regButtonDisabled}
          onPress={() => {
            setStatusMessage('Checking......')
            setPictureStatus('processing');
            setRegButtonDisabled(true);
            theCamera.takePictureAsync()
            .then((picture) => {
              sendImageForProcessing(
                apiToken,
                picture, 
                setPictureStatus,
                setRegButtonDisabled, 
                setStatusMessage,
                clubGUID, members)
            })
          }}
        />
        <View style={styles.statusContainer}>
          { showAppropriateStatusIcon(pictureStatus) }
          <Text style={styles.attendanceOutcome}>{statusMessage}</Text>
        </View>
        <View style={styles.sessionDesc}>        
        </View>
      </View>
    </View>
  );
}


AttendanceScreen.navigationOptions = {
  headerShown: false,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 0.25,
    borderColor: '#014576'
  },
    buttonStyle: {
    backgroundColor: '#a30d17',
    height: 100,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20
  },
  camera: { 
    flex: 1, 
    margin: 10 
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
  },
  attendanceOutcome: {
    flex: 1,
    fontSize: 20,
    color: '#014576',
    marginLeft: 10,
    marginTop: 5,
    flexWrap: 'wrap'
  },
  sessionDesc: {
    borderWidth: 1,
    height: 50,
    width: '75%',
    marginLeft: 70,
    marginTop: 5,
    borderColor: '#014576',
  }
});
