import firebase from "firebase/app";
import "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDwMNmqKp36s0BM76Ib3zViuhHqeWlildk",
    projectId: "i69social",
    storageBucket: "i69social.appspot.com"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { firebase, storage as default };
