import SwiftUI

struct HomeView: View {
    @Environment(CoinsManager.self) private var coinsManager

    @State private var searchText = ""
    @State private var sortOption: CoinSortOption = .name

    private var displayedCoins: [Coin] {
        coinsManager.coins.filteredAndSorted(searchText: searchText, sort: sortOption)
    }

    private var emptyMessage: String {
        searchText.isEmpty ? "Nothing to show yet." : "No coins match \"\(searchText)\"."
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                ScreenHeader(
                    title: "Home",
                    isOffline: coinsManager.isShowingCachedCoins,
                    offlineMessage: "Offline — showing last synced prices"
                )
                CoinSearchSortBar(searchText: $searchText, sortOption: $sortOption)
                LoadingErrorEmptyView(
                    loading: coinsManager.loading,
                    errorMessage: coinsManager.errorMessage,
                    isEmpty: displayedCoins.isEmpty,
                    emptyMessage: emptyMessage,
                    onRefresh: { await coinsManager.loadCoins() }
                ) {
                    List(displayedCoins) { coin in
                        NavigationLink(value: CoinDetailRoute(coinId: coin.coinId)) {
                            CoinRowView(coin: coin)
                        }
                        .listRowInsets(EdgeInsets(top: 0, leading: Theme.contentPadding, bottom: 0, trailing: Theme.contentPadding))
                    }
                    .listStyle(.plain)
                    .scrollContentBackground(.hidden)
                    .background(.background)
                    .refreshable {
                        await coinsManager.loadCoins()
                    }
                }
            }
            .toolbar(.hidden, for: .navigationBar)
            .navigationDestination(for: CoinDetailRoute.self) { route in
                CoinDetailView(coinId: route.coinId)
            }
            .task {
                await coinsManager.loadCoins()
            }
        }
    }
}

#Preview {
    HomeView()
        .environment(CoinsManager.preview)
}
