import * as React from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ToastAndroid, StyleSheet,Dimensions,Animated, FlatList } from 'react-native'
import firebase from 'firebase'
import db from '../config'
import {SwipeListView} from 'react-native-swipe-list-view'

export default class SwipeList extends React.Component{

    constructor(props){
        super(props);
        this.state={
            allNotifs:this.props.AllNotifications
        }
    }

    update=(notifications)=>{
        db.collection('AllNotifications').doc(notifications.docId).update({
            'NotificationsStatus':"read"
        })
    }
    onSwipeValueChange=(swipeData)=>{
        var allNotifs=this.state.allNotifs
        const {key,value}=swipeData
        if(value<-Dimensions.get("window").width){
            const newData={...allNotifs}
            this.update(allNotifs[key])
            newData.splice(prevIndex,1)
            this.setState({
                allNotifs:newData,
            })
        }
    }

    renderItem=(data)=>{
        return(
            <View></View>
        )
    }
    renderHiddenItem=()=>{}

    render(){
        return(
            <View>
                <SwipeListView data={this.state.allNotifs} renderItem={this.renderItem}
                renderHiddenItem={this.renderHiddenItem}
                />
            </View>
        )
    }
}