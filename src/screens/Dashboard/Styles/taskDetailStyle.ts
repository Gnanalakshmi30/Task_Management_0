import { Platform, StatusBar, StyleSheet } from "react-native";
import colors from "../../../constants/Colors";

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    appBar: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56 + (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0),
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        elevation: 4,
    },
    backButton: {
        paddingRight: 16,
        paddingVertical: 8,
        justifyContent: 'center',
    },
    appBarTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    circle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    circleText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18,
    },
    cardTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    daysLeft: {
        fontSize: 14,
        color: '#555',
    },
    expiry: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
});

export default styles;