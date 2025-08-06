import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/Splash/SplashScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import TaskDashboard from '../screens/Dashboard/TaskDashboard';

export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    TaskDashboard: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="TaskDashboard" component={TaskDashboard} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigator;
