import Foundation

protocol NotificationService {
    func requestPermission() async
    func presentAlertTriggered(_ alert: Alert) async
}
