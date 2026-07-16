import Foundation

@MainActor
protocol LocalAlertPersistence {
    func replaceAll(with alerts: [Alert], userId: String) throws
    func fetchAll(userId: String) throws -> [Alert]
}
