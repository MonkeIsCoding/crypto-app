import SwiftUI

struct AlertTypeToggle: View {
    @Binding var selection: AlertType

    var body: some View {
        HStack(spacing: 8) {
            option(.above, title: "Above")
            option(.below, title: "Below")
        }
    }

    private func option(_ type: AlertType, title: String) -> some View {
        let isSelected = selection == type
        return Button(title) {
            selection = type
        }
        .buttonStyle(.plain)
        .font(.body.bold())
        .foregroundStyle(isSelected ? .white : .primary)
        .frame(maxWidth: .infinity, minHeight: 44)
        .background(
            RoundedRectangle(cornerRadius: Theme.cornerRadius)
                .fill(isSelected ? Color.accentColor : Color.clear)
        )
        .overlay(
            RoundedRectangle(cornerRadius: Theme.cornerRadius)
                .strokeBorder(isSelected ? Color.clear : Theme.hairline, lineWidth: 1)
        )
        .accessibilityAddTraits(isSelected ? [.isSelected] : [])
    }
}

#Preview {
    @Previewable @State var selection: AlertType = .above
    AlertTypeToggle(selection: $selection)
        .padding()
}
