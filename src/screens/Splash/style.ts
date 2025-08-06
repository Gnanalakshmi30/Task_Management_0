import { StyleSheet } from "react-native";
import colors from "../../constants/colors";
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    image: {
        width: width * 0.8,
        height: width * 0.8,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.title,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.title,
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: colors.paragraph,
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 12,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 5,
    },
    secondaryButton: {
        flex: 1,
        borderColor: colors.primary,
        borderWidth: 1.5,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 5,
    },
    primaryText: {
        color: colors.background,
        fontWeight: '600',
    },
    secondaryText: {
        color: colors.primary,
        fontWeight: '600',
    },
});
