import * as Notifications from "expo-notifications";
import { Alert } from "../../models/Alert";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;
  const { status: requested } = await Notifications.requestPermissionsAsync();
  return requested === "granted";
}

function coinLabel(coinId: string) {
  return coinId.charAt(0).toUpperCase() + coinId.slice(1);
}

export async function presentAlertTriggeredNotification(alert: Alert): Promise<void> {
  const direction = alert.type === "above" ? "risen above" : "fallen below";
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${coinLabel(alert.coin_id)} alert triggered`,
      body: `Price has ${direction} $${alert.target_price.toLocaleString()}.`,
    },
    trigger: null,
  });
}
