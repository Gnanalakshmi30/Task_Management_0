import { StyleSheet } from "react-native";
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import colors from "../constants/Colors";


const styles = StyleSheet.create({
    inputContainer: { marginBottom: 10 },
    input: {
        width: width * 0.8,
        borderWidth: 1,
        borderColor: colors.borderColor,
        borderRadius: height * 0.01,
        paddingHorizontal: width * 0.02,
        paddingVertical: height * 0.02,
        marginBottom: height * 0.01,
    },
    inputError: {
        borderColor: colors.red,
    },
    inputErrorText: {
        textAlign: 'left',
        alignSelf: 'flex-start',
        width: '100%',
        color: colors.red,
        marginBottom: height * 0.01,
        fontSize: width * 0.04,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        padding: 5,
        zIndex: 1,
    },

    button: {
        width: width * 0.8,
        backgroundColor: colors.primary,
        padding: height * 0.02,
        borderRadius: height * 0.01,
        alignItems: 'center',
        marginTop: height * 0.01,
    },
    buttonText: {
        color: colors.background,
        fontWeight: '600',
        fontSize: height * 0.02,
    },

    socialContainer: {
        flexDirection: 'row',
        gap: width * 0.01,
        marginBottom: height * 0.01,
    },
    socialButton: {
        backgroundColor: '#F5F5F5',
        padding: height * 0.01,
        borderRadius: width * 0.01,
    },
    socialIcon: {
        width: height * 0.04,
        height: height * 0.04,
    },


});
export default styles;
