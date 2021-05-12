import React, { Component} from 'react';
import { Header,Icon,Badge } from 'react-native-elements';
import { View, Text, StyeSheet ,Alert} from 'react-native';
import db from '../config'
import firebase from 'firebase'

 class MyHeader extends Component {

  constructor(){
    super();
    this.state={
      value:'',
    }
  }

  getUnread=()=>{
    db.collection('AllNotifications').where('NotificationStatus','==',"unread").onSnapshot(snapshot=>{
      var unread=snapshot.docs.map(doc=>{
        doc.data()
      })
      this.setState({
        value:unread.length,
      })
    })
  }

  bellWithBadge=()=>{
    return(
      <View>
       <Icon name='bell' type='font-awesome' color='#696969'
      //   onPress={()=>{
      //    this.props.navigation.navigate('MyNotifications')
      //  }}
       />
       <Badge value={this.state.value} containerStyle={{position:'absolute',top:-4,right:-4}} />
      </View>
    )
  }

  componentDidMount(){
    this.getUnread()
  }
   render(){
     return (
    <Header
      leftComponent={<Icon name='bars' type='font-awesome' color='#696969'  onPress={() => props.navigation.toggleDrawer()}/>}
      rightComponent={<this.bellWithBadge />}
      centerComponent={{ text: props.title, style: { color: 'white', fontSize:20,fontWeight:"bold", } }}
      backgroundColor = "cyan"
    />
  );
   }  
  
};

export default MyHeader;