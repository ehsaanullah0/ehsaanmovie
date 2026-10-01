import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {registerSW} from 'virtual:pwa-register';

// Register service worker immediately for offline readiness
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('App update available');
  },
  onOfflineReady() {
    console.log('App is ready for full offline use');
  },
});

createRoot(document.getElementById('root')!).render(<App />);

