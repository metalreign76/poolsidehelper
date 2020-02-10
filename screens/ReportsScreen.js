import React, { useGlobal, setGlobal } from 'reactn';
import { Button } from 'react-native-elements';
import { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, ActivityIndicator, Platform} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { NavigationEvents } from 'react-navigation';
import Modal from "react-native-modal";

function getMemberData(
  selectedMember, 
  scmToken, 
  apiToken, 
  clubGUID, 
  setFindingMember, 
  setMemberDetails,
  setShowMemberDetails
) {

  fetch('https://nx3dyozzzd.execute-api.eu-west-1.amazonaws.com/beta/SCM/getmember/' + selectedMember.id, {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
      'Authorization-Token': scmToken,
      'x-api-key': apiToken
    },
    body: JSON.stringify({ clubGUID: clubGUID})
  })
  .then((response) => {
    return response.json()
  })
  .then((responseJSON) => {
    setFindingMember(false);
    var listData = [];
    var listKeys = Object.keys(responseJSON.data);
    var i = 1;
    listKeys.forEach(field => {
      listData.push({ key: i++, info: responseJSON.data[field], desc: field})
    })
    setMemberDetails(listData);
    setShowMemberDetails(true);
  })
  .catch((error) => {
    setFindingMember(false);
    console.log("Error:", error)
  });
}

export default function ReportsScreen() {

  const [clubGUID, setClubGUID] = useGlobal('clubGUID');
  const [scmToken, setSCMToken] = useGlobal('scmToken');
  const [membersArr, setMembersArr] = useGlobal('members');
  const [apiToken, setApiToken] = useGlobal('apiToken');
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [regButtonDisabled, setRegButtonDisabled] = useState(true);
  const [findingMember, setFindingMember] = useState(false);
  const [securityPin, setSecurityPin] = useGlobal('securityPin');
  const [memberDetails, setMemberDetails] = useState([]);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  
  useEffect( () => {
    const membersList = membersArr.map((member) => {
      return {
        id: member.Guid,
        name: member.MemberName
      }
    })
    setMembers(membersList);
  }, [membersArr])


  const [pinNbrEntered, setPinNbrEntered] = useState('');
  const CELL_COUNT = 4;
  const ref = useBlurOnFulfill({pinNbrEntered, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    pinNbrEntered,
    setPinNbrEntered,
  });
  const [pinValidated, setPinValidated] = useState(false);

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
      <View style={{flex: 1, flexDirection: 'row'}}>
        <NavigationEvents
          onDidBlur={() => setPinValidated(false)}
        />
        <View style={styles.container}>
          <Text>Reports</Text>
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
              }
            }
            onPress={ () => { }}
            containerStyle={styles.searchableStyle}
            textInputStyle={styles.searchableText}
            itemStyle={styles.searchableDropdownStyle}
            itemTextStyle={styles.searchableItemsStyle}
            itemsContainerStyle={styles.searchableContainerStyle}
            items={members}
            placeholder="start typing member name"
            resetValue={false}
            underlineColorAndroid="transparent"
          />
          <Button
            title={'Member Details'}
            buttonStyle={styles.buttonStyle}
            disabled={regButtonDisabled}
            onPress={() => {
              setRegButtonDisabled(true);
              setFindingMember(true);
              getMemberData(
                selectedMember, 
                scmToken, 
                apiToken, 
                clubGUID, 
                setFindingMember, 
                setMemberDetails,
                setShowMemberDetails);
            }}
          />
          <View style={{ marginTop: 20 }}>
            <ActivityIndicator size={60} color="#014576" animating={findingMember}/>
          </View>
        </View>
        <View>
          <Modal isVisible={showMemberDetails}>
            <View style={styles.modalStyle}>
              <FlatList
                data={memberDetails}
                renderItem={({ item }) =>
                  <View>
                    <Text style={styles.modalDescText}>{item.desc} : 
                      <Text style={styles.modalInfoText}> {item.info}</Text>
                    </Text>                    
                  </View>
                }
                ItemSeparatorComponent={() => 
                  <View style={styles.itemSeparator}/>
                }
                showsVerticalScrollIndicator={true}
              />
              <Button
                title={'Close'} 
                buttonStyle={styles.modalButtonStyle}
                onPress={() => {
                  setShowMemberDetails(false);
                }}
              />                
            </View>
          </Modal>
        </View>
      </View>    
    );
  }
}


ReportsScreen.navigationOptions = {
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
    marginTop: 20
  },
  statusContainer: {
    marginVertical: 40
  },
  inputFormField: {
    width: '60%',
  },
  title: {
    textAlign: 'center', 
    fontSize: 30,
    marginTop: 30,
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
  },
  modalButtonStyle: {
    backgroundColor: '#014576',
    marginLeft: '40%',
    marginRight: '40%'
  },
  modalStyle: {
    backgroundColor: '#fff',
    padding: 10,
    width: '90%',
    height: '90%',
    flex: 1
  },
  modalDescText: {
    color: '#014576',
    fontStyle: 'italic'
  },
  modalInfoText: {
    fontSize: 18    ,
    color: '#014576'
  },
  itemSeparator : {
    height: 1,
    width: "90%",
    backgroundColor: "#014576",
    marginTop: 5
  }
});
