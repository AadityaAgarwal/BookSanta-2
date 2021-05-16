import firebase from 'firebase'
require('@firebase/firestore')
var firebaseConfig = {
  apiKey: "AIzaSyBdmndKkj7qQ48YUIgeaReBlrkp2lbhH5I",
  authDomain: "booksantareference.firebaseapp.com",
  projectId: "booksantareference",
  storageBucket: "booksantareference.appspot.com",
  messagingSenderId: "271437699560",
  appId: "1:271437699560:web:d00bd2d540ef2e467fec5d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();