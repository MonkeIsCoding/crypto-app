import Constants from "expo-constants";

interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface AppExtra {
  apiBaseUrl: string;
  firebase: FirebaseWebConfig;
}

const extra = (Constants.expoConfig?.extra ?? {}) as Partial<AppExtra>;

export const env = {
  apiBaseUrl: extra.apiBaseUrl ?? "http://localhost:3000",
  firebase: extra.firebase ?? {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  },
};
