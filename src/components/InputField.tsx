import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import styles from '../constants/Styles';
import AntDesign from '@react-native-vector-icons/ant-design';
import colors from '../constants/Colors';


interface InputFieldProps {
    value: string;
    placeholder: string;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    secureTextEntry?: boolean;
    onChangeText: (text: string) => void;
    onFocus?: () => void;
    error?: string;
    maxLength?: number;
}

const InputField: React.FC<InputFieldProps> = ({
    value,
    placeholder,
    keyboardType = 'default',
    secureTextEntry = false,
    onChangeText,
    onFocus,
    error,
    maxLength,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordField = secureTextEntry;

    return (
        <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
                <TextInput
                    value={value}
                    placeholderTextColor={colors.paragraph}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    secureTextEntry={isPasswordField && !showPassword}
                    onChangeText={onChangeText}
                    onFocus={onFocus}
                    maxLength={maxLength}
                    style={[styles.input, error && styles.inputError]}
                />
                {isPasswordField && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(prev => !prev)}
                        style={styles.eyeIcon}
                    >
                        <AntDesign
                            name={showPassword ? 'eye' : 'eye-invisible'}
                            size={20}
                            color={colors.paragraph}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.inputErrorText}>{error}</Text>}
        </View>
    );
};

export default InputField;
