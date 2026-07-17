import SwiftUI

struct CoinRowView: View {
    let coin: Coin

    private var isPositive: Bool { coin.priceChange24h >= 0 }

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: Theme.rowSpacing) {
                Text(coin.symbol.uppercased())
                    .font(.body.bold())
                Text(coin.name)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            VStack(alignment: .trailing, spacing: Theme.rowSpacing) {
                Text(coin.price, format: .currency(code: "USD"))
                    .font(.body.bold())
                    .tabularNumbers()
                Text("\(isPositive ? "+" : "")\(coin.priceChange24h, specifier: "%.2f")%")
                    .font(.subheadline)
                    .tabularNumbers()
                    .foregroundStyle(Color.priceChange(coin.priceChange24h))
            }
        }
        .padding(.vertical, 10)
        .listRowSeparatorTint(Theme.hairline)
    }
}

#Preview {
    List {
        CoinRowView(coin: .mock)
    }
    .listStyle(.plain)
}
