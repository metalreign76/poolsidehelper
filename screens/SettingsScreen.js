import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RubikText } from '../components/StyledText';

export default function SettingsScreen() {
  return (
    <View>
      <RubikText style={styles.settingsFormText}>Swimming Club Name</RubikText>
      <RubikText style={styles.settingsFormText}>Club Guid</RubikText>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsFormText: {
    marginLeft: 10,
    marginTop: 20,
    fontSize: 20
  }
});

SettingsScreen.navigationOptions = {
  title: 'Key Swimming Club Settings',
};
