import { StyleSheet } from 'react-native';
import colors from "../../constants/Colors";
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({

    scrollContainer: {
        padding: width * 0.1,
        flexGrow: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },

    illustration: {
        width: width * 0.6,
        height: width * 0.6,
        marginBottom: height * 0.03,
    },
    title: {
        fontSize: width * 0.05,
        fontWeight: '700',
        color: colors.title,
    },
    subtitle: {
        fontSize: width * 0.04,
        marginVertical: height * 0.01,
        color: '#555',
    },
    loginText: {
        color: colors.secondary,
        fontWeight: '600',
    },
    tabContainer: {
        flexDirection: 'row',
        marginVertical: height * 0.02,
        backgroundColor: colors.background,
        borderRadius: height * 0.02,
    },
    tabButton: {
        flex: 1,
        paddingVertical: height * 0.01,
        alignItems: 'center',
        borderRadius: height * 0.01,
    },
    activeTab: {
        backgroundColor: colors.background,
        elevation: 2,
    },
    tabText: {
        color: '#888',
    },
    activeTabText: {
        color: colors.title,
        fontWeight: '600',
    },
    input: {
        width: width * 0.8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: height * 0.01,
        paddingHorizontal: width * 0.02,
        paddingVertical: height * 0.02,
        marginBottom: height * 0.01,
    },

    passwordInput: {
        width: width * 0.8,
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.02,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: height * 0.01,
    },

    passwordInputWrapper: {
        position: 'relative',
        width: '100%',
        marginBottom: height * 0.02,
    },
    eyeIcon: {
        position: 'absolute',
        right: width * 0.02,
        top: width * 0.07,
        transform: [{ translateY: -12 }],
        color: colors.gray,

    },
    loginButton: {
        width: width * 0.8,
        backgroundColor: colors.primary,
        padding: height * 0.02,
        borderRadius: height * 0.01,
        alignItems: 'center',
        marginTop: height * 0.01,
    },
    loginButtonText: {
        color: colors.background,
        fontWeight: '600',
        fontSize: height * 0.02,
    },
    orText: {
        marginVertical: height * 0.02,
        color: '#888',
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
    bottomText: {
        fontSize: 14,
        color: colors.paragraph,
    },
    createAccount: {
        color: colors.secondary,
        fontWeight: '600',
    },
    errorText: {
        textAlign: 'left',
        alignSelf: 'flex-start',
        width: '100%',
        color: colors.red,
        marginBottom: height * 0.01,
        fontSize: width * 0.04,
    },
});
