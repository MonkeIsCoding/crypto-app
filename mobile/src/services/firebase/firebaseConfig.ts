import { initializeApp, getApps } from "firebase/app";
import { initializeAuth } from "firebase/auth";
// firebase/auth's typings are a single universal .d.ts that omits RN-only exports,
// even though the package re-exports @firebase/auth's actual React Native build at
// runtime (Metro resolves the "react-native" condition there, unlike this typings file).
// @ts-expect-error — getReactNativePersistence exists at runtime but not in these typings.
import { getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { env } from "../../config/env";

const app = getApps().length === 0 ? initializeApp(env.firebase) : getApps()[0];

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
