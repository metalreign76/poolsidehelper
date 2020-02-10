import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import StatusScreen from '../screens/StatusScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AttendanceScreen from '../screens/AttendanceScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const StatusStack = createStackNavigator(
  {
    Status: StatusScreen,
  },
  config
);

StatusStack.navigationOptions = {
  tabBarLabel: 'Status',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

StatusStack.path = '';

const RegisterStack = createStackNavigator(
  {
    Register: RegisterScreen,
  },
  config
);

RegisterStack.navigationOptions = {
  tabBarLabel: 'Register',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person-add' : 'md-person-add'} />
  ),
};

RegisterStack.path = '';

const AttendanceStack = createStackNavigator(
  {
    Attendance: AttendanceScreen,
  },
  config
);

AttendanceStack.navigationOptions = {
  tabBarLabel: 'Attendance',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-checkmark-circle-outline' : 'md-checkmark-circle-outline'} />
  ),
};

AttendanceStack.path = '';

const ReportsStack = createStackNavigator(
  {
    Reports: ReportsScreen,
  },
  config
);

ReportsStack.navigationOptions = {
  tabBarLabel: 'Reports',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-list' : 'md-list'} />
  ),
};

ReportsStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  StatusStack,
  RegisterStack,
  AttendanceStack,
  ReportsStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
