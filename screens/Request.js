import * as React from 'react'
import { KeyboardAvoidingView, Text, TextInput, ToastAndroid, Touchable, TouchableOpacity, View, StyleSheet } from 'react-native'
import firebase from 'firebase'
import db from '../config'
import MyHeader from '../components/Header'

export default class Request extends React.Component {
    constructor() {
        super();
        this.state = {
            bookName: '',
            bookReason: '',
            userId: firebase.auth().currentUser.email
        }
    }
    addRequest = (bookName, bookReason) => {
        var UserID = this.state.userId
        var randomRequestId = Math.random().toString(36).substring(7)

        db.collection('Requested_Books').add({
            'User_Id': UserID,
            'Book_Name': bookName,
            'Book_Reason': bookReason,
            'Request_ID': randomRequestId
        })

        this.setState({
            bookName: '',
            bookReason: '',
        })
        return ToastAndroid.show("Book Requested", ToastAndroid.SHORT)
    }
    render() {
        return (
            <View>
                <MyHeader title="Request" navigation={this.props.navigation} />
                <KeyboardAvoidingView>
                    <TextInput
                        placeholder="Book Name"

                        onChangeText={(text) => {
                            this.setState({
                                bookName: text
                            })
                        }}
                        style={[styles.loginBox, { marginTop: 100 }]}
                        value={this.state.bookName}
                    />
                    <TextInput
                        placeholder="Reason For Issue"
                        style={styles.loginBox}
                        multiline numberOfLines={10}
                        onChangeText={(text) => {
                            this.setState({
                                bookReason: text
                            })
                        }}
                        value={this.state.bookReason}
                    />
                    <TouchableOpacity onPress={() => {
                        this.addRequest(this.state.bookName, this.state.bookReason)
                    }} style={{ marginTop: 10, alignSelf: 'center', borderWidth: 2, borderRadius: 20, borderColor: 'red', backgroundColor: 'orange', width: 100, height: 30, alignItems: 'center' }}>
                        <Text style={{ textAlign: 'center' }}>
                            Submit
                        </Text >
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    loginBox: {
        width: '75%',
        height: 40,
        borderWidth: 2,
        margin: 10,
        paddingLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'red',
        borderRadius: 20,
        alignSelf: 'center'
    },
    login: {
        width: '75%',
        height: 40,
        borderWidth: 2,
        margin: 10,
        paddingLeft: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
})