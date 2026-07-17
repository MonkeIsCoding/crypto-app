import SwiftUI

struct WelcomeView: View {
    var body: some View {
        VStack(spacing: 0) {
            Spacer()

            VStack(spacing: 24) {
                RoundedRectangle(cornerRadius: Theme.cornerRadius)
                    .fill(Color.accentColor)
                    .frame(width: 80, height: 80)
                    .overlay {
                        Image(systemName: "chart.line.uptrend.xyaxis")
                            .font(.system(size: 36, weight: .semibold))
                            .foregroundStyle(.white)
                    }

                VStack(spacing: 8) {
                    Text("Track crypto, simply")
                        .font(.title.bold())
                        .multilineTextAlignment(.center)

                    Text("Live prices, watchlists, and price alerts — all in one clean view")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 16)
                }
            }

            Spacer()

            VStack(spacing: 12) {
                NavigationLink(value: AuthMode.register) {
                    Text("Create account")
                }
                .buttonStyle(.filledCapsule)

                NavigationLink(value: AuthMode.login) {
                    Text("Log in")
                }
                .buttonStyle(.hairlineOutlined(color: .primary))
            }
        }
        .padding(Theme.contentPadding)
        .navigationDestination(for: AuthMode.self) { mode in
            AuthView(mode: mode)
        }
    }
}

#Preview {
    NavigationStack {
        WelcomeView()
    }
    .environment(AuthManager.preview)
}
