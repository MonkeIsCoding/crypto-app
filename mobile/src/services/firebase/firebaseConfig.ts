import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { env } from "../../config/env";

// Firebase JS SDK auto-persists auth state via AsyncStorage on React Native
// when @react-native-async-storage/async-storage is installed (v11+).
const app = getApps().length === 0 ? initializeApp(env.firebase) : getApps()[0];

export const auth = getAuth(app);
