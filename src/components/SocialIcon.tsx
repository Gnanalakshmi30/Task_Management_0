import React from 'react';
import { TouchableOpacity, Image, GestureResponderEvent, ViewStyle, ImageStyle, View } from 'react-native';
import styles from '../constants/Styles';

interface Props {
    onPress: (event: GestureResponderEvent) => void;
    iconSource: any;
    style?: ViewStyle;
    iconStyle?: ImageStyle;
}

const SocialLoginButton: React.FC<Props> = ({ onPress, iconSource, style, iconStyle }) => {
    return (
        <View style={styles.socialContainer}>
            <TouchableOpacity style={[styles.socialButton, style]} onPress={onPress}>
                <Image source={iconSource} style={[styles.socialIcon, iconStyle]} />
            </TouchableOpacity>
        </View>
    );
};

export default SocialLoginButton;
