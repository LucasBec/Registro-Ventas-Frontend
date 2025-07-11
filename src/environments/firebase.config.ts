import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAKSMdKxTvwdIc1qfgpMW3yTptUo96ZO0w',
  authDomain: 'gestor-ventas-sosarepa.firebaseapp.com',
  projectId: 'gestor-ventas-sosarepa',
  storageBucket: 'gestor-ventas-sosarepa.firebasestorage.app',
  messagingSenderId: '119574079604',
  appId: '1:119574079604:web:2cf14245dae3875cd1c921',
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
