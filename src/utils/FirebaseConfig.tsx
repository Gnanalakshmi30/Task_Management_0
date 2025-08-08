import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';


const firebaseConfig = {
    apiKey: "AIzaSyA2_rWUYW80zf6iyROIMbLSuSjRMwtuzXs",
    authDomain: "task-manager-39940.firebaseapp.com",
    databaseURL: "https://task-manager-39940-default-rtdb.firebaseio.com",
    projectId: "task-manager-39940",
    storageBucket: "task-manager-39940.firebasestorage.app",
    messagingSenderId: "176650700167",
    appId: "1:176650700167:web:851af708b7835820783f22",
    measurementId: "G-VWN06C49CF"
};


const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const firestore = getFirestore(app);


export const pushNotificationChannelRegistration = (): void => {
    if (Platform.OS === 'android') {
        PushNotification.createChannel(
            {
                channelId: 'task-alerts',
                channelName: 'Task Alerts',
                channelDescription: 'Notifications about your tasks',
                importance: 4,
                vibrate: true,
            },
            (created) => console.log(`createChannel returned '${created}'`)
        );
    }

    PushNotification.configure({
        onRegister: function (token) {
            console.log("TOKEN:", token);
        },
        onNotification: function (notification) {
            console.log('NOTIFICATION:', notification);
        },
        popInitialNotification: true,
        requestPermissions: true,
    });
};



