import AsyncStorage from '@react-native-async-storage/async-storage';

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
