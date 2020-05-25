import * as firebase from 'firebase';
const firebaseConfig = {
    apiKey: 'AIzaSyCevv1ioJPTdqxDk0VBLVlw1ALVmNIfnBg',
    authDomain: 'find-my-item.firebaseapp.com',
    databaseURL: "find-my-item.firebaseio.com",
    projectId: "find-my-item",
    storageBucket: "find-my-item.appspot.com",
    messagingSenderId: "000000000000000",
    appId: "1:000000000000000:web:000000000000000"
};
firebase.initializeApp(firebaseConfig);
export default firebase;