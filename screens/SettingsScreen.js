import React, { useGlobal } from 'reactn';
import { NavigationEvents } from 'react-navigation';
import {
  StyleSheet,
  View,
  ScrollView, Text
} from 'react-native';
import { AsyncStorage } from 'react-native';
import { TextField } from 'react-native-material-textfield';
import { useEffect, useState } from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

export default function SettingsScreen() {

  const [clubGUID, setClubGUID] = useGlobal('clubGUID');
  const [scmToken, setSCMToken] = useGlobal('scmToken');
  const [apiToken, setApiToken] = useGlobal('apiToken');
  const [securityPin, setSecurityPin] = useGlobal('securityPin');
  const [pinValidated, setPinValidated] = useState(securityPin ? false : true);

  useEffect(() => {
    AsyncStorage.multiSet([
      ['SECURITYPIN', securityPin], 
      ['CLUBGUID', clubGUID], 
      ['SCMTOKEN', scmToken],
      ['APITOKEN', apiToken],
    ])
  })

  const [pinNbrEntered, setPinNbrEntered] = useState('');
  const CELL_COUNT = 4;
  const ref = useBlurOnFulfill({pinNbrEntered, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    pinNbrEntered,
    setPinNbrEntered,
  });

  if(!pinValidated) {
    return (
      <View>
        <NavigationEvents
          onDidBlur={() => {
              setPinNbrEntered('');
            }
          }
        />
        <Text style={styles.title}>Enter Security Pin</Text>
        <CodeField
          ref={ref}
          value={pinNbrEntered}
          onChangeText={(pinNbrEntered) => {
              if(pinNbrEntered.length == CELL_COUNT) {
                if(pinNbrEntered === securityPin) {
                  setPinValidated(true)
                  setPinNbrEntered('');
                }
                else {
                  setPinNbrEntered('');
                  getCellOnLayoutHandler(0)
                }
              }
              else
                setPinNbrEntered(pinNbrEntered);
            }
          }
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldStyle}
          keyboardType="number-pad"
          renderCell={({index, symbol, isFocused}) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </View>
    )
  }
  else {
    return (
      <ScrollView>
        <NavigationEvents
          onDidBlur={() => setPinValidated(securityPin ? false : true)}
        />
        <View> 
          <TextField  
            containerStyle={styles.inputFormField}
            label='Security Pin'
            labelTextStyle={styles.settingsFormText}
            onChangeText={(securityPinNbr) => {
              setSecurityPin(securityPinNbr);
            }}               
            onBlur={() => {
            }}
            placeholder = "4 Digit Pin"
            placeholderTextColor = "#014576"
            autoCapitalize = "none"
            defaultValue = {securityPin}
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
}

const styles = StyleSheet.create({
  settingsFormText: {
    fontSize: 20,
    marginTop: 5,
    color: '#014576'
  },
  inputFormField: {
    width: '60%',
  },
  title: {
    textAlign: 'center', 
    fontSize: 30,
    color: '#014576'
  },
  codeFieldStyle: {
    marginTop: 20, 
    marginLeft: 100,
    marginRight: 100,
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
    color: '#014576'
  },
  focusCell: {
    borderColor: '#014576',
  }
});

SettingsScreen.navigationOptions = {
  title: 'Key Swimming Club Settings',
  headerTitleStyle: {
    color: '#014576'
  }
};
