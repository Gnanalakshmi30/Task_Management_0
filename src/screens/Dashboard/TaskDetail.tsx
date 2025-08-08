import React, { useContext } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation } from '@react-navigation/native';
import styles from './Styles/taskDetailStyle';
import { TaskContext } from '../../constants/TaskContext';

const TaskDetail = () => {
    const taskContext = useContext(TaskContext);
    const navigation = useNavigation();

    if (!taskContext) {
        throw new Error('TaskDetail must be used within a TaskProvider');
    }

    const { selectedTask } = taskContext;

    if (!selectedTask) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Text>No task selected.</Text>
            </SafeAreaView>
        );
    }

    const formattedDueDate = selectedTask.dueDate?.seconds
        ? new Date(selectedTask.dueDate.seconds * 1000).toLocaleDateString()
        : selectedTask.dueDate || 'No due date';

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" />
            <View style={styles.appBar}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <FontAwesome name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Task Details</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.circle}>
                    <Text style={styles.circleText}>{selectedTask.id}</Text>
                </View>
                <View style={styles.cardTextContainer}>
                    <Text style={styles.title}>{selectedTask.name}</Text>
                    <Text style={styles.daysLeft}>Due: {formattedDueDate}</Text>
                    <Text style={styles.expiry}>Description: {selectedTask.description}</Text>
                    <Text style={styles.expiry}>Status: {selectedTask.status}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default TaskDetail;
