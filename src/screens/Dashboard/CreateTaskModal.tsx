import React, { useEffect, useState } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './modalStyle';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import firestore, { addDoc, collection, serverTimestamp } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { getTaskSchema } from '../../schemas/TaskSchema';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { database } from "../../utils/FirebaseConfig";
import { isConnected } from '../../utils/NetworkService';
import { saveTaskOffline } from '../../utils/localStorage';


interface TaskModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    taskName: string;
    setTaskName: (name: string) => void;
    taskDesc: string;
    setTaskDesc: (desc: string) => void;
    taskDate: Date | null;
    setTaskDate: (date: Date | null) => void;
    showDatePicker: boolean;
    setShowDatePicker: (show: boolean) => void;
    handleSubmit: () => void;
    clearForm: () => void;
}

const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const TaskModal: React.FC<TaskModalProps> = ({
    modalVisible,
    setModalVisible,
    taskName,
    setTaskName,
    taskDesc,
    setTaskDesc,
    taskDate,
    setTaskDate,
    showDatePicker,
    setShowDatePicker,
    handleSubmit,
    clearForm,
}) => {

    const submitTaskToFirestore = async () => {

        try {
            const online = await isConnected();
            const payload = {
                title: 'Sample Task',
                description: 'This is a test task',
                userId: "6789",
                createdAt: firestore.FieldValue.serverTimestamp(),
            }
            if (online) {

                await firestore().collection('tasks').add(payload);
                Alert.alert('Success', 'Task created successfully');
                clearForm();
                setModalVisible(false);
            } else {
                await saveTaskOffline(payload);
            }

        } catch (error: any) {
            if (error.name === 'ValidationError') {
                const messages = error.inner.map((e: any) => e.message).join('\n');
                Alert.alert('Validation Error', messages);
            } else {
                console.error('Firestore error:', error);
                Alert.alert('Error', 'Something went wrong while saving task');
            }
        }
    };


    return (
        <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Create Task</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <FontAwesome name="close" size={24} color="grey" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        placeholder="Task Name"
                        value={taskName}
                        onChangeText={setTaskName}
                        style={[styles.input, { height: 80 }]}
                    />

                    <TextInput
                        placeholder="Task Description"
                        value={taskDesc}
                        onChangeText={setTaskDesc}
                        multiline
                        style={[styles.input, { height: 80 }]}
                    />

                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                        <Text style={{ color: taskDate ? 'black' : '#aaa' }}> {taskDate ? formatDate(taskDate) : 'Select Date'}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={taskDate || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    setTaskDate(selectedDate);
                                }
                            }}
                        />
                    )}

                    <View style={styles.buttonRow}>
                        <View style={styles.buttonWrapper}>
                            <Button title="Submit" onPress={submitTaskToFirestore} />
                        </View>
                        <View style={styles.buttonWrapper}>
                            <Button title="Clear" onPress={clearForm} color="gray" />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};


export default TaskModal;
