import SwiftUI

struct FilledCapsuleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.body.bold())
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity, minHeight: 28)
            .padding(.vertical, 14)
            .background(Color.accentColor, in: RoundedRectangle(cornerRadius: Theme.cornerRadius))
            .opacity(configuration.isPressed ? 0.85 : 1)
    }
}

struct HairlineOutlinedButtonStyle: ButtonStyle {
    let color: Color

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.body.bold())
            .foregroundStyle(color)
            .frame(maxWidth: .infinity, minHeight: 28)
            .padding(.vertical, 14)
            .background(
                RoundedRectangle(cornerRadius: Theme.cornerRadius)
                    .strokeBorder(color.opacity(configuration.isPressed ? 0.4 : 0.6), lineWidth: 1)
            )
    }
}

struct HairlineFieldModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .background(
                RoundedRectangle(cornerRadius: Theme.cornerRadius)
                    .strokeBorder(Theme.hairline, lineWidth: 1)
            )
    }
}

#Preview {
    Button("Remove from Watchlist") {}
        .buttonStyle(.hairlineOutlined(color: .negative))
        .padding()
    Button("Create alert") {}
        .buttonStyle(.filledCapsule)
        .padding()
}
