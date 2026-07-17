import SwiftUI

struct SettingsView: View {
    @Environment(AuthManager.self) private var authManager
    @Environment(CoinsManager.self) private var coinsManager
    @Environment(WatchlistManager.self) private var watchlistManager
    @Environment(AlertsManager.self) private var alertsManager

    @AppStorage("themePreference") private var themePreference: ThemePreference = .system
    @AppStorage("alertNotificationsEnabled") private var notificationsEnabled = true

    @State private var clearingCache = false
    @State private var showDeleteConfirmation = false
    @State private var errorMessage: String?
    @State private var showError = false

    private var memberSince: String? {
        authManager.user?.createdAt?.formatted(date: .abbreviated, time: .omitted)
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                ScreenHeader(title: "Settings")
                ScrollView {
                    VStack(alignment: .leading, spacing: 0) {
                        accountSection
                        appearanceRow
                        notificationsRow

                        Button(clearingCache ? "Clearing…" : "Clear offline cache", action: clearCache)
                            .buttonStyle(.hairlineOutlined(color: .primary))
                            .frame(maxWidth: .infinity)
                            .disabled(clearingCache)
                            .padding(.top, Theme.sectionSpacing)

                        Button("Log out", role: .destructive, action: logout)
                            .buttonStyle(.hairlineOutlined(color: .negative))
                            .frame(maxWidth: .infinity)
                            .padding(.top, 12)

                        Button(authManager.deletingAccount ? "Deleting account…" : "Delete account", role: .destructive) {
                            showDeleteConfirmation = true
                        }
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(Color.negative)
                        .frame(maxWidth: .infinity)
                        .padding(.top, Theme.sectionSpacing)
                        .disabled(authManager.deletingAccount)
                    }
                    .padding(Theme.contentPadding)
                }
            }
            .toolbar(.hidden, for: .navigationBar)
            .alert(errorMessage ?? "", isPresented: $showError) {}
            .confirmationDialog(
                "Delete account",
                isPresented: $showDeleteConfirmation,
                titleVisibility: .visible
            ) {
                Button("Delete", role: .destructive, action: deleteAccount)
                Button("Cancel", role: .cancel) {}
            } message: {
                Text("This permanently deletes your account, watchlist, and alerts. This can't be undone.")
            }
        }
    }

    private var accountSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Signed in as")
                .font(.subheadline)
                .foregroundStyle(.secondary)
            Text(authManager.user?.email ?? "")
                .font(.title3.bold())

            if let user = authManager.user, !user.emailVerified {
                Label("Email not verified", systemImage: "exclamationmark.circle.fill")
                    .font(.caption.weight(.medium))
                    .foregroundStyle(.orange)
            }

            if let memberSince {
                Text("Member since \(memberSince)")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.bottom, Theme.sectionSpacing)
    }

    private var appearanceRow: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text("Appearance")
                    .font(.subheadline.weight(.semibold))
                Text("Light or dark theme")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Picker("Appearance", selection: $themePreference) {
                ForEach(ThemePreference.allCases) { preference in
                    Text(preference.label).tag(preference)
                }
            }
            .pickerStyle(.segmented)
            .fixedSize()
        }
        .padding(.vertical, 14)
        .overlay(alignment: .bottom) {
            Rectangle().fill(Theme.hairline).frame(height: 1)
        }
    }

    private var notificationsRow: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text("Alert notifications")
                    .font(.subheadline.weight(.semibold))
                Text("Push alerts when targets hit")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Toggle("Alert notifications", isOn: $notificationsEnabled)
                .labelsHidden()
        }
        .padding(.vertical, 14)
        .overlay(alignment: .bottom) {
            Rectangle().fill(Theme.hairline).frame(height: 1)
        }
    }

    private func logout() {
        do {
            try authManager.logout()
        } catch {
            present(error.localizedDescription)
        }
    }

    private func clearCache() {
        clearingCache = true
        coinsManager.clearLocalCache()
        watchlistManager.clearLocalCache()
        alertsManager.clearLocalCache()
        clearingCache = false
        present("Offline data has been cleared.")
    }

    private func deleteAccount() {
        Task {
            do {
                try await authManager.deleteAccount()
            } catch {
                present("Couldn't delete your account.")
            }
        }
    }

    private func present(_ message: String) {
        errorMessage = message
        showError = true
    }
}

#Preview {
    SettingsView()
        .environment(AuthManager.signedInPreview)
        .environment(CoinsManager.preview)
        .environment(WatchlistManager.preview)
        .environment(AlertsManager.preview)
}
