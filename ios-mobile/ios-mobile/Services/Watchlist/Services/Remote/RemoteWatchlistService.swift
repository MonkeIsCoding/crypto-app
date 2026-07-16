import Foundation

protocol RemoteWatchlistService {
    func fetchWatchlist() async throws -> [WatchlistItem]
    func addToWatchlist(coinId: String) async throws
    func removeFromWatchlist(entryId: String) async throws
}
