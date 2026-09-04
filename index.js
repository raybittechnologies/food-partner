

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { navigate } from './navigation/RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';


notifee.createChannel({
  id: 'default',
  name: 'Default Notifications',
  importance: AndroidImportance.HIGH,
  sound: 'default',
});

async function onDisplayNotification(remoteMessage) {
  await notifee.displayNotification({
    title: remoteMessage?.data?.title || remoteMessage?.notification?.title || 'New Delivery Request',
    body: remoteMessage?.data?.body || remoteMessage?.notification?.body || 'You have a new order.',
    data: remoteMessage?.data,
    android: {
      channelId: 'default',
      smallIcon: 'ic_launcher_round',
      largeIcon: 'ic_launcher_round',
      pressAction: { id: 'default' },
      sound: 'default',
      actions: [
        { title: 'Accept', pressAction: { id: 'accept', launchActivity: 'default' },},
        { title: 'Reject', pressAction: { id: 'reject' } },
      ],
    },
      ios: {
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
      sound: 'default',
      categoryId: 'default', // only if you've registered iOS categories for Accept/Reject actions
    },
  });
}

// FCM data payloads are string-only — if your backend sends the full
function parseOrderFromNotificationData(data) {
  const raw = data?.orderDetails ?? data?.order;
  if (!raw) return null;
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch (e) {
    console.log('⚠️ Failed to parse order payload:', e);
    return null;
  }
}

async function openOrderRequest(data) {
  const orderDetails = parseOrderFromNotificationData(data);
  console.log('📨 Storing pending order request:', orderDetails);

  try {
    await AsyncStorage.setItem('pendingOrderRequest', JSON.stringify(orderDetails));
  } catch (e) {
    console.log('⚠️ Failed to store pending order:', e);
  }

  // Still attempt direct navigation too — covers foreground/background
  // cases where the tree already exists, so nothing regresses there.
  navigate('order-request', { data: orderDetails });
}

async function handleNotificationAction(pressActionId, notification) {
  switch (pressActionId) {
    case 'accept':
    case 'default':
      openOrderRequest(notification?.data);
      console.log('✅ Accepted from notification:')
      break;
    case 'reject':
      console.log('❌ Rejected from notification:', notification?.data);
      // TODO: direct decline API call if you want reject to skip opening the app
      break;
  }

  if (notification?.id) {
    await notifee.cancelNotification(notification.id);
  }
}

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  console.log('🔔 Notifee background event:', type, pressAction?.id);

  if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
    await handleNotificationAction(pressAction?.id, notification);
  }
  if (type === EventType.DISMISSED) {
    console.log('🔔 Notification dismissed:', notification?.id);
  }
});

notifee.onForegroundEvent(({ type, detail }) => {
  console.log('🔔 Notifee foreground event:', type, detail);
  const { notification, pressAction } = detail;
  console.log('🔔 Notifee foreground event:', type, pressAction?.id);

  if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
    handleNotificationAction(pressAction?.id, notification);
  }
  if (type === EventType.DISMISSED) {
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
