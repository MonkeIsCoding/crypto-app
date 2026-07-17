import SwiftUI

struct WatchlistToggleButton: View {
    let isWatchlisted: Bool
    let isToggling: Bool
    let action: () -> Void

    private var title: String {
        isToggling
            ? (isWatchlisted ? "Removing…" : "Adding…")
            : (isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist")
    }

    var body: some View {
        Group {
            if isWatchlisted {
                Button(title, action: action)
                    .buttonStyle(.hairlineOutlined(color: .negative))
            } else {
                Button(title, action: action)
                    .buttonStyle(.filledCapsule)
            }
        }
        .frame(maxWidth: .infinity)
        .disabled(isToggling)
    }
}

#Preview {
    VStack(spacing: 16) {
        WatchlistToggleButton(isWatchlisted: false, isToggling: false, action: {})
        WatchlistToggleButton(isWatchlisted: true, isToggling: false, action: {})
    }
    .padding()
}
