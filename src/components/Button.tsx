import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import styles from '../constants/Styles';


interface ButtonProps {
    title: string;
    onPress: () => void;
    backgroundColor?: string;
    style?: ViewStyle;
}

const CustomButton: React.FC<ButtonProps> = ({ title, onPress, style }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

export default CustomButton;


