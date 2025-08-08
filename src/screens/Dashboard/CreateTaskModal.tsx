import React from 'react';
import { View, Modal, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './Styles/modalStyle';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { taskSchema } from '../../schemas/TaskSchema';
import InputField from '../../components/InputField';
import { useFormValidator } from '../../customHooks/useFormValidator';
import CustomButton from '../../components/Button';
import { createTask, updateTask } from '../../services/AuthService';


interface TaskModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    taskName: string;
    setTaskName: (name: string) => void;
    taskDesc: string;
    setTaskId: (name: string) => void;
    taskId: string;
    setTaskDesc: (desc: string) => void;
    taskStatus: string;
    setTaskStatus: (desc: string) => void;
    taskDate: Date | null;
    setTaskDate: (date: Date | null) => void;
    showDatePicker: boolean;
    setShowDatePicker: (show: boolean) => void;
    handleSubmit: () => void;
    clearForm: () => void;
    operationMethod: 'create' | 'update';
    selectedTask: any | null;
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
    taskId,
    setTaskId,
    taskDesc,
    setTaskDesc,
    taskStatus,
    setTaskStatus,
    taskDate,
    setTaskDate,
    showDatePicker,
    setShowDatePicker,
    handleSubmit,
    clearForm,
    operationMethod,
    selectedTask,
}) => {

    type formFields = {
        id?: string;
        name: string;
        description: string;
        status: string;
        dueDate: string;
        operationMethod: string;
    };

    const { errors, validate, clearError } = useFormValidator<formFields>(taskSchema);

    const submitTaskToFirestore = async () => {
        try {
            const formValues: formFields = {
                name: taskName,
                description: taskDesc,
                status: taskStatus,
                dueDate: taskDate?.toString() ?? "",
                operationMethod,
                ...(operationMethod === 'update' && selectedTask?.id ? { id: selectedTask.id } : {}),
            };

            const isValid = await validate(formValues);
            if (!isValid) {
                return;
            }

            const payload = {
                name: taskName,
                description: taskDesc,
                status: taskStatus,
                dueDate: taskDate,
            };

            let response;

            if (operationMethod === 'create') {
                response = await createTask(payload);
            } else if (operationMethod === 'update' && selectedTask?.id) {
                response = await updateTask(selectedTask.id, payload);
            }

            if (!response?.message) {
                Alert.alert("Error", response?.message ?? "Try again later");
                return;
            }

            clearForm();
            setModalVisible(false);

        } catch (error: any) {
        }
    };

    return (
        <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {operationMethod === 'create' ? 'Create Task' : 'Edit Task'}
                        </Text>
                        <TouchableOpacity onPress={() => {
                            clearForm();
                            return setModalVisible(false);
                        }}>
                            <FontAwesome name="close" size={24} color="grey" />
                        </TouchableOpacity>
                    </View>
                    <InputField
                        placeholder="Task Name"
                        value={taskName}
                        onChangeText={setTaskName}
                        error={errors.name}
                        onFocus={() => clearError('name')}
                    />

                    <InputField
                        placeholder="Task Description"
                        value={taskDesc}
                        onChangeText={setTaskDesc}
                        error={errors.description}
                    />
                    <InputField
                        placeholder="Task Status"
                        value={taskStatus}
                        onChangeText={setTaskStatus}
                        error={errors.status}
                        onFocus={() => clearError('status')}
                    />

                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                        <Text style={{ color: taskDate ? 'black' : '#aaa' }}>
                            {taskDate ? formatDate(taskDate) : 'Select due date'}
                        </Text>
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

                    <CustomButton title="Submit" onPress={submitTaskToFirestore} />
                </View>
            </View>
        </Modal>
    );
};

export default TaskModal;
