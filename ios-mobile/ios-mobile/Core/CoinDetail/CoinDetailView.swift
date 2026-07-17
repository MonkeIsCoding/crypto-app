import SwiftUI

struct CoinDetailView: View {
    let coinId: String

    @Environment(WatchlistManager.self) private var watchlistManager
    @Environment(CoinsManager.self) private var coinsManager
    @Environment(AlertsManager.self) private var alertsManager

    @State private var previewCoin: Coin?
    @State private var togglingWatchlist = false

    @State private var alertType: AlertType = .above
    @State private var targetPrice: Double?
    @State private var infoMessage: String?
    @State private var showInfoAlert = false

    init(coinId: String) {
        self.coinId = coinId
    }

    init(previewCoin: Coin) {
        self.coinId = previewCoin.coinId
        _previewCoin = State(initialValue: previewCoin)
    }

    private var isWatchlisted: Bool {
        watchlistManager.isWatchlisted(coinId)
    }

    private var coin: Coin? {
        previewCoin ?? coinsManager.selectedCoin
    }

    private var loading: Bool {
        previewCoin == nil && coinsManager.detailLoading
    }

    private var errorMessage: String? {
        previewCoin == nil ? coinsManager.detailErrorMessage : nil
    }

    var body: some View {
        LoadingErrorEmptyView(
            loading: loading,
            errorMessage: errorMessage,
            isEmpty: coin == nil,
            onRefresh: {
                guard previewCoin == nil else { return }
                await coinsManager.loadCoin(id: coinId)
            }
        ) {
            if let coin {
                ScrollView {
                    VStack(alignment: .leading, spacing: Theme.sectionSpacing) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("\(coin.name) · \(coin.symbol.uppercased())")
                                .font(.subheadline)
                                .foregroundStyle(.secondary)

                            Text(coin.price, format: .currency(code: "USD"))
                                .font(.largeTitle.bold())
                                .tabularNumbers()

                            Text("\(coin.priceChange24h >= 0 ? "+" : "")\(coin.priceChange24h, specifier: "%.2f")% Today")
                                .font(.subheadline.weight(.semibold))
                                .tabularNumbers()
                                .foregroundStyle(Color.priceChange(coin.priceChange24h))
                        }

                        PriceChartView(labels: coin.chartLabels, prices: coin.chartPrices)

                        VStack(spacing: 0) {
                            StatRow(label: "Market cap", value: coin.formattedMarketCap)
                            StatRow(label: "Last updated", value: coin.formattedLastUpdated)
                        }

                        WatchlistToggleButton(isWatchlisted: isWatchlisted, isToggling: togglingWatchlist, action: toggleWatchlist)

                        VStack(alignment: .leading, spacing: 16) {
                            Text("Create alert")
                                .font(.headline)

                            AlertTypeToggle(selection: $alertType)

                            TextField("Target price (USD)", value: $targetPrice, format: .number)
                                .keyboardType(.decimalPad)
                                .hairlineField()

                            Button(alertsManager.creatingAlert ? "Creating…" : "Create alert", action: createAlert)
                                .buttonStyle(.filledCapsule)
                                .frame(maxWidth: .infinity)
                                .disabled(alertsManager.creatingAlert)
                        }
                    }
                    .padding(Theme.contentPadding)
                }
            }
        }
        .navigationTitle(coin?.name ?? "Coin")
        .navigationBarTitleDisplayMode(.inline)
        .task(id: coinId) {
            guard previewCoin == nil else { return }
            await coinsManager.loadCoin(id: coinId)
        }
        .alert(infoMessage ?? "", isPresented: $showInfoAlert) {}
    }

    private func toggleWatchlist() {
        togglingWatchlist = true
        let removing = isWatchlisted
        Task {
            defer { togglingWatchlist = false }
            do {
                try await watchlistManager.toggle(coinId)
            } catch {
                infoMessage = "Couldn't \(removing ? "remove from" : "add to") watchlist."
                showInfoAlert = true
            }
        }
    }

    private func createAlert() {
        guard let targetPrice, targetPrice > 0 else {
            infoMessage = "Enter a positive target price."
            showInfoAlert = true
            return
        }
        Task {
            if await alertsManager.createAlert(coinId: coinId, type: alertType, targetPrice: targetPrice, coin: coin) {
                infoMessage = "You'll be notified when \(coinId) goes \(alertType.rawValue) \(targetPrice.formatted(.currency(code: "USD")))."
                self.targetPrice = nil
            } else {
                infoMessage = alertsManager.creationErrorMessage
            }
            showInfoAlert = true
        }
    }
}

#Preview {
    NavigationStack {
        CoinDetailView(previewCoin: .mock)
            .environment(WatchlistManager.preview)
            .environment(CoinsManager.preview)
            .environment(AlertsManager.preview)
    }
}
