import Foundation

struct CoinsAPIService: RemoteCoinService {
    private let client: APIClient

    init(client: APIClient = .shared) {
        self.client = client
    }

    func fetchCoins() async throws -> [Coin] {
        try await client.get("/coins")
    }

    func fetchCoin(id: String) async throws -> Coin {
        try await client.get("/coins/\(id)")
    }
}
