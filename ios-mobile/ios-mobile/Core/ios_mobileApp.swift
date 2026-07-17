//
//  ios_mobileApp.swift
//  ios-mobile
//
//  Created by Kiko on 07/07/2026.
//

import SwiftUI
import SwiftData
import FirebaseCore

@main
struct ios_mobileApp: App {
    // register app delegate for Firebase setup
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate

    let modelContainer: ModelContainer

    @State private var authManager: AuthManager
    @State private var watchlistManager: WatchlistManager
    @State private var coinsManager: CoinsManager
    @State private var alertsManager: AlertsManager

    init() {
        FirebaseApp.configure()
        
        do {
            modelContainer = try ModelContainer(for: CachedCoin.self, CachedAlert.self, CachedWatchlistItem.self)
        } catch {
            fatalError("Failed to create ModelContainer: \(error)")
        }
        
        authManager = .init(service: FirebaseAuthService())
        coinsManager = .init(service: CoinsAPIService(), store: SwiftDataCoinPersistence(context: modelContainer.mainContext))
        watchlistManager = .init(service: WatchlistAPIService(), store: SwiftDataWatchlistPersistence(context: modelContainer.mainContext))
        alertsManager = .init(service: AlertsAPIService(), store: SwiftDataAlertPersistence(context: modelContainer.mainContext), notificationService: LocalNotificationService())
    }

    var body: some Scene {
      WindowGroup {
        RootView()
          .environment(authManager)
          .environment(watchlistManager)
          .environment(coinsManager)
          .environment(alertsManager)
      }
    }
}

// Per Firebase instructions
class AppDelegate: NSObject, UIApplicationDelegate {
  func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    return true
  }
}
