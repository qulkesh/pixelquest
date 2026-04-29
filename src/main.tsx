import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { useAuthStore } from './store/useAuthStore';
import { startProfilePushSubscription } from './lib/profileSync';
import { startAchievementSubscriber } from './lib/achievementsSubscriber';

useAuthStore.getState().init();
startProfilePushSubscription();
startAchievementSubscriber();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
