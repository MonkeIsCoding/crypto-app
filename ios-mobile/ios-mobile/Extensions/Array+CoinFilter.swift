import Foundation

nonisolated enum CoinSortOption: String, CaseIterable, Identifiable {
    case name
    case price
    case priceChange24h

    var id: String { rawValue }

    var label: String {
        switch self {
        case .name: return "Name"
        case .price: return "Price"
        case .priceChange24h: return "24h Change"
        }
    }
}

extension Array where Element == Coin {
    func filtered(bySearch searchText: String) -> [Coin] {
        guard !searchText.isEmpty else { return self }
        return filter {
            $0.name.localizedCaseInsensitiveContains(searchText) ||
            $0.symbol.localizedCaseInsensitiveContains(searchText)
        }
    }

    func sorted(by option: CoinSortOption) -> [Coin] {
        switch option {
        case .name:
            return sorted { $0.name.localizedCaseInsensitiveCompare($1.name) == .orderedAscending }
        case .price:
            return sorted { $0.price > $1.price }
        case .priceChange24h:
            return sorted { $0.priceChange24h > $1.priceChange24h }
        }
    }

    func filteredAndSorted(searchText: String, sort: CoinSortOption) -> [Coin] {
        filtered(bySearch: searchText).sorted(by: sort)
    }
}
