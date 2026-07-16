import Foundation
import SwiftData

@Model
final class CachedWatchlistItem {
    #Unique<CachedWatchlistItem>([\.id])

    var id: String
    var userId: String
    var coinId: String
    var addedAt: String

    @Attribute(.externalStorage) private var coinData: Data?

    var coin: Coin? {
        coinData.flatMap { try? JSONDecoder().decode(Coin.self, from: $0) }
    }

    init(item: WatchlistItem) {
        id = item.id
        userId = item.userId
        coinId = item.coinId
        addedAt = item.addedAt
        coinData = item.coin.flatMap { try? JSONEncoder().encode($0) }
    }

    var asWatchlistItem: WatchlistItem {
        WatchlistItem(id: id, userId: userId, coinId: coinId, addedAt: addedAt, coin: coin)
    }
}
