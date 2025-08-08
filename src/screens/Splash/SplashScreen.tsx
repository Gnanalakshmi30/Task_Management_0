
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import { styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;


const SplashScreen = () => {
    const navigation = useNavigation<SplashScreenNavigationProp>();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkUserAndNavigate = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                const loggedIn = !!storedUser;
                setIsLoggedIn(loggedIn);

                setTimeout(() => {
                    if (loggedIn) {
                        navigation.replace('TaskDashboard');
                    } else {
                        navigation.replace('Login');
                    }
                }, 5000);
            } catch (error) {
                setIsLoggedIn(false);
                navigation.replace('Login');
            }
        };

        checkUserAndNavigate();
    }, [navigation]);


    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <Image
                source={require('../../../assets/images/login_page.png')}
                style={styles.image}
                resizeMode="contain"
            />

            <Text style={styles.title}>Task Management</Text>
            <Text style={styles.subtitle}>Create, prepare and manage your tasks!</Text>
            <Text style={styles.description}>
                Welcome Home! Access trusted services for a comfortable, hassle-free living.
            </Text>
            {!isLoggedIn && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.replace('Login')}>
                        <Text style={styles.primaryText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.replace('Register')}
                    >
                        <Text style={styles.secondaryText}>Register</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default SplashScreen;

