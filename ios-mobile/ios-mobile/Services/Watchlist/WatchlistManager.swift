import Foundation

@Observable
@MainActor
final class WatchlistManager {
    private let service: RemoteWatchlistService
    private let store: LocalWatchlistPersistence

    private(set) var items: [WatchlistItem] = []
    private(set) var loading = true
    private(set) var errorMessage: String?
    private(set) var isShowingCachedItems = false

    private var userId: String?

    init(service: RemoteWatchlistService, store: LocalWatchlistPersistence) {
        self.service = service
        self.store = store
    }

    /// Called whenever the signed-in user changes (including sign-out).
    func setUser(_ userId: String?) async {
        self.userId = userId
        guard userId != nil else {
            items = []
            loading = false
            return
        }
        loading = true
        await refresh()
    }

    func refresh() async {
        guard let userId else { return }
        loading = items.isEmpty
        errorMessage = nil
        do {
            let fetched = try await service.fetchWatchlist()
            items = fetched
            isShowingCachedItems = false
            try? store.replaceAll(with: fetched, userId: userId)
        } catch {
            if let cached = try? store.fetchAll(userId: userId), !cached.isEmpty {
                items = cached
                isShowingCachedItems = true
            } else {
                items = []
                isShowingCachedItems = false
                errorMessage = "Couldn't load your watchlist."
            }
        }
        loading = false
    }

    func isWatchlisted(_ coinId: String) -> Bool {
        items.contains { $0.coinId == coinId }
    }

    func toggle(_ coinId: String) async throws {
        if isWatchlisted(coinId) {
            try await removeCoin(coinId)
        } else {
            try await addCoin(coinId)
        }
    }

    func addCoin(_ coinId: String) async throws {
        guard userId != nil else { return }
        try await service.addToWatchlist(coinId: coinId)
        await refresh()
    }

    func removeCoin(_ coinId: String) async throws {
        guard let entryId = items.first(where: { $0.coinId == coinId })?.id else { return }
        try await service.removeFromWatchlist(entryId: entryId)
        await refresh()
    }

    func clearLocalCache() {
        guard let userId else { return }
        try? store.replaceAll(with: [], userId: userId)
        items = []
        isShowingCachedItems = false
    }
}
