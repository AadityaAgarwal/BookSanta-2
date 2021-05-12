import * as React from 'react'
import { ListItem} from 'react-native-elements'
import db from '../config'
import { View, Text, KeyboardAvoidingView, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import MyHeader from '../components/Header'
import firebase from 'firebase'

export default class Donate extends React.Component {
  constructor() {
    super()
    this.state = {
      requestedBooksList: [],
      userId:firebase.auth().currentUser.email,
    }
    this.requestRef = null
  }

  getRequestedBooksList = () => {
    this.requestRef = db.collection('Requested_Books')
      .onSnapshot((snapshot) => {
      //  var requestedBooksList=snapshot.docs.map(doc=>{doc.data()})

        var requestedBooksList = []
        snapshot.forEach(doc => {
          requestedBooksList.push(doc.data())
       });
      
        this.setState({
          requestedBooksList: requestedBooksList
        });
      })
  }

  componentDidMount() {
    this.getRequestedBooksList();
    console.log(this.state.requestedBooksList)
  }

  componentWillUnmount() {
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.Book_Name}
        subtitle={item.Book_Reason}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
          <TouchableOpacity style={styles.button} onPress={
            this.props.navigation.navigate('ReceiverDetails', { "Details": item })
          }>
            <Text style={{ color: '#ffff' }}>View</Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {/* <Header
          backgroundColor={'blue'}
          leftComponent={
              <Icon name='bars' onPress={()=>{
                  props.navigation.toggleDrawer()
              }}/>}
              rightComponent={
                  <Icon name='bell' />
              }
          centerComponent={{
            text: 'Donate',
            style: { color: '#fff', fontSize: 20 },
          }}
        /> */}

        <MyHeader title="Donate" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {
            this.state.requestedBooksList.length === 0
              ? (
                <View style={styles.subContainer}>
                  <Text style={{ fontSize: 20 }}>List Of All Requested Books</Text>
                </View>
              )
              : (
                <FlatList
                  data={this.state.requestedBooksList}
                  renderItem={
                    //  this.renderItem

                    ({ item }) => (
                      <View style={{ borderBottomWidth: 2 }}>
                        <View>
                          <View style={{ marginTop: 10 }}>
                            <Text style={{ fontWeight: 'bold' }}>{item.Book_Name}</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item.Book_Reason}</Text>
                            <TouchableOpacity style={styles.button} onPress={()=>{
                              this.props.navigation.navigate('ReceiverDetails', { "Details": item })
                            }}>
                              <Text style={{ color: '#ffff' }}>View</Text>
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
              )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8
    }
  }
})