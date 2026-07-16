import Foundation

private struct AddToWatchlistBody: Encodable {
    let coinId: String
}

struct WatchlistAPIService: RemoteWatchlistService {
    private let client: APIClient

    init(client: APIClient = .shared) {
        self.client = client
    }

    func fetchWatchlist() async throws -> [WatchlistItem] {
        try await client.get("/watchlist")
    }

    func addToWatchlist(coinId: String) async throws {
        let _: WatchlistItem = try await client.post("/watchlist", body: AddToWatchlistBody(coinId: coinId))
    }

    func removeFromWatchlist(entryId: String) async throws {
        try await client.delete("/watchlist/\(entryId)")
    }
}
