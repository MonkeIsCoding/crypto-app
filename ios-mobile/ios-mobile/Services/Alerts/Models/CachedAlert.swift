import Foundation
import SwiftData

@Model
final class CachedAlert {
    #Unique<CachedAlert>([\.id])

    var id: String
    var userId: String
    var coinId: String
    var type: AlertType
    var targetPrice: Double
    var triggered: Bool
    var createdAt: String

    @Attribute(.externalStorage) private var coinData: Data?

    var coin: Coin? {
        coinData.flatMap { try? JSONDecoder().decode(Coin.self, from: $0) }
    }

    init(alert: Alert) {
        id = alert.id
        userId = alert.userId
        coinId = alert.coinId
        type = alert.type
        targetPrice = alert.targetPrice
        triggered = alert.triggered
        createdAt = alert.createdAt
        coinData = alert.coin.flatMap { try? JSONEncoder().encode($0) }
    }

    var asAlert: Alert {
        Alert(
            id: id,
            userId: userId,
            coinId: coinId,
            type: type,
            targetPrice: targetPrice,
            triggered: triggered,
            createdAt: createdAt,
            coin: coin
        )
    }
}
