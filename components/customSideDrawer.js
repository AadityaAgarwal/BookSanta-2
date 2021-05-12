import * as React from 'react'
import {View,Text,TouchableOpacity} from 'react-native'
import {DrawerItems} from 'react-navigation-drawer'
import firebase from 'firebase'


export default class CustomSideDrawer extends React.Component{
    render(){
        return(
            <View><View>
                <DrawerItems 
                {...this.props}
                />
                </View>
                <View>
                    <TouchableOpacity onPress={
                        ()=>{
                            firebase.auth().signOut()
                            this.props.navigation.navigate('WelcomeScreen')
                        }
                    }>
                        <Text>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}