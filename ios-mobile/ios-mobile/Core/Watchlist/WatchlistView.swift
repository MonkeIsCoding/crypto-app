import SwiftUI

struct WatchlistView: View {
    @Environment(WatchlistManager.self) private var watchlistManager

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                ScreenHeader(
                    title: "Watchlist",
                    isOffline: watchlistManager.isShowingCachedItems,
                    offlineMessage: "Offline — showing last synced watchlist"
                )
                LoadingErrorEmptyView(
                    loading: watchlistManager.loading && watchlistManager.items.isEmpty,
                    errorMessage: watchlistManager.errorMessage,
                    isEmpty: watchlistManager.items.isEmpty,
                    emptyMessage: "Your watchlist is empty. Add coins from Home.",
                    onRefresh: { await watchlistManager.refresh() }
                ) {
                    List(watchlistManager.items) { item in
                        if let coin = item.coin {
                            NavigationLink(value: CoinDetailRoute(coinId: item.coinId)) {
                                CoinRowView(coin: coin)
                            }
                            .listRowInsets(EdgeInsets(top: 0, leading: Theme.contentPadding, bottom: 0, trailing: Theme.contentPadding))
                        }
                    }
                    .listStyle(.plain)
                    .scrollContentBackground(.hidden)
                    .background(.background)
                    .refreshable {
                        await watchlistManager.refresh()
                    }
                }
            }
            .toolbar(.hidden, for: .navigationBar)
            .navigationDestination(for: CoinDetailRoute.self) { route in
                CoinDetailView(coinId: route.coinId)
            }
            .task {
                await watchlistManager.refresh()
            }
        }
    }
}

#Preview {
    WatchlistView()
        .environment(WatchlistManager.preview)
}
