import SwiftUI

struct LoadingErrorEmptyView<Content: View>: View {
    let loading: Bool
    let errorMessage: String?
    let isEmpty: Bool
    var emptyMessage: String = "Nothing to show yet."
    let onRefresh: () async -> Void
    @ViewBuilder var content: () -> Content

    var body: some View {
        if loading {
            ProgressView()
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        } else if let errorMessage {
            unavailable(icon: "exclamationmark.triangle", title: "Something went wrong", message: errorMessage)
        } else if isEmpty {
            unavailable(icon: "tray", title: "Nothing here yet", message: emptyMessage)
        } else {
            content()
        }
    }

    private func unavailable(icon: String, title: String, message: String) -> some View {
        ScrollView {
            ContentUnavailableView {
                Label(title, systemImage: icon)
            } description: {
                Text(message)
            }
            .containerRelativeFrame(.vertical)
        }
        .refreshable { await onRefresh() }
    }
}

#Preview("Loading") {
    LoadingErrorEmptyView(loading: true, errorMessage: nil, isEmpty: false, onRefresh: {}) {
        EmptyView()
    }
}

#Preview("Error") {
    LoadingErrorEmptyView(
        loading: false,
        errorMessage: "Couldn't load coins. Pull to retry.",
        isEmpty: false,
        onRefresh: {}
    ) {
        EmptyView()
    }
}

#Preview("Empty") {
    LoadingErrorEmptyView(
        loading: false,
        errorMessage: nil,
        isEmpty: true,
        emptyMessage: "Your watchlist is empty. Add coins from Home.",
        onRefresh: {}
    ) {
        EmptyView()
    }
}

#Preview("Content") {
    LoadingErrorEmptyView(loading: false, errorMessage: nil, isEmpty: false, onRefresh: {}) {
        List([Coin.mock]) { coin in
            CoinRowView(coin: coin)
                .listRowInsets(EdgeInsets(top: 0, leading: Theme.contentPadding, bottom: 0, trailing: Theme.contentPadding))
        }
        .listStyle(.plain)
    }
}
