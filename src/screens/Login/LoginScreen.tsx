import React, { useEffect, useState } from 'react';
import { styles } from './Style';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView, Platform,
    Alert
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { useFormValidator } from '../../customHooks/useFormValidator';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import InputField from '../../components/InputField';
import CustomButton from '../../components/Button';
import SocialLoginButton from '../../components/SocialIcon';
import { googleAuth, loginUserFromFirebase, saveUserToFirebase } from '../../services/AuthService';
import loginSchema from '../../schemas/LoginSchema';
import { saveUserToLocalStorage } from '../../utils/localStorage';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;


const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email' | 'google'>('phone');
    type formFields = {
        email: string;
        mobile: string;
        password: string;
        loginMethod: string;

    };
    const [formValues, setFormValues] = useState({
        email: '',
        mobile: '',
        password: ''

    });
    const { errors, validate, clearError } = useFormValidator<formFields>(loginSchema);


    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '176650700167-n9enmshe6rhd8c96f3ce78t9cc3h3962.apps.googleusercontent.com',
        });
    }, [])


    const handleChange = (field: string, value: string) => {
        setFormValues(prev => ({ ...prev, [field]: value }));
    };

    const handleLogin = async (loginMethod: string, email?: string) => {
        console.log("login");

        try {
            if (loginMethod !== 'google') {
                console.log("vali", formValues.email, formValues.mobile, formValues.password, loginMethod);

                const isValid = await validate({
                    email: formValues.email,
                    mobile: formValues.mobile,
                    password: formValues.password,
                    loginMethod: loginMethod,
                });
                console.log("vali", isValid);
                if (!isValid) return;
            }

            const payload = {
                loginMethod,
                email: loginMethod === 'google' ? email : formValues.email,
                mobile: formValues.mobile,
                password: formValues.password,
            };

            console.log("payload", payload);


            const { userId, user, error } = await loginUserFromFirebase(payload);
            if (user != null) {
                const localUser = {
                    userId: userId ?? '',
                    email: user.email || '',
                    mobile: user.mobile || '',
                    name: user.name || '',
                };
                await saveUserToLocalStorage(localUser);
                navigation.replace('TaskDashboard')
            } else {
                Alert.alert("Error", error ?? "Try again later");

            }

            setFormValues({
                email: '',
                mobile: '',
                password: '',
            });


        } catch (error) {
            console.log("error", error);
        }
    };

    async function onGoogleButtonPress() {
        try {
            const user = await googleAuth();

            if (user) {
                await handleLogin('google', user.email ?? "");
                Alert.alert("Success", "Logged in with Google");
            } else {
                Alert.alert("Error", "User not found");
            }
        } catch (error: any) {
            Alert.alert("Login Failed", error.message || "Something went wrong");
        }
    }

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

                    <Text style={styles.title}>Login to your account</Text>
                    <Text style={styles.subtitle}>
                        {"Don't have an account? "}
                        <Text style={styles.loginText} onPress={() => navigation.replace('Register')}>Register</Text>

                    </Text>

                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                loginMethod === 'phone' && styles.activeTab,
                            ]}
                            onPress={() => {
                                setLoginMethod('phone');
                                clearError(['email', 'mobile', 'password']);
                                setFormValues({
                                    email: '',
                                    mobile: '',
                                    password: '',
                                });
                            }}
                        >
                            <Text style={loginMethod === 'phone' ? styles.activeTabText : styles.tabText}>Phone Number</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.tabButton,
                                loginMethod === 'email' && styles.activeTab,
                            ]}
                            onPress={() => {
                                setLoginMethod('email');
                                clearError(['email', 'mobile', 'password']);
                                setFormValues({
                                    email: '',
                                    mobile: '',
                                    password: '',
                                });
                            }}
                        >
                            <Text style={loginMethod === 'email' ? styles.activeTabText : styles.tabText}>Email</Text>
                        </TouchableOpacity>
                    </View>

                    {loginMethod === 'phone' ? (
                        <InputField
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                            maxLength={10}
                            value={formValues.mobile}
                            onChangeText={(text) => handleChange('mobile', text)}
                            onFocus={() => clearError('mobile')}
                            error={errors.mobile}
                        />

                    ) : (
                        <InputField
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            value={formValues.email}
                            onChangeText={(text) => handleChange('email', text)}
                            onFocus={() => clearError('email')}
                            error={errors.email}
                        />

                    )}
                    <InputField
                        value={formValues.password}
                        placeholder="Enter password"
                        secureTextEntry
                        onChangeText={text => handleChange('password', text)}
                        onFocus={() => clearError('password')}
                        error={errors.password}
                    />


                    <CustomButton title="Login" onPress={() => handleLogin(loginMethod)} />

                    <Text style={styles.orText}>or login with</Text>


                    <SocialLoginButton
                        onPress={onGoogleButtonPress}
                        iconSource={require('../../../assets/images/google_image.png')}
                        style={styles.socialButton}
                        iconStyle={styles.socialIcon}
                    />


                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;
