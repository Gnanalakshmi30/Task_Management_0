import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';


export const saveUserToLocalStorage = async (user: {
    userId: string;
    email: string;
    mobile: string;
    name: string;
}) => {
    try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        console.log('User data saved to local storage');
    } catch (error) {
        console.error('Error saving user to local storage', error);
    }
};

export const saveTaskOffline = async (task: any) => {
    const existing = await AsyncStorage.getItem('offlineTasks');
    const tasks = existing ? JSON.parse(existing) : [];
    tasks.push(task);
    await AsyncStorage.setItem('offlineTasks', JSON.stringify(tasks));
};

export const getOfflineTasks = async (): Promise<any[]> => {
    const tasks = await AsyncStorage.getItem('offlineTasks');
    return tasks ? JSON.parse(tasks) : [];
};

export const clearOfflineTasks = async () => {
    await AsyncStorage.removeItem('offlineTasks');
};


export const logoutUser = async (navigation: any) => {
    try {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('offlineTasks');
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            })
        );
    } catch (error) {
        console.error('Error during logout', error);
    }
}

export const storeFCMToken = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
        console.log('User declined messaging permissions');
    } else {
        try {
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                await AsyncStorage.setItem('fcmToken', fcmToken);
                console.log('FCM token stored:', fcmToken);
            }
        } catch (storageError) {
            console.error('Failed to store FCM token:', storageError);
        }
    }
}