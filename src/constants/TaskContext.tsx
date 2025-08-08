import React, { createContext, useState, ReactNode } from 'react';

export type Task = {
    id: string;
    name: string;
    description: string;
    status?: string;
    dueDate?: any;
};

type TaskContextType = {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    selectedTask: Task | null;
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
};

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    return (
        <TaskContext.Provider value={{ tasks, setTasks, selectedTask, setSelectedTask }}>
            {children}
        </TaskContext.Provider>
    );
};
