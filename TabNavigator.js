import { View } from 'react-native';
import { createAppContainer,createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Donate from './screens/Donate'
import Request from './screens/Request'


export  const TabNavigator=createBottomTabNavigator({
   
    
    Request:{
        screen:Request
    },Donate:{
        screen:Donate
    },
})