import React, { useGlobal, setGlobal } from 'reactn';
import { Button } from 'react-native-elements';
import { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Platform} from 'react-native';
import { Icon } from 'react-native-elements'
import SearchableDropdown from 'react-native-searchable-dropdown';
import { Camera } from 'expo-camera';
import { NavigationEvents } from 'react-navigation';
import * as ImageManipulator from 'expo-image-manipulator';

function sendImageForProcessing(apiToken, selectedMember, picData, setPictureStatus, clubGuid) {

  ImageManipulator.manipulateAsync(picData.uri,
    [{ resize: {width: 240} }],
    { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  )
  .then((smallImage) => {
    console.log("ImageSize", smallImage.base64.length)

    return fetch('https://nx3dyozzzd.execute-api.eu-west-1.amazonaws.com/beta/AWS/registration', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiToken
      },
      body: JSON.stringify({
        photoId: selectedMember,
        photo64: smallImage.base64,
        clubGUID: clubGuid
      })
    })
  })
  .then((response) => {
    switch(response.status) {
      case 200: 
      setPictureStatus('processed');
      return response.json()
          break;
      default:
        throw new Error("Error received: "+response.status);
        break;
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    setPictureStatus('failed');
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
              color='red'
              size={60}
            />
        break;
    case 'processing' :
    default: 
      return <ActivityIndicator size="large" color="#014576"/>
  }

}

export default function RegisterScreen() {

  const [clubGUID, setClubGUID] = useGlobal('clubGUID');
  const [scmToken, setSCMToken] = useGlobal('scmToken');
  const [membersArr, setMembersArr] = useGlobal('members');
  const [apiToken, setApiToken] = useGlobal('apiToken');
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [regButtonDisabled, setRegButtonDisabled] = useState(true);
  const [buttonText, setButtonText] = useState('Register');
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [pictureStatus, setPictureStatus] = useState('');
  const [screenLoaded, setScreenLoaded] = useState(true);

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
            <Camera style={styles.camera} ratio="1:1" type={type} ref={ref => {theCamera = ref;}}
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
                  type === Camera.Constants.Type.front
                    ? Camera.Constants.Type.back
                    : Camera.Constants.Type.front
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
        <Text style={styles.labels}>
          Select Member..
        </Text>
        <SearchableDropdown
          onTextChange={text => {}}
          onItemSelect={item => {
              setSelectedMember(item);
              setRegButtonDisabled(false);
              setPictureStatus('');
            }
          }
          onPress={ () => { }}
          containerStyle={styles.searchableStyle}
          textInputStyle={styles.searchableText}
          itemStyle={styles.searchableDropdownStyle}
          itemTextStyle={styles.searchableItemsStyle}
          itemsContainerStyle={styles.searchableContainerStyle}
          items={members}
          //defaultIndex={2}
          placeholder="start typing member name"
          resetValue={false}
          underlineColorAndroid="transparent"
        />
        <Button
          title={'Register'}
          buttonStyle={styles.buttonStyle}
          disabled={regButtonDisabled}
          onPress={() => {
            setPictureStatus('processing');
            setRegButtonDisabled(true);
            theCamera.takePictureAsync()
            .then((picture) => {
              sendImageForProcessing(
                apiToken, 
                selectedMember.id, 
                picture, 
                setPictureStatus, 
                clubGUID)
            })
          }}
        />
        <View style={styles.statusContainer}>{ showAppropriateStatusIcon(pictureStatus) }</View>
      </View>
    </View>
  );
}


RegisterScreen.navigationOptions = {
  headerShown: false,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 0.25,
    borderColor: '#014576',
  },
  labels: {
    marginTop: 20,
    marginLeft:10,
    color: '#014576'
  },
  searchableStyle: {
    padding: 10
  },
  searchableText: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#014576',
    backgroundColor: '#FAF7F6',
    color: '#014576'
  },
  searchableDropdownStyle: {
    padding: 10,
    marginTop: 2,
    backgroundColor: '#FAF9F8',
    borderColor: '#014576',
    borderWidth: 1,
  },
  searchableItemsStyle: {
    //text style of a single dropdown item
    color: '#014576',
  },
  searchableContainerStyle: {
    //items container style you can pass maxHeight
    //to restrict the items dropdown hieght
    maxHeight: '80%',
  },
  buttonStyle: {
    backgroundColor: '#014576',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    height: 100
  },
  camera: { 
    flex: 1, 
    margin: 10,
  },
  statusContainer: {
    marginVertical: 40
  }
});
