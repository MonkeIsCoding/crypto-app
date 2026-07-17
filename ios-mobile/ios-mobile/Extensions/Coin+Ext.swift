import Foundation

extension Coin {
    var formattedMarketCap: String {
        marketCap.formatted(.currency(code: "USD").notation(.compactName))
    }

    var formattedLastUpdated: String {
        guard let date = Date(iso8601: lastUpdated) else { return lastUpdated }
        return date.formatted(
            .dateTime.month(.abbreviated).day().hour(.twoDigits(amPM: .omitted)).minute(.twoDigits)
        )
    }

    var chartLabels: [String] {
        guard !priceHistory.isEmpty else { return ["now"] }
        return priceHistory.map { point in
            guard let date = Date(iso8601: point.timestamp) else { return "" }
            return date.formatted(.dateTime.weekday(.abbreviated))
        }
    }

    var chartPrices: [Double] {
        priceHistory.isEmpty ? [price] : priceHistory.map(\.price)
    }
}

extension Coin {
    static let mock = Coin(
        coinId: "bitcoin",
        name: "Bitcoin",
        symbol: "btc",
        price: 62_476,
        priceChange24h: -0.22,
        marketCap: 1_254_176_847_154,
        lastUpdated: "2026-07-06T12:00:59.334Z",
        priceHistory: [
            PriceHistoryPoint(timestamp: "2026-06-30T12:00:00.000Z", price: 64_120),
            PriceHistoryPoint(timestamp: "2026-07-01T12:00:00.000Z", price: 63_780),
            PriceHistoryPoint(timestamp: "2026-07-02T12:00:00.000Z", price: 64_510),
            PriceHistoryPoint(timestamp: "2026-07-03T12:00:00.000Z", price: 63_205),
            PriceHistoryPoint(timestamp: "2026-07-04T12:00:00.000Z", price: 62_940),
            PriceHistoryPoint(timestamp: "2026-07-05T12:00:00.000Z", price: 63_310),
            PriceHistoryPoint(timestamp: "2026-07-06T12:00:00.000Z", price: 62_476)
        ]
    )
}
