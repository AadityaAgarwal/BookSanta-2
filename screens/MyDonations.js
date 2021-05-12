import * as React from 'react';
import {View,Text,FlatList} from 'react-native'
import db from '../config'
import firebase from 'firebase'

export default class MyDonations extends React.Component{

    constructor(){
        super();
        this.state={
            allDonations:[],
            donorId:firebase.auth().currentUser.email,
            donorName:'',
        }
        this.requestRef=null;
    }
    getDonations=()=>{
      this.requestRef = db.collection('AllDonations').where("DonorId",'==',this.state.donorId)
      .onSnapshot(snapshot=>{
          var allDonations=[]
          snapshot.docs.map(doc=>{
              var donations=doc.data()
              donations["doc_id"]=doc.id;
              allDonations.push(donations)
          })
      })
      this.setState({
          allDonations:allDonations,
      })
    }
    getDonorDetails=(userId)=>{
        db.collection('Users').where("Email","==",userId).get()
        .then(
            snapshot=>{
                snapshot.forEach(doc=>{
                    this.setState({
                        donorName:doc.data().FirstName+" "+doc.data().LastName,
                    })
                })
            }
        )
    }

    sendNotification=(bookDetails,RequestStatus)=>{
        var requestId=bookDetails.RequestId
        var donorId=bookDetails.DonorId

        db.collection('AllNotifications').where('RequestId','==',requestId).where('DonorId','==',donorId).get()
        .then(
            snapshot=>{
                snapshot.forEach(doc=>{
                    var msg=''
                  if(RequestStatus==='Book Sent'){
                      msg=this.state.donorName+" sent you a book"
                  }
                  else {
                      msg=this.state.donorName+" has shown interest in donating book"
                  }  
                  db.collection('AllNotifications').doc(doc.id).update(
                      {
                          'Message':msg,
                          'NotificationStatus':"unread",
                      }
                  )
                })
            }
        )
    }
    sendBook=(bookDetails)=>{
        if(bookDetails.RequestStatus==="Book Sent"){
            var RequestStatus="donor interested"
            db.collection('AllDonations').doc(bookDetails.doc_id).update({
                'RequestStatus':RequestStatus
            })
        this.sendNotification(bookDetails,RequestStatus)
        }
        else {
            var RequestStatus="Book Sent"
            db.collection('AllDonations').doc(bookDetails.doc_id).update({
                'RequestStatus':"Book Sent"
            })
            this.sendNotification(bookDetails,RequestStatus);
        }
    }
   
    componentDidMount=()=>{
        this.getDonations()
        this.getDonorDetails(this.state.donorId)
    }
    render(){
        return(
            <View>
                <Text>My donations</Text>
               <FlatList
                  data={this.state.allDonations}
                  renderItem={
                    ({ item }) => (
                      <View style={{ borderBottomWidth: 2 }}>
                        <View>
                          <View style={{ marginTop: 10 }}>
                            <Text style={{ fontWeight: 'bold' }}>{item.RequestedBy}</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item.RequestStatus}</Text>
                            <TouchableOpacity style={styles.button} onPress={
                             this.sendBook(item)
                            }>
                              <Text style={{ color: '#ffff' }}>Donate Book</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )
                  }
                  keyExtractor={(item, index) => {
                    index.toString();
                  }}
                />
            </View>
        )
    }
}