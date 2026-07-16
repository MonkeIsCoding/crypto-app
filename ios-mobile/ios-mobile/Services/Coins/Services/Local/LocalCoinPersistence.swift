import Foundation

@MainActor
protocol LocalCoinPersistence {
    func replaceAll(with coins: [Coin]) throws
    func fetchAll() throws -> [Coin]
    func fetch(coinId: String) throws -> Coin?
}
