import * as React from 'react'
import {createStackNavigator} from 'react-navigation-stack'
import Donate from '../screens/Donate'
import ReceiverDetails from './ReceiverDetails'

export const StackNavigator=createStackNavigator({
    DonateList:{
        screen:Donate
    },
    ReceiverDetails:{
        screen:ReceiverDetails
    }
},
{
    initialRouteName:'DonateList'
}
)