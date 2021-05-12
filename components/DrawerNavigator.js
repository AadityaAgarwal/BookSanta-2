import * as React from 'react'
import { View, Text } from 'react-native'
import { DrawerItems, createDrawerNavigator } from 'react-navigation-drawer'
import { TabNavigator } from '../TabNavigator'
import CustomSideDrawer from './customSideDrawer'
import Settings from '../screens/Settings'
import MyDonations from '../screens/MyDonations'
import MyNotifications from '../screens/MyNotifications'

export const DrawerNavigator = createDrawerNavigator({
    Home: TabNavigator,
    Settings: Settings,
    MyDonations:MyDonations,
    MyNotifications:MyNotifications,
}, {
    contentComponent: CustomSideDrawer
}, {
    initialRouteName: 'Home'
})