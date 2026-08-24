/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';


notifee.createChannel({
  id: 'default',
  name: 'Default Notifications',
  importance: AndroidImportance.HIGH,
  sound: 'default',
});

// ─────────────────────────────────────────────
// Display Notification via Notifee
// ─────────────────────────────────────────────
async function onDisplayNotification(remoteMessage) {
  await notifee.displayNotification({
    title: remoteMessage?.data?.title || remoteMessage?.notification?.title || 'Notification',
    body: remoteMessage?.data?.body || remoteMessage?.notification?.body || 'You have a new message',
    android: {
      channelId: 'default',
      smallIcon: 'ic_launcher_round',
      largeIcon: 'ic_launcher_round',
      pressAction: { id: 'default' },
      sound: 'default',
    },
  });
}

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  console.log('🔔 Notifee background event:', type, pressAction?.id);

  if (type === EventType.PRESS) {
    // User tapped the notification body
    console.log('🔔 Notification pressed:', notification?.id);
    await notifee.cancelNotification(notification.id);
  }

  if (type === EventType.ACTION_PRESS) {
    // User tapped an action button
    console.log('🔔 Action pressed:', pressAction?.id);
    await notifee.cancelNotification(notification.id);
  }

  if (type === EventType.DISMISSED) {
    // User dismissed the notification
    console.log('🔔 Notification dismissed:', notification?.id);
  }
});


messaging().onMessage(async remoteMessage => {
  console.log('📨 Foreground FCM:', remoteMessage);
  await onDisplayNotification(remoteMessage);
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📨 Background FCM:', remoteMessage);
  await onDisplayNotification(remoteMessage);
});


AppRegistry.registerComponent(appName, () => App);
