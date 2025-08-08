import React, { useEffect } from 'react';
import PushNotification from 'react-native-push-notification';
import AppNavigator from './src/navigation/AppNavigator';
import { Platform } from 'react-native';
import { pushNotificationChannelRegistration } from './src/utils/FirebaseConfig';

export default function App() {
  useEffect(() => {
    pushNotificationChannelRegistration();
  }, []);

  return <AppNavigator />;
}
