import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './Styles/style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import AntDesign from '@react-native-vector-icons/ant-design';
import TaskModal from './CreateTaskModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { clearOfflineTasks, logoutUser } from '../../utils/localStorage';
import { isConnected } from '../../utils/NetworkService';
import { useNavigation } from '@react-navigation/native';
import colors from '../../constants/Colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { TaskContext } from '../../constants/TaskContext';
import { deleteTask, getTasks, listenAndSyncOfflineTasks } from '../../services/AuthService';
import PushNotification from 'react-native-push-notification';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskDashboard'>;

export default function TaskDashboard() {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const taskContext = useContext(TaskContext);
    if (!taskContext) {
        throw new Error('TaskDashboard must be used within a TaskProvider');
    }
    const { setSelectedTask } = taskContext;

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [modalVisible, setModalVisible] = useState(false);

    const [taskName, setTaskName] = useState('');
    const [taskId, setTaskId] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskDate, setTaskDate] = useState<Date | null>(null);
    const [taskStatus, setTaskStatus] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [operationMethod, setOperationMethod] = useState<'create' | 'update'>('create');
    const [selectedTaskLocal, setSelectedTaskLocal] = useState<any | null>(null);

    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
    const [menuVisible, setMenuVisible] = useState(false);
    const closeMenu = () => setMenuVisible(false);


    const TaskCard = ({ title, description, status, time, onEdit, onDelete }: any) => (
        <LinearGradient colors={[colors.secondary, colors.gray]} style={styles.taskCard}>
            <Text style={styles.taskTitle}>{title}</Text>
            <Text style={styles.taskDesc}>{description}</Text>
            <Text style={styles.taskTime}>{time}</Text>
            <Text style={styles.taskTitle}>Status: {status}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                <TouchableOpacity onPress={onEdit} style={{ marginRight: 20 }}>
                    <AntDesign name="edit" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete}>
                    <AntDesign name="delete" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );

    const clearForm = () => {
        setTaskName('');
        setTaskDesc('');
        setTaskStatus('');
        setTaskDate(null);
        setSelectedTaskLocal(null);
        setOperationMethod('create');
    };

    const handleSubmit = () => {
        clearForm();
        setModalVisible(false);
        setSelectedTask(null);
    };

    useEffect(() => {
        let unsubscribeFn: (() => void) | null = null;

        (async () => {
            unsubscribeFn = await getTasks(
                (fetchedTasks, marks) => {
                    setTasks(fetchedTasks);
                    setMarkedDates(marks);
                    setLoading(false);

                    if (fetchedTasks.length > 0) {
                        console.log("fetched", fetchedTasks.length);
                        setTimeout(() => {
                            console.log("timeout");

                            PushNotification.localNotification({
                                channelId: "task-alerts",
                                title: "Task alert",
                                message: `You have ${fetchedTasks.length} task${fetchedTasks.length > 1 ? 's' : ''}.`,
                                playSound: true,
                                soundName: 'default',
                                importance: 'high',
                                vibrate: true,
                            });
                        }, 1000);
                    }
                },
                (error) => {
                    console.error('Error fetching tasks:', error);
                    setLoading(false);
                }
            );
        })();

        getName();
        const unsubscribeSync = listenAndSyncOfflineTasks();

        return () => {
            if (unsubscribeFn) {
                unsubscribeFn();
            }
            if (unsubscribeSync) {
                unsubscribeSync();
            }
        };
    }, []);

    const getName = async () => {
        const user = await AsyncStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setUserName(parsedUser?.name ?? '');
        }
    };

    const openCreateModal = () => {

        clearForm();
        setOperationMethod('create');
        setModalVisible(true);
    };

    const handleEditTask = (task: any) => {
        setTaskId(task.taskId);
        setTaskName(task.name);
        setTaskDesc(task.description);
        setTaskStatus(task.status);
        setTaskDate(task.dueDate ? new Date(task.dueDate.seconds * 1000) : null);
        setSelectedTaskLocal(task);
        setOperationMethod('update');
        setModalVisible(true);
    };

    const handleDeleteTask = async (taskId: string) => {
        const result = await deleteTask(taskId);
        if (result.status === 'success') {
            setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
        } else {
            console.error('Failed to delete task:', result.message);
        }
    };

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.todayText}>Today’s {new Date().toLocaleDateString('en-US', { weekday: 'long' })}</Text>
                        <Text style={styles.username}>{userName}</Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <Image
                            source={require('../../../assets/images/profile_image.png')}
                            style={styles.profile}
                        />
                        <TouchableOpacity style={styles.createTaskButton} onPress={openCreateModal} >
                            <AntDesign name="plus" size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setMenuVisible(prev => !prev)}>
                            <AntDesign name="more" size={20} color="#000" />
                        </TouchableOpacity>

                        {menuVisible && (
                            <>
                                <TouchableWithoutFeedback onPress={closeMenu}>
                                    <View style={styles.backdrop} />
                                </TouchableWithoutFeedback>

                                <View style={styles.popupMenu}>
                                    <TouchableOpacity
                                        style={styles.menuItem}
                                        onPress={() => {
                                            closeMenu();
                                            logoutUser(navigation);
                                        }}
                                    >
                                        <Text style={styles.menuText}>Logout</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>

                <Calendar
                    onDayPress={(day) => {
                        setSelectedDate(day.dateString);
                    }}
                    markedDates={{
                        ...markedDates,
                        [selectedDate]: {
                            ...(markedDates[selectedDate] || {}),
                            selected: true,
                            selectedColor: colors.primary,
                        }
                    }}
                    theme={{
                        selectedDayBackgroundColor: colors.primary,
                        todayTextColor: colors.secondary,
                        arrowColor: colors.primary,
                        textSectionTitleColor: colors.gray,
                        selectedDayTextColor: colors.white,
                        monthTextColor: colors.black,
                    }}
                    style={{ marginBottom: 20 }}
                />


                <TaskModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    taskName={taskName}
                    setTaskName={setTaskName}
                    setTaskId={setTaskId}
                    taskId={taskId}
                    taskDesc={taskDesc}
                    setTaskDesc={setTaskDesc}
                    taskStatus={taskStatus}
                    setTaskStatus={setTaskStatus}
                    taskDate={taskDate}
                    setTaskDate={setTaskDate}
                    showDatePicker={showDatePicker}
                    setShowDatePicker={setShowDatePicker}
                    handleSubmit={handleSubmit}
                    clearForm={clearForm}
                    operationMethod={operationMethod}
                    selectedTask={selectedTaskLocal}
                />

                {loading ? (
                    <Text style={{ textAlign: 'center', marginVertical: 20 }}>Loading tasks...</Text>
                ) : tasks.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginVertical: 20 }}>No tasks found.</Text>
                ) : (
                    tasks
                        .filter(task => {
                            const dueDate = task.dueDate && task.dueDate.seconds
                                ? new Date(task.dueDate.seconds * 1000).toISOString().split('T')[0]
                                : null;
                            return dueDate === selectedDate;
                        })
                        .map((task) => (
                            <TouchableOpacity
                                key={task.id || task.taskId}
                                onPress={() => {
                                    setSelectedTask(task);
                                    return navigation.navigate('TaskDetail');
                                }}
                                activeOpacity={0.7}
                            >
                                <TaskCard
                                    title={task.name}
                                    description={task.description}
                                    status={task.status}
                                    time={
                                        task.dueDate
                                            ? new Date(task.dueDate.seconds * 1000).toLocaleString([], {
                                                year: 'numeric',
                                                month: 'short',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })
                                            : 'No Date & Time'
                                    }
                                    onEdit={() => handleEditTask(task)}
                                    onDelete={() => handleDeleteTask(task.id)}
                                />
                            </TouchableOpacity>
                        ))
                )}

            </ScrollView>
        </SafeAreaView>
    );
}
