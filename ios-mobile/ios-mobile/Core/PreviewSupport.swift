import Foundation
import SwiftData

// Shared in-memory SwiftData container backing every SwiftUI preview so
// preview data never touches the real on-disk cache.
enum PreviewModelContainer {
    static let shared: ModelContainer = {
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        do {
            return try ModelContainer(for: CachedCoin.self, CachedAlert.self, CachedWatchlistItem.self, configurations: config)
        } catch {
            fatalError("Failed to create preview ModelContainer: \(error)")
        }
    }()
}

private struct PreviewAuthService: AuthService {
    var signedInUser: AppUser?

    var authStateChanges: AsyncStream<AppUser?> {
        AsyncStream { continuation in
            continuation.yield(signedInUser)
            continuation.finish()
        }
    }

    func login(email: String, password: String) async throws {}
    func register(email: String, password: String) async throws {}
    func logout() throws {}
    func resetPassword(email: String) async throws {}
    func deleteAccount() async throws {}
}

private struct PreviewCoinsService: RemoteCoinService {
    func fetchCoins() async throws -> [Coin] { [.mock] }
    func fetchCoin(id: String) async throws -> Coin { .mock }
}

private struct PreviewAlertsService: RemoteAlertService {
    func fetchAlerts() async throws -> [Alert] { [] }

    func createAlert(coinId: String, type: AlertType, targetPrice: Double) async throws -> Alert {
        Alert(id: UUID().uuidString, userId: "preview", coinId: coinId, type: type, targetPrice: targetPrice, triggered: false, createdAt: "", coin: nil)
    }

    func removeAlert(id: String) async throws {}
}

private struct PreviewWatchlistService: RemoteWatchlistService {
    func fetchWatchlist() async throws -> [WatchlistItem] { [] }

    func addToWatchlist(coinId: String) async throws {}

    func removeFromWatchlist(entryId: String) async throws {}
}

private struct PreviewNotificationService: NotificationService {
    func requestPermission() async {}
    func presentAlertTriggered(_ alert: Alert) async {}
}

extension AuthManager {
    static var preview: AuthManager {
        AuthManager(service: PreviewAuthService())
    }

    static var signedInPreview: AuthManager {
        let user = AppUser(uid: "preview", email: "franciscomaximo.sousa@my.istec.pt", emailVerified: false, createdAt: Date(timeIntervalSince1970: 1_752_580_800))
        return AuthManager(service: PreviewAuthService(signedInUser: user))
    }
}

extension CoinsManager {
    static var preview: CoinsManager {
        CoinsManager(service: PreviewCoinsService(), store: SwiftDataCoinPersistence(context: PreviewModelContainer.shared.mainContext))
    }
}

extension AlertsManager {
    static var preview: AlertsManager {
        AlertsManager(
            service: PreviewAlertsService(),
            store: SwiftDataAlertPersistence(context: PreviewModelContainer.shared.mainContext),
            notificationService: PreviewNotificationService()
        )
    }
}

extension WatchlistManager {
    static var preview: WatchlistManager {
        WatchlistManager(service: PreviewWatchlistService(), store: SwiftDataWatchlistPersistence(context: PreviewModelContainer.shared.mainContext))
    }
}
