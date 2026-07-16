import Foundation

protocol RemoteCoinService {
    func fetchCoins() async throws -> [Coin]
    func fetchCoin(id: String) async throws -> Coin
}
