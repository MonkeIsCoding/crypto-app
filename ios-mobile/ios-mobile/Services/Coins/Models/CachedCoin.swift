import Foundation
import SwiftData

@Model
final class CachedCoin {
    #Unique<CachedCoin>([\.coinId])

    var coinId: String
    var name: String
    var symbol: String
    var price: Double
    var priceChange24h: Double
    var marketCap: Double
    var lastUpdated: String

    // Saved as JSON because SwiftData crashes when storing [PriceHistoryPoint] directly.
    @Attribute(.externalStorage) private var priceHistoryData: Data = Data()

    var priceHistory: [PriceHistoryPoint] {
        (try? JSONDecoder().decode([PriceHistoryPoint].self, from: priceHistoryData)) ?? []
    }

    init(coin: Coin) {
        coinId = coin.coinId
        name = coin.name
        symbol = coin.symbol
        price = coin.price
        priceChange24h = coin.priceChange24h
        marketCap = coin.marketCap
        lastUpdated = coin.lastUpdated
        priceHistoryData = (try? JSONEncoder().encode(coin.priceHistory)) ?? Data()
    }

    var asCoin: Coin {
        Coin(
            coinId: coinId,
            name: name,
            symbol: symbol,
            price: price,
            priceChange24h: priceChange24h,
            marketCap: marketCap,
            lastUpdated: lastUpdated,
            priceHistory: priceHistory
        )
    }
}
