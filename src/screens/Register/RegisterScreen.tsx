import React, { useState } from 'react';
import { styles } from './style';
import {
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
import InputField from '../../components/InputField';
import SocialLoginButton from '../../components/SocialIcon';
import { googleAuth, saveUserToFirebase } from '../../services/AuthService';
import { useFormValidator } from '../../customHooks/useFormValidator';
import registerSchema from '../../schemas/RegisterSchema';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;


const RegisterScreen = () => {
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const [loginMethod, setLoginMethod] = useState<'general' | 'google'>('general');
    type formFields = {
        email: string;
        mobile: string;
        password: string;
        confirmPassword: string;
        name: string;
        loginMethod: string;

    };
    const { errors, validate, clearError } = useFormValidator<formFields>(registerSchema);
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });

    const handleRegistration = async (loginMethod: string, email?: string, name?: string,) => {
        try {
            if (loginMethod !== 'google') {
                const isValid = await validate({
                    email: formValues.email,
                    mobile: formValues.mobile,
                    password: formValues.password,
                    confirmPassword: formValues.confirmPassword,
                    name: formValues.name,
                    loginMethod: loginMethod,
                });

                if (!isValid) return;
            }
            const payload = {
                loginMethod,
                email: loginMethod === 'google' ? email : formValues.email,
                mobile: formValues.mobile,
                password: formValues.password,
                name: loginMethod === 'google' ? name : formValues.name,
            };
            const response = await saveUserToFirebase(payload);
            if (!response) {
                Alert.alert("Error", "Try again after sometime");

            } else {
                Alert.alert("Success", "Registration successful, kindly login");
            }

            setFormValues({
                email: '',
                mobile: '',
                password: '',
                name: '',
                confirmPassword: ''
            });

            navigation.replace('Login')
        } catch (error) {

        }
    };



    async function onGoogleButtonPress() {
        try {
            const user = await googleAuth();

            if (user) {
                await handleRegistration('google', user.email ?? "", user.displayName ?? "");
                Alert.alert("Success", "Registered with Google, Kindly login");
            } else {
                Alert.alert("Error", "User not found");
            }
        } catch (error: any) {
            Alert.alert("Login Failed", error.message || "Something went wrong");
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormValues(prev => ({ ...prev, [field]: value }));
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



                    <InputField
                        placeholder="Enter your phone number"
                        keyboardType="phone-pad"
                        maxLength={10}
                        value={formValues.mobile}
                        onChangeText={(text) => handleChange('mobile', text)}
                        onFocus={() => clearError('mobile')}
                        error={errors.mobile}
                    />

                    <InputField
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        value={formValues.email}
                        onChangeText={(text) => handleChange('email', text)}
                        onFocus={() => clearError('email')}
                        error={errors.email}
                    />

                    <InputField
                        placeholder="Enter your name"
                        value={formValues.name}
                        onChangeText={(text) => handleChange('name', text)}
                        onFocus={() => clearError('name')}
                        error={errors.name}
                    />

                    <InputField
                        value={formValues.password}
                        placeholder="Enter password"
                        secureTextEntry
                        onChangeText={text => handleChange('password', text)}
                        onFocus={() => clearError('password')}
                        error={errors.password}
                    />

                    <InputField
                        value={formValues.confirmPassword}
                        placeholder="Enter confirm password"
                        secureTextEntry
                        onChangeText={text => handleChange('confirmPassword', text)}
                        onFocus={() => clearError('confirmPassword')}
                        error={errors.confirmPassword}
                    />

                    <TouchableOpacity style={styles.loginButton} onPress={() => handleRegistration(loginMethod)}>
                        <Text style={styles.loginButtonText}>Sign up</Text>
                    </TouchableOpacity>

                    <Text style={styles.orText}>or register with</Text>

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

export default RegisterScreen;
