import SwiftUI

struct CoinSearchSortBar: View {
    @Binding var searchText: String
    @Binding var sortOption: CoinSortOption

    var body: some View {
        HStack(spacing: 10) {
            HStack(spacing: 8) {
                Image(systemName: "magnifyingglass")
                    .foregroundStyle(.secondary)
                TextField("Search coins", text: $searchText)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(
                RoundedRectangle(cornerRadius: Theme.cornerRadius)
                    .strokeBorder(Theme.hairline, lineWidth: 1)
            )

            Menu {
                Picker("Sort by", selection: $sortOption) {
                    ForEach(CoinSortOption.allCases) { option in
                        Text(option.label).tag(option)
                    }
                }
            } label: {
                Label("Sort", systemImage: "arrow.up.arrow.down")
                    .labelStyle(.iconOnly)
                    .padding(10)
                    .foregroundStyle(.white)
                    .background(
                        RoundedRectangle(cornerRadius: Theme.cornerRadius)
                    )
            }
        }
        .padding(.horizontal, Theme.contentPadding)
        .padding(.bottom, 12)
    }
}

#Preview {
    @Previewable @State var searchText = ""
    @Previewable @State var sortOption: CoinSortOption = .name
    CoinSearchSortBar(searchText: $searchText, sortOption: $sortOption)
}
