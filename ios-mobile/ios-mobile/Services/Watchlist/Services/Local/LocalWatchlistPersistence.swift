import Foundation

@MainActor
protocol LocalWatchlistPersistence {
    func replaceAll(with items: [WatchlistItem], userId: String) throws
    func fetchAll(userId: String) throws -> [WatchlistItem]
}
