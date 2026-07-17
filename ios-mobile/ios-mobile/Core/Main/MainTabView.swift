import SwiftUI

struct MainTabView: View {
    var body: some View {
        TabView {
            Tab("Home", systemImage: "house") {
                HomeView()
            }
            Tab("Watchlist", systemImage: "star") {
                WatchlistView()
            }
            Tab("Alerts", systemImage: "bell") {
                AlertsView()
            }
            Tab("Settings", systemImage: "gearshape") {
                SettingsView()
            }
        }
    }
}

#Preview {
    MainTabView()
        .environment(AuthManager.signedInPreview)
        .environment(WatchlistManager.preview)
        .environment(CoinsManager.preview)
        .environment(AlertsManager.preview)
}
