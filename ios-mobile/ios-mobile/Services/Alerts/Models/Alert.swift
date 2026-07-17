import Foundation

nonisolated enum AlertType: String, Codable, Equatable {
    case above
    case below
}

nonisolated struct Alert: Codable, Identifiable, Equatable {
    let id: String
    let userId: String
    let coinId: String
    let type: AlertType
    let targetPrice: Double
    let triggered: Bool
    let createdAt: String

    var coin: Coin?

    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case coinId = "coin_id"
        case type
        case targetPrice = "target_price"
        case triggered
        case createdAt = "created_at"
        case coin
    }
}
