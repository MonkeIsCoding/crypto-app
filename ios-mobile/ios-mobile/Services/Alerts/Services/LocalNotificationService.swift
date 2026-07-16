import Foundation
import UserNotifications

// Shows banners from alert polling while the app is open.
final class LocalNotificationService: NSObject, NotificationService, UNUserNotificationCenterDelegate {
    override init() {
        super.init()
        UNUserNotificationCenter.current().delegate = self
    }

    func requestPermission() async {
        _ = try? await UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound])
    }

    func presentAlertTriggered(_ alert: Alert) async {
        let direction = alert.type == .above ? "risen above" : "fallen below"
        let coinLabel = alert.coin?.name ?? alert.coinId.capitalized

        let content = UNMutableNotificationContent()
        content.title = "\(coinLabel) alert triggered"
        content.body = "Price has \(direction) \(alert.targetPrice.formatted(.currency(code: "USD")))."

        let request = UNNotificationRequest(identifier: alert.id, content: content, trigger: nil)
        try? await UNUserNotificationCenter.current().add(request)
    }

    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        completionHandler([.banner, .list])
    }
}
