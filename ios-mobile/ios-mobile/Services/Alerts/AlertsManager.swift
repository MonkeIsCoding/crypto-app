import Foundation

@Observable
@MainActor
final class AlertsManager {
    private let service: RemoteAlertService
    private let store: LocalAlertPersistence
    private let notificationService: NotificationService
    private let notificationsEnabled: () -> Bool

    private(set) var alerts: [Alert] = []
    private(set) var loading = true
    private(set) var errorMessage: String?
    private(set) var isShowingCachedAlerts = false

    private(set) var creatingAlert = false
    private(set) var creationErrorMessage: String?

    private var userId: String?
    // nil until the first fetch of a session, so alerts already triggered
    // before the app opened don't fire a notification on that first load.
    private var seenTriggeredIds: Set<String>?

    init(
        service: RemoteAlertService,
        store: LocalAlertPersistence,
        notificationService: NotificationService,
        notificationsEnabled: @escaping () -> Bool = {
            UserDefaults.standard.object(forKey: "alertNotificationsEnabled") as? Bool ?? true
        }
    ) {
        self.service = service
        self.store = store
        self.notificationService = notificationService
        self.notificationsEnabled = notificationsEnabled
    }

    // Called whenever the signed-in user changes (including sign-out).
    func setUser(_ userId: String?) async {
        self.userId = userId
        seenTriggeredIds = nil
        guard userId != nil else {
            alerts = []
            loading = false
            return
        }
        await notificationService.requestPermission()
        await loadAlerts()
    }

    func loadAlerts() async {
        guard let userId else { return }
        loading = alerts.isEmpty
        errorMessage = nil
        do {
            let fetched = try await service.fetchAlerts()
            await notifyNewlyTriggered(in: fetched)
            alerts = fetched
            isShowingCachedAlerts = false
            try? store.replaceAll(with: fetched, userId: userId)
        } catch {
            if let cached = try? store.fetchAll(userId: userId), !cached.isEmpty {
                alerts = cached
                isShowingCachedAlerts = true
            } else {
                alerts = []
                isShowingCachedAlerts = false
                errorMessage = "Couldn't load alerts."
            }
        }
        loading = false
    }

    private func notifyNewlyTriggered(in fetched: [Alert]) async {
        let newlyTriggered = seenTriggeredIds.map { seen in
            fetched.filter { $0.triggered && !seen.contains($0.id) }
        } ?? []
        seenTriggeredIds = Set(fetched.filter(\.triggered).map(\.id))

        guard notificationsEnabled() else { return }
        for alert in newlyTriggered {
            await notificationService.presentAlertTriggered(alert)
        }
    }

    @discardableResult
    func createAlert(coinId: String, type: AlertType, targetPrice: Double, coin: Coin? = nil) async -> Bool {
        guard let userId else { return false }
        creatingAlert = true
        creationErrorMessage = nil
        defer { creatingAlert = false }
        do {
            var created = try await service.createAlert(coinId: coinId, type: type, targetPrice: targetPrice)
            if created.coin == nil, let coin {
                created.coin = coin
            }
            alerts.insert(created, at: 0)
            try? store.replaceAll(with: alerts, userId: userId)
            return true
        } catch {
            creationErrorMessage = "Couldn't create alert."
            return false
        }
    }

    func removeAlert(_ alert: Alert) async {
        alerts.removeAll { $0.id == alert.id }
        seenTriggeredIds?.remove(alert.id)
        do {
            try await service.removeAlert(id: alert.id)
            try? store.replaceAll(with: alerts, userId: alert.userId)
        } catch {
            await loadAlerts()
        }
    }

    func clearLocalCache() {
        guard let userId else { return }
        try? store.replaceAll(with: [], userId: userId)
        alerts = []
        isShowingCachedAlerts = false
    }
}
