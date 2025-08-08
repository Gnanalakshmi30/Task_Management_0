import { StyleSheet } from "react-native";
import colors from "../../../constants/Colors";
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#000000aa',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalContent: {
        margin: 20,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
        padding: 8,
    },

    dateInput: {
        width: width * 0.8,
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: height * 0.01,
        paddingHorizontal: width * 0.02,
        paddingVertical: height * 0.02,
        marginBottom: height * 0.01,
    },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    buttonWrapper: {
        marginLeft: 10,
    },
});

export default styles;