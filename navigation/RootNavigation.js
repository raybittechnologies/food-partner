// navigation/RootNavigation.js
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

let pendingNavigation = null;

function routeExistsInState(name, state) {
  if (!state?.routes) return false;
  for (const route of state.routes) {
    if (route.name === name) return true;
    if (route.state && routeExistsInState(name, route.state)) return true;
  }
  return false;
}

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    const rootState = navigationRef.getRootState();
    if (routeExistsInState(name, rootState)) {
      navigationRef.navigate(name, params);
      return;
    }
  }
  console.log('⏳ Route not mounted yet, queuing:', name);
  pendingNavigation = { name, params };
  pollAndFlush();
}

function pollAndFlush(retries = 15) {
  if (!pendingNavigation) return;

  if (navigationRef.isReady()) {
    const rootState = navigationRef.getRootState();
    if (routeExistsInState(pendingNavigation.name, rootState)) {
      const { name, params } = pendingNavigation;
      pendingNavigation = null;
      navigationRef.navigate(name, params);
      return;
    }
  }

  if (retries > 0) {
    setTimeout(() => pollAndFlush(retries - 1), 400);
  } else {
    console.log('❌ Gave up, route never appeared:', pendingNavigation);
  }
}

export function flushPendingNavigation() {
  pollAndFlush();
}