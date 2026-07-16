import Foundation
import SwiftData

@MainActor
final class SwiftDataAlertPersistence: LocalAlertPersistence {
    private let context: ModelContext

    init(context: ModelContext) {
        self.context = context
    }

    func replaceAll(with alerts: [Alert], userId: String) throws {
        let existing = try context.fetch(FetchDescriptor<CachedAlert>(predicate: #Predicate { $0.userId == userId }))
        for cached in existing {
            context.delete(cached)
        }
        for alert in alerts {
            context.insert(CachedAlert(alert: alert))
        }
        try context.save()
    }

    func fetchAll(userId: String) throws -> [Alert] {
        let descriptor = FetchDescriptor<CachedAlert>(
            predicate: #Predicate { $0.userId == userId },
            sortBy: [SortDescriptor(\.createdAt, order: .reverse)]
        )
        return try context.fetch(descriptor).map(\.asAlert)
    }
}
