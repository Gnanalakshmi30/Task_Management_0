import { FirebaseAuthTypes, getAuth, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { firestore } from '../utils/FirebaseConfig';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, serverTimestamp, updateDoc, onSnapshot } from "firebase/firestore";
import { saveTaskOffline, getOfflineTasks, clearOfflineTasks } from "../utils/localStorage";
import { isConnected } from "../utils/NetworkService";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import firestores from '@react-native-firebase/firestore';




interface UserPayload {
    email?: string;
    mobile?: string;
    password?: string;
    name?: string;
    loginMethod: string;
}

interface UserData {
    email: string;
    mobile: string;
    name: string;
    password?: string;
}

export const loginUserFromFirebase = async (formValues: UserPayload): Promise<{ userId: string | null; user: UserData | null, error: string | null }> => {
    try {
        const { loginMethod, email, mobile, password } = formValues;
        const userId =
            loginMethod === 'email'
                ? email?.replace(/\./g, '_')
                : loginMethod === 'google'
                    ? email?.replace(/\./g, '_')
                    : mobile;

        if (!userId) {
            return { userId: null, user: null, error: 'Invalid user ID' };
        }
        const docRef = doc(firestore, "User", userId);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) {
            return { userId: null, user: null, error: 'User not found' };

        }

        const userData = snapshot.data() as UserData;
        if (loginMethod !== 'google' && userData.password && userData.password !== password) {
            return { userId: null, user: null, error: 'Invalid password' };
        }

        return { userId, user: userData, error: null };
    } catch (error: any) {
        return { userId: null, user: null, error: error.message || 'An unknown error occurred' };

    }
};

export const saveUserToFirebase = async (formValues: UserPayload) => {
    const { loginMethod, email, mobile, password, name } = formValues;
    const userId =
        loginMethod === 'general'
            ? email?.replace(/\./g, '_')
            : loginMethod === 'google'
                ? email?.replace(/\./g, '_')
                : mobile;

    if (!userId) throw new Error('Invalid user ID');
    const userData = {
        email: email ?? '',
        mobile: mobile ?? '',
        password: password ?? '',
        name: name ?? ''
    };
    await setDoc(doc(firestore, "User", userId), userData);
    return userId;
};

export const fetchAllUsers = async () => {
    const snapshot = await getDocs(collection(firestore, "User"));
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};

export const googleAuth = async (): Promise<FirebaseAuthTypes.User | null> => {
    try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const userInfo = await GoogleSignin.signIn();

        if (!userInfo) {
            throw new Error("Google info not found");
        }

        const googleCredential = GoogleAuthProvider.credential(userInfo.data?.idToken);
        const firebaseUserCredential = await signInWithCredential(getAuth(), googleCredential);

        return firebaseUserCredential.user;
    } catch (error) {
        console.error("Google login failed", error);
        throw error;
    }
};


export const createTask = async (
    taskData: { name: string; description: string; status: string; dueDate: Date | null }
) => {
    const userDataString = await AsyncStorage.getItem('user');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const payload = {
        ...taskData,
        createdAt: serverTimestamp(),
        userId: userData?.userId ?? null
    };

    const online = await isConnected();

    if (online) {
        await addDoc(collection(firestore, "tasks"), payload);
        return { status: "online", message: "Task created successfully" };
    } else {
        await saveTaskOffline(payload);
        return { status: "offline", message: "Task saved offline" };
    }
};


export const updateTask = async (taskId: string, data: any) => {
    try {
        console.log("taskId", taskId, data);

        const docRef = doc(firestore, "tasks", taskId);
        await updateDoc(docRef, data);
        return { status: 'success', message: 'Task updated successfully' };
    } catch (error) {
        return { status: 'error', message: (error as Error).message };
    }
};

export const getTasks = async (
    onTasksUpdate: (tasks: any[], markedDates: { [key: string]: any }) => void,
    onError?: (error: any) => void
): Promise<() => void> => {  // Return a function (unsubscribe or noop)
    try {
        const online = await isConnected();
        if (online) {
            const unsubscribe = onSnapshot(
                collection(firestore, "tasks"),
                async (querySnapshot) => {
                    const fetchedTasks: any[] = [];
                    const marks: { [key: string]: any } = {};

                    querySnapshot.forEach(documentSnapshot => {
                        const data = documentSnapshot.data();
                        const task = {
                            ...data,
                            id: documentSnapshot.id,
                        };
                        fetchedTasks.push(task);

                        const dueDate =
                            (task as any).dueDate && (task as any).dueDate.seconds
                                ? new Date((task as any).dueDate.seconds * 1000).toISOString().split('T')[0]
                                : null;
                        if (dueDate) {
                            marks[dueDate] = {
                                marked: true,
                                dotColor: '#B486F1',
                                selectedColor: '#B486F1',
                            };
                        }
                    });

                    await AsyncStorage.setItem('offlineTasks', JSON.stringify(fetchedTasks));

                    onTasksUpdate(fetchedTasks, marks);
                },
                (error) => {
                    if (onError) onError(error);
                }
            );

            return unsubscribe;
        } else {
            const offline = await getOfflineTasks();
            const marks: { [key: string]: any } = {};
            offline.forEach(task => {
                const dueDate =
                    task.dueDate && task.dueDate.seconds
                        ? new Date(task.dueDate.seconds * 1000).toISOString().split('T')[0]
                        : null;

                if (dueDate) {
                    marks[dueDate] = {
                        marked: true,
                        dotColor: '#B486F1',
                        selectedColor: '#B486F1',
                    };
                }
            });

            onTasksUpdate(offline, marks);

            // No listener in offline mode, return noop function
            return () => { };
        }
    } catch (error) {
        if (onError) onError(error);
        return () => { };
    }
};


export const listenAndSyncOfflineTasks = () => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
        if (state.isConnected && state.isInternetReachable) {
            const offlineTasks = await AsyncStorage.getItem('offlineTasks');
            if (offlineTasks) {
                const tasksOffline = JSON.parse(offlineTasks);
                for (const task of tasksOffline) {
                    const snapshot = await firestores()
                        .collection('tasks')
                        .where('taskId', '==', task.taskId)
                        .get();

                    if (snapshot.empty) {
                        await firestores().collection('tasks').add(task);
                    } else {
                        console.log(`Task ${task.taskId} already exists. Skipping...`);
                    }
                }
                await clearOfflineTasks();
            }
        }
    });

    // Return unsubscribe function so caller can clean up listener
    return unsubscribe;
};


export const deleteTask = async (taskId: string) => {
    try {
        // Using react-native-firebase firestore instance you have as firestores
        await firestores().collection('tasks').doc(taskId).delete();
        return { status: 'success', message: 'Task deleted successfully' };
    } catch (error: any) {
        console.error('Error deleting task:', error);
        return { status: 'error', message: error.message || 'Error deleting task' };
    }
};
