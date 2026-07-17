import Foundation

@Observable
@MainActor
final class CoinsManager {
    private let service: RemoteCoinService
    private let store: LocalCoinPersistence

    private(set) var coins: [Coin] = []
    private(set) var loading = true
    private(set) var errorMessage: String?
    private(set) var isShowingCachedCoins = false

    private(set) var selectedCoin: Coin?
    private(set) var detailLoading = true
    private(set) var detailErrorMessage: String?
    private(set) var isShowingCachedDetail = false

    init(service: RemoteCoinService, store: LocalCoinPersistence) {
        self.service = service
        self.store = store
    }

    func loadCoins() async {
        loading = coins.isEmpty
        errorMessage = nil
        do {
            let fetched = try await service.fetchCoins()
            coins = fetched
            isShowingCachedCoins = false
            try? store.replaceAll(with: fetched)
        } catch {
            if let cached = try? store.fetchAll(), !cached.isEmpty {
                coins = cached
                isShowingCachedCoins = true
            } else {
                coins = []
                isShowingCachedCoins = false
                errorMessage = "Couldn't load coins. Pull to retry."
            }
        }
        loading = false
    }

    func loadCoin(id: String) async {
        selectedCoin = nil
        detailLoading = true
        detailErrorMessage = nil
        do {
            selectedCoin = try await service.fetchCoin(id: id)
            isShowingCachedDetail = false
        } catch {
            if let cached = try? store.fetch(coinId: id) {
                selectedCoin = cached
                isShowingCachedDetail = true
            } else {
                detailErrorMessage = "Couldn't load this coin."
            }
        }
        detailLoading = false
    }

    func clearLocalCache() {
        try? store.replaceAll(with: [])
        coins = []
        isShowingCachedCoins = false
    }
}
