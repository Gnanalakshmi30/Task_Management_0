import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import AntDesign from '@react-native-vector-icons/ant-design';
import TaskModal from '../CreateTaskModal';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import NetInfo from '@react-native-community/netinfo';
import { clearOfflineTasks, getOfflineTasks } from '../../../utils/localStorage';
import { isConnected } from '../../../utils/NetworkService';



const TaskCard = ({ title, description, time }: any) => (
    <LinearGradient colors={['#DDA5F6', '#B486F1']} style={styles.taskCard}>
        <Text style={styles.taskTitle}>{title}</Text>
        <Text style={styles.taskDesc}>{description}</Text>
        <Text style={styles.taskTime}>{time}</Text>
    </LinearGradient>
);

export default function TaskDashboard() {
    const [selectedTab, setSelectedTab] = useState<'active' | 'done'>('active');
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [modalVisible, setModalVisible] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskDate, setTaskDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});


    const handleSubmit = () => {
        console.log('Task submitted:', taskName, taskDesc, taskDate);
        clearForm();
        setModalVisible(false);
    };

    const clearForm = () => {
        setTaskName('');
        setTaskDesc('');
        setTaskDate(null);
    };


    useEffect(() => {
        getTasks()
        getName()
    }, []);

    const getName = async () => {
        const user = await AsyncStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setUserName(parsedUser?.name ?? '');
        }
    }

    const getTasks = async () => {
        const online = await isConnected();

        if (online) {
            firestore()
                .collection('tasks')
                .onSnapshot(async querySnapshot => {
                    const fetchedTasks: any[] = [];
                    const marks: { [key: string]: any } = {};

                    querySnapshot.forEach(documentSnapshot => {
                        const data = documentSnapshot.data();
                        const task = {
                            ...data,
                            id: documentSnapshot.id,
                        };
                        fetchedTasks.push(task);

                        const dueDate =
                            (task as any).createdAt && (task as any).createdAt.seconds
                                ? new Date((task as any).createdAt.seconds * 1000).toISOString().split('T')[0]
                                : null;


                        if (dueDate) {
                            marks[dueDate] = {
                                marked: true,
                                dotColor: '#B486F1',
                                selectedColor: '#B486F1',
                            };
                        }
                    });
                    console.log("fetchedTasks", fetchedTasks);



                    setTasks(fetchedTasks);
                    setMarkedDates(marks);
                    setLoading(false);
                    await AsyncStorage.setItem('offlineTasks', JSON.stringify(fetchedTasks));
                }, error => {
                    console.error('Error fetching tasks:', error);
                });

        } else {
            const offline = await getOfflineTasks();
            setTasks(offline);

            const marks: { [key: string]: any } = {};
            offline.forEach(task => {
                const dueDate =
                    task.createdAt && task.createdAt.seconds
                        ? new Date(task.createdAt.seconds * 1000).toISOString().split('T')[0]
                        : null;

                if (dueDate) {
                    marks[dueDate] = {
                        marked: true,
                        dotColor: '#B486F1',
                        selectedColor: '#B486F1',
                    };
                }
            });

            setMarkedDates(marks);
            setLoading(false);
        }
    };


    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(async state => {
            if (state.isConnected && state.isInternetReachable) {
                const offlineTasks = await getOfflineTasks();

                for (const task of offlineTasks) {
                    const snapshot = await firestore()
                        .collection('tasks')
                        .where('taskId', '==', task.taskId)
                        .get();

                    if (snapshot.empty) {
                        await firestore().collection('tasks').add(task);
                    } else {
                        console.log(`Task ${task.taskId} already exists. Skipping...`);
                    }
                }

                await clearOfflineTasks();
            }
        });

        return () => unsubscribe();
    }, []);


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
                            source={require('../../../../assets/images/profile_image.png')}
                            style={styles.profile}
                        />
                        <TouchableOpacity style={styles.createTaskButton} onPress={() => setModalVisible(true)} >
                            <AntDesign name="plus" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Calendar */}
                <Calendar
                    onDayPress={(day) => {
                        setSelectedDate(day.dateString);
                    }}
                    markedDates={{
                        ...markedDates,
                        [selectedDate]: {
                            ...(markedDates[selectedDate] || {}),
                            selected: true,
                            selectedColor: '#B486F1',
                        }
                    }}
                    theme={{
                        selectedDayBackgroundColor: '#B486F1',
                        todayTextColor: '#00adf5',
                        arrowColor: '#B486F1',
                        textSectionTitleColor: '#444',
                        selectedDayTextColor: '#fff',
                        monthTextColor: '#000',
                    }}
                    style={{ marginBottom: 20 }}
                />


                <TaskModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    taskName={taskName}
                    setTaskName={setTaskName}
                    taskDesc={taskDesc}
                    setTaskDesc={setTaskDesc}
                    taskDate={taskDate}
                    setTaskDate={setTaskDate}
                    showDatePicker={showDatePicker}
                    setShowDatePicker={setShowDatePicker}
                    handleSubmit={handleSubmit}
                    clearForm={clearForm}
                />



                {loading ? (
                    <Text style={{ textAlign: 'center', marginVertical: 20 }}>Loading tasks...</Text>
                ) : tasks.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginVertical: 20 }}>No tasks found.</Text>
                ) : (
                    tasks
                        .filter(task => {
                            const createdAtDate = task.createdAt && task.createdAt.seconds
                                ? new Date(task.createdAt.seconds * 1000).toISOString().split('T')[0]
                                : null;
                            return createdAtDate === selectedDate;
                        })
                        .map((task) => (
                            <TaskCard
                                key={task.id || task.taskId}
                                title={task.name}
                                description={task.description}
                                time={
                                    task.dueDate
                                        ? new Date(task.dueDate.seconds * 1000).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })
                                        : 'No Time'
                                }
                            />
                        ))
                )}

            </ScrollView>
        </SafeAreaView>


    );
}
