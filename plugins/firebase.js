import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'

if (!firebase.apps.length) {
  const config = {
    apiKey: 'AIzaSyBLbMjEyJRrF3jRi3D0OpRAn-9_zx5HDEE',
    authDomain: 'supphero-4ce73.firebaseapp.com',
    databaseURL: 'https://supphero-4ce73.firebaseio.com',
    projectId: 'supphero-4ce73',
    storageBucket: 'supphero-4ce73.appspot.com',
    messagingSenderId: '800464300796'
  }
  firebase.initializeApp(config)
  firebase.firestore().settings({ timestampsInSnapshots: true })
}
const fireDb = firebase.firestore()
const storage = firebase.storage()

export { storage, fireDb }
