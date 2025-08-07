import { FirebaseAuthTypes, getAuth, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ref, set, get, child } from 'firebase/database';
import { database } from '../utils/FirebaseConfig';

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
        console.log("formValues", formValues);


        const userId =
            loginMethod === 'email'
                ? email?.replace(/\./g, '_')
                : loginMethod === 'google'
                    ? email?.replace(/\./g, '_')
                    : mobile;

        if (!userId) {
            return { userId: null, user: null, error: 'Invalid user ID' };
        }

        console.log("userId", userId);

        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `User/${userId}`));
        console.log("snapshot", snapshot);


        if (!snapshot.exists()) {
            return { userId: null, user: null, error: 'User not found' };

        }

        const userData = snapshot.val() as UserData;

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

    console.log("formValues", formValues);


    const userId =
        loginMethod === 'general'
            ? email?.replace(/\./g, '_')
            : loginMethod === 'google'
                ? email?.replace(/\./g, '_')
                : mobile;

    if (!userId) throw new Error('Invalid user ID');
    console.log("userId", userId);

    const userData = {
        email: email ?? '',
        mobile: mobile ?? '',
        password: password ?? '',
        name: name ?? ''
    };

    console.log("userData", userData);


    await set(ref(database, `User/${userId}`), userData);
    return userId;
};

export const fetchAllUsers = async () => {
    const snapshot = await get(ref(database, 'User'));
    const data = snapshot.val();
    if (!data) return [];

    return Object.entries(data).map(([id, user]) => ({
        id,
        ...(user as any),
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