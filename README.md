# Task Management App

## Project Overview
This Task Management App enables users to efficiently organize and track their daily tasks. It features user authentication, task creation, update, deletion, and a calendar view for better visualization. The app integrates with Firebase Firestore for real-time data storage and supports offline usage with AsyncStorage, syncing data when connectivity is restored. Users receive local push notifications for pending tasks on their due dates if matches the current date.

---

## Features Implemented
- Splash screen for smooth app startup
- User registration and login with email/password authentication
- Create, update, and delete tasks with detailed descriptions and due dates
- Calendar view showing tasks mapped to specific dates
- Local push notifications reminding users of pending tasks
- Offline data caching with AsyncStorage and automatic sync with Firestore
- Real-time updates using Firestore’s snapshot listeners

---

## Tech Stack Used
- **React Native** (CLI)
- **Firebase Firestore** for backend database
- **AsyncStorage** for offline data persistence
- **React Native Push Notifications** for local reminders
- **React Native Calendars** for calendar UI
- **React Navigation** for screen navigation
- TypeScript
- **useContext** for managing tasks(State Management)

## Software Requirement
Node version: 20.18.1

--- 

## App Store Publishing Instructions

https://github.com/Gnanalakshmi30/Task_Management_0/blob/main/App_Store_Publishing_Instructions.docx

## Screenshots / Demo

https://github.com/Gnanalakshmi30/Task_Management_0/tree/main/Screenshots
---

##  Screen Recording link
1. https://drive.google.com/file/d/1zCtLlsVnKOssb-8JbSAa28lRdUwzKfTg/view?usp=sharing
2. https://drive.google.com/file/d/1Zkd1CeI1tMwNLglurb_3FdAiszJYmIUw/view?usp=sharing
3. https://drive.google.com/file/d/1TAvrgEdJ4ITwlj5zz400sjy2fBHV-6hT/view?usp=sharing
4. https://drive.google.com/file/d/1QH4VuDOdpdjP_ugt-VMOWRR1GS70Opgs/view?usp=sharing


## How to Run the App

### 1. Clone the repository
```bash
git clone <https://github.com/Gnanalakshmi30/Task_Management_0>

### 2. Switch to project directory
cd <repository-folder>

### 3. Perform npm install
npm install

### 4. Run the application
To run in android: npx react-native run-android
To run in iOS: npx react-native run-android


