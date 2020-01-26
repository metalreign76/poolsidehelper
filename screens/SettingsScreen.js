import React, { useGlobal } from 'reactn';
import {
  StyleSheet,
  View,
  ScrollView
} from 'react-native';
import { AsyncStorage } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { useEffect } from 'react';

export default function SettingsScreen() {

  const [clubName, setClubName] = useGlobal('clubName');
  const [clubGUID, setClubGUID] = useGlobal('clubGUID');
  const [scmToken, setSCMToken] = useGlobal('scmToken');
  const [apiToken, setApiToken] = useGlobal('apiToken');

  useEffect(() => {
    AsyncStorage.multiSet([
      ['CLUBNAME', clubName], 
      ['CLUBGUID', clubGUID], 
      ['SCMTOKEN', scmToken],
      ['APITOKEN', apiToken],
    ])
  })

  return (
    <ScrollView>
      <View> 
        <TextField  
          containerStyle={styles.inputFormField}
          label='Swimming Club Name'
          labelTextStyle={styles.settingsFormText}
          onChangeText={(clubNameTxt) => {
            console.log("On change..", clubNameTxt)
            setClubName(clubNameTxt);
          }}               
          onBlur={() => {
            console.log("Storing....", clubName, clubGUID)
          }}
          placeholder = "Club Name"
          placeholderTextColor = "#014576"
          autoCapitalize = "none"
          defaultValue = {clubName}
        />
      </View>
      <View> 
        <TextField  
          containerStyle={styles.inputFormField}
          label='Club Guid'
          labelTextStyle={styles.settingsFormText}
          onChangeText={clubGUIDTxt => {
            setClubGUID(clubGUIDTxt);
          }}               
          placeholder = "Club GUID"          
          onBlur={() => {
            console.log("Storing....", clubName, clubGUID)
          }}
          placeholderTextColor = "#014576"
          autoCapitalize = "none"
          defaultValue = {clubGUID}
        />
      </View>      
      <View> 
        <TextField  
          containerStyle={styles.inputFormField}
          label='SwimClub Manager Token'
          labelTextStyle={styles.settingsFormText}
          onChangeText={scmToken => {
            setSCMToken(scmToken);
          }}               
          placeholder = "SCM Token"          
          onBlur={() => {
            console.log("Storing....", scmToken)
          }}
          placeholderTextColor = "#014576"
          autoCapitalize = "none"
          defaultValue = {scmToken}
        />
      </View>      
      <View> 
        <TextField  
          containerStyle={styles.inputFormField}
          label='API Token'
          labelTextStyle={styles.settingsFormText}
          onChangeText={apiToken => {
            setApiToken(apiToken);
          }}               
          placeholder = "API Token"          
          onBlur={() => {
            console.log("Storing....", apiToken)
          }}
          placeholderTextColor = "#014576"
          autoCapitalize = "none"
          defaultValue = {apiToken}
        />
      </View>      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  settingsFormText: {
    fontSize: 20,
    marginTop: 5
  },
  inputFormField: {
    width: '50%',
    marginLeft: 10,
    paddingLeft: 5
  }
});

SettingsScreen.navigationOptions = {
  title: 'Key Swimming Club Settings',
};
