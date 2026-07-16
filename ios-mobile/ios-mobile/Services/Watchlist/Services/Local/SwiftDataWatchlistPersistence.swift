import Foundation
import SwiftData

@MainActor
final class SwiftDataWatchlistPersistence: LocalWatchlistPersistence {
    private let context: ModelContext

    init(context: ModelContext) {
        self.context = context
    }

    func replaceAll(with items: [WatchlistItem], userId: String) throws {
        let existing = try context.fetch(FetchDescriptor<CachedWatchlistItem>(predicate: #Predicate { $0.userId == userId }))
        for cached in existing {
            context.delete(cached)
        }
        for item in items {
            context.insert(CachedWatchlistItem(item: item))
        }
        try context.save()
    }

    func fetchAll(userId: String) throws -> [WatchlistItem] {
        let descriptor = FetchDescriptor<CachedWatchlistItem>(
            predicate: #Predicate { $0.userId == userId },
            sortBy: [SortDescriptor(\.addedAt, order: .reverse)]
        )
        return try context.fetch(descriptor).map(\.asWatchlistItem)
    }
}
