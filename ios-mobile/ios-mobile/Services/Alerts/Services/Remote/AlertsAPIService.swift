import Foundation

private struct CreateAlertBody: Encodable {
    let coinId: String
    let type: AlertType
    let targetPrice: Double
}

struct AlertsAPIService: RemoteAlertService {
    private let client: APIClient

    init(client: APIClient = .shared) {
        self.client = client
    }

    func fetchAlerts() async throws -> [Alert] {
        try await client.get("/alerts")
    }

    func createAlert(coinId: String, type: AlertType, targetPrice: Double) async throws -> Alert {
        try await client.post("/alerts", body: CreateAlertBody(coinId: coinId, type: type, targetPrice: targetPrice))
    }

    func removeAlert(id: String) async throws {
        try await client.delete("/alerts/\(id)")
    }
}
