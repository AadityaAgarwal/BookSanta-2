import firebase from 'firebase'
require('@firebase/firestore')
var firebaseConfig = {
  apiKey: "AIzaSyAHKzS_E0y91Rhfz9pa6258PH9exZF0vJo",
  authDomain: "booksanta-2bb17.firebaseapp.com",
  projectId: "booksanta-2bb17",
  storageBucket: "booksanta-2bb17.appspot.com",
  messagingSenderId: "697446715518",
  appId: "1:697446715518:web:95718948e369619526082f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();