import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createSwitchNavigator,createAppContainer} from 'react-navigation'
import{ DrawerNavigator} from './components/DrawerNavigator';
import ReceiverDetails from './components/ReceiverDetails';
import WelcomeScreen from './screens/welcomeScreen';
import {TabNavigator} from './TabNavigator'

export default class App extends React.Component {
  render(){
    return (
    
      <AppContainer/>
    
  );
}
  }


  const SwitchNavigator=createSwitchNavigator({
    WelcomeScreen:WelcomeScreen,
    Drawer:DrawerNavigator,
    ReceiverDetails:ReceiverDetails //new add
  })

  const AppContainer=createAppContainer(SwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
