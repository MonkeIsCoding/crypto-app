import SwiftUI

struct RootView: View {
    @Environment(AuthManager.self) private var authManager
    @Environment(WatchlistManager.self) private var watchlistManager
    @Environment(AlertsManager.self) private var alertsManager
    @Environment(\.scenePhase) private var scenePhase

    @AppStorage("themePreference") private var themePreference: ThemePreference = .system

    private static let alertPollInterval = Duration.seconds(60)

    var body: some View {
        Group {
            if authManager.initializing {
                ProgressView()
            } else if authManager.user != nil {
                MainTabView()
            } else {
                NavigationStack {
                    WelcomeView()
                }
            }
        }
        .task(id: authManager.user?.uid) {
            await watchlistManager.setUser(authManager.user?.uid)
            await alertsManager.setUser(authManager.user?.uid)

            guard authManager.user != nil else { return }
            while !Task.isCancelled {
                try? await Task.sleep(for: Self.alertPollInterval)
                guard !Task.isCancelled else { break }
                await alertsManager.loadAlerts()
            }
        }
        .onChange(of: scenePhase) {
            guard scenePhase == .active, authManager.user != nil else { return }
            Task { await alertsManager.loadAlerts() }
        }
        .preferredColorScheme(themePreference.colorScheme)
    }
}

#Preview {
    RootView()
        .environment(AuthManager.preview)
        .environment(WatchlistManager.preview)
        .environment(CoinsManager.preview)
        .environment(AlertsManager.preview)
}
