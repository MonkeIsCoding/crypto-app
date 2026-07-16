import Foundation
import SwiftData

@MainActor
final class SwiftDataCoinPersistence: LocalCoinPersistence {
    private let context: ModelContext

    init(context: ModelContext) {
        self.context = context
    }

    func replaceAll(with coins: [Coin]) throws {
        for cached in try context.fetch(FetchDescriptor<CachedCoin>()) {
            context.delete(cached)
        }
        for coin in coins {
            context.insert(CachedCoin(coin: coin))
        }
        try context.save()
    }

    func fetchAll() throws -> [Coin] {
        let descriptor = FetchDescriptor<CachedCoin>(sortBy: [SortDescriptor(\.name)])
        return try context.fetch(descriptor).map(\.asCoin)
    }

    func fetch(coinId: String) throws -> Coin? {
        var descriptor = FetchDescriptor<CachedCoin>(predicate: #Predicate { $0.coinId == coinId })
        descriptor.fetchLimit = 1
        return try context.fetch(descriptor).first?.asCoin
    }
}
