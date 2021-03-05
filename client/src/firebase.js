import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/firestore'

const app = firebase.initializeApp({
    apiKey: "AIzaSyBblR-HzoIdZa0-MGcas-IJtppLbFKE5H0",
    authDomain: "enrollable-9a105.firebaseapp.com",
    databaseURL: "https://enrollable-9a105-default-rtdb.firebaseio.com",
    projectId: "enrollable-9a105",
    storageBucket: "enrollable-9a105.appspot.com",
    messagingSenderId: "811071981252",
    appId: "1:811071981252:web:769374920893ae2f7cab91",
    measurementId: "G-X69HK0FGL9"
})

export const auth = app.auth()
export const db = app.firestore()
export default app