import Foundation

nonisolated struct PriceHistoryPoint: Codable, Equatable {
    let timestamp: String
    let price: Double
}

nonisolated struct Coin: Codable, Identifiable, Equatable {
    let coinId: String
    let name: String
    let symbol: String
    let price: Double
    let priceChange24h: Double
    let marketCap: Double
    let lastUpdated: String
    let priceHistory: [PriceHistoryPoint]

    var id: String { coinId }

    enum CodingKeys: String, CodingKey {
        case coinId = "coin_id"
        case name
        case symbol
        case price
        case priceChange24h = "price_change_24h"
        case marketCap = "market_cap"
        case lastUpdated = "last_updated"
        case priceHistory = "price_history"
    }
}
