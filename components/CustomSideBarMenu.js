import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'
import {Avatar} from 'react-native-elements'
import {ImagePicker} from 'expo-image-picker'
import firebase from 'firebase';
import db from '../config'

export default class CustomSideBarMenu extends Component{

  constructor(){
    super()
    this.state={
      imgSrc:'',
      userId:firebase.auth().currentUser.email,
      name:''
    }
  }

  fetchImage=(imgName)=>{
    var storageRef=firebase.storage().ref().child("user_profile/"+imgName)
    storageRef.getDownloadURL().then(
      url=>{
        this.setState({
          imgSrc:url
        })
      }
    )
    .catch((error)=>{
      this.setState({
        imgSrc:"*"
      })
    })
  }

  uploadImage=async(uri,imgName)=>{
    var response=await fetch(uri)
    var blob=await response.blob()
    var ref=firebase.storage().ref().child("user_profile/"+imgName)
    return(ref.put(blob).then(response=>{
      this.fetchImage(imgName)
    })
    )
  }

  selectImg=async()=>{
   const {cancelled,uri} = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
  })

  if(!cancelled){
    this.uploadImage(uri,this.state.userId)
  }
}

// getUserProfile=()=>{
// db.collection('users').where('email_id','==',this.state.userId).get()
// .then(snapshot=>{
//   snapshot.forEach(doc=>{
//     this.setState({
//       name:doc.data().first_name+" "+doc.data().last_name
//     })
//   })
// })
// }

componentDidMount(){
  this.fetchImage(this.state.userId)
  // this.getUserProfile()
}
  render(){
    return(
      <View style={{flex:1}}>
        <View style={{marginTop:50}}>
          <Avatar rounded
          source={{uri :this.state.imgSrc}}
         size={"medium"}
         onPress={()=>{
           this.selectImg()
         }}
         showEditButton
         />
         <Text>{this.state.name}</Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props}/>
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Text>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container : {
    flex:1
  },
  drawerItemsContainer:{
    flex:0.8
  },
  logOutContainer : {
    flex:0.2,
    justifyContent:'flex-end',
    paddingBottom:30
  },
  logOutButton : {
    height:30,
    width:'100%',
    justifyContent:'center',
    padding:10
  },
  logOutText:{
    fontSize: 30,
    fontWeight:'bold'
  }
})
