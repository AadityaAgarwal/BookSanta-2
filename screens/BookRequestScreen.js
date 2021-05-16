import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  FlatList,
} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {BookSearch} from 'react-native-google-books';
import { ListItem } from 'react-native-elements/dist/list/ListItem';

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      IsBookRequestActive:'',
      reasonToRequest:'',
      requestedBookName:'',
      bookStatus:'',
      userDocId:'',
      requestId:'',
      docId:'',
      dataSrc:'',
      isFlatlistVisible:false,
      image_link:'',
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }


  getBookRequest=()=>{
    var bookRequest=db.collection('requested_books').where('user_id','==',this.state.userId).get()
    .then(
      snapshot=>{
        snapshot.forEach(doc=>{
          if(doc.data().book_status!=="received"){
            this.setState({
              'requestId':doc.data().request_id,
              'requestedBookName':doc.data().book_name,
              'bookStatus':doc.data().book_status,
              'docId':doc.id,
            })
          }
        })
      }
    )
  }

  getBookRequestActive=()=>{
    db.collection('users').where('email_id','==',this.state.userId).onSnapshot(snapshot=>{
      snapshot.forEach(doc=>{
        this.setState({
          IsBookRequestActive:doc.data().IsBookRequestActive,
          userDocId:doc.id,
        })
      })
    })
  }
  addRequest =async(bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var books=await BookSearch.searchbook(bookName,'AIzaSyAHKzS_E0y91Rhfz9pa6258PH9exZF0vJo')
    var randomRequestId = this.createUniqueId()
    db.collection('requested_books').add({
        "user_id": userId,
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        'book_status':"requested",
        'image_link':books.data[0].volumeInfo.imageLinks.smallThumbName,
    })

   this.getBookRequest()

    db.collection('users').where('email_id','==',userId).get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{db.collection('users').doc(doc.id).update(
        {
          'IsBookRequestActive':true,
        }
      )})
    })
    this.setState({
        bookName :'',
        reasonToRequest : ''
    })

    return Alert.alert("Book Requested Successfully")
  }

  receivedBooks=(bookName)=>{
    var userId=this.state.userId

    db.collection('received_books').add({
      'userId':userId,
      'book_Name':bookName,
      'bookStatus':"received",
      'requestId':this.state.requestId
    })
  }

  updateBookRequestStatus=()=>{
    db.collection('requested_books').doc(this.state.docId).update({
      'book_status':"received"
    })

    db.collection('users').where('email_id','==',this.state.userId).get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
        db.collection('users').doc(doc.id).update({
          'isBookRequestActive':false
        })
      })
    })
  }

  sendNotification=()=>{
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then(snapshot=>{
      snapshot.forEach(doc=>{
        var docData=doc.data()
        var name=docData.first_name+" "+docData.last_name
        db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
        .then(snapshot=>{
          snapshot.forEach(doc=>{
            var bookName=doc.data().book_name
            var donorId=doc.data().donor_id
            
            db.collection('all_notifications').add({
              'message':name+" received the book"+bookName,
              'targeted_user_id':donorId,
              'notification_status':"unread",
              'book_name':bookName,
            })
          })
        })
      })
    })
  }

  getBooksApi=async(bookName)=>{
    this.setState({
      bookName:bookName
    })

    if(bookName.length>=2){
      var books=await BookSearch.searchbook(bookName,'AIzaSyAHKzS_E0y91Rhfz9pa6258PH9exZF0vJo')
      this.setState({
        dataSrc:books.data,
        isFlatlistVisible:true,
      })
    }
  }

  renderItem=({item})=>{
    return(
         
      <TouchableHighlight style={{alignItems:'center',width:'90%'}} activeOpacity={0.5} underlayColor={'red'} 
      onPress={
        
        this.setState({
          isFlatlistVisible:false,
          bookName:item.volumeInfo.title ,
        })
      }
      bottomDivider
      > 
        <Text>
          {item.volumeInfo.title}
        </Text>
      </TouchableHighlight>
    )
  }
  componentDidMount(){
    this.getBookRequestActive()
    this.getBookRequest()
  }

  render(){

    if(this.state.isBookRequestActive===true){
      return(
        <View>
          <Text>You have already requested a book.</Text>
          <Text>Book Name: {this.state.requestedBookName}</Text>
          <Text>Request Status: {this.state.bookStatus}</Text>

          <TouchableOpacity onPress={()=>{
            this.sendNotification()
            this.updateBookRequestStatus()
            this.receivedBooks(this.state.requestedBookName)
          }}>
            <Text>I have received the book</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else{

    return(
        <View style={{flex:1}}>
          <MyHeader title="Request Book" navigation ={this.props.navigation}/>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={(text)=>{
                  this.getBooksApi(text)
                    this.setState({
                        bookName:text
                    })
                }}
                value={this.state.bookName}
              />

              {this.state.isFlatlistVisible? 
            ( <FlatList data={this.state.dataSrc}
             renderItem={this.renderItem}
             keyExtractor={(item,index)=>{
               index.toString()
             }}
             />)
            : 
            (
            
            <View>
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the book"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity></View>
            )}
            </KeyboardAvoidingView>
        </View>
    )}
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
