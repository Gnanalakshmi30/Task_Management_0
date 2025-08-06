import React, { useState } from 'react';
import { styles } from './style';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView, Platform
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;


const RegisterScreen = () => {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Image
                        source={require('../../../assets/images/login_page.png')}
                        style={styles.illustration}
                        resizeMode="contain"
                    />

                    <Text style={styles.title}>Create an account</Text>
                    <Text style={styles.subtitle} onPress={() => navigation.replace('Login')}>
                        {" Already have an account? "}
                        <Text style={styles.loginText}>Login</Text>
                    </Text>

                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                loginMethod === 'phone' && styles.activeTab,
                            ]}
                            onPress={() => setLoginMethod('phone')}
                        >
                            <Text style={loginMethod === 'phone' ? styles.activeTabText : styles.tabText}>Phone Number</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                loginMethod === 'email' && styles.activeTab,
                            ]}
                            onPress={() => setLoginMethod('email')}
                        >
                            <Text style={loginMethod === 'email' ? styles.activeTabText : styles.tabText}>Email</Text>
                        </TouchableOpacity>
                    </View>

                    {loginMethod === 'phone' ? (
                        <TextInput
                            style={styles.input}
                            placeholder="+91-000-000-0000"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    ) : (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Sign up</Text>
                    </TouchableOpacity>

                    <Text style={styles.orText}>or register with</Text>

                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton}>
                            <Image
                                source={require('../../../assets/images/google_image.png')}
                                style={styles.socialIcon}
                            />
                        </TouchableOpacity>

                    </View>


                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default RegisterScreen;
