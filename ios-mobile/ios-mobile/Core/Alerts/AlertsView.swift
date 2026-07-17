import SwiftUI

struct AlertsView: View {
    @Environment(AlertsManager.self) private var alertsManager

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                ScreenHeader(
                    title: "Alerts",
                    isOffline: alertsManager.isShowingCachedAlerts,
                    offlineMessage: "Offline — showing last synced alerts"
                )
                LoadingErrorEmptyView(
                    loading: alertsManager.loading && alertsManager.alerts.isEmpty,
                    errorMessage: alertsManager.errorMessage,
                    isEmpty: alertsManager.alerts.isEmpty,
                    emptyMessage: "No alerts yet. Create one from a coin's detail page.",
                    onRefresh: { await alertsManager.loadAlerts() }
                ) {
                    List(alertsManager.alerts) { alert in
                        HStack {
                            VStack(alignment: .leading, spacing: Theme.rowSpacing) {
                                Text(alert.coin?.name ?? alert.coinId.capitalized)
                                    .font(.body.bold())
                                Text("\(alert.type == .above ? "Above" : "Below") \(alert.targetPrice.formatted(.currency(code: "USD")))")
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                                    .tabularNumbers()
                            }
                            Spacer()
                            PillBadge(status: alert.triggered ? .triggered : .watching)
                        }
                        .padding(.vertical, 10)
                        .listRowInsets(EdgeInsets(top: 0, leading: Theme.contentPadding, bottom: 0, trailing: Theme.contentPadding))
                        .listRowSeparatorTint(Theme.hairline)
                        .swipeActions {
                            Button("Delete", systemImage: "trash", role: .destructive) {
                                delete(alert)
                            }
                        }
                    }
                    .listStyle(.plain)
                    .scrollContentBackground(.hidden)
                    .background(.background)
                    .refreshable {
                        await alertsManager.loadAlerts()
                    }
                }
            }
            .toolbar(.hidden, for: .navigationBar)
            .task {
                await alertsManager.loadAlerts()
            }
        }
    }

    private func delete(_ alert: Alert) {
        Task {
            await alertsManager.removeAlert(alert)
        }
    }
}

#Preview {
    AlertsView()
        .environment(AlertsManager.preview)
}
