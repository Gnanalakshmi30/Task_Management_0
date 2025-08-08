import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    createTaskButton: {
        marginLeft: 12,
    },
    todayText: { fontSize: 14, color: '#999' },
    username: { fontSize: 20, fontWeight: 'bold' },
    profile: { width: 40, height: 40, borderRadius: 20 },

    calendarScroll: { marginVertical: 16 },
    calendarItem: {
        alignItems: 'center',
        padding: 10,
        marginRight: 10,
        borderRadius: 12,
    },
    activeCalendarItem: {
        backgroundColor: '#F4E3FF',
    },
    calendarDay: { color: '#999' },
    calendarDate: { fontWeight: 'bold', fontSize: 16 },
    activeDay: { color: '#000' },
    activeDate: { color: '#000' },

    tabBar: {
        flexDirection: 'row',
        marginBottom: 16,
        backgroundColor: '#F2F2F2',
        borderRadius: 12,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#4CAF50',
    },
    tabText: { color: '#fff' },

    taskCard: {
        borderRadius: 20,
        padding: 16,
        marginVertical: 8,
    },
    taskTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
    taskDesc: { fontSize: 14, color: '#f9f9f9', marginVertical: 4 },
    taskTime: { fontSize: 12, color: '#eee', marginTop: 8 },
    popupMenu: {
        position: 'absolute',
        top: 40,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        paddingVertical: 5,
        minWidth: 150,
        zIndex: 1001,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    menuText: {
        fontSize: 16,
        color: '#333',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 1000,
    },
});


export default styles;