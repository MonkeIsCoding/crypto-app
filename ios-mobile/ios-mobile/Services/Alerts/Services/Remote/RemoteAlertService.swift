import Foundation

protocol RemoteAlertService {
    func fetchAlerts() async throws -> [Alert]
    func createAlert(coinId: String, type: AlertType, targetPrice: Double) async throws -> Alert
    func removeAlert(id: String) async throws
}
