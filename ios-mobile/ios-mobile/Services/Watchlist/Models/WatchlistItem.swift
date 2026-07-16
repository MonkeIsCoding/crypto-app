import Foundation

nonisolated struct WatchlistItem: Codable, Identifiable, Equatable {
    let id: String
    let userId: String
    let coinId: String
    let addedAt: String

    let coin: Coin?

    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case coinId = "coin_id"
        case addedAt = "added_at"
        case coin
    }
}
